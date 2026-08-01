/**
 * Os tres layouts que a cena interpola.
 *
 * Calculados uma vez e enviados a GPU como atributos. O shader mistura entre eles
 * conforme o scroll — a CPU nunca reposiciona um vertice depois disso.
 */

/** Pseudo-aleatorio deterministico por indice: mesma cena em todo carregamento. */
function ruido(i: number): number {
  const s = Math.sin(i * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export type Layouts = {
  posA: Float32Array;
  posB: Float32Array;
  posC: Float32Array;
  seeds: Float32Array;
};

// --- Geometria da marca -----------------------------------------------------
// Os mesmos numeros que geram o SVG em `LogoImpetus.tsx`, para o leque da cena e
// o do logo serem literalmente a mesma curva.
export const LAMINAS = 7;

/**
 * Nos por qualidade. Multiplos de LAMINAS de proposito: assim toda lamina recebe
 * o mesmo numero de amostras e nenhuma fileira sai parcial.
 *
 * O piso do `reduced` nao e estetico — abaixo disso o passo entre amostras cresce
 * e a lamina, que e desenhada ligando amostras consecutivas, degenera numa
 * sequencia de retas visiveis em vez de uma curva. `layouts.check.mts` trava isso.
 */
export const NOS = { full: 147, reduced: 91 } as const;
const ABERTURA = 1.24; // rad
const ARCO_R = 44;
const ARCO_C: Vec2 = [52, 50];
const PONTA: Vec2 = [110, 50]; // convergencia, vai para a origem da cena
/** Unidades SVG → unidades da cena. A marca fica com ~9 de largura. */
const ESCALA = 0.09;

type Vec2 = [number, number];

/** Ponto de uma cubica de Bezier em t. */
function bezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const s = 1 - t;
  return [
    s * s * s * p0[0] + 3 * s * s * t * p1[0] + 3 * s * t * t * p2[0] + t * t * t * p3[0],
    s * s * s * p0[1] + 3 * s * s * t * p1[1] + 3 * s * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/** Pontos de controle de uma lamina, em coordenadas do SVG. */
function lamina(indice: number) {
  const u = (indice / (LAMINAS - 1)) * 2 - 1; // -1 .. 1
  const a = u * ABERTURA;

  const S: Vec2 = [ARCO_C[0] - ARCO_R * Math.cos(a), ARCO_C[1] + ARCO_R * Math.sin(a)];
  const dx = PONTA[0] - S[0];
  const dy = PONTA[1] - S[1];
  const dist = Math.hypot(dx, dy);

  // Sai da origem inclinada pelo angulo do leque e chega na ponta na horizontal:
  // e dai que vem a curvatura crescente das laminas externas.
  const cos = Math.cos(-a * 0.55);
  const sin = Math.sin(-a * 0.55);
  const dir: Vec2 = [(dx * cos - dy * sin) / dist, (dx * sin + dy * cos) / dist];

  const P1: Vec2 = [S[0] + dir[0] * dist * 0.45, S[1] + dir[1] * dist * 0.45];
  const P2: Vec2 = [PONTA[0] - dist * 0.4, PONTA[1]];

  return { S, P1, P2 };
}

export function gerarLayouts(n: number): Layouts {
  const posA = new Float32Array(n * 3);
  const posB = new Float32Array(n * 3);
  const posC = new Float32Array(n * 3);
  const seeds = new Float32Array(n);

  // Angulo aureo — distribuicao esferica sem os polos aglomerados que uma grade
  // lat/long produz.
  const aureo = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const j = i * 3;
    seeds[i] = ruido(i);

    // ---- A: constelacao (hero) ----
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const anel = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * aureo;
    const raio = 3.05 + ruido(i + 3) * 0.55;
    posA[j] = Math.cos(phi) * anel * raio;
    posA[j + 1] = y * raio * 0.74;
    posA[j + 2] = Math.sin(phi) * anel * raio;

    // ---- B: fragmentado (problema) ----
    // Cinco ilhas que se afastam: a mesma entidade em versoes divergentes,
    // cada uma no seu sistema.
    const ilha = i % 5;
    const angulo = (ilha / 5) * Math.PI * 2 + ruido(i + 99) * 0.55;
    const dist = 6.4 + ruido(i + 7) * 3.1;
    posB[j] = Math.cos(angulo) * dist + (ruido(i + 11) - 0.5) * 1.7;
    posB[j + 1] = (ruido(i + 13) - 0.5) * 5.6;
    posB[j + 2] = Math.sin(angulo) * dist + (ruido(i + 17) - 0.5) * 1.7;

    // ---- C: a marca ----
    // Os nos assentam sobre as laminas do logo. A ponta do leque cai na origem,
    // que e exatamente onde o nucleo vermelho brilha e para onde as linhas e as
    // particulas de fluxo ja apontam — o desenho e o argumento coincidem.
    const qual = i % LAMINAS;
    const passo = Math.floor(i / LAMINAS);
    // Cada lamina precisa do seu proprio total: quando `n` nao divide por
    // LAMINAS, a ultima fileira e parcial e um divisor unico deixaria as laminas
    // do fim uma amostra curtas — elas parariam antes da ponta e o leque sairia
    // rasgado, com so algumas pontas tocando a origem.
    const passosDesta = Math.floor(n / LAMINAS) + (qual < n % LAMINAS ? 1 : 0);
    const t = passosDesta > 1 ? passo / (passosDesta - 1) : 1;

    const { S, P1, P2 } = lamina(qual);
    const ponto = bezier(S, P1, P2, PONTA, t);

    // Sem desvio perpendicular: os nos ficam exatamente sobre a curva. As linhas
    // ligam amostras consecutivas da mesma lamina (ver NetworkGraph), entao
    // qualquer dispersao viraria zigue-zague em vez de uma lamina limpa.
    posC[j] = (ponto[0] - PONTA[0]) * ESCALA;
    // SVG cresce para baixo, a cena para cima.
    posC[j + 1] = -(ponto[1] - PONTA[1]) * ESCALA;
    // Profundidade minima so para a marca nao ficar perfeitamente chapada.
    posC[j + 2] = (ruido(i + 53) - 0.5) * 0.22;
  }

  return { posA, posB, posC, seeds };
}
