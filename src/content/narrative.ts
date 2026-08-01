/**
 * A narrativa do site, na ordem em que o scroll a revela.
 *
 * Todo texto aqui deriva do `manifesto-impetus.md`, do `01_VISAO.md` ou dos docs
 * do MVP. Nada foi inventado para soar bem: o produto esta na Fase 0, e o site
 * nao pode prometer alem do que `packages/protocol/src/index.ts` entrega.
 */

export const hero = {
  eyebrow: "fase 0 · mvp interno",
  titleLines: ["Uma entidade.", "Várias máquinas."],
  lead: "O Impetus não é um programa por computador. É uma identidade única, presente em cada máquina do time — e, do seu lado, uma conversa só.",
  /** Estados reais possiveis; o terceiro existe porque maquina suspensa e normal. */
  machines: [
    { nick: "PC-Daniel", status: "online há 12 min", online: true },
    { nick: "PC-Guilherme", status: "online há 3h 40min", online: true },
    { nick: "PC-Migo", status: "suspenso", online: false },
  ],
} as const;

export const problema = {
  id: "problema",
  eyebrow: "o problema",
  title: "A mesma coisa, em versões diferentes.",
  body: [
    "Um sistema para comunicação. Outro para arquivos. Outro para tarefas. Cada um desenhado como uma ilha, com modelo de dados próprio e vocabulário próprio.",
    "A mesma entidade — um cliente, um projeto, uma decisão — passa a existir em versões ligeiramente diferentes em cada um deles. E ninguém, nem humano nem IA, tem a visão completa dela.",
  ],
  punch:
    "O Impetus não promete resolver isso com mais integrações. Promete tornar o problema estruturalmente impossível.",
} as const;

export const arquitetura = {
  id: "arquitetura",
  eyebrow: "arquitetura",
  title: "Um cérebro. Muitos agentes.",
  lead: "Duas peças com responsabilidades diferentes — e uma regra de rede que resolve o problema difícil.",
  pieces: [
    {
      tone: "green",
      tag: "gateway · v1",
      name: "WhatsApp",
      desc: "Onde você fala. É só um meio de acessar o Impetus — não é o Impetus. O dashboard entra como segundo gateway sem mudar nada no meio.",
    },
    {
      tone: "red",
      tag: "cérebro central · 1 instância, 24/7",
      name: "O Impetus",
      desc: "Recebe a mensagem, entende a intenção, decide a qual máquina aquilo se refere e coordena a resposta. Hospedado à parte — nunca no PC de alguém do time.",
    },
    {
      tone: "amber",
      tag: "agente local · 1 por máquina",
      name: "PC-Daniel, PC-Guilherme…",
      desc: "Faz o que exige estar fisicamente naquela máquina: ler arquivo, rodar git, zipar pasta. Serviço em segundo plano, sem janela aberta.",
    },
  ],
  detail: {
    title: "A conexão é sempre iniciada pelo agente.",
    body: [
      "O cérebro nunca liga para o agente. A maioria das máquinas de casa e escritório está atrás de NAT ou firewall, sem IP público — se o cérebro tivesse que ligar para dentro, cada pessoa precisaria configurar redirecionamento de porta no roteador.",
      "Fazendo o agente ligar para fora e manter a conexão aberta, o problema desaparece sem configuração nenhuma. É o mesmo padrão de Slack, Discord e Tailscale.",
    ],
  },
  honesty: {
    title: "Agentes locais não ficam online o tempo todo.",
    body: "Eles dependem da máquina de cada pessoa estar ligada. Isso não é um bug a esconder — é física. O sistema diz “máquina offline” em vez de travar esperando uma resposta que não vem, e reconecta sozinho quando a máquina acorda.",
  },
} as const;

export const fases = {
  eyebrow: "para onde vai",
  title: "Quatro fases. Nenhuma avança por calendário.",
  lead: "Cada fase parte de um uso real e comprovado antes de generalizar. Se o critério não for atingido, a resposta certa é permanecer nela e revisar a hipótese.",
  items: [
    {
      n: "Fase 0",
      name: "MVP interno",
      current: true,
      body: "A própria equipe DMG, sem cliente externo. Critério: a equipe notaria a ausência do Impetus se ele saísse do ar por um dia.",
    },
    {
      n: "Fase 1",
      name: "Ponte validada",
      current: false,
      body: "Um time técnico externo, em regime acompanhado. Critério: ele opta por continuar depois do teste, sem ser convencido a permanecer.",
    },
    {
      n: "Fase 2",
      name: "Produto",
      current: false,
      body: "Clientes pagantes fora do círculo de validação. Permissões, segurança e billing maduros antes — não depois.",
    },
    {
      n: "Fase 3",
      name: "Além do técnico",
      current: false,
      body: "Extensão para áreas não-técnicas. Sem cronograma: é direção, não prazo.",
    },
  ],
} as const;

export const cta = {
  eyebrow: "onde começar",
  title: "Antes do produto, o documento.",
  body: "O Impetus está na Fase 0: uso interno, quatro protocolos funcionando, nenhum cliente externo. Não há o que baixar ainda — e inventar um botão de cadastro seria a única desonestidade desta página. O que existe, e é público, é a tese que sustenta a arquitetura.",
  action: "Ler o manifesto",
  footnote: "Documento fundador · toda decisão técnica precisa poder ser justificada nele",
} as const;
