/**
 * Shaders da cena.
 *
 * A cena tem TRES layouts pre-calculados por no — constelacao (A), fragmentado (B)
 * e topologia (C) — e o scroll interpola entre eles com um unico uniform.
 * Interpolar no vertex shader, em vez de reescrever posicoes na CPU a cada quadro,
 * e o que mantem o morph a 60fps com milhares de vertices.
 *
 * Arco narrativo do `uProgress`:
 *   0.00 → 0.34   constelacao se estilhaca      (hero → problema)
 *   0.34 → 0.66   fragmentos voltam a convergir (problema → tese)
 *   0.66 → 1.00   grafo assume a topologia real (tese → arquitetura)
 */

/** Mistura de layout, compartilhada pelos tres materiais — precisa ser identica nos tres. */
const MIX_LAYOUT = /* glsl */ `
  vec3 misturarLayout(vec3 a, vec3 b, vec3 c, float p) {
    if (p < 0.34) return mix(a, b, smoothstep(0.0, 0.34, p));
    if (p < 0.66) return mix(b, a, smoothstep(0.34, 0.66, p));
    return mix(a, c, smoothstep(0.66, 1.0, p));
  }

  // Quanto a cena esta "quebrada" agora — pico no meio da fragmentacao.
  // As conexoes e o fluxo de particulas somem por aqui: quando o contexto
  // fragmenta, nada mais atravessa. A gaussiana e o que faz isso respirar
  // em vez de piscar.
  float rupturaEm(float p) {
    return exp(-pow((p - 0.34) / 0.17, 2.0));
  }
`;

export const pontosVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aPosC;
  attribute float aSeed;

  varying float vAlpha;

  ${MIX_LAYOUT}

  void main() {
    vec3 p = misturarLayout(aPosA, aPosB, aPosC, uProgress);

    // Deriva lenta: sem ela a constelacao parece um render parado, nao um sistema vivo.
    p.x += sin(uTime * 0.35 + aSeed * 6.283) * 0.055;
    p.y += cos(uTime * 0.29 + aSeed * 4.712) * 0.055;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 / max(-mv.z, 0.001));

    vAlpha = 0.42 + 0.34 * fract(aSeed * 7.0);
  }
`;

export const pontosFragment = /* glsl */ `
  precision mediump float;

  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(0.949, 0.941, 0.933, a);
  }
`;

export const linhasVertex = /* glsl */ `
  uniform float uProgress;

  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aPosC;

  varying float vAlpha;

  ${MIX_LAYOUT}

  void main() {
    vec3 p = misturarLayout(aPosA, aPosB, aPosC, uProgress);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    // Nos dois primeiros estados a linha e so tecido de fundo. No terceiro ela
    // VIRA a marca — sao as laminas — entao ganha peso para o logo ser legivel.
    float base = mix(0.17, 0.52, smoothstep(0.66, 1.0, uProgress));
    vAlpha = base * (1.0 - rupturaEm(uProgress));
  }
`;

export const linhasFragment = /* glsl */ `
  precision mediump float;

  varying float vAlpha;

  void main() {
    if (vAlpha < 0.005) discard;
    gl_FragColor = vec4(0.949, 0.941, 0.933, vAlpha);
  }
`;

/**
 * Particulas de fluxo.
 *
 * Viajam do NO para o NUCLEO — nunca o contrario. Isso nao e escolha estetica:
 * no Impetus a conexao e sempre iniciada pelo agente local, porque o cerebro nao
 * tem como alcancar uma maquina atras de NAT. A direcao aqui conta essa verdade.
 */
export const fluxoVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aPosC;
  attribute float aOffset;

  varying float vAlpha;

  ${MIX_LAYOUT}

  void main() {
    vec3 origem = misturarLayout(aPosA, aPosB, aPosC, uProgress);

    float t = fract(aOffset + uTime * 0.13);
    vec3 p = mix(origem, vec3(0.0), t);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 / max(-mv.z, 0.001));

    // Nasce e morre no caminho, em vez de aparecer e sumir de estalo.
    //
    // Some quando a marca se forma: a particula viaja em reta ate a origem, e no
    // estado do logo isso cruzaria o miolo do leque, empastando justamente os
    // vaos que tornam a marca reconhecivel.
    float marca = smoothstep(0.66, 0.92, uProgress);
    vAlpha = sin(t * 3.14159) * 0.85 * (1.0 - rupturaEm(uProgress)) * (1.0 - marca);
  }
`;

export const fluxoFragment = /* glsl */ `
  precision mediump float;

  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(1.0, 0.231, 0.247, a);
  }
`;
