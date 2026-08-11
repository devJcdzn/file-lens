import { Link } from 'react-router-dom'

const EXTS = ['.md', '.csv', '.json', '.yaml', '.ini', '.env', '.toml', '.log', '.xml', '.txt']

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <p className="hero__kicker">100% local no seu navegador</p>
        <h1 className="hero__title">
          Arquivos que o desktop não formata,
          <br />
          legíveis em segundos.
        </h1>
        <p className="hero__sub">
          Markdown, CSV, JSON, YAML, logs e configs abrem limpos e legíveis. Nada é enviado a
          servidor.
        </p>
        <div className="hero__cta">
          <Link to="/viewer" className="btn btn--primary">
            Abrir visualizador
          </Link>
          <a href="#testar" className="btn btn--ghost">
            Testar aqui
          </a>
          {/* MVP: extensão oculta
          <a href="#instalar" className="btn btn--ghost">
            Instalar extensão
          </a>
          */}
        </div>
        <div className="hero__formats" aria-label="Formatos suportados">
          {EXTS.map((ext) => (
            <span className="chip" key={ext}>
              {ext}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
