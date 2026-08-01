import { conversa } from "@/content/product";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A conversa real.
 *
 * Regra tipografica que sustenta a secao: o que a PESSOA escreve vem em sans; o
 * que o SISTEMA responde vem em mono. Isso e o mesmo contrato usado no resto do
 * site — mono marca saida real de maquina, nunca decoracao.
 *
 * As strings sao as de `apps/brain/src/format.ts`, sem reescrita.
 */
export function Conversa() {
  return (
    <Section id={conversa.id} width="wide">
      <Reveal>
        <Eyebrow>{conversa.eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="mt-7 text-title font-semibold text-balance">{conversa.title}</h2>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-5 max-w-[46rem] text-lead text-pretty text-text-dim">
          {conversa.lead}
        </p>
      </Reveal>

      <ol className="mt-16 space-y-6">
        {conversa.turns.map((turno, i) => (
          <li
            key={i}
            className="grid items-center gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,38rem)_minmax(0,20rem)]"
          >
            <Reveal delay={0.04}>
              <div className={turno.from === "user" ? "flex justify-end lg:justify-start" : ""}>
                {turno.from === "user" ? (
                  <p className="max-w-[28rem] rounded-panel rounded-br-sm bg-panel-2 px-5 py-3.5 leading-relaxed text-text">
                    {turno.text}
                  </p>
                ) : (
                  <div className="max-w-[36rem] rounded-panel rounded-bl-sm border border-line bg-panel px-5 py-4">
                    <p className="saida-sistema font-mono text-[0.82rem] leading-relaxed text-text">
                      {turno.text}
                    </p>

                    {turno.attachment && (
                      <p className="mt-4 inline-flex items-center gap-2.5 rounded-chip border border-line bg-panel-2 px-3 py-2 font-mono text-[0.72rem] text-text-dim">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-green-deep shadow-[0_0_8px_var(--color-green-deep)]"
                        />
                        {turno.attachment}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            {turno.note ? (
              <Reveal delay={0.12}>
                <p className="border-l border-line pl-4 text-[0.82rem] leading-relaxed text-text-dim lg:border-l-0 lg:border-none lg:pl-0">
                  {turno.note}
                </p>
              </Reveal>
            ) : (
              <span aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
