import { describe, it, expect } from 'vitest'
import { findMatches, highlightLine } from '../src/find'
import { escapeHtml } from '../src/highlight'

describe('findMatches', () => {
  it('retorna lista vazia para query vazia', () => {
    expect(findMatches('hello world', '')).toEqual([])
    expect(findMatches('hello world', '   ')).toEqual([])
  })

  it('busca case-insensitive', () => {
    const matches = findMatches('Hello\nWORLD\nhello', 'hello')
    expect(matches).toHaveLength(2)
    expect(matches[0]).toMatchObject({ line: 0, column: 0 })
    expect(matches[1]).toMatchObject({ line: 2, column: 0 })
  })

  it('localiza match no meio da linha', () => {
    const matches = findMatches('foo bar baz', 'bar')
    expect(matches).toHaveLength(1)
    expect(matches[0]).toMatchObject({ line: 0, column: 4, index: 4 })
  })

  it('encontra múltiplos na mesma linha', () => {
    const matches = findMatches('aa aa aa', 'aa')
    expect(matches).toHaveLength(3)
    expect(matches.map((m) => m.column)).toEqual([0, 3, 6])
  })
})

describe('highlightLine', () => {
  it('escapa HTML e marca ocorrências', () => {
    const html = highlightLine('<b>xx</b> e <b>yy', 'xx', escapeHtml)
    expect(html).not.toContain('<b>')
    expect(html).toContain('fv-mark')
    expect(html).toContain('&lt;b&gt;')
    expect(html).toContain('<mark class="fv-mark">xx</mark>')
  })

  it('marca match ativo', () => {
    const html = highlightLine('foo bar baz', 'bar', escapeHtml, 4)
    expect(html).toContain('fv-mark--active')
  })
})
