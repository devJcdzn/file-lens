export const SAMPLE_MD = `# Guia da API · Acme Cloud

> Arquivos \`.md\` como este normalmente abrem como texto puro no desktop.
> O **FileLens** renderiza tudo: títulos, tabelas, código e listas.

## Endpoints

| Método | Rota            | Descrição               |
| ------ | --------------- | ----------------------- |
| GET    | \`/users\`       | Lista usuários          |
| POST   | \`/users\`       | Cria um usuário         |
| DELETE | \`/users/:id\`   | Remove um usuário       |

## Exemplo de requisição

\`\`\`json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "roles": ["admin", "editor"],
  "active": true
}
\`\`\`

## Checklist de deploy

- [x] Pipeline de CI rodando
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do banco agendado

> **Importante:** nunca suba o arquivo \`.env\` para o repositório.

## Resultado esperado

Cada seção deste arquivo aparece formatada — do jeito que deveria ter sido
exibido desde o início. E tudo isso acontece **localmente, no seu navegador**.
`;

export function makeSampleFile(): File {
  return new File([SAMPLE_MD], 'guia-acme-api.md', {
    type: 'text/markdown',
    lastModified: Date.now(),
  })
}
