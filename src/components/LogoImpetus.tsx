import type { CSSProperties } from "react";

/**
 * A marca: laminas que partem de um arco a esquerda e convergem num unico ponto
 * a direita — o mesmo argumento do produto, varias maquinas e uma entidade so.
 *
 * Geometria calculada, nao desenhada a mao: todas as laminas terminam exatamente
 * em (110, 50), entao o ponto de convergencia e o mesmo para o desenho e para a
 * origem da animacao.
 */
const LAMINAS = [
  "M33.41 10.03 C47.94 44.67 76.63 50 110 50 C76.63 50 54.38 42.19 42 6.74 A4.6 4.6 0 0 1 33.41 10.03 Z",
  "M18.87 20.81 C48.8 50.45 72.57 50 110 50 C72.57 50 53.79 45.68 25.52 14.45 A4.6 4.6 0 0 1 18.87 20.81 Z",
  "M9.89 36.55 C51.65 53.21 70.05 50 110 50 C70.05 50 54.37 46.87 13.52 28.1 A4.6 4.6 0 0 1 9.89 36.55 Z",
  "M8 54.6 C53.9 53.45 69.2 50 110 50 C69.2 50 53.9 46.55 8 45.4 A4.6 4.6 0 0 1 8 54.6 Z",
  "M13.52 71.9 C54.37 53.13 70.05 50 110 50 C70.05 50 51.65 46.79 9.89 63.45 A4.6 4.6 0 0 1 13.52 71.9 Z",
  "M25.52 85.55 C53.79 54.32 72.57 50 110 50 C72.57 50 48.8 49.55 18.87 79.19 A4.6 4.6 0 0 1 25.52 85.55 Z",
  "M42 93.26 C54.38 57.81 76.63 50 110 50 C76.63 50 47.94 55.33 33.41 89.97 A4.6 4.6 0 0 1 42 93.26 Z",
];

/** Indice da lamina central — o atraso da animacao cresce a partir dela. */
const CENTRO = (LAMINAS.length - 1) / 2;

export function LogoImpetus({
  animado = false,
  className,
}: {
  animado?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 100" fill="currentColor" aria-hidden className={className}>
      {LAMINAS.map((d, i) => (
        <path
          key={d}
          d={d}
          className={animado ? "lamina-convergente" : undefined}
          // Do centro para fora: as laminas nascem no ponto e se abrem em leque.
          style={animado ? ({ "--i": Math.abs(i - CENTRO) } as CSSProperties) : undefined}
        />
      ))}
    </svg>
  );
}
