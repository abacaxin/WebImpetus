"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll suave — desligado por completo sob `prefers-reduced-motion`.
 *
 * Interpolar o scroll e exatamente o tipo de movimento que dispara enjoo em quem
 * liga essa preferencia, e "suavizar menos" nao resolve: o certo e devolver o
 * scroll nativo do navegador, que a pessoa ja calibrou no sistema dela.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduzMovimento = useReducedMotion();

  if (reduzMovimento) return <>{children}</>;

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
