"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Entrada de elemento ao alcancar a viewport.
 *
 * Deslocamento pequeno (14px) e de proposito: o olho le como "o conteudo assentou",
 * nao como "algo voou pela tela". Reveal grande e a diferenca entre uma pagina que
 * parece cara e uma que parece um carrossel de template.
 *
 * `once` porque re-animar no scroll de volta e ruido — a pessoa ja viu.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p";
}) {
  const reduzMovimento = useReducedMotion();
  const Componente = motion[as];

  if (reduzMovimento) {
    const Estatico = as;
    return <Estatico className={className}>{children}</Estatico>;
  }

  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.44, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Componente>
  );
}
