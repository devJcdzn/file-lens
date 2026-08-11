export type Format =
  | 'markdown'
  | 'text'
  | 'csv'
  | 'json'
  | 'yaml'
  | 'ini'
  | 'env'
  | 'toml'
  | 'xml'
  | 'log'
  | 'unknown'

export type FileErrorKind = 'too-large' | 'binary' | 'read'

export type FileError = {
  kind: FileErrorKind
  message: string
  detail?: string
}

export type FileInfo = {
  name: string
  size: number
  lastModified: number
  format: Format
}
