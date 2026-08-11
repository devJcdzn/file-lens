import { describe, it, expect } from 'vitest'
import { detectFormat, looksBinary } from '../src/detect'

describe('detectFormat', () => {
  it('detecta markdown por extensão', () => {
    expect(detectFormat('README.md')).toBe('markdown')
    expect(detectFormat('documento.markdown')).toBe('markdown')
    expect(detectFormat('LEIAME.MD')).toBe('markdown')
  })

  it('detecta dados e config', () => {
    expect(detectFormat('dados.csv')).toBe('csv')
    expect(detectFormat('dados.TSV')).toBe('csv')
    expect(detectFormat('config.json')).toBe('json')
    expect(detectFormat('docker-compose.yml')).toBe('yaml')
    expect(detectFormat('config.yaml')).toBe('yaml')
    expect(detectFormat('settings.ini')).toBe('ini')
    expect(detectFormat('app.conf')).toBe('ini')
    expect(detectFormat('.env')).toBe('env')
    expect(detectFormat('Cargo.toml')).toBe('toml')
    expect(detectFormat('server.log')).toBe('log')
    expect(detectFormat('feed.xml')).toBe('xml')
    expect(detectFormat('notas.txt')).toBe('text')
  })

  it('retorna unknown para extensões não mapeadas', () => {
    expect(detectFormat('foto.png')).toBe('unknown')
    expect(detectFormat('semextensao')).toBe('unknown')
  })
})

describe('looksBinary', () => {
  it('detecta arquivos binários por bytes nulos', () => {
    const binary = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]).buffer
    expect(looksBinary(binary)).toBe(true)
  })

  it('aceita texto UTF-8 sem bytes nulos', () => {
    const text = new TextEncoder().encode('# Olá, mundo!\nlinha de exemplo').buffer
    expect(looksBinary(text)).toBe(false)
  })

  it('é tolerante a arquivos vazios', () => {
    expect(looksBinary(new ArrayBuffer(0))).toBe(false)
  })
})
