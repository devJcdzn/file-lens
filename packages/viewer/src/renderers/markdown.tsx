import { useMemo } from 'react'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import DOMPurify from 'dompurify'
import { resolveLanguage, highlightSnippet } from '../highlight'

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      return highlightSnippet(code, resolveLanguage(lang))
    },
  })
)
marked.use({ gfm: true, breaks: false })

export function renderMarkdown(text: string): string {
  const raw = marked.parse(text, { async: false }) as string
  return DOMPurify.sanitize(raw)
}

export function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content])
  return <div className="fv-md" dangerouslySetInnerHTML={{ __html: html }} />
}
