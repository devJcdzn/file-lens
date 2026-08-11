import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { Format, FileError } from './types'
import { detectFormat, looksBinary, FORMAT_LABEL, ACCEPT_ATTR } from './detect'
import { decodeBuffer, formatBytes } from './read'
import { MarkdownRenderer, CsvRenderer, JsonRenderer, YamlRenderer, TextRenderer } from './renderers'
import { findMatches } from './find'
import type { Match } from './find'
import { FindBar } from './FindBar'
import './styles.css'

const DEFAULT_MAX_BYTES = 6 * 1024 * 1024
const MAX_RECENT = 8

const RICH_FORMATS: Format[] = ['markdown', 'csv', 'json', 'yaml']
const FIND_FORCES_RAW: Format[] = ['markdown', 'json', 'yaml']

type RecentEntry = { file: File; openedAt: number }
type ViewMode = 'rendered' | 'raw'

export type FileViewerProps = {
  maxBytes?: number
  className?: string
  initialFile?: File | null
  onFileOpen?: (file: File) => void
  onFileClose?: () => void
  onError?: (error: FileError) => void
}

const DROP_EXTS = ['.md', '.csv', '.json', '.yaml', '.ini', '.env', '.toml', '.log', '.xml', '.txt']

export function FileViewer({
  maxBytes = DEFAULT_MAX_BYTES,
  className = '',
  initialFile,
  onFileOpen,
  onFileClose,
  onError,
}: FileViewerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [content, setContent] = useState('')
  const [format, setFormat] = useState<Format>('unknown')
  const [error, setError] = useState<FileError | null>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [recent, setRecent] = useState<RecentEntry[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('rendered')
  const [findOpen, setFindOpen] = useState(false)
  const [findQuery, setFindQuery] = useState('')
  const [activeMatchIndex, setActiveMatchIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const openFile = useCallback(
    async (candidate: File) => {
      if (!candidate) return
      setError(null)
      if (candidate.size > maxBytes) {
        const e: FileError = {
          kind: 'too-large',
          message: 'Arquivo grande demais',
          detail: `O limite é de ${formatBytes(maxBytes)} para o visualizador não travar.`,
        }
        setError(e)
        onError?.(e)
        return
      }
      setBusy(true)
      try {
        const buffer = await candidate.arrayBuffer()
        if (looksBinary(buffer)) {
          const e: FileError = {
            kind: 'binary',
            message: 'Arquivo binário detectado',
            detail:
              'Só arquivos de texto são suportados: .md, .csv, .json, .yaml, .ini, .env, .toml, .log, .xml, .txt.',
          }
          setError(e)
          onError?.(e)
          return
        }
        const text = decodeBuffer(buffer)
        const fmt = detectFormat(candidate.name)
        setFile(candidate)
        setContent(text)
        setFormat(fmt)
        setViewMode('rendered')
        setFindOpen(false)
        setFindQuery('')
        setActiveMatchIndex(0)
        setRecent((prev) => {
          const next = [
            { file: candidate, openedAt: Date.now() },
            ...prev.filter(
              (r) =>
                !(
                  r.file.name === candidate.name &&
                  r.file.size === candidate.size &&
                  r.file.lastModified === candidate.lastModified
                )
            ),
          ]
          return next.slice(0, MAX_RECENT)
        })
        onFileOpen?.(candidate)
      } catch {
        const e: FileError = { kind: 'read', message: 'Não foi possível ler este arquivo' }
        setError(e)
        onError?.(e)
      } finally {
        setBusy(false)
      }
    },
    [maxBytes, onError, onFileOpen]
  )

  useEffect(() => {
    if (initialFile) void openFile(initialFile)
  }, [initialFile, openFile])

  useEffect(() => {
    const onPaste = (e: globalThis.ClipboardEvent) => {
      const candidate = Array.from(e.clipboardData?.files ?? [])[0]
      if (candidate) {
        e.preventDefault()
        void openFile(candidate)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [openFile])

  const matches: Match[] = useMemo(
    () => (findOpen ? findMatches(content, findQuery) : []),
    [content, findQuery, findOpen]
  )

  useEffect(() => {
    setActiveMatchIndex(0)
  }, [findQuery, content])

  const openFind = useCallback(() => {
    if (!file) return
    setFindOpen(true)
    if (FIND_FORCES_RAW.includes(format)) {
      setViewMode('raw')
    }
  }, [file, format])

  const closeFind = useCallback(() => {
    setFindOpen(false)
    setFindQuery('')
    setActiveMatchIndex(0)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'f' && file) {
        e.preventDefault()
        openFind()
      }
      if (e.key === 'Escape' && findOpen) {
        e.preventDefault()
        closeFind()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [file, findOpen, openFind, closeFind])

  const goNext = useCallback(() => {
    if (matches.length === 0) return
    setActiveMatchIndex((i) => (i + 1) % matches.length)
  }, [matches.length])

  const goPrev = useCallback(() => {
    if (matches.length === 0) return
    setActiveMatchIndex((i) => (i - 1 + matches.length) % matches.length)
  }, [matches.length])

  const activeMatch = matches[activeMatchIndex] ?? null
  const lineCount = useMemo(() => (content ? content.split('\n').length : 0), [content])
  const isRich = RICH_FORMATS.includes(format)

  const reset = useCallback(() => {
    setFile(null)
    setContent('')
    setFormat('unknown')
    setError(null)
    setBusy(false)
    setViewMode('rendered')
    closeFind()
    onFileClose?.()
  }, [closeFind, onFileClose])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const candidate = e.dataTransfer.files?.[0]
    if (candidate) void openFile(candidate)
  }

  const onDragOver = (e: DragEvent) => e.preventDefault()

  const copy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard pode não estar disponível */
    }
  }

  const download = () => {
    if (!file) return
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const searchProps = {
    searchQuery: findOpen ? findQuery : '',
    activeMatch: findOpen ? activeMatch : null,
  }

  const renderBody = () => {
    if (viewMode === 'raw' || !isRich) {
      return (
        <TextRenderer
          content={content}
          format={viewMode === 'raw' && isRich ? 'text' : format}
          searchQuery={searchProps.searchQuery}
          activeMatch={searchProps.activeMatch}
        />
      )
    }

    switch (format) {
      case 'markdown':
        return <MarkdownRenderer content={content} />
      case 'csv':
        return (
          <CsvRenderer
            content={content}
            searchQuery={searchProps.searchQuery}
            activeMatchIndex={findOpen ? activeMatchIndex : -1}
          />
        )
      case 'json':
        return <JsonRenderer content={content} />
      case 'yaml':
        return <YamlRenderer content={content} />
      default:
        return (
          <TextRenderer
            content={content}
            format={format}
            searchQuery={searchProps.searchQuery}
            activeMatch={searchProps.activeMatch}
          />
        )
    }
  }

  return (
    <div
      className={`fv ${dragging ? 'fv--dragging' : ''} ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDragging(false)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPT_ATTR}
        onChange={(e) => {
          const candidate = e.target.files?.[0]
          if (candidate) void openFile(candidate)
          e.target.value = ''
        }}
      />

      {busy && (
        <div className="fv-busy" role="status">
          <span className="fv-spinner" aria-hidden />
          Lendo arquivo…
        </div>
      )}

      {error && (
        <div className="fv-error" role="alert">
          <div className="fv-error__icon" aria-hidden>
            !
          </div>
          <h3 className="fv-error__title">{error.message}</h3>
          {error.detail && <p className="fv-error__detail">{error.detail}</p>}
          <button type="button" className="fv-btn fv-btn--ghost" onClick={reset}>
            Escolher outro arquivo
          </button>
        </div>
      )}

      {!file && !error && !busy && (
        <div
          className="fv-drop"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          role="button"
          tabIndex={0}
          aria-label="Escolher um arquivo para visualizar"
        >
          <div className="fv-drop__icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 16V4" strokeLinecap="round" />
              <path d="m7 9 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="fv-drop__title">Arraste um arquivo</p>
          <p className="fv-drop__sub">ou clique para escolher</p>
          <ul className="fv-drop__chips" aria-label="Formatos suportados">
            {DROP_EXTS.map((ext) => (
              <li key={ext} className="fv-drop__chip">
                {ext}
              </li>
            ))}
          </ul>
        </div>
      )}

      {file && (
        <div className="fv-shell">
          <div className="fv-toolbar">
            <div className="fv-toolbar__file">
              <span className={`fv-dot fv-dot--${format}`} aria-hidden />
              <span className="fv-toolbar__name" title={file.name}>
                {file.name}
              </span>
              <span className="fv-badge">{FORMAT_LABEL[format]}</span>
            </div>
            <div className="fv-toolbar__actions">
              <span className="fv-toolbar__meta">
                {formatBytes(file.size)} · {lineCount} linhas
              </span>
              {isRich && (
                <button
                  type="button"
                  className={`fv-btn fv-btn--ghost${viewMode === 'raw' ? ' fv-btn--active' : ''}`}
                  onClick={() => setViewMode((m) => (m === 'raw' ? 'rendered' : 'raw'))}
                  title={viewMode === 'raw' ? 'Ver formatado' : 'Ver texto bruto'}
                >
                  {viewMode === 'raw' ? 'Formatado' : 'Raw'}
                </button>
              )}
              <button
                type="button"
                className={`fv-btn fv-btn--ghost${findOpen ? ' fv-btn--active' : ''}`}
                onClick={() => (findOpen ? closeFind() : openFind())}
                title="Buscar (⌘/Ctrl+F)"
              >
                Buscar
              </button>
              <button
                type="button"
                className="fv-btn fv-btn--ghost"
                onClick={() => void copy()}
                disabled={!content}
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <button type="button" className="fv-btn fv-btn--ghost" onClick={download} disabled={!content}>
                Baixar
              </button>
              <button
                type="button"
                className="fv-btn fv-btn--icon fv-btn--danger-icon"
                onClick={reset}
                aria-label="Fechar arquivo"
                title="Fechar arquivo"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {findOpen && (
            <FindBar
              query={findQuery}
              matchCount={matches.length}
              activeIndex={activeMatchIndex}
              onQueryChange={setFindQuery}
              onNext={goNext}
              onPrev={goPrev}
              onClose={closeFind}
            />
          )}

          {recent.length > 1 && (
            <div className="fv-recent">
              <span className="fv-recent__label">Recentes</span>
              {recent.map((entry) => (
                <button
                  type="button"
                  key={`${entry.file.name}-${entry.file.size}-${entry.file.lastModified}`}
                  className={`fv-recent__chip ${
                    entry.file.name === file.name &&
                    entry.file.size === file.size &&
                    entry.file.lastModified === file.lastModified
                      ? 'fv-recent__chip--active'
                      : ''
                  }`}
                  onClick={() => void openFile(entry.file)}
                  title={entry.file.name}
                >
                  {entry.file.name}
                </button>
              ))}
            </div>
          )}

          <div className="fv-body">{renderBody()}</div>
        </div>
      )}
    </div>
  )
}
