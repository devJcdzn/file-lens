import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { CsvRenderer } from '../src/renderers/csv'

describe('CsvRenderer', () => {
  it('usa a 1ª linha como cabeçalho por padrão', () => {
    const html = renderToString(
      createElement(CsvRenderer, { content: 'nome,idade\nAna,30\nBruno,25' })
    )
    expect(html).toContain('<th>nome</th>')
    expect(html).toContain('<th>idade</th>')
    expect(html).toContain('<td>Ana</td>')
    expect(html).toContain('<td>30</td>')
    // meta: 2 data rows
    expect(html).toContain('2 linhas')
  })

  it('não quebra com só uma linha (header sem dados)', () => {
    const html = renderToString(createElement(CsvRenderer, { content: 'a,b,c' }))
    expect(html).toContain('<th>a</th>')
    expect(html).toContain('0 linhas')
  })

  it('usa fallback para header vazio', () => {
    const html = renderToString(createElement(CsvRenderer, { content: 'nome,\n1,2' }))
    expect(html).toContain('<th>nome</th>')
    expect(html).toContain('<th>Coluna 2</th>')
  })
})
