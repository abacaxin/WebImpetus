"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  ShaderMaterial,
} from "three";

import { LAMINAS, NOS, gerarLayouts } from "./layouts";
import {
  fluxoFragment,
  fluxoVertex,
  linhasFragment,
  linhasVertex,
  pontosFragment,
  pontosVertex,
} from "./shaders";

/** smoothstep na CPU — a mesma curva que os shaders usam. */
function suavizar(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const NUCLEO_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NUCLEO_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform float uIntensidade;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    // Dois halos somados: um nucleo denso e um brilho largo. Um so gradiente
    // le como circulo borrado; dois leem como luz.
    float halo = smoothstep(1.0, 0.0, d);
    float brilho = pow(smoothstep(1.0, 0.15, d), 3.0);
    float a = (halo * 0.20 + brilho * 0.85) * uIntensidade;
    if (a < 0.01) discard;
    gl_FragColor = vec4(1.0, 0.231, 0.247, a);
  }
`;

export function NetworkGraph({
  progresso,
  qualidade,
}: {
  progresso: MotionValue<number>;
  qualidade: "full" | "reduced";
}) {
  const { viewport } = useThree();
  const externo = useRef<Group>(null);
  const interno = useRef<Group>(null);
  const suave = useRef(0);
  const tempo = useRef(0);

  const nos = NOS[qualidade];
  const fluxoPorNo = qualidade === "full" ? 2 : 1;
  // `dpr` ja e limitado no Canvas; aqui so evitamos pontos gigantes em telas HiDPI.
  const pixelRatio = Math.min(viewport.dpr ?? 1, 2);

  const { geometrias, materiais } = useMemo(() => {
    const { posA, posB, posC, seeds } = gerarLayouts(nos);

    // --- Pontos: um vertice por no ---
    const gPontos = new BufferGeometry();
    gPontos.setAttribute("position", new BufferAttribute(posA.slice(), 3));
    gPontos.setAttribute("aPosA", new BufferAttribute(posA, 3));
    gPontos.setAttribute("aPosB", new BufferAttribute(posB, 3));
    gPontos.setAttribute("aPosC", new BufferAttribute(posC, 3));
    gPontos.setAttribute("aSeed", new BufferAttribute(seeds, 1));

    // --- Linhas ---
    // Em A e B o segundo vertice e a origem: a conexao aponta para o cerebro
    // central, que e o argumento daqueles estados.
    //
    // Em C isso arruinaria a marca. Centenas de retas de cada no ate um unico
    // ponto preenchem o miolo do leque e o resultado le como um triangulo solido,
    // nao como laminas. Entao aqui a linha segue a PROPRIA lamina, ligando
    // amostras consecutivas (i → i + LAMINAS) — os vaos entre as laminas ficam
    // vazios, que e o que faz o logo ser reconhecivel.
    const lA = new Float32Array(nos * 6);
    const lB = new Float32Array(nos * 6);
    const lC = new Float32Array(nos * 6);
    for (let i = 0; i < nos; i++) {
      const proximo = i + LAMINAS;
      for (let eixo = 0; eixo < 3; eixo++) {
        lA[i * 6 + eixo] = posA[i * 3 + eixo];
        lB[i * 6 + eixo] = posB[i * 3 + eixo];
        lC[i * 6 + eixo] = posC[i * 3 + eixo];
        // A e B: vertices 3..5 ficam em zero — o nucleo.
        // C: a ultima amostra de cada lamina ja esta na ponta, entao ligar na
        // origem gera um segmento de tamanho zero, invisivel.
        lC[i * 6 + 3 + eixo] = proximo < nos ? posC[proximo * 3 + eixo] : 0;
      }
    }
    const gLinhas = new BufferGeometry();
    gLinhas.setAttribute("position", new BufferAttribute(lA.slice(), 3));
    gLinhas.setAttribute("aPosA", new BufferAttribute(lA, 3));
    gLinhas.setAttribute("aPosB", new BufferAttribute(lB, 3));
    gLinhas.setAttribute("aPosC", new BufferAttribute(lC, 3));

    // --- Fluxo: particulas viajando do no para o nucleo ---
    const total = nos * fluxoPorNo;
    const fA = new Float32Array(total * 3);
    const fB = new Float32Array(total * 3);
    const fC = new Float32Array(total * 3);
    const offsets = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      const no = i % nos;
      for (let eixo = 0; eixo < 3; eixo++) {
        fA[i * 3 + eixo] = posA[no * 3 + eixo];
        fB[i * 3 + eixo] = posB[no * 3 + eixo];
        fC[i * 3 + eixo] = posC[no * 3 + eixo];
      }
      offsets[i] = (i / total) * 0.97 + (i % 7) * 0.03;
    }
    const gFluxo = new BufferGeometry();
    gFluxo.setAttribute("position", new BufferAttribute(fA.slice(), 3));
    gFluxo.setAttribute("aPosA", new BufferAttribute(fA, 3));
    gFluxo.setAttribute("aPosB", new BufferAttribute(fB, 3));
    gFluxo.setAttribute("aPosC", new BufferAttribute(fC, 3));
    gFluxo.setAttribute("aOffset", new BufferAttribute(offsets, 1));

    const comuns = { uProgress: { value: 0 }, uTime: { value: 0 } };

    return {
      geometrias: { pontos: gPontos, linhas: gLinhas, fluxo: gFluxo },
      materiais: {
        pontos: new ShaderMaterial({
          vertexShader: pontosVertex,
          fragmentShader: pontosFragment,
          uniforms: {
            ...structuredClone(comuns),
            uSize: { value: 62 },
            uPixelRatio: { value: pixelRatio },
          },
          transparent: true,
          depthWrite: false,
        }),
        linhas: new ShaderMaterial({
          vertexShader: linhasVertex,
          fragmentShader: linhasFragment,
          uniforms: { uProgress: { value: 0 } },
          transparent: true,
          depthWrite: false,
        }),
        fluxo: new ShaderMaterial({
          vertexShader: fluxoVertex,
          fragmentShader: fluxoFragment,
          uniforms: {
            ...structuredClone(comuns),
            uSize: { value: 26 },
            uPixelRatio: { value: pixelRatio },
          },
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
        nucleo: new ShaderMaterial({
          vertexShader: NUCLEO_VERTEX,
          fragmentShader: NUCLEO_FRAGMENT,
          uniforms: { uIntensidade: { value: 1 } },
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      },
    };
  }, [nos, fluxoPorNo, pixelRatio]);

  // WebGL nao libera buffer nem programa sozinho: sem isso, trocar de qualidade
  // (ou remontar em navegacao) vaza memoria de GPU.
  useEffect(() => {
    return () => {
      Object.values(geometrias).forEach((g) => g.dispose());
      Object.values(materiais).forEach((m) => m.dispose());
    };
  }, [geometrias, materiais]);

  useFrame((state, delta) => {
    // `delta` limitado: voltar de uma aba em segundo plano entrega um salto de
    // varios segundos, e a cena daria um pulo em vez de continuar.
    const dt = Math.min(delta, 0.05);
    tempo.current += dt;

    // Amortece o scroll: o valor cru treme em trackpad e o morph fica nervoso.
    suave.current += (progresso.get() - suave.current) * Math.min(1, dt * 5);
    const p = suave.current;

    materiais.pontos.uniforms.uProgress.value = p;
    materiais.pontos.uniforms.uTime.value = tempo.current;
    materiais.linhas.uniforms.uProgress.value = p;
    materiais.fluxo.uniforms.uProgress.value = p;
    materiais.fluxo.uniforms.uTime.value = tempo.current;

    // O nucleo encolhe quando o grafo fragmenta — sem centro, nao ha nucleo.
    const ruptura = Math.exp(-Math.pow((p - 0.34) / 0.17, 2));
    materiais.nucleo.uniforms.uIntensidade.value = 1 - ruptura * 0.88;

    // A marca so e legivel parada e de frente. Conforme ela se forma, o giro
    // proprio desacelera e a rotacao acumulada volta a zero.
    const formando = suavizar(0.66, 1, p);
    if (interno.current) {
      interno.current.rotation.y += dt * 0.045 * (1 - formando);
      interno.current.rotation.y *= 1 - Math.min(1, formando * dt * 6);
    }

    // Formada, ela sai de fundo: o scroll a leva para o canto superior esquerdo
    // e a encolhe, ate assumir posicao e tamanho de logo.
    const saindo = suavizar(0.88, 1, p);
    if (externo.current) {
      // O parallax tambem cede — mouse mexendo na marca atrapalharia a leitura.
      const alvoY = state.pointer.x * 0.22 * (1 - formando);
      const alvoX = -state.pointer.y * 0.14 * (1 - formando);
      externo.current.rotation.y += (alvoY - externo.current.rotation.y) * 0.04;
      externo.current.rotation.x += (alvoX - externo.current.rotation.x) * 0.04;

      externo.current.scale.setScalar(1 - saindo * 0.66);
      externo.current.position.set(
        -viewport.width * 0.3 * saindo,
        viewport.height * 0.3 * saindo,
        0,
      );
    }
  });

  return (
    <group ref={externo}>
      <group ref={interno}>
        <lineSegments geometry={geometrias.linhas} material={materiais.linhas} />
        <points geometry={geometrias.pontos} material={materiais.pontos} />
        <points geometry={geometrias.fluxo} material={materiais.fluxo} />
      </group>
      <mesh material={materiais.nucleo}>
        <planeGeometry args={[4.6, 4.6]} />
      </mesh>
    </group>
  );
}
