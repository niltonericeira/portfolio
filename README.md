# Portfólio de Nilton Ericeira

Site estático em HTML, CSS e JavaScript, com manifest e service worker para PWA.

## Executar localmente

Requisito: Node.js 22 ou superior. Não há dependências externas nem necessidade de executar `npm install`, configurar `.env` ou instalar Homebrew, Rosetta ou banco de dados.

Na pasta do projeto:

```sh
npm start
```

Abra http://localhost:8080. Para encerrar, pressione `Ctrl+C`.
Também é possível usar `npm run dev`. Se a porta estiver ocupada:

```sh
PORT=8081 npm start
```

O servidor aceita conexões apenas deste computador e serve os arquivos públicos do site. Não há etapa de compilação. As alterações aparecem ao recarregar o navegador.

## Cache durante o desenvolvimento

O service worker é ativado na publicação e desativado em localhost. Caso o navegador tenha uma versão local antiga instalada, remova o service worker e os dados do site nas ferramentas de desenvolvimento uma vez.

## Publicação

O site continua compatível com GitHub Pages: os arquivos HTML, CSS, JavaScript e `assets/` são publicados diretamente. O servidor Node é apenas uma ferramenta local.

## Auditoria da migração

Verificação em 6 de outubro de 2026: máquina ARM64, Node.js 24.21.0 e npm 11.19.0 disponíveis. O projeto não contém módulos nativos, binários Intel, caminhos do iMac ou dependências npm. Os canais de contato usam links para e-mail, WhatsApp e LinkedIn; não há backend de formulário. Links externos de contato precisam de internet.
