export type Match = {
  /** 0-based line index in content.split('\n') */
  line: number
  /** character offset within the line */
  column: number
  /** absolute character index in the full content string */
  index: number
}

/** Case-insensitive search over full content. Returns ordered matches. */
export function findMatches(content: string, query: string): Match[] {
  const q = query.trim()
  if (!q || !content) return []

  const lowerContent = content.toLowerCase()
  const lowerQuery = q.toLowerCase()
  const matches: Match[] = []

  // Precompute line start offsets
  const lineStarts: number[] = [0]
  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 10 /* \n */) lineStarts.push(i + 1)
  }

  let from = 0
  let idx: number
  while ((idx = lowerContent.indexOf(lowerQuery, from)) !== -1) {
    // binary-ish: find line for idx
    let line = 0
    for (let l = lineStarts.length - 1; l >= 0; l--) {
      const start = lineStarts[l] ?? 0
      if (start <= idx) {
        line = l
        break
      }
    }
    const lineStart = lineStarts[line] ?? 0
    matches.push({
      line,
      column: idx - lineStart,
      index: idx,
    })
    from = idx + lowerQuery.length
  }

  return matches
}

/** Highlight all occurrences of query in a single line (already plain text). Returns HTML. */
export function highlightLine(
  line: string,
  query: string,
  escapeHtml: (s: string) => string,
  activeColumn?: number
): string {
  const q = query.trim()
  if (!q) return escapeHtml(line)

  const lower = line.toLowerCase()
  const lq = q.toLowerCase()
  let html = ''
  let from = 0
  let i: number
  while ((i = lower.indexOf(lq, from)) !== -1) {
    html += escapeHtml(line.slice(from, i))
    const active = activeColumn !== undefined && i === activeColumn
    const cls = active ? 'fv-mark fv-mark--active' : 'fv-mark'
    html += `<mark class="${cls}">${escapeHtml(line.slice(i, i + q.length))}</mark>`
    from = i + q.length
  }
  html += escapeHtml(line.slice(from))
  return html
}
