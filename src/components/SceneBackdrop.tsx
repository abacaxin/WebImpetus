"use client";

import { useScroll, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useDeviceCapability } from "@/hooks/useDeviceCapability";

const ImpetusScene = dynamic(() => import("@/scene/ImpetusScene"), { ssr: false });

/**
 * A faixa da pagina onde a cena 3D vive — hero ate arquitetura.
 *
 * O canvas e `sticky`, nao `fixed`: assim ele cobre exatamente estas secoes e para
 * sozinho no fim da faixa, sem nenhum calculo de altura. A margem negativa puxa o
 * conteudo por cima do canvas em vez de empurra-lo para baixo.
 */
export function SceneBackdrop({ children }: { children: ReactNode }) {
  const faixa = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const reduzMovimento = useReducedMotion();
  const capacidade = useDeviceCapability();
  const [podeMontar, setPodeMontar] = useState(false);
  const [temTamanho, setTemTamanho] = useState(false);

  const { scrollYProgress } = useScroll({
    target: faixa,
    offset: ["start start", "end end"],
  });

  // Esperar a ociosidade antes de montar a cena: o hero precisa pintar primeiro.
  // Sem isso, compilar shader e alocar buffers competem com a primeira pintura.
  useEffect(() => {
    const janela = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (janela.requestIdleCallback) {
      janela.requestIdleCallback(() => setPodeMontar(true), { timeout: 1200 });
      return;
    }
    const t = setTimeout(() => setPodeMontar(true), 400);
    return () => clearTimeout(t);
  }, []);

  /**
   * Guarda: so montar o canvas depois que o container tiver tamanho medido.
   *
   * O R3F mede o container ao montar. Se naquele instante ele medir 0, o renderer
   * nasce com o buffer padrao (300x150) e nao se corrige sozinho — uma cena
   * esticada, sem nenhum erro no console para denunciar. Como este componente
   * monta o canvas de forma adiada (requestIdleCallback), vale nao depender de o
   * layout ja ter assentado naquele instante.
   *
   * Defensivo, nao corretivo: essa falha nao foi observada aqui — nao deu para
   * verificar, porque o ambiente de teste nao compoe quadros e o rAF nunca roda.
   * Se nenhuma das duas checagens confirmar tamanho, a cena nao monta e entra o
   * fallback estatico: falhar para o lado seguro.
   */
  useEffect(() => {
    const el = palco.current;
    if (!el) return;

    const conferir = (w: number, h: number) => {
      if (w > 0 && h > 0) setTemTamanho(true);
    };

    const r = el.getBoundingClientRect();
    conferir(r.width, r.height);

    const ro = new ResizeObserver(([entrada]) => {
      conferir(entrada.contentRect.width, entrada.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mostrarCena =
    podeMontar && temTamanho && !reduzMovimento && capacidade !== "none";

  return (
    <div ref={faixa} className="relative">
      <div
        ref={palco}
        aria-hidden
        className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-svh"
      >
        {mostrarCena ? (
          <ImpetusScene
            progresso={scrollYProgress}
            qualidade={capacidade === "full" ? "full" : "reduced"}
          />
        ) : (
          // Fallback estatico: mesma composicao, sem GPU. Quem pediu menos
          // movimento — ou nao tem WebGL — ve uma pagina composta, nao um buraco.
          <div className="size-full bg-[radial-gradient(circle_at_50%_42%,rgba(192,24,26,0.16),transparent_58%)]" />
        )}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
