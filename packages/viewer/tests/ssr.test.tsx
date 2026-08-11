import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { FileViewer } from '../src/FileViewer'
import { MarkdownRenderer } from '../src/renderers/markdown'
import { CsvRenderer } from '../src/renderers/csv'
import { JsonRenderer } from '../src/renderers/json'
import { YamlRenderer } from '../src/renderers/yaml'
import { TextRenderer } from '../src/renderers/text'

describe('smoke: renderização no servidor (SSR)', () => {
  it('FileViewer renderiza o estado vazio sem lançar', () => {
    const html = renderToString(createElement(FileViewer))
    expect(html).toContain('Arraste um arquivo')
  })

  it('MarkdownRenderer renderiza conteúdo formatado', () => {
    const html = renderToString(createElement(MarkdownRenderer, { content: '# Título\n\nTexto' }))
    expect(html).toContain('<h1>Título</h1>')
  })

  it('CsvRenderer renderiza tabela', () => {
    const html = renderToString(
      createElement(CsvRenderer, { content: 'a,b\n1,2\n3,4' })
    )
    expect(html).toContain('<table')
    expect(html).toContain('<td>1</td>')
  })

  it('JsonRenderer renderiza JSON formatado', () => {
    const html = renderToString(createElement(JsonRenderer, { content: '{"x": [1, 2]}' }))
    expect(html).toContain('JSON válido')
  })

  it('YamlRenderer renderiza YAML', () => {
    const html = renderToString(createElement(YamlRenderer, { content: 'a: 1\nb: 2' }))
    expect(html).toContain('YAML válido')
  })

  it('TextRenderer renderiza log com linhas', () => {
    const html = renderToString(createElement(TextRenderer, { content: 'INFO start\nERRO crash', format: 'log' }))
    expect(html).toContain('INFO start')
    expect(html).toContain('lv-log--error')
  })
})
