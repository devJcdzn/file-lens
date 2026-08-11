import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Format } from '../types'
import { highlightSnippet, escapeHtml } from '../highlight'
import { highlightLine } from '../find'

const FORMAT_LANG: Partial<Record<Format, string>> = {
  ini: 'ini',
  env: 'ini',
  toml: 'ini',
  xml: 'xml',
}

const MAX_LINES = 4000
const LINE_HEIGHT = 26
const VIRTUAL_THRESHOLD = 40

function logClass(line: string): string | null {
  const head = line.slice(0, 100)
  if (/^\[?\s*(erro|error|fatal|critical)\b/i.test(head) || /\b(erro|error|fatal|critical)\b/i.test(head))
    return 'lv-log--error'
  if (/^\[?\s*(aviso|warn|warning)\b/i.test(head) || /\b(aviso|warn|warning)\b/i.test(head.slice(0, 24)))
    return 'lv-log--warn'
  if (/^\[?\s*(info|notice|informa)\b/i.test(head) || /\b(info|notice)\b/i.test(head.slice(0, 24)))
    return 'lv-log--info'
  if (/^\[?\s*(debug|trace|depura)\b/i.test(head) || /\b(debug|trace)\b/i.test(head.slice(0, 24)))
    return 'lv-log--debug'
  return null
}

export type TextRendererProps = {
  content: string
  format: Format
  searchQuery?: string
  activeMatch?: { line: number; column: number } | null
}

function renderLineHtml(
  format: Format,
  lineIndex: number,
  rawLine: string,
  query: string,
  activeMatch: { line: number; column: number } | null
): string {
  if (query) {
    const activeCol =
      activeMatch && activeMatch.line === lineIndex ? activeMatch.column : undefined
    const marked = highlightLine(rawLine, query, escapeHtml, activeCol)
    if (format === 'log') {
      const cls = logClass(rawLine)
      return cls ? `<span class="${cls}">${marked}</span>` : marked
    }
    return marked
  }

  if (format === 'log') {
    const cls = logClass(rawLine)
    const escaped = escapeHtml(rawLine)
    return cls ? `<span class="${cls}">${escaped}</span>` : escaped
  }

  // Highlight por linha só para formatos de linha única (ini/xml).
  // Markdown/json/yaml em raw usam format "text" e só escapam - evita tokens quebrados.
  const lang = FORMAT_LANG[format]
  if (lang) return highlightSnippet(rawLine, lang)
  return escapeHtml(rawLine)
}

function LineRow({
  lineIndex,
  rawLine,
  format,
  query,
  activeMatch,
  style,
}: {
  lineIndex: number
  rawLine: string
  format: Format
  query: string
  activeMatch: { line: number; column: number } | null
  style?: CSSProperties
}) {
  const html = renderLineHtml(format, lineIndex, rawLine, query, activeMatch)
  const isActive = activeMatch?.line === lineIndex
  return (
    <div
      className={`fv-text__line${isActive ? ' fv-text__line--active' : ''}`}
      data-line={lineIndex}
      style={style}
    >
      <span className="fv-text__ln">{lineIndex + 1}</span>
      <span
        className="fv-text__code"
        dangerouslySetInnerHTML={{ __html: html.length ? html : '\u00a0' }}
      />
    </div>
  )
}

function VirtualLines({
  shown,
  format,
  query,
  activeMatch,
}: {
  shown: string[]
  format: Format
  query: string
  activeMatch: { line: number; column: number } | null
}) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: shown.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 12,
  })

  useEffect(() => {
    if (!activeMatch || activeMatch.line >= shown.length) return
    virtualizer.scrollToIndex(activeMatch.line, { align: 'center' })
  }, [activeMatch?.line, activeMatch?.column, shown.length, virtualizer])

  return (
    <div className="fv-text__scroll" ref={parentRef}>
      <div
        className="fv-text__virtual"
        style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <LineRow
            key={item.key}
            lineIndex={item.index}
            rawLine={shown[item.index] ?? ''}
            format={format}
            query={query}
            activeMatch={activeMatch}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function StaticLines({
  shown,
  format,
  query,
  activeMatch,
}: {
  shown: string[]
  format: Format
  query: string
  activeMatch: { line: number; column: number } | null
}) {
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeMatch || activeMatch.line >= shown.length) return
    const row = parentRef.current?.querySelector(`[data-line="${activeMatch.line}"]`)
    row?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeMatch?.line, activeMatch?.column, shown.length])

  return (
    <div className="fv-text__scroll" ref={parentRef}>
      {shown.map((rawLine, i) => (
        <LineRow
          key={i}
          lineIndex={i}
          rawLine={rawLine}
          format={format}
          query={query}
          activeMatch={activeMatch}
        />
      ))}
    </div>
  )
}

export function TextRenderer({
  content,
  format,
  searchQuery = '',
  activeMatch = null,
}: TextRendererProps) {
  const [clientReady, setClientReady] = useState(false)
  const lines = useMemo(() => content.split('\n'), [content])
  const shown = lines.slice(0, MAX_LINES)
  const truncated = lines.length > MAX_LINES
  const query = searchQuery.trim()

  useEffect(() => {
    setClientReady(true)
  }, [])

  const useVirtual = clientReady && shown.length > VIRTUAL_THRESHOLD

  return (
    <div className="fv-text">
      <div className="fv-text__meta">
        <span className="fv-badge">{format === 'unknown' ? 'texto' : format}</span>
        <span>
          {`${lines.length} ${lines.length === 1 ? 'linha' : 'linhas'}`}
        </span>
      </div>
      {useVirtual ? (
        <VirtualLines shown={shown} format={format} query={query} activeMatch={activeMatch} />
      ) : (
        <StaticLines shown={shown} format={format} query={query} activeMatch={activeMatch} />
      )}
      {truncated && (
        <p className="fv-text__truncate">
          Exibindo as primeiras {MAX_LINES} linhas de {lines.length}.
        </p>
      )}
    </div>
  )
}
