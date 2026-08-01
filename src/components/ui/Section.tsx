import type { ReactNode } from "react";

/**
 * Envelope de secao: ritmo vertical e largura de leitura, num lugar so.
 *
 * Existe porque doze secoes repetindo o mesmo par padding/max-width divergem na
 * terceira vez que alguem mexe numa delas — e ritmo inconsistente e a coisa que
 * mais rapido faz uma pagina parecer montada por acaso.
 */
export function Section({
  id,
  children,
  className = "",
  width = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** `wide` para grades e diagramas; `narrow` para blocos de leitura corrida. */
  width?: "default" | "wide" | "narrow";
}) {
  const max = {
    narrow: "max-w-[46rem]",
    default: "max-w-[72rem]",
    wide: "max-w-[86rem]",
  }[width];

  return (
    <section
      id={id}
      className={`relative px-(--spacing-gutter) py-(--spacing-section) ${className}`}
    >
      <div className={`mx-auto w-full ${max}`}>{children}</div>
    </section>
  );
}

/**
 * Rotulo tipografico da secao. Sempre mono, sempre com o ponto luminoso —
 * e a marca de "voce esta num movimento novo da narrativa".
 */
export function Eyebrow({
  children,
  tone = "red",
}: {
  children: ReactNode;
  tone?: "red" | "green" | "amber";
}) {
  const cor = {
    red: "text-red-bright",
    green: "text-green",
    amber: "text-amber",
  }[tone];

  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-label uppercase tracking-[0.14em] ${cor}`}
    >
      <span
        aria-hidden
        className="size-[7px] rounded-full bg-current shadow-[0_0_10px_currentColor]"
      />
      {children}
    </p>
  );
}
