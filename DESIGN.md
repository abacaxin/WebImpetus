# Impetus — Website Oficial

Direção de experiência, design system e arquitetura. Escrito antes da implementação;
revisado quando a implementação contradisser algo aqui.

---

## 1. A aposta editorial

O Impetus está na **Fase 0** — MVP interno, nenhum usuário externo, quatro protocolos
funcionando de verdade e um reservado. Um site que fingisse ser um produto lançado
contradiria o documento fundador, que trata honestidade arquitetural como princípio.

Então a aposta é o inverso do SaaS genérico: **a honestidade é o diferencial de marca.**

O manifesto recusa explicitamente as categorias existentes (chatbot, ERP, CRM, "apenas
uma IA"). Essa recusa é o material mais forte que o projeto tem — nenhum concorrente
publica o que *não* é. O site transforma isso em seção, não em nota de rodapé.

Regra de conteúdo: **nada no site promete além do que `packages/protocol/src/index.ts`
entrega.** `gitStatus` aparece como reservado, não como feature.

Headline do hero vem do próprio produto, não de copywriting novo:

> **Uma entidade. Várias máquinas.**

---

## 2. Design system

Herdado de `impetus-diagrama.html`. As cores **codificam a arquitetura** — não são
decoração, e esse significado não pode ser quebrado em peça nova.

### Cor

| Token | Valor | Significado |
|---|---|---|
| `--bg` | `#0a0a0c` | fundo |
| `--panel` / `--panel-2` | `#121215` / `#17171b` | superfícies elevadas |
| `--line` | `rgba(255,255,255,.09)` | bordas |
| `--text` | `#f2f0ee` | texto (off-white, nunca `#fff`) |
| `--text-dim` / `--text-faint` | `.62` / `.50` | hierarquia secundária |
| `--red` / `--red-bright` | `#c0181a` / `#ff3b3f` | **cérebro central** |
| `--green` | `#4ade80` | **gateway** (entrada do usuário) |
| `--amber` | `#ffb703` | **agente local** |

Contraste **medido no navegador**, sobre `--bg`: `--text` 17.4:1 · `--text-dim` 7.0:1 ·
`--text-faint` 4.9:1. Os três passam em AA para texto normal.

As opacidades originais (`.55` / `.32`) vieram do diagrama do produto e reprovaram na
auditoria: `.32` dava 2.6:1 e estava sendo usado em cabeçalho de tabela, status de
máquina e legenda de protocolo — informação, não decoração. Subir os tokens corrigiu
todos os usos de uma vez, em vez de caçar ocorrência por ocorrência.

### Tipografia

Space Grotesk (display/corpo) + Space Mono (rótulos técnicos, caminhos, respostas do
produto). O mono não é estilo — ele marca **o que é saída real do sistema**.

Escala fluida com `clamp()`, base 16px, razão ~1.25 no corpo e salto expressivo no
display (`clamp(2.5rem, 7vw, 6.5rem)`).

### Espaço, raio, motion

- Espaçamento em múltiplos de 4; ritmo de seção em `clamp(6rem, 12vh, 10rem)`.
- Raio: `10px` (chip) / `14px` (painel) / `20px` (bloco maior). Nada de pill.
- Motion: `140ms` (hover) / `320ms` (reveal) / `640ms` (transição de seção).
- Easing padrão `cubic-bezier(.22,.61,.36,1)`; spring só onde há física (cursor, drag).
- Conectores tracejados (`3 5`) são a textura da marca, herdados do diagrama.
- **O grid de 46px do diagrama não foi trazido.** Lá ele cobre um blueprint de
  arquitetura, onde tem função; aqui só sobraria como decoração — e a única seção
  onde chegou a ser usado é a da conversa, atrás de texto mono pequeno, onde ruído
  de fundo custa legibilidade. Se voltar, que seja sobre uma superfície que de fato
  represente medição ou diagrama.

---

## 3. Arquitetura da narrativa

Primeira versão: site de divulgação, não documentação. Sete movimentos.

| # | Seção | O que estabelece |
|---|---|---|
| 1 | **Hero** | Uma entidade, várias máquinas. |
| 2 | **O problema** | Fragmentação: a mesma entidade em versões divergentes. |
| 3 | **Como funciona** | Cérebro central + agentes; conexão sempre de saída. |
| 4 | **O produto** | Conversa real de WhatsApp, com as respostas exatas do código. |
| 5 | **Os protocolos** | Quatro que funcionam, um reservado. Problema → ação → resultado. |
| 6 | **Fases** | 0 → 3, com "você está aqui" na 0. |
| 7 | **CTA** | Ler o manifesto — o artefato público que de fato existe. |

Cortadas da v1, prontas para voltar quando houver o que sustentar: **A recusa**
(o que o Impetus não é), **A tese**, **A interpretação** (schema estrito,
`temperature 0`, 24/24), **Princípios** e **Confiança** (confirmação por classe de
ação, e o aviso de que o texto da mensagem sai para o Groq). O texto delas está no
histórico do git — nenhuma precisa ser reescrita.

### Por que a seção do produto é o núcleo

Nada convence mais do que o produto respondendo. A conversa usa **strings exatas** de
`format.ts` e `MANUAL.md` — incluindo a desambiguação numerada e o zip que respeita o
`.gitignore`. Zero mockup inventado.

### Por que a arquitetura é o momento de competência

O detalhe que separa quem sabe de quem não sabe: *a conexão é sempre iniciada pelo
agente, nunca pelo cérebro* — porque a maioria das máquinas está atrás de NAT. Mesmo
padrão de Slack, Discord e Tailscale. Explicar isso vale mais que dez adjetivos.

---

## 4. 3D — uma cena, não três

**Um único canvas WebGL** atravessa hero → arquitetura, transformando-se conforme o scroll.
Três cenas decorativas seriam mais caras e diriam menos.

| Scroll | Estado da cena |
|---|---|
| Hero | Constelação: um núcleo vermelho, nós âmbar orbitando, partículas fluindo **dos nós para o núcleo** (direção arquiteturalmente correta). |
| Problema | A constelação se estilhaça: cópias divergentes do mesmo nó afastam-se, conexões arrebentam. |
| (transição) | Os fragmentos convergem de volta a um grafo único e coerente. |
| Arquitetura | Os nós assentam sobre as lâminas da marca — o leque se forma, com a ponta na origem. |

O terceiro estado é o **logo**, não um diagrama: as lâminas usam os mesmos números
que geram o SVG em `LogoImpetus.tsx`, e o ponto de convergência cai na origem — que
é exatamente onde o núcleo vermelho brilha e para onde as linhas e as partículas de
fluxo já apontavam. O desenho da marca e o argumento do produto são a mesma forma.

A cena é monocromática por isso: a marca é monocromática. O verde e o âmbar vivem
nos cartões da seção de arquitetura, não aqui.

O 3D morre depois da arquitetura. O resto da página é tipografia, produto e movimento 2D —
porque é lá que o conteúdo manda.

**Degradação:**
- `prefers-reduced-motion` → canvas não monta; entra um frame estático composto.
- Mobile / `deviceMemory` baixo → contagem de partículas reduzida, sem pós-processamento, `dpr` limitado a 1.5.
- Canvas carrega via `next/dynamic` após a primeira pintura; o hero é legível e completo sem ele.

---

## 5. Arquitetura de código

```
src/
  app/            layout, page, metadata, sitemap, robots, opengraph-image
  components/     ui/ (primitivos)  sections/ (os doze movimentos)
  scene/          canvas R3F, shaders, hooks de scroll da cena
  content/        TODA a copy, em .ts tipado — nenhum texto solto em componente
  hooks/          useScrollProgress, useReducedMotion, useDeviceCapability
  styles/         tokens.css (design system) + globals.css
  lib/            utils mínimos
```

Copy separada de componente (item 14 do briefing) é o que permite revisar texto sem
tocar em layout — e é o que torna uma futura versão em inglês uma troca de arquivo.

**Stack:** Next 15 (App Router) · TypeScript · Tailwind v4 · React Three Fiber + drei ·
motion · Lenis.

**Performance:** um canvas, `dpr` adaptativo, fontes `next/font` com `display: swap`,
code splitting por seção pesada, animações restritas a `transform`/`opacity`.

**Acessibilidade:** navegação por teclado com foco visível de verdade, `prefers-reduced-motion`
respeitado no Lenis e no canvas, headings em ordem, alvos de toque ≥ 44px, a conversa da
seção 6 legível por leitor de tela como texto, não como imagem.

---

## 6. Questão em aberto

**O CTA.** Na Fase 0 não existe download, cadastro nem trial — e inventar um seria a
única desonestidade do site. A proposta é o CTA conduzir ao **manifesto**, que é o
artefato público real, com um caminho secundário para acompanhar o desenvolvimento.

Se a intenção for captar interesse de times externos (Fase 1), isso muda o final da
página — e precisa ser decidido antes, não depois.
