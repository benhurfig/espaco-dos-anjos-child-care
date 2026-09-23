# Relatório de Correções Pré-Template

**Projeto:** Espaço dos Anjos Child Care  
**Branch:** `codex/pre-template-fixes`  
**Data:** 13 de agosto de 2026  
**Status:** pronto para revisão; não publicado e não mesclado na `main`.

## Objetivo

Corrigir a base atual antes de transformá-la no Template Oficial MateGrowth para Family Child Care, preservando o design e o conteúdo aprovado do site.

## Correções concluídas

### Arquitetura e qualidade

- Header removido de dentro do landmark `main`.
- Páginas legais receberam fechamento HTML correto.
- Menu das páginas legais passou a usar a implementação ativa.
- Código legado `header.js` e `gallery.js` removido.
- CSS vazios `forms.css`, `gallery.css` e `sections.css` removidos.
- Manifest válido criado e vinculado às páginas.
- URLs legais internas, redirects e canonicals alinhados.

### SEO técnico e local

- Title principal reduzido para 60 caracteres.
- Descriptions mantidas dentro do intervalo recomendado.
- Canonical e `og:url` alinhados em todas as páginas.
- Redirect permanente do domínio sem `www` para o domínio canônico.
- JSON-LD organizado como `ChildCare`, `WebSite`, `WebPage` e `ImageObject`.
- Sitemap contém somente as cinco URLs canônicas.
- `priority` e `changefreq`, ignorados pelo Google, foram removidos.
- Open Graph e Twitter Cards completados.
- Favicons e dimensões de social preview corrigidos.
- Nenhum rating, preço, coordenada ou credencial não confirmada foi adicionado.

### SEO multilíngue

- Inglês disponível em `/`.
- Português disponível em `/pt/`.
- Espanhol disponível em `/es/`.
- Cada idioma possui HTML inicial, title, description, canonical, Open Graph e schema próprios.
- `hreflang` recíproco para `en`, `pt`, `es` e `x-default`.
- Sitemap contém alternates linguísticos.
- Seletor de idioma navega entre URLs indexáveis.
- Gerador reproduzível em `scripts/generate-localized-pages.js`.
- EN/PT/ES continuam com 215 chaves equivalentes.

### Acessibilidade

- Tradução de alt texts corrigida.
- Slider respeita `prefers-reduced-motion`.
- Menu móvel restaura foco.
- Seletor de idiomas oferece navegação por setas, Home, End e Escape.
- Um H1 por página e ausência de IDs duplicados validadas.

### Performance

- CSS de produção consolidado de 20 arquivos encadeados para um bundle.
- CSS modular original preservado para desenvolvimento.
- Font Awesome removido.
- Ícones substituídos por sprite SVG local.
- Treze variantes WebP responsivas geradas.
- Conjunto responsivo reduziu aproximadamente 66,7% em relação aos originais equivalentes.
- `srcset` e `sizes` adicionados às imagens principais.
- Seções abaixo da dobra usam `content-visibility`.
- Preconnect adicionado para Google Tag Manager.
- Cache busting atualizado para scripts modificados.

### Cookies e analytics

- Aviso de consentimento criado em EN/PT/ES.
- Aceitar e recusar possuem destaque equivalente.
- GA4 não é carregado antes do aceite.
- Publicidade, personalização e armazenamento de anúncios permanecem negados.
- Escolha é persistida em armazenamento local essencial.
- Botão discreto permite mudar a decisão depois.
- Política de Privacidade atualizada com o comportamento real.

## Como reconstruir

Na raiz do projeto:

```sh
node scripts/build-css.js
node scripts/generate-localized-pages.js
```

Para recriar variantes de imagem, o script `scripts/optimize-images.js` requer a biblioteca `sharp`:

```sh
node scripts/optimize-images.js
```

Os arquivos `pt/index.html`, `es/index.html` e `assets/css/site.bundle.css` são gerados. Alterações devem ser feitas no `index.html`, nos dicionários ou nos CSS de componente e depois regeneradas.

## Como validar

```sh
node scripts/validate-site.js
```

O validador confere:

- cinco páginas canônicas;
- titles e descriptions;
- canonical e Open Graph;
- assets e `srcset`;
- JSON-LD;
- `hreflang`;
- sitemap e robots;
- bundle CSS;
- manifest;
- paridade das 215 chaves EN/PT/ES;
- ausência do Font Awesome em produção.

## Confirmações humanas antes de publicar

Os valores abaixo já existiam no site e não foram alterados sem autorização. Devem ser confirmados com a cliente:

- e-mail `espacodosanjos.chilcare@gmail.com` — verificar se “chilcare” é intencional;
- autorização para exibir o endereço residencial completo;
- status e redação de “EEC Licensed”;
- aceitação atual de Child Care Vouchers;
- faixa etária de 6 meses a 5 anos;
- horário operacional de 7:30 AM a 5:30 PM;
- horários de visita exibidos;
- lista de comunidades atendidas;
- disponibilidade divulgada no Monthly Bulletin;
- propriedade do Google Business Profile;
- ID correto do GA4 e requisitos de consentimento/cookies;
- revisão jurídica das páginas de privacidade e termos.

## Passos de publicação

1. Obter as confirmações humanas acima.
2. Executar os três geradores quando houver mudanças de conteúdo, CSS ou imagem.
3. Executar `node scripts/validate-site.js`.
4. Fazer preview da branch em desktop e mobile.
5. Testar Rich Results e schema na URL de preview/publicação.
6. Revisar redirects e headers reais da hospedagem.
7. Mesclar a branch somente após aprovação.
8. Publicar.
9. Enviar `sitemap.xml` no Google Search Console.
10. Inspecionar `/`, `/pt/` e `/es/` e solicitar indexação.
11. Monitorar cobertura, Core Web Vitals e eventos de conversão.

## Fora de escopo desta etapa

- Transformação em template reutilizável.
- Centralização completa dos dados da cliente.
- SmartMate Qualification, Waitlist, Calendar ou Financial.
- Alteração de conteúdo comercial não confirmado.
- Publicação, merge, commit, push ou configuração do Search Console.

## Critério de aceite

A branch está pronta para revisão quando os geradores executam sem erro, o validador termina com sucesso, o preview não apresenta regressão visual e as informações comerciais marcadas acima foram confirmadas.
