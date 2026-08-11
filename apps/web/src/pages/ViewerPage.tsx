import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileViewer } from '@file-viewer/viewer'
import { SupportCard } from '../components/SupportCard'

export function ViewerPage() {
  const [hasFile, setHasFile] = useState(false)

  return (
    <div className={`viewer-app${hasFile ? ' viewer-app--with-file' : ''}`}>
      {!hasFile && (
        <Link to="/" className="viewer-app__home" aria-label="Voltar ao início">
          FileLens
        </Link>
      )}

      <div className="viewer-app__layout">
        <main className="viewer-app__main">
          <FileViewer
            className="viewer-app__viewer"
            onFileOpen={() => setHasFile(true)}
            onFileClose={() => setHasFile(false)}
          />
        </main>

        {hasFile && (
          <aside className="viewer-app__rail">
            <Link to="/" className="viewer-app__rail-home">
              FileLens
            </Link>
            <SupportCard />
            <a
              className="ad-slot"
              href="https://x.com/clo_jeann"
              target="_blank"
              rel="noopener noreferrer"
              title="Fale comigo no X para anunciar"
            >
              Anuncie aqui
            </a>
          </aside>
        )}
      </div>
    </div>
  )
}
