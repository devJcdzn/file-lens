import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { escapeHtml } from '../highlight'

const MAX_ROWS = 500
const MAX_COLS = 60

export type CsvRendererProps = {
  content: string
  /** Highlight query for cell matches (case-insensitive). */
  searchQuery?: string
  /** Active match absolute index among all cell matches (optional). */
  activeMatchIndex?: number
}

function headerLabel(raw: string | undefined, colIndex: number): string {
  const trimmed = (raw ?? '').trim()
  return trimmed || `Coluna ${colIndex + 1}`
}

function highlightCell(text: string, query: string, isActive: boolean): string {
  if (!query) return escapeHtml(text)
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  let html = ''
  let i = 0
  let from = 0
  while ((i = lower.indexOf(q, from)) !== -1) {
    html += escapeHtml(text.slice(from, i))
    const cls = isActive ? 'fv-mark fv-mark--active' : 'fv-mark'
    html += `<mark class="${cls}">${escapeHtml(text.slice(i, i + query.length))}</mark>`
    from = i + query.length
  }
  html += escapeHtml(text.slice(from))
  return html
}

export function CsvRenderer({ content, searchQuery = '', activeMatchIndex = -1 }: CsvRendererProps) {
  const [headerRow, setHeaderRow] = useState(true)

  const { rows, errors } = useMemo(() => {
    const parsed = Papa.parse<string[]>(content, { skipEmptyLines: 'greedy' })
    return { rows: parsed.data as string[][], errors: parsed.errors }
  }, [content])

  const maxCols = useMemo(() => {
    let max = 0
    for (const row of rows) if (row.length > max) max = row.length
    return Math.min(max, MAX_COLS)
  }, [rows])

  const headers = useMemo(() => {
    if (!headerRow || rows.length === 0) {
      return Array.from({ length: maxCols }, (_, i) => String(i + 1))
    }
    const first = rows[0] ?? []
    return Array.from({ length: maxCols }, (_, i) => headerLabel(first[i], i))
  }, [headerRow, rows, maxCols])

  const dataRows = headerRow && rows.length > 0 ? rows.slice(1) : rows
  const visible = dataRows.slice(0, MAX_ROWS)
  const truncatedRows = dataRows.length > MAX_ROWS
  const query = searchQuery.trim()

  // Build match indices across visible cells for active highlighting
  let matchCounter = -1

  return (
    <div className="fv-csv">
      <div className="fv-csv__meta">
        <span className="fv-badge">tabela</span>
        <span>
          {`${dataRows.length} ${dataRows.length === 1 ? 'linha' : 'linhas'} × ${maxCols} ${maxCols === 1 ? 'coluna' : 'colunas'}`}
        </span>
        <label className="fv-csv__toggle">
          <input
            type="checkbox"
            checked={headerRow}
            onChange={(e) => setHeaderRow(e.target.checked)}
          />
          <span>1ª linha como cabeçalho</span>
        </label>
        {errors.length > 0 && (
          <span className="fv-csv__warn">algumas linhas podem estar malformadas</span>
        )}
      </div>
      <div className="fv-csv__scroll">
        <table className="fv-csv__table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, r) => (
              <tr key={r}>
                {Array.from({ length: maxCols }, (_, c) => {
                  const cell = row[c] ?? ''
                  if (!query) {
                    return <td key={c}>{cell}</td>
                  }
                  const lower = cell.toLowerCase()
                  const q = query.toLowerCase()
                  let local = 0
                  let pos = 0
                  let firstMatchIndex = -1
                  while ((pos = lower.indexOf(q, pos)) !== -1) {
                    matchCounter++
                    if (local === 0) firstMatchIndex = matchCounter
                    local++
                    pos += q.length
                  }
                  const isActive =
                    firstMatchIndex >= 0 &&
                    activeMatchIndex >= firstMatchIndex &&
                    activeMatchIndex < firstMatchIndex + local
                  return (
                    <td
                      key={c}
                      dangerouslySetInnerHTML={{
                        __html: highlightCell(cell, query, isActive),
                      }}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {truncatedRows && (
          <p className="fv-csv__truncate">
            Exibindo as primeiras {MAX_ROWS} linhas de {dataRows.length}.
          </p>
        )}
      </div>
    </div>
  )
}
