const STEPS = [
  {
    n: '1',
    title: 'Arraste o arquivo',
    text: 'Solte um .md, .csv ou .json na área de upload - ou clique para escolher no disco.',
  },
  {
    n: '2',
    title: 'Leitura na hora',
    text: 'O formato é detectado e renderizado: markdown, tabelas, JSON e syntax highlight.',
  },
  {
    n: '3',
    title: 'Copie ou baixe',
    text: 'O original não é alterado. Copie o texto ou baixe de volta quando quiser.',
  },
]

export function Steps() {
  return (
    <section className="section" id="como-funciona">
      <div className="section__head">
        <h2 className="section__title">Como funciona</h2>
        <p className="section__lede">Três passos. Sem conta. Sem upload para a nuvem.</p>
      </div>
      <div className="steps">
        {STEPS.map((step) => (
          <article className="step" key={step.n}>
            <span className="step__n">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
