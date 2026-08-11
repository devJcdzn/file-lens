import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@file-viewer/viewer': fileURLToPath(new URL('../../packages/viewer/src/index.ts', import.meta.url)),
    },
  },
})
