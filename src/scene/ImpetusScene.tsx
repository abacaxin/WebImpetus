"use client";

import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "motion/react";

import { NetworkGraph } from "./NetworkGraph";

/**
 * O canvas. Importado dinamicamente (ver `SceneBackdrop`) para que three.js nunca
 * entre no bundle da primeira pintura — o hero precisa estar legivel antes de a
 * GPU ser acionada.
 */
export default function ImpetusScene({
  progresso,
  qualidade,
}: {
  progresso: MotionValue<number>;
  qualidade: "full" | "reduced";
}) {
  return (
    <Canvas
      // Teto de 1.5 em vez do dpr do aparelho: a cena e feita de pontos suaves e
      // linhas finas, que nao ganham nitidez visivel acima disso — so custo.
      dpr={[1, qualidade === "full" ? 1.5 : 1]}
      camera={{ position: [0, 0, 9.2], fov: 45 }}
      gl={{ antialias: qualidade === "full", alpha: true, powerPreference: "high-performance" }}
      // Sem interacao de ponteiro na cena: os eventos custam raycast por quadro e
      // nada aqui e clicavel. O parallax le `state.pointer`, que nao precisa disso.
      events={undefined}
      style={{ pointerEvents: "none" }}
    >
      <NetworkGraph progresso={progresso} qualidade={qualidade} />
    </Canvas>
  );
}
