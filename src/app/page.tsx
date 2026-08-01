import { SceneBackdrop } from "@/components/SceneBackdrop";
import { Arquitetura } from "@/components/sections/Arquitetura";
import { ChamadaFinal } from "@/components/sections/ChamadaFinal";
import { Conversa } from "@/components/sections/Conversa";
import { Fases } from "@/components/sections/Fases";
import { Hero } from "@/components/sections/Hero";
import { Problema } from "@/components/sections/Problema";
import { Protocolos } from "@/components/sections/Protocolos";

/**
 * Primeira versao: site de divulgacao, nao documentacao.
 *
 * O que e (hero) → por que existe (problema) → como funciona (arquitetura) →
 * vendo funcionar (conversa) → o que ja faz (protocolos) → em que fase esta →
 * onde ler mais.
 *
 * `SceneBackdrop` envolve as tres primeiras: e a faixa onde a cena 3D se transforma.
 */
export default function Home() {
  return (
    <>
      <SceneBackdrop>
        <Hero />
        <Problema />
        <Arquitetura />
      </SceneBackdrop>

      <Conversa />
      <Protocolos />
      <Fases />
      <ChamadaFinal />
    </>
  );
}
