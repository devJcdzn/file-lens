import { useMemo } from 'react'
import yaml from 'js-yaml'
import { highlightSnippet } from '../highlight'

export function YamlRenderer({ content }: { content: string }) {
  const status = useMemo(() => {
    try {
      yaml.load(content)
      return 'ok'
    } catch {
      return 'error'
    }
  }, [content])

  const html = useMemo(() => highlightSnippet(content, 'yaml'), [content])

  return (
    <div className="fv-yaml">
      <div className="fv-yaml__meta">
        {status === 'ok' ? (
          <span className="fv-badge fv-badge--ok">YAML válido</span>
        ) : (
          <span className="fv-badge fv-badge--warn">YAML inválido — exibindo texto bruto</span>
        )}
      </div>
      <pre className="fv-code">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
