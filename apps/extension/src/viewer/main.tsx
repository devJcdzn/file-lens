import { createRoot } from 'react-dom/client'
import { FileViewer } from '@file-viewer/viewer'
import './viewer.css'

function ExtensionApp() {
  return (
    <div className="fl-ext">
      <header className="fl-ext__header">
        <span className="fl-ext__logo" aria-hidden>
          <svg viewBox="0 0 512 512" width="22" height="22">
            <defs>
              <linearGradient id="flx" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5b8cff" />
                <stop offset="1" stopColor="#38e0c8" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" rx="118" fill="url(#flx)" />
            <rect x="150" y="112" width="212" height="288" rx="26" fill="#0b0f1a" opacity="0.95" />
            <path d="M288 112l72 72h-48c-13.3 0-24-10.7-24-24v-48z" fill="#0b0f1a" opacity="0.95" />
            <rect x="192" y="242" width="128" height="16" rx="8" fill="#5b8cff" />
            <rect x="192" y="278" width="96" height="13" rx="6.5" fill="#38e0c8" />
            <rect x="192" y="311" width="116" height="13" rx="6.5" fill="#3a4563" />
          </svg>
        </span>
        <div className="fl-ext__titles">
          <strong>FileLens</strong>
          <span>Visualizador de arquivos</span>
        </div>
      </header>
      <p className="fl-ext__hint">
        Arraste um arquivo <strong>.md</strong>, <strong>.csv</strong>, <strong>.json</strong>,{' '}
        <strong>.yaml</strong>, <strong>.ini</strong>, <strong>.env</strong>, <strong>.toml</strong>,{' '}
        <strong>.log</strong>, <strong>.xml</strong> ou <strong>.txt</strong> para esta janela.
      </p>
      <FileViewer className="fl-ext__viewer" />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<ExtensionApp />)
