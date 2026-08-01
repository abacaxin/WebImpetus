import { protocolos } from "@/content/product";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Problema → acao → resultado, por protocolo. Nao e grade de cards: cada item
 * carrega o contexto de por que existe.
 *
 * `gitStatus` aparece marcado como reservado, com tratamento visual proprio. Essa
 * honestidade e o argumento — um site que o listasse como feature contradiria o
 * proprio contrato do produto.
 */
export function Protocolos() {
  return (
    <Section id={protocolos.id} width="default">
      <Reveal>
        <Eyebrow>{protocolos.eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="mt-7 text-title font-semibold text-balance">{protocolos.title}</h2>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-5 max-w-[48rem] text-lead text-pretty text-text-dim">
          {protocolos.lead}
        </p>
      </Reveal>

      <ul className="mt-16 space-y-4">
        {protocolos.items.map((item, i) => (
          <Reveal as="li" key={item.name} delay={0.04 * i}>
            <article
              className={`rounded-panel border p-6 sm:p-8 ${
                item.done
                  ? "border-line bg-panel/70"
                  : "border-dashed border-line bg-transparent"
              }`}
            >
              <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h3 className="font-mono text-lg font-bold tracking-tight">{item.name}</h3>
                <span
                  className={`rounded-chip px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${
                    item.done
                      ? "bg-green/12 text-green"
                      : "border border-line text-text-faint"
                  }`}
                >
                  {item.done ? "funciona" : "reservado"}
                </span>
              </header>

              <dl className="mt-6 grid gap-6 md:grid-cols-3">
                <Passo rotulo="problema" valor={item.problem} atenuado={!item.done} />
                <Passo rotulo="ação" valor={item.action} atenuado={!item.done} />
                <div>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-text-faint">
                    resultado
                  </dt>
                  <dd
                    className={`saida-sistema mt-2.5 rounded-chip border px-3 py-2.5 font-mono text-[0.76rem] leading-relaxed ${
                      item.done
                        ? "border-line bg-panel-2 text-text"
                        : "border-line border-dashed text-text-faint"
                    }`}
                  >
                    {item.result}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 border-t border-line-soft pt-5 text-[0.85rem] leading-relaxed text-text-dim">
                {item.detail}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function Passo({
  rotulo,
  valor,
  atenuado,
}: {
  rotulo: string;
  valor: string;
  atenuado: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-text-faint">
        {rotulo}
      </dt>
      <dd
        className={`mt-2.5 text-[0.9rem] leading-relaxed ${
          atenuado ? "text-text-faint" : "text-text-dim"
        }`}
      >
        {valor}
      </dd>
    </div>
  );
}
