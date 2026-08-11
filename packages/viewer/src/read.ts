const DECODER = new TextDecoder('utf-8', { fatal: false })

export function decodeBuffer(buffer: ArrayBuffer): string {
  let text = DECODER.decode(buffer)
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  return text
}

export async function readFileAsText(file: Blob): Promise<string> {
  const buffer = await file.arrayBuffer()
  return decodeBuffer(buffer)
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2
  return `${value.toFixed(digits)} ${units[i]}`
}

export function formatLines(lineCount: number): string {
  return lineCount === 1 ? '1 linha' : `${lineCount} linhas`
}
