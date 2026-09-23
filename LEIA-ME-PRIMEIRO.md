# Espaço dos Anjos — revisão completa: FAQ + Clinton + Family Request

Preparada em 23/09/2026. **Não publicada.**

## Base desta revisão

Foi usada a versão aprovada `Espaco-dos-Anjos-Nova-Versao-Base-V1.zip`.
Não foi usado nenhum HTML das versões V2, V2.1 ou V3 rejeitadas.

A Home continua com **13 blocos, na mesma sequência, em EN/PT/ES**. Dentro desses blocos, a única alteração de HTML foi tornar Clinton um link no mapa. A remoção das bolinhas de Programs é feita por uma regra CSS adicional.

Todos os arquivos de imagens, ícones, CSS original e JavaScript da base aprovada foram preservados byte a byte. O novo acabamento está em `assets/css/refinements.css`. O cabeçalho e o rodapé recebem os novos links; o seletor de idiomas, o menu mobile e o componente flutuante continuam usando os mesmos controladores.

## Abrir a versão completa

1. Extraia o ZIP em uma pasta nova, sem misturar versões.
2. Abra `Espaco-dos-Anjos-Atualizado` no VS Code.
3. Abra o `index.html` pelo Live Server. Use a raiz dessa pasta como raiz do servidor.

Os caminhos de arquivos começam por `/`. Por isso, abra pelo servidor local e não por duplo clique em `file://`.

## Alterações desta etapa

### Programs

Removida a bolinha decorativa antes dos ícones na Home e na página Our Program, nos três idiomas. Cards, textos, cores e ícones foram mantidos.

### Clinton

Novas páginas com endereço real, mapa, horário regular, distinção entre cuidados e visitas, links para conhecer a daycare e Final CTA:

- EN: `/family-child-care-clinton-ma/`
- PT: `/pt/creche-em-clinton-ma/`
- ES: `/es/guarderia-en-clinton-ma/`

O item Clinton no mapa da Home agora aponta para a página do idioma atual. O footer também apresenta um link para a localização em Clinton. Não foram inventadas outras unidades, tempos de trajeto ou serviços de transporte.

### Family Request

As três URLs existentes foram mantidas. A página agora tem:

**Header → título e orientação curta → SmartMate → ajuda por telefone, SMS e e-mail → footer.**

Saíram o hero com a Luciene, o mockup, os blocos educativos extensos e o Final CTA de matrícula. A ajuda usa os contatos já existentes na base:

- Telefone/SMS: `(774) 232-8156`
- E-mail: `espacodosanjos.chilcare@gmail.com` — grafia preservada da base.

O CTA do header e a opção do componente flutuante apontam para o formulário da própria página, sem reiniciá-la. O link Contact do footer aponta para o bloco de ajuda. Não foi acrescentado outro seletor de idiomas; o header controla a página externa e o SmartMate controla o idioma interno.

O iframe mantém:

`https://www.smartimateapp.com/family-request/?company=espaco-dos-anjos-child-care&embed=1`

O script de integração é exatamente o mesmo da versão aprovada. O parent não copia perguntas, sessão, dados pessoais, configurações, GA4 individual ou Meta do SmartMate. Nenhuma configuração de SmartMate, Supabase, Analytics ou Meta foi alterada.

### FAQ

Novas páginas com **23 perguntas por idioma**, organizadas em quatro assuntos: horários/localização, atendimento/matrícula, rotina e solicitações/visitas.

- EN: `/faq/`
- PT: `/pt/perguntas-frequentes/`
- ES: `/es/preguntas-frecuentes/`

A FAQ está no menu principal, no menu mobile e no footer. Os 33 blocos de perguntas antes espalhados pelas páginas (11 assuntos em três idiomas) foram substituídos por um link compacto para a central. O restante do conteúdo dessas páginas e seus Final CTAs foi preservado.

As perguntas usam os dados da base aprovada. O horário regular de cuidados é **segunda a sexta, 7h30–17h30**. As janelas de visita herdadas da base são apresentadas separadamente e dependem de combinação/confirmação com Luciene. O site não transforma uma janela de visita em cuidado noturno ou de fim de semana.

Não foram inventados preços, calendário de feriados, política para neve, promessa de vaga, prazo de resposta, atendimento parcial/integral disponível ou adaptações alimentares garantidas. Quando a informação não foi fornecida, a resposta orienta confirmar com Luciene.

## Páginas e SEO técnico

São **47 arquivos HTML**: os 41 da versão aprovada e seis novos (FAQ e Clinton em três idiomas). As páginas legais continuam em inglês, como na base; não fazem parte dessas seis novas traduções.

Canonicals, títulos, descrições, dados estruturados, alternates `hreflang` recíprocos e sitemap foram atualizados. O seletor de idiomas usa a URL equivalente de cada nova página. As perguntas visíveis da central têm marcação FAQPage; isso não é promessa de resultado especial ou posição no Google.

O crédito MateGrowth continua apontando para `https://www.mategrowth.com/`. O Instagram da daycare foi mantido.

## Testes executados nesta revisão

Os resultados atuais estão em `docs/qa/`. Relatórios da base aprovada foram movidos para `docs/legacy/qa-base-aprovada/`.

- **47 HTML:** tags, H1, IDs, arquivos locais, links, âncoras, canonicals, alternates de idioma, JSON-LD e sitemap, sem problemas encontrados pelo validador.
- **Preservação:** todos os 41 HTML anteriores continuam no pacote; as três Homes mantêm os 13 blocos, mesma ordem e componentes. Todos os assets originais têm os mesmos hashes da base.
- **235 verificações de layout:** 47 páginas em 320, 390, 768, 1024 e 1440 px. Sem overflow horizontal, imagens locais quebradas, sobreposição estável de header ou H1 encoberto nos testes.
- **Interações nas 47 páginas:** abrir/fechar menu mobile, dropdown de idiomas e componente flutuante, incluindo Escape.
- **FAQ:** os 23 accordions foram abertos/fechados em cada idioma; acionamento por teclado também conferido.
- **57 verificações sintéticas:** listener do iframe, origem/janela/payload, limites de altura, ausência de novos eventos de formulário no parent e nomes já existentes dos eventos de contato/CTA.
- **Pacote final:** extraído em outra pasta, comparado com os arquivos da entrega e submetido novamente ao validador estático.

### Limites dos testes

A renderização foi feita em Chromium offline. Para testar os arquivos locais sem rede, CSS, imagens, ícones e scripts foram carregados em memória. Transições/animações foram congeladas somente nos testes de layout, para medir posições finais. As fontes do Google não puderam ser baixadas; o preview usou as alternativas disponíveis no sistema. O HTML entregue mantém as fontes originais.

Maps e SmartMate foram substituídos SOMENTE na memória das prévias por áreas claramente identificadas como teste offline. O ZIP não contém `srcdoc`, placeholders de formulário/mapa nem alterações de endpoints. As mensagens de resize foram testadas sinteticamente; isso não é um teste ponta a ponta do SmartMate.

Não foram enviados formulários, criadas famílias/sessões de teste, alteradas configurações externas ou publicados arquivos. Envio real, abandono/continuação, atribuição/DebugView, renderização externa de Maps/SmartMate e permissões do domínio precisam ser conferidos em ambiente autorizado com internet antes da publicação.

Observação herdada da base: o controle de cookies foca o botão de configurações no footer após aceitar/rejeitar; dependendo do navegador, isso pode deslocar a rolagem. Esse comportamento não foi alterado nesta etapa, que preserva os scripts originais.

## Manutenção

Para repetir a validação estática, rode:

`python3 scripts/validate_site.py`

ou:

`node scripts/validate-site.js`

O site continua estático, sem novas dependências de produção, bibliotecas ou framework. O antigo gerador de páginas permanece desativado, como na base aprovada, para não sobrescrever a arquitetura atual.
