import { problema } from "@/content/narrative";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Problema() {
  return (
    <Section id={problema.id} width="narrow" className="min-h-svh flex items-center">
      <div>
        <Reveal>
          <Eyebrow>{problema.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-7 text-title font-semibold text-balance">{problema.title}</h2>
        </Reveal>

        {problema.body.map((paragrafo, i) => (
          <Reveal key={i} delay={0.12 + i * 0.06} as="p">
            <span className="mt-7 block text-lead text-pretty text-text-dim">
              {paragrafo}
            </span>
          </Reveal>
        ))}

        <Reveal delay={0.26}>
          {/* A frase que fecha a secao ganha regua vermelha — e a tese do bloco,
              nao mais um paragrafo. */}
          <p className="mt-12 border-l-2 border-red pl-6 text-lead font-medium text-text">
            {problema.punch}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
