import { arquitetura } from "@/content/narrative";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/** As cores CODIFICAM o papel arquitetural — ver `tokens.css`. Nao trocar por estetica. */
const TOM = {
  green: { borda: "border-green/25", tag: "text-green", ponto: "bg-green" },
  red: { borda: "border-red/60", tag: "text-red-bright", ponto: "bg-red-bright" },
  amber: { borda: "border-amber/25", tag: "text-amber", ponto: "bg-amber" },
} as const;

export function Arquitetura() {
  return (
    <Section id={arquitetura.id} width="default" className="py-(--spacing-section)">
      <Reveal>
        <Eyebrow>{arquitetura.eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="mt-7 text-title font-semibold text-balance">{arquitetura.title}</h2>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-5 max-w-[44rem] text-lead text-pretty text-text-dim">
          {arquitetura.lead}
        </p>
      </Reveal>

      <ol className="mt-16">
        {arquitetura.pieces.map((peca, i) => {
          const tom = TOM[peca.tone];
          return (
            <li key={peca.name}>
              <Reveal delay={0.06 * i}>
                <div
                  className={`rounded-panel border bg-panel/70 p-6 backdrop-blur-sm sm:p-8 ${tom.borda}`}
                >
                  <p
                    className={`flex items-center gap-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] ${tom.tag}`}
                  >
                    <span aria-hidden className={`size-1.5 rounded-full ${tom.ponto}`} />
                    {peca.tag}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{peca.name}</h3>
                  <p className="mt-3 max-w-[52ch] leading-relaxed text-text-dim">{peca.desc}</p>
                </div>
              </Reveal>

              {/* Conector tracejado entre as pecas — a mesma textura do diagrama
                  de arquitetura do produto. */}
              {i < arquitetura.pieces.length - 1 && (
                <div aria-hidden className="flex justify-center py-4">
                  <span className="block h-10 w-px border-l border-dashed border-line" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-20 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-panel border border-line bg-panel-2/60 p-7 backdrop-blur-sm sm:p-9">
            <h3 className="text-lg font-semibold tracking-tight text-balance">
              {arquitetura.detail.title}
            </h3>
            {arquitetura.detail.body.map((p, i) => (
              <p key={i} className="mt-4 text-pretty leading-relaxed text-text-dim">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="h-full rounded-panel border border-line bg-panel-2/60 p-7 backdrop-blur-sm sm:p-9">
            <h3 className="text-lg font-semibold tracking-tight text-balance">
              {arquitetura.honesty.title}
            </h3>
            <p className="mt-4 text-pretty leading-relaxed text-text-dim">
              {arquitetura.honesty.body}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
