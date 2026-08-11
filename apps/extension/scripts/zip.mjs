import { zipSync } from 'fflate'
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'dist')

function walk(dirPath, base = '') {
  const files = {}
  for (const entry of readdirSync(dirPath)) {
    const full = join(dirPath, entry)
    const rel = join(base, entry).split(sep).join('/')
    if (statSync(full).isDirectory()) {
      Object.assign(files, walk(full, rel))
    } else {
      files[rel] = readFileSync(full)
    }
  }
  return files
}

const files = walk(dir)
const zipped = zipSync(files, { level: 9 })
const outPath = join(root, 'filelens-extension.zip')
writeFileSync(outPath, zipped)
console.log(`✓ ${outPath} (${Object.keys(files).length} arquivos, ${(zipped.byteLength / 1024).toFixed(1)} KB)`)
