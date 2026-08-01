/**
 * O produto, como ele realmente responde.
 *
 * As respostas do Impetus abaixo sao as strings REAIS, copiadas de
 * `apps/brain/src/format.ts` e do `docs/MANUAL.md`. Nenhuma foi reescrita para
 * caber melhor no layout — se uma linha ficar longa, o layout que se ajusta.
 */

export type Turn = {
  from: "user" | "impetus";
  text: string;
  /** Anotacao editorial ao lado da bolha: por que ESTE detalhe importa. */
  note?: string;
  /** Nome do arquivo anexado, quando o turno entrega um documento. */
  attachment?: string;
};

export const conversa = {
  id: "produto",
  eyebrow: "o produto",
  title: "Assim, na prática.",
  lead: "Sem decorar comando, sem informar caminho. Você escreve como escreveria para um colega — com gíria, sem acento, com erro de digitação.",
  turns: [
    {
      from: "user",
      text: "quem tá ligado agora",
    },
    {
      from: "impetus",
      text: "PC-Daniel — online há 12 min\nPC-Guilherme — online há 3h 40min",
      note: "Uma linha por máquina. O tempo é desde que o Impetus subiu naquela máquina — não desde que o computador ligou.",
    },
    {
      from: "user",
      text: "cadê o flora",
      note: "Nome aproximado, minúsculo, sem acento. O índice normaliza espaço, hífen, underscore e ponto como o mesmo separador.",
    },
    {
      from: "impetus",
      text: `Achei mais de um projeto parecido com "flora":\n\n1. FloraBeauty — PC-Daniel (${String.raw`C:\...\FloraBeauty`})\n2. Flora-Docs — PC-Guilherme (${String.raw`C:\...\Flora-Docs`})\n\nResponda com o número ou o nome, pra eu saber qual.`,
      note: "Achou mais de um, então pergunta antes de agir. Você responde 1, 2 ou só “flora-docs” — os três funcionam.",
    },
    {
      from: "user",
      text: "1",
    },
    {
      from: "impetus",
      text: `Achei: FloraBeauty — PC-Daniel\n${String.raw`C:\Users\Daniel\Documents\Codes\DMG\FloraBeauty`}\né um repositório git, última modificação em 21/07/2026.`,
    },
    {
      from: "user",
      text: "zipa e me manda",
    },
    {
      from: "impetus",
      text: "Mandando FloraBeauty.zip...",
      attachment: "FloraBeauty.zip",
      note: "O zip não leva node_modules nem .git — o agente lê o .gitignore da própria pasta, em vez de carregar uma lista fixa que divergiria do que cada projeto ignora.",
    },
  ] satisfies Turn[],
} as const;

export const protocolos = {
  id: "protocolos",
  eyebrow: "os protocolos",
  title: "Quatro que funcionam. Um reservado.",
  lead: "O contrato entre o cérebro e os agentes é um pacote de tipos que nenhum dos dois lados importa do outro. Acrescentar um comando quebra a compilação até que ele seja ensinado ao classificador — em vez de nunca ser reconhecido em silêncio.",
  items: [
    {
      name: "status",
      done: true,
      problem: "Quais máquinas do time estão no ar agora?",
      action: "O cérebro pergunta a todas em paralelo, com 5 segundos de janela cada.",
      result: "PC-Daniel — online há 12 min",
      detail:
        "Máquina que não responde a tempo entra na lista como “sem resposta”, em vez de sumir. A resposta prefere dizer que não sabe a omitir.",
    },
    {
      name: "find",
      done: true,
      problem: "Onde está o projeto — e em qual máquina?",
      action: "Cada agente mantém um índice leve do primeiro nível das pastas configuradas.",
      result: "Achei: FloraBeauty — PC-Daniel",
      detail:
        "Acha pasta de projeto e também arquivo solto ao lado dela. Busca por aproximação: “dmg saas” encontra DMG_SaaS.",
    },
    {
      name: "listFiles",
      done: true,
      problem: "O que tem dentro dessa pasta?",
      action: "Listagem rasa — um nível, pastas primeiro, arquivos com tamanho.",
      result: "src/\nREADME.md (2.1 KB)",
      detail:
        "Pedir a listagem de um arquivo é recusado com clareza, antes de sequer perguntar ao agente: arquivo não tem conteúdo para listar.",
    },
    {
      name: "shareFile",
      done: true,
      problem: "Me manda esse arquivo — ou essa pasta inteira.",
      action: "Arquivo vai direto; pasta é zipada antes, respeitando o .gitignore.",
      result: "Mandando FloraBeauty.zip...",
      detail:
        "O teto de tamanho é checado ANTES de zipar: o agente soma o que entraria e recusa cedo, em vez de abortar um stream no meio.",
    },
    {
      name: "gitStatus",
      done: false,
      problem: "Qual a branch, o que mudou, o que falta commitar?",
      action: "Nome reservado no contrato. Sem payload, sem handler dos dois lados.",
      result: "Isso ainda não está pronto — vem numa próxima etapa.",
      detail:
        "Ele entende o pedido e repete de volta o que entendeu. Isso é diferente de “ainda não sei fazer isso”: a interpretação funcionou, falta a ação existir.",
    },
  ],
} as const;
