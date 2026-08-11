const FORMATS = [
  {
    name: 'Markdown',
    exts: '.md .markdown',
    text: 'README, docs e notas com títulos, tabelas, listas e código formatados.',
  },
  {
    name: 'CSV / TSV',
    exts: '.csv .tsv',
    text: 'Exports de planilha viram tabela com cabeçalho e rolagem.',
  },
  {
    name: 'JSON',
    exts: '.json .jsonc',
    text: 'Pretty-print, validação e highlight para configs e APIs.',
  },
  {
    name: 'YAML',
    exts: '.yaml .yml',
    text: 'Compose, Actions e configs legíveis com validação.',
  },
  {
    name: 'INI e Env',
    exts: '.ini .cfg .env',
    text: 'Variáveis e settings organizados com highlight.',
  },
  {
    name: 'Logs e texto',
    exts: '.log .txt .xml .toml',
    text: 'Logs por nível e texto com números de linha.',
  },
]

export function Formats() {
  return (
    <section className="section section--alt" id="formatos">
      <div className="section__head">
        <h2 className="section__title">Formatos suportados</h2>
        <p className="section__lede">
          Quando o SO mostra um bloco de texto sem forma, o FileLens organiza.
        </p>
      </div>
      <div className="formats">
        {FORMATS.map((f) => (
          <article className="format-card" key={f.name}>
            <h3>{f.name}</h3>
            <p className="format-card__exts">{f.exts}</p>
            <p className="format-card__text">{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
