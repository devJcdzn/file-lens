/** Botão oficial via Button API (sem script - funciona em SPA/React). */
const BMC_HREF = 'https://www.buymeacoffee.com/devjc'
const BMC_IMG =
  'https://img.buymeacoffee.com/button-api/?text=Me%20Paga%20um%20Caf%C3%A9zinho&emoji=&slug=devjc&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00'

export function SupportCard() {
  return (
    <aside className="support-card">
      <p className="support-card__title">Gostou do FileLens?</p>
      <p className="support-card__text">
        O projeto é gratuito e local. Se ajudar no seu dia a dia, um café faz diferença.
      </p>
      <a
        className="support-card__bmc"
        href={BMC_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Me paga um cafézinho"
      >
        <img src={BMC_IMG} alt="Me Paga um Cafézinho" width={228} height={64} />
      </a>
    </aside>
  )
}
