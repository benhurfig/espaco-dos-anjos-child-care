# Revisão Final de Pré-Publicação

**Data:** 13 de agosto de 2026  
**Branch revisada:** `codex/pre-template-fixes`  
**Parecer técnico:** **GO condicional** — tecnicamente aprovado; publicar somente após confirmar os dados comerciais listados abaixo.

## Resultado do gate técnico

- Build CSS executado do zero.
- Treze variantes de imagens regeneradas.
- Páginas PT/ES regeneradas.
- Validador automático aprovado.
- Cinco páginas canônicas aprovadas.
- EN/PT/ES testados em desktop e mobile.
- Política de Privacidade e Termos testados em desktop e mobile.
- Nenhum overflow horizontal após as correções finais.
- Nenhuma imagem quebrada.
- Nenhum erro ou warning no console durante os testes.
- Menu móvel abre, fecha com Escape e remove o bloqueio do body corretamente.
- Seletor de idioma navega de `/` para `/pt/` e preserva `pt-BR`.
- CSS bundle carregado corretamente.
- Ícones SVG locais carregados corretamente.
- Canonical, Open Graph, JSON-LD, sitemap, robots e `hreflang` aprovados.
- Todos os links com `target="_blank"` possuem `noopener`.
- Nenhuma URL HTTP insegura encontrada no conteúdo do site.
- Banner de cookies EN/PT/ES testado com GA4 bloqueado até o aceite.

## Problemas encontrados e corrigidos nesta revisão

### Consentimento de analytics

Foi adicionado um aviso simples de cookies com aceitar/recusar, preferência persistente e acesso posterior às configurações. O GA4 não é carregado enquanto analytics não for aceito; cookies de publicidade permanecem negados.

### Idioma incorreto nas páginas legais

Quando a preferência salva era português ou espanhol, o atributo `lang` das páginas legais mudava, embora o texto jurídico permanecesse em inglês. O seletor foi removido dessas páginas e elas agora permanecem corretamente em inglês.

### Overflow na Política de Privacidade

O e-mail e a URL longa ultrapassavam a largura em telas de 390 px. O CSS jurídico agora permite quebra segura de palavras e URLs longas.

### Cache do CSS

O identificador do bundle foi atualizado para `20260813-2`, evitando que a versão anterior permaneça no navegador após o deploy.

## Confirmações obrigatórias antes de publicar

Estas informações já estavam no site. Não foram alteradas porque dependem da cliente:

1. Confirmar se o e-mail correto é `espacodosanjos.chilcare@gmail.com`.
2. Confirmar autorização para publicar `277 Greeley St, Clinton, MA 01510`.
3. Confirmar a afirmação “EEC Licensed”.
4. Confirmar que Child Care Vouchers continuam sendo aceitos.
5. Confirmar atendimento de 6 meses a 5 anos.
6. Confirmar horário operacional de 7:30 AM a 5:30 PM.
7. Confirmar horários de visita exibidos no site.
8. Confirmar vagas/disponibilidade mostradas no Monthly Bulletin.
9. Confirmar cidades/comunidades atendidas.
10. Confirmar que `G-LD62J5RD1Z` é a propriedade GA4 correta.

Se algum desses valores estiver incorreto, ele deve ser corrigido no HTML, traduções, schema e páginas legais antes da publicação.

## Cuidados ao criar o commit

- Não usar `git add .` sem revisar os arquivos.
- Não incluir mudanças de `.DS_Store`; elas já existiam separadamente e não fazem parte desta entrega.
- Incluir as novas pastas `pt/`, `es/`, `scripts/`, variantes WebP, bundle CSS, sprite SVG e documentos de revisão.
- Confirmar que os arquivos removidos de código legado também entram no commit.
- Executar novamente `node scripts/validate-site.js` imediatamente antes do commit.

## Pós-publicação obrigatório

1. Testar os redirects reais:
   - domínio sem `www` → domínio com `www`;
   - `/pt` → `/pt/`;
   - `/es` → `/es/`;
   - páginas legais `.html` → URLs canônicas sem extensão.
2. Rodar o Rich Results Test na URL pública.
3. Inspecionar `/`, `/pt/` e `/es/` no Search Console.
4. Enviar o sitemap público.
5. Confirmar eventos GA4 de booking, telefone, SMS, e-mail, idioma e Google Profile.
6. Conferir Core Web Vitals após dados reais de tráfego.

## Parecer

Não foram encontrados bloqueadores técnicos restantes no código revisado. A publicação está condicionada apenas à confirmação dos dados operacionais/comerciais e ao cuidado de excluir `.DS_Store` do commit.
