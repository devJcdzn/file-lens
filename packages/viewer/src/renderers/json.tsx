import { useMemo } from 'react'
import { highlightSnippet } from '../highlight'

export function JsonRenderer({ content }: { content: string }) {
  const { html, parsed, error } = useMemo(() => {
    try {
      const value = JSON.parse(content)
      const pretty = JSON.stringify(value, null, 2)
      return { html: highlightSnippet(pretty, 'json'), parsed: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { html: highlightSnippet(content, 'json'), parsed: false, error: message }
    }
  }, [content])

  return (
    <div className="fv-json">
      <div className="fv-json__meta">
        {parsed ? (
          <span className="fv-badge fv-badge--ok">JSON válido</span>
        ) : (
          <span className="fv-badge fv-badge--warn">JSON inválido — exibindo texto bruto</span>
        )}
        {error && <span className="fv-json__error">{error}</span>}
      </div>
      <pre className="fv-code">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
