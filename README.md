# FileLens

Visualize arquivos que o desktop abre como texto puro: **Markdown**, **CSV/TSV**, **JSON**, **YAML**, **INI**, **.env**, **TOML**, **logs**, **XML** e **TXT**.

Tudo roda **100% no navegador** — o conteúdo do arquivo não é enviado a nenhum servidor.

## Estrutura

Monorepo npm workspaces:

```
packages/viewer/     # núcleo compartilhado (React FileViewer + renderers)
apps/web/            # site + demo + página /viewer
apps/extension/      # extensão Chrome / Edge / Firefox (MV3)
```

## Requisitos

- Node.js **≥ 20**
- npm (vem com o Node)

## Scripts

```bash
npm install

npm run dev:web      # landing + viewer em http://localhost:5173
npm run dev:ext      # rebuild da extensão em watch
npm test             # testes do package viewer
npm run typecheck    # TypeScript em todos os workspaces
npm run build        # build web + extension
npm run zip          # gera apps/extension/filelens-extension.zip
```

## MVP web

O lançamento atual prioriza o **site + `/viewer`** (tema claro). A extensão existe no monorepo, mas está **oculta na UI** até o release oficial.

```bash
npm run dev:web
# http://localhost:5173        landing
# http://localhost:5173/viewer visualizador limpo
```

O card “Buy me a coffee” usa o slug BMC `devjc`.

<!--
## Extensão (modo desenvolvedor) — reativar no site quando disponível

1. `npm run build` (ou `npm run dev:ext` para watch)
2. Use a pasta `apps/extension/dist`
3. Chrome: chrome://extensions → Carregar sem compactação
4. Firefox: about:debugging → Carregar extensão temporária
-->

## Formatos suportados

| Formato   | Extensões              | Visualização                          |
|----------|------------------------|---------------------------------------|
| Markdown | `.md`, `.markdown`     | GFM, código com syntax highlight      |
| CSV/TSV  | `.csv`, `.tsv`         | Tabela (1ª linha como cabeçalho)      |
| JSON     | `.json`, `.jsonc`      | Pretty-print + validação              |
| YAML     | `.yaml`, `.yml`        | Highlight + validação                 |
| INI      | `.ini`, `.cfg`, `.conf`| Texto com highlight                   |
| Env      | `.env`                 | Texto com highlight                   |
| TOML     | `.toml`                | Texto com highlight                   |
| Log      | `.log`                 | Linhas coloridas por nível            |
| XML      | `.xml`                 | Texto com highlight                   |
| Texto    | `.txt`                 | Texto com números de linha            |

Limite padrão: **6 MB** por arquivo (só texto; binários são recusados).

## Privacidade

- Leitura local via File API do navegador
- Sem backend e sem telemetria no código do projeto
- Markdown sanitizado com DOMPurify (proteção XSS)

## Desenvolvimento

O package `@file-viewer/viewer` é consumido pelos apps via alias Vite para o TypeScript fonte (`packages/viewer/src`). Não é necessário publicar o package para desenvolver.

```bash
# rodar só os testes do viewer
npm run test --workspace=@file-viewer/viewer
```

## Licença

Projeto privado / uso pessoal até definição de licença.
