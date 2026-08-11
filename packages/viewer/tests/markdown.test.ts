import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../src/renderers/markdown'
import { decodeBuffer } from '../src/read'

describe('renderMarkdown', () => {
  it('renderiza títulos e parágrafos', () => {
    const html = renderMarkdown('# Título\n\nUm **parágrafo** com texto.')
    expect(html).toContain('<h1>Título</h1>')
    expect(html).toContain('<strong>parágrafo</strong>')
  })

  it('renderiza código com sintaxe', () => {
    const html = renderMarkdown('```js\nconst a = 1\n```')
    expect(html).toContain('<pre>')
    expect(html).toContain('hljs')
  })

  it('sanitiza HTML malicioso (XSS)', () => {
    const html = renderMarkdown('# Seguro\n\n<script>alert("x")</script>\n\n<img src=x onerror=alert(1)>')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
  })

  it('sanitiza javascript: em links', () => {
    const html = renderMarkdown('[clique](javascript:alert(1))')
    expect(html).not.toContain('javascript:')
  })

  it('renderiza tabelas GFM', () => {
    const html = renderMarkdown('| a | b |\n|---|---|\n| 1 | 2 |')
    expect(html).toContain('<table>')
    expect(html).toContain('<td>1</td>')
  })
})

describe('decodeBuffer', () => {
  it('remove BOM UTF-8', () => {
    const buf = new Uint8Array([0xef, 0xbb, 0xbf, 0x68, 0x69]).buffer
    expect(decodeBuffer(buf)).toBe('hi')
  })

  it('decodifica texto UTF-8', () => {
    const buf = new TextEncoder().encode('Olá mundo — ção').buffer
    expect(decodeBuffer(buf)).toBe('Olá mundo — ção')
  })
})
