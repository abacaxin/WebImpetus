"use client";

import { useEffect, useState } from "react";

export type Capability = "full" | "reduced" | "none";

/**
 * Quanto a cena 3D pode custar nesta maquina.
 *
 * Nao usa user-agent: telefone potente e notebook fraco existem, e sniffing de UA
 * erra nos dois sentidos. Os sinais aqui sao sobre o APARELHO — memoria, nucleos e
 * area de tela —, nao sobre a marca dele.
 *
 * `none` significa que o canvas nem monta: sem WebGL, nao ha o que degradar.
 */
export function useDeviceCapability(): Capability {
  // Comeca em "none" e sobe depois da montagem: no servidor nao ha como medir, e
  // assumir "full" faria o cliente montar uma cena cara antes de saber se cabe.
  const [capability, setCapability] = useState<Capability>("none");

  useEffect(() => {
    if (!supportsWebGL()) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 8; // ausente no Safari/Firefox — nao penalizar
    const cores = nav.hardwareConcurrency ?? 8;
    const narrow = window.matchMedia("(max-width: 900px)").matches;

    const modesto = memory <= 4 || cores <= 4 || narrow;
    setCapability(modesto ? "reduced" : "full");
  }, []);

  return capability;
}

/**
 * Um contexto WebGL de teste, criado e descartado na hora.
 *
 * Vale o custo: sem isso, um navegador com WebGL desabilitado (ou sem GPU
 * disponivel) renderizaria um canvas preto no lugar do hero, sem cair no fallback.
 */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}
