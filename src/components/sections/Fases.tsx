import { fases } from "@/content/narrative";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Fases() {
  return (
    <Section width="default">
      <Reveal>
        <Eyebrow>{fases.eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="mt-7 max-w-[22ch] text-title font-semibold text-balance">
          {fases.title}
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-5 max-w-[46rem] text-lead text-pretty text-text-dim">{fases.lead}</p>
      </Reveal>

      <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {fases.items.map((f, i) => (
          <Reveal as="li" key={f.n} delay={0.05 * i}>
            <div
              className={`h-full border-t-2 pt-6 ${
                f.current ? "border-red-bright" : "border-line"
              }`}
            >
              <p className="flex items-center gap-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]">
                <span className={f.current ? "text-red-bright" : "text-text-faint"}>{f.n}</span>
                {f.current && (
                  <span className="rounded-chip bg-red/15 px-2 py-0.5 text-[0.58rem] text-red-bright">
                    você está aqui
                  </span>
                )}
              </p>
              <h3
                className={`mt-3 text-lg font-semibold tracking-tight ${
                  f.current ? "text-text" : "text-text-dim"
                }`}
              >
                {f.name}
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-pretty text-text-dim">
                {f.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
