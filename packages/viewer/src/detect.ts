import type { Format } from './types'

const EXT_MAP: Record<string, Format> = {
  md: 'markdown',
  markdown: 'markdown',
  mdown: 'markdown',
  mkdn: 'markdown',
  mkdown: 'markdown',
  txt: 'text',
  text: 'text',
  json: 'json',
  jsonc: 'json',
  geojson: 'json',
  webmanifest: 'json',
  csv: 'csv',
  tsv: 'csv',
  yaml: 'yaml',
  yml: 'yaml',
  ini: 'ini',
  cfg: 'ini',
  conf: 'ini',
  config: 'ini',
  properties: 'ini',
  env: 'env',
  toml: 'toml',
  log: 'log',
  xml: 'xml',
}

export const SUPPORTED_FORMATS: { format: Format; label: string; extensions: string[] }[] = [
  { format: 'markdown', label: 'Markdown', extensions: ['.md', '.markdown'] },
  { format: 'csv', label: 'CSV / TSV', extensions: ['.csv', '.tsv'] },
  { format: 'json', label: 'JSON', extensions: ['.json', '.jsonc'] },
  { format: 'yaml', label: 'YAML', extensions: ['.yaml', '.yml'] },
  { format: 'ini', label: 'INI / Config', extensions: ['.ini', '.cfg', '.conf'] },
  { format: 'env', label: 'Env', extensions: ['.env'] },
  { format: 'toml', label: 'TOML', extensions: ['.toml'] },
  { format: 'log', label: 'Logs', extensions: ['.log'] },
  { format: 'xml', label: 'XML', extensions: ['.xml'] },
  { format: 'text', label: 'Texto', extensions: ['.txt'] },
]

/** Valor de `accept` no file picker — extensões + nomes especiais (.env). */
export const ACCEPT_ATTR = [
  ...new Set([
    ...SUPPORTED_FORMATS.flatMap((f) => f.extensions),
    ...Object.keys(EXT_MAP).map((ext) => `.${ext}`),
  ]),
].join(',')

export function detectFormat(fileName: string): Format {
  const base = fileName.toLowerCase()
  const parts = base.split('.')
  const ext = parts.length > 1 ? (parts.pop() ?? '') : ''
  if (ext === '' && parts[0] === 'env') return 'env'
  return EXT_MAP[ext] ?? 'unknown'
}

export function looksBinary(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer)
  const sample = Math.min(bytes.length, 8192)
  let nuls = 0
  for (let i = 0; i < sample; i++) {
    if (bytes[i] === 0) nuls++
  }
  return nuls > 0
}

export const FORMAT_LABEL: Record<Format, string> = {
  markdown: 'Markdown',
  text: 'Texto',
  csv: 'CSV',
  json: 'JSON',
  yaml: 'YAML',
  ini: 'INI',
  env: '.env',
  toml: 'TOML',
  xml: 'XML',
  log: 'Log',
  unknown: 'Texto',
}
