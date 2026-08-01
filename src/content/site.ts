/**
 * Identidade do site e navegacao.
 *
 * Toda copy do site vive em `src/content/` — nunca solta dentro de componente.
 * Isso permite revisar texto sem tocar em layout, e torna uma versao futura em
 * ingles uma troca de arquivo em vez de uma varredura por JSX.
 */

export const site = {
  name: "Impetus",
  /** Titulo curto o bastante para nao truncar em aba nem em card de compartilhamento. */
  title: "Impetus — Uma entidade, várias máquinas",
  description:
    "Um cérebro central e um agente em cada máquina do time, conversando por linguagem natural. Sem decorar comando, sem informar caminho. Em Fase 0: uso interno, quatro protocolos funcionando.",
  locale: "pt-BR",
  /** Trocar quando o dominio definitivo existir; usado em canonical, OG e sitemap. */
  url: "https://impetus.dmg.dev",
  manifestoUrl:
    "https://github.com/dmggroup/Impetus/blob/main/manifesto-impetus.md",
} as const;

export const nav = [
  { label: "Problema", href: "#problema" },
  { label: "Arquitetura", href: "#arquitetura" },
  { label: "Produto", href: "#produto" },
  { label: "Protocolos", href: "#protocolos" },
] as const;
