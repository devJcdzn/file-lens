import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileViewer } from '@file-viewer/viewer'
import { makeSampleFile } from '../sample'

export function Demo() {
  const [sampleVersion, setSampleVersion] = useState(0)

  return (
    <section className="section" id="testar">
      <div className="section__head">
        <h2 className="section__title">Teste com o seu arquivo</h2>
        <p className="section__lede">
          Arraste para a área abaixo ou clique para escolher. Tudo fica no seu navegador.
        </p>
      </div>
      <div className="demo">
        <div className="demo__bar">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => setSampleVersion((v) => v + 1)}
          >
            Carregar exemplo
          </button>
          <span className="demo__note">Cole um arquivo com ⌘/Ctrl+V</span>
          <Link to="/viewer" className="demo__full">
            Abrir em página própria
          </Link>
        </div>
        <FileViewer
          key={sampleVersion}
          initialFile={sampleVersion ? makeSampleFile() : null}
          className="demo__viewer"
        />
      </div>
    </section>
  )
}
