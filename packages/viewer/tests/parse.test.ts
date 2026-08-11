import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../src/renderers/markdown'
import { highlightSnippet, escapeHtml } from '../src/highlight'
import Papa from 'papaparse'

describe('highlightSnippet', () => {
  it('destaca JSON conhecido', () => {
    const out = highlightSnippet('{"a": 1}', 'json')
    expect(out).toContain('hljs-attr')
    expect(out).not.toContain('{"a": 1}')
  })

  it('escapa HTML quando a linguagem é desconhecida', () => {
    const out = highlightSnippet('<script>alert(1)</script>', 'txt')
    expect(out).toContain('&lt;script&gt;')
    expect(out).not.toContain('<script>')
  })

  it('escapa sem linguagem informada', () => {
    const out = highlightSnippet('<b>x</b>')
    expect(out).not.toContain('<b>')
  })

  it('resolvida aliases comuns', () => {
    expect(highlightSnippet('const a=1', 'js')).toContain('hljs-')
    expect(highlightSnippet('$ echo oi', 'sh')).toContain('hljs-')
  })
})

describe('escapeHtml', () => {
  it('escapa caracteres perigosos', () => {
    expect(escapeHtml('<a href="x">&"')).toBe('&lt;a href="x"&gt;&amp;"')
  })
})

describe('markdown sem linguagem no bloco de código', () => {
  it('não lança exceção e escapa HTML dentro do bloco', () => {
    const html = renderMarkdown('```\n<script>alert(1)</script>\n```')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
  })
})

describe('papaparse', () => {
  it('parseia CSV básico', () => {
    const result = Papa.parse<string[]>('nome,idade\nAna,30\nBruno,25', { skipEmptyLines: 'greedy' })
    expect(result.data).toEqual([
      ['nome', 'idade'],
      ['Ana', '30'],
      ['Bruno', '25'],
    ])
  })

  it('parseia TSV com tabulação', () => {
    const result = Papa.parse<string[]>('a\tb\n1\t2', { skipEmptyLines: 'greedy' })
    expect(result.data).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })
})
