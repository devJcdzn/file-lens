import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const LINKS = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#formatos', label: 'Formatos' },
  { href: '#testar', label: 'Testar' },
  // MVP: extensão oculta
  // { href: '#instalar', label: 'Instalar' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a href="#top" className="site-nav__brand">
          <Logo size={26} />
          <span>FileLens</span>
        </a>
        <nav className={`site-nav__links ${open ? 'site-nav__links--open' : ''}`}>
          <Link to="/viewer" onClick={() => setOpen(false)} className="site-nav__viewer">
            Visualizador
          </Link>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          {/* MVP: extensão oculta
          <a href="#instalar" className="site-nav__cta">
            Instalar extensão
          </a>
          */}
        </nav>
        <button
          type="button"
          className="site-nav__burger"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
