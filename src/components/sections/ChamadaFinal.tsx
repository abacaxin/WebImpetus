import { cta } from "@/content/narrative";
import { site } from "@/content/site";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * O fecho.
 *
 * Nao ha download, cadastro nem trial: o produto esta na Fase 0 e inventar um
 * botao seria a unica desonestidade da pagina. O CTA leva ao manifesto — o
 * artefato publico que de fato existe.
 */
export function ChamadaFinal() {
  return (
    <Section width="narrow" className="min-h-[80svh] flex items-center">
      <div>
        <Reveal>
          <Eyebrow>{cta.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-7 text-display font-semibold text-balance">{cta.title}</h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-8 text-lead text-pretty text-text-dim">{cta.body}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12">
            <a
              href={site.manifestoUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-12 items-center gap-3 rounded-chip bg-text px-6 py-3.5 font-medium text-bg transition-colors duration-(--duration-hover) hover:bg-red-bright hover:text-text"
            >
              {cta.action}
              <span
                aria-hidden
                className="transition-transform duration-(--duration-hover) group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <p className="mt-5 font-mono text-[0.7rem] text-text-faint">{cta.footnote}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
