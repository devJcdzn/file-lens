import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

export type FindBarProps = {
  query: string
  matchCount: number
  activeIndex: number
  onQueryChange: (query: string) => void
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

export function FindBar({
  query,
  matchCount,
  activeIndex,
  onQueryChange,
  onNext,
  onPrev,
  onClose,
}: FindBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) onPrev()
      else onNext()
    }
  }

  const label =
    matchCount === 0
      ? query.trim()
        ? '0 resultados'
        : ''
      : `${activeIndex + 1} / ${matchCount}`

  return (
    <div className="fv-find" role="search">
      <input
        ref={inputRef}
        type="search"
        className="fv-find__input"
        placeholder="Buscar no arquivo…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Buscar no arquivo"
        autoComplete="off"
        spellCheck={false}
      />
      <span className="fv-find__count" aria-live="polite">
        {label}
      </span>
      <button type="button" className="fv-btn fv-btn--icon" onClick={onPrev} disabled={matchCount === 0} title="Anterior" aria-label="Resultado anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="fv-btn fv-btn--icon" onClick={onNext} disabled={matchCount === 0} title="Próximo" aria-label="Próximo resultado">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="fv-btn fv-btn--icon" onClick={onClose} title="Fechar busca" aria-label="Fechar busca">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
