export function Install() {
  return (
    <section className="section section--alt" id="instalar">
      <div className="section__head">
        <span className="section__eyebrow">Extensão</span>
        <h2 className="section__title">Um clique na barra, uma aba de leitura</h2>
        <p className="section__lede">
          Instale a extensão para abrir o visualizador direto da barra do navegador — sem precisar
          abrir o site.
        </p>
      </div>
      <div className="install">
        <div className="install-card">
          <h3>
            <span className="install-card__dot install-card__dot--chrome" aria-hidden /> Chrome ·
            Edge · Brave
          </h3>
          <p>Carregue a extensão em modo desenvolvedor:</p>
          <ol>
            <li>
              Baixe o pacote da extensão (<code>filelens-extension.zip</code>)
            </li>
            <li>
              Extraia e acesse <code>chrome://extensions</code>
            </li>
            <li>Ative o "Modo desenvolvedor" no canto superior</li>
            <li>Clique em "Carregar sem compactação" e selecione a pasta</li>
          </ol>
        </div>
        <div className="install-card">
          <h3>
            <span className="install-card__dot install-card__dot--firefox" aria-hidden /> Firefox
          </h3>
          <p>O mesmo pacote funciona no Firefox:</p>
          <ol>
            <li>
              Acesse <code>about:debugging#/runtime/this-firefox</code>
            </li>
            <li>Clique em "Carregar extensão temporária"</li>
            <li>
              Selecione o arquivo <code>manifest.json</code> dentro da pasta extraída
            </li>
          </ol>
        </div>
      </div>
      <p className="install__note">
        As lojas oficiais — Chrome Web Store e Add-ons da Mozilla — chegam em breve.
      </p>
    </section>
  )
}
