import { hero } from "@/content/narrative";
import { LogoImpetus } from "@/components/LogoImpetus";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-end px-(--spacing-gutter) pb-16 pt-32">
      <div className="mx-auto w-full max-w-[86rem]">
        {/* A marca abre a pagina se montando a partir do ponto de convergencia —
            o mesmo movimento que o resto do site argumenta. */}
        <LogoImpetus animado className="mb-10 h-14 w-auto sm:h-[4.5rem]" />

        <Reveal>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </Reveal>

        <h1 className="mt-7 text-display font-semibold">
          {hero.titleLines.map((linha, i) => (
            <Reveal key={linha} delay={0.08 + i * 0.09} className="block">
              {/* A segunda linha em vermelho: a marca inteira e "uma entidade"
                  em branco e "varias maquinas" no vermelho do cerebro central. */}
              <span className={i === 1 ? "text-red-bright" : undefined}>{linha}</span>
            </Reveal>
          ))}
        </h1>

        <Reveal delay={0.28}>
          <p className="mt-8 max-w-[34rem] text-lead text-pretty text-text-dim">
            {hero.lead}
          </p>
        </Reveal>

        <Reveal delay={0.38}>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs">
            {hero.machines.map((m) => (
              <li key={m.nick} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={
                    m.online
                      ? "size-1.5 rounded-full bg-green-deep shadow-[0_0_8px_var(--color-green-deep)]"
                      : "size-1.5 rounded-full bg-text-faint"
                  }
                />
                <span className={m.online ? "text-text-dim" : "text-text-faint"}>
                  {m.nick}
                </span>
                <span className="text-text-faint">— {m.status}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
