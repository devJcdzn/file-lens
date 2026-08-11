import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'icons')

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5b8cff"/>
      <stop offset="1" stop-color="#38e0c8"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="118" fill="url(#g)"/>
  <rect x="150" y="112" width="212" height="288" rx="26" fill="#0b0f1a" opacity="0.95"/>
  <path d="M288 112l72 72h-48c-13.3 0-24-10.7-24-24v-48z" fill="#0b0f1a" opacity="0.95"/>
  <rect x="192" y="242" width="128" height="16" rx="8" fill="#5b8cff"/>
  <rect x="192" y="278" width="96" height="13" rx="6.5" fill="#38e0c8"/>
  <rect x="192" y="311" width="116" height="13" rx="6.5" fill="#3a4563"/>
  <rect x="192" y="344" width="76" height="13" rx="6.5" fill="#3a4563"/>
</svg>`

const sizes = [16, 32, 48, 128]

mkdirSync(outDir, { recursive: true })

for (const size of sizes) {
  await sharp(Buffer.from(ICON_SVG))
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon${size}.png`))
  console.log(`✓ icons/icon${size}.png`)
}

console.log('Ícones gerados em public/icons/')
