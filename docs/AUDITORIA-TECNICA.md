# Auditoria técnica — Espaço dos Anjos Child Care

**Data:** 23 de setembro de 2026  
**Escopo:** somente leitura no website; este arquivo é o único artefato criado.  
**Workspace auditado:** `/Users/ben/Documents/WebSites/MateGrowth/Espaco dos Anjos`  
**Branch / commit no início:** `main` / `1945bf5` (`upgrade`)  
**Alterações locais no início:** nenhuma.  
**Produção consultada:** `https://www.espacodosanjoschildcare.com/`, `robots.txt` e `sitemap.xml`, em 23/09/2026. A produção já contém o Hero estático de Fall; portanto, os testes da Home representam a versão atual, não uma versão anterior.

## A. Resumo do estado atual

O checkout está estruturalmente consistente: há **47 documentos HTML**, cada um com um canonical único, e o sitemap possui as mesmas 47 URLs canônicas. O validador interno retornou zero problemas. O domínio principal em produção responde `200` por HTTPS, e o domínio sem `www` redireciona permanentemente para o domínio canônico com `www`.

O Hero novo está implementado exclusivamente nas três Homes (`index.html`, `pt/index.html` e `es/index.html`) por meio de `assets/css/hero-home.css`. Ele usa uma única fotografia responsiva, não carrega o antigo slider na Home, não usa lazy-loading na imagem principal, inclui preload com `imagesrcset`/`imagesizes` e desativa as animações para `prefers-reduced-motion`.

Foram identificadas duas correções funcionais concretas para uma próxima etapa: foco/rolagem indevida do consentimento e recarga desnecessária caso o visitante clique no link da página Family Request enquanto já estiver preenchendo-a. Há também uma lacuna de medição para os links de Family Request do menu/header/footer, se a intenção for medir todas as portas de entrada do fluxo.

## B. Inventário de páginas e componentes

| Item | Resultado |
|---|---|
| Páginas HTML | 47 |
| Canonicals únicos | 47 |
| URLs no sitemap | 47, com conjunto igual ao dos canonicals |
| Homes EN/PT/ES | presentes, com 13 blocos cada |
| Páginas institucionais | About, Program, Meals, Our Space, FAQ e Family Request nas três línguas |
| Páginas locais | Clinton, Lancaster, Hudson e Marlborough, além das páginas por intenção de busca |
| Páginas legais | Privacy Policy e Terms of Service presentes |
| H1 por página | 1 em todos os 47 documentos |
| IDs duplicados | nenhum encontrado |
| Âncoras locais quebradas | nenhuma encontrada |
| Imagens sem `alt` | nenhuma encontrada |

### Componentes

- Header, menu mobile, seletor de idioma, footer e botão flutuante existem uma vez por página segundo o validador.
- A Home mantém a ordem mobile exigida: H1 → imagem → descrição/CTAs. A regra está explícita em `assets/css/hero-home.css:241-247`.
- Family Request contém formulário incorporado + bloco de ajuda, sem Final CTA duplicado. Isso foi validado estaticamente nas três versões.
- O crédito da MateGrowth é um link para `mategrowth.com/`, não para Instagram.

## C. Matriz de eventos do website

**ID encontrado em todos os 47 HTMLs:** `G-LD62J5RD1Z`.  
**Importante:** os resultados abaixo distinguem código encontrado de recebimento no GA4. O recebimento no GA4/DebugView não foi consultado.

| Ação | Elemento/página | Evento previsto no código | Parâmetros seguros | Situação |
|---|---|---|---|---|
| Ir ao bloco final | Links `#tour`, inclusive CTA principal da Home | `tour_cta_click` | `cta_text`, `cta_location` | Encontrado em `assets/js/analytics-events.js:33-44` |
| Iniciar Family Request pelo CTA final/flutuante | Elementos com `data-family-request-link` | `final_cta_request` | `cta_text`, `request_provider: Smartimate` | Encontrado em `:47-52` |
| Telefonar | `tel:` | `phone_click` | `cta_text` | Encontrado |
| Enviar SMS | `sms:` | `text_click` | `cta_text` | Encontrado |
| Enviar e-mail | `mailto:` | `email_click` | `cta_text` | Encontrado |
| Abrir Instagram | URL oficial do Instagram | `instagram_click` | `cta_text` | Encontrado |
| Abrir perfil Google | `share.google/` | `google_profile_click` | `cta_text` | Encontrado |
| Trocar idioma | controles `data-language` | `language_change` | `selected_language` | Encontrado |

O dispatcher bloqueia eventos se não houver consentimento ou `gtag` (`analytics-events.js:4-16`), e não inclui PII na lista de parâmetros prevista.

### Consentimento

- Estado padrão: `analytics_storage: denied`; as demais categorias de anúncios continuam negadas (`index.html:16-24`).
- O script externo do GA4 é carregado somente após consentimento aceito ou quando a escolha aceita já existe no armazenamento local (`index.html:27-35`, `cookie-consent.js:60-65`).
- O controle impede criar duas tags externas do GA4 por página (`index.html:28`).
- **Recebimento de page_view/eventos no GA4 não verificado:** não foi acessado DebugView, Realtime ou a propriedade.

## D. Revisão do embed SmartMate

As três páginas Family Request usam:

`https://www.smartimateapp.com/family-request/?company=espaco-dos-anjos-child-care&embed=1`

O script `assets/js/smartmate-family-request-embed.js` apresenta as proteções esperadas:

- origem aceita exatamente `https://www.smartimateapp.com` (`linha 8` e `34`);
- associa a mensagem ao `iframe.contentWindow` correspondente (`linha 35`);
- exige o tipo `smartmate:family-request:resize` (`linha 38`);
- valida número/decimal simples e limita a altura entre 640 e 12.000 px (`linhas 41-47`);
- reescreve o fallback usando apenas o slug público, sem repassar query strings/tokens (`linhas 22-28`);
- não envia `family_request_*` a partir do parent.

**Não confirmado:** o valor de `companies.website_domain` no SmartMate. O domínio final do parent a confirmar é `https://www.espacodosanjoschildcare.com` (com `www`), porque o apex faz `301` para ele na produção.

## E. SEO técnico e indexabilidade

| Verificação | Resultado |
|---|---|
| `robots.txt` | permite rastreamento e aponta para o sitemap canônico |
| `sitemap.xml` local | XML lido pelo validador; 47 URLs, todas canônicas |
| Canonical | 47/47 presentes, únicos e com domínio `www` |
| hreflang | destinos presentes e recíprocos segundo o validador; EN/PT/ES/x-default nas equivalências |
| `noindex` | nenhum encontrado nos HTMLs |
| Titles e meta descriptions | exatamente um de cada por documento, validados |
| JSON-LD | sintaxe JSON válida quando presente |
| Redirecionamento apex → www | confirmado em produção: `301` para `https://www.espacodosanjoschildcare.com/` |
| HTTPS / Home / robots / sitemap em produção | `200` para Home, robots e sitemap |

Não há acesso ao Search Console nesta auditoria. Portanto, o site está **tecnicamente indexável**, mas status de indexação, cobertura, CWV de campo e limites de solicitação permanecem pendentes de confirmação no painel.

## F. Performance e acessibilidade

### Novo Hero

- Única imagem responsiva: `hero-01-960w.webp` (74.072 bytes, 960×541) e `hero-01.webp` (201.228 bytes, 1600×901).
- Preload compatível com `srcset`/`sizes`: `index.html:207`; a imagem tem `fetchpriority="high"`, largura e altura definidos e não usa `loading="lazy"` (`index.html:314`).
- O Hero usa o CSS novo e não referencia `hero-slider.js` nas Homes. O arquivo antigo existe no repositório, mas não está ligado à Home.
- Folhas usam CSS/SVG leve e `pointer-events:none`; `prefers-reduced-motion` desativa as duas animações (`hero-home.css:270-273`).

### Outros pontos

- Mapa do Google usa `loading="lazy"` (`index.html:751`).
- Fontes possuem `display=swap` e preconnect para Google Fonts/gtag (`index.html:197-203`).
- A folha-fonte `assets/css/style.css` ainda tem 17 `@import`, mas as páginas usam `site.bundle.css`; não foi observado `@import` no bundle aplicado às páginas.
- Não foi executado Lighthouse/PageSpeed nem foram coletadas três medições. Assim, não há nova nota de performance, LCP, CLS ou Core Web Vitals para atribuir ao Hero atual.

### Acessibilidade/uso verificados estaticamente

- Skip link, nomes acessíveis no menu, título do iframe, `alt` em imagens e estrutura de um H1 foram encontrados.
- O menu flutuante permite Escape e devolve foco ao botão (`assets/js/floating-booking.js`).
- Testes manuais completos de teclado, contraste por pixel e viewport 320/390/768/1440 não foram automatizados nesta rodada; exigem revisão visual/assistida complementar.

## G. Problemas confirmados por prioridade

### Alta — consentimento pode deslocar a pessoa para o footer

- **Página/arquivo:** todas as páginas; `assets/js/cookie-consent.js:118-135`.
- **Evidência:** o botão de configurações é anexado a `.footer__bottom` e, após aceitar ou recusar, recebe foco programaticamente (`settingsButton.focus()`).
- **Como reproduzir:** primeira visita → clicar em “Accept analytics” ou “Decline”. O foco é movido para um elemento no rodapé, o que pode deslocar a rolagem da pessoa para longe do conteúdo que ela estava lendo.
- **Impacto:** quebra de contexto e experiência ruim, sobretudo em mobile; é também um problema de foco acessível.
- **Correção recomendada:** ocultar o banner sem mover o foco ao botão no rodapé; manter um caminho de teclado acessível para preferências sem provocar salto de scroll.
- **Teste de correção:** primeira visita em 390 px e 1440 px; aceitar/recusar e confirmar posição estável, foco previsível e reabertura das preferências.

### Média — links da própria Family Request podem recarregar a página em preenchimento

- **Páginas/arquivos:** `family-request/index.html:164,243`; equivalentes PT e ES.
- **Evidência:** header/footer mantêm `href` para a própria URL canônica. Um link normal para a mesma página faz nova navegação do documento.
- **Como reproduzir:** iniciar o preenchimento no iframe e clicar em “Family Request” no header/footer da própria página.
- **Impacto:** pode recarregar a página pai e interromper um preenchimento no iframe.
- **Correção recomendada:** tornar o item atual não navegável ou impedir a recarga somente quando já estiver na rota ativa, preservando a semântica e a acessibilidade.
- **Teste de correção:** iniciar preenchimento sem enviar dados e ativar header/footer; confirmar que não há reload nem perda de contexto.

### Média — rastreamento não cobre as entradas de Family Request no menu/header/footer

- **Página/arquivo:** todas as páginas; `assets/js/analytics-events.js:47-52`.
- **Evidência:** `final_cta_request` só é enviado para `data-family-request-link` ou URL externa SmartMate. Os links normais do header/footer para `/family-request/`, `/pt/family-request/` e `/es/family-request/` não carregam esse atributo.
- **Impacto:** a propriedade pode subcontar quem inicia a jornada pelo menu, apesar de medir CTAs finais/flutuantes.
- **Correção recomendada:** decidir a regra de medição; se menu/header/footer também representam início de jornada, marcá-los de forma explícita sem duplicar o evento.
- **Teste de correção:** interceptar `gtag` localmente e validar exatamente um `final_cta_request` por porta de entrada, após consentimento.

### Baixa — documentação de validação aponta para o comando errado se executado literalmente

- **Arquivo:** `scripts/validate-site.js` é JavaScript, enquanto o validador real é `scripts/validate_site.py`.
- **Evidência:** executar `python3 scripts/validate-site.js` resulta em `SyntaxError`; `python3 scripts/validate_site.py` funciona.
- **Impacto:** apenas risco operacional para quem seguir o nome errado; não afeta visitantes.
- **Correção recomendada:** documentar o comando canônico ou chamar o wrapper com Node.
- **Teste de correção:** executar o comando documentado e confirmar JSON sem issues.

## H. Melhorias opcionais (não são defeitos críticos)

- Remover ou arquivar `assets/js/hero-slider.js` somente se for confirmado que nenhuma página futura o usa. Não há necessidade funcional imediata.
- Padronizar formatação dos elementos no `<head>` em uma futura manutenção, sem misturar com correções funcionais.
- Fazer uma rodada manual de contraste e foco em leitores de tela/teclado antes de qualquer redesign amplo.

## I. Pendências por falta de acesso/ferramenta

- Recebimento real de `page_view` e eventos no GA4/DebugView.
- Estado de indexação, cobertura, HTTPS e Core Web Vitals de campo no Search Console.
- Cadastro `companies.website_domain` no SmartMate.
- Teste real de resize enviado pelo SmartMate e preenchimento sem dados pessoais.
- Medições Lighthouse comparáveis (três por viewport) do Hero novo.
- Teste manual final em 320, 390, 768 e 1440 px e contraste calculado por ferramenta.

## J. Ordem recomendada para correções

1. Corrigir o foco/rolagem do consentimento e validar nos dois estados de escolha.
2. Impedir a recarga da página Family Request quando o visitante já está nela.
3. Definir e implementar, se aprovado, a cobertura analítica para header/menu/footer do Family Request.
4. Rodar medições Lighthouse e revisão manual de teclado/contraste após as correções acima.

## Testes executados

1. Inventário do checkout e Git: branch `main`, commit `1945bf5`, sem alterações locais iniciais.
2. `python3 scripts/validate_site.py`: **47 páginas, 47 canonicals, 13 blocos esperados na Home, 0 issues**.
3. Auditoria estática adicional: H1, IDs duplicados, âncoras locais, `alt`, `noindex`, references de Family Request, GA4 e SmartMate.
4. Consulta pública read-only: Home, apex, `robots.txt` e `sitemap.xml` em produção.
5. Conferência local da Home atual e do Hero responsivo sem alterar arquivos funcionais.

## Confirmação de escopo

Não foram alterados HTML, CSS, JavaScript, Analytics, SmartMate, Search Console, DNS ou configurações externas. Não houve commit, push ou publicação. O único arquivo criado nesta auditoria é este relatório.
