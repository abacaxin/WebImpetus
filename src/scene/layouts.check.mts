/**
 * Check da geometria da marca na cena.
 *
 *   node --experimental-strip-types src/scene/layouts.check.mts
 *
 * A amostragem de bezier das laminas e a unica logica nao-trivial da cena e nao
 * da para conferir no olho: o ambiente de preview nao compoe quadros. Roda nas
 * DUAS qualidades — 150 no desktop, 64 no mobile — porque menos amostras por
 * lamina aumentam o passo, e e ai que a curva degeneraria em retas visiveis.
 *
 * `.mts` para o Node tratar como ESM sem mexer no package.json, e fora do
 * `**\/*.ts` do tsconfig para nao entrar no build.
 */
import assert from "node:assert";

import { LAMINAS, NOS, gerarLayouts } from "./layouts.ts";

const r2 = (v: number) => Math.round(v * 100) / 100;

function conferir(N: number) {
  const { posA, posB, posC, seeds } = gerarLayouts(N);

  for (const [nome, buf] of Object.entries({ posA, posB, posC, seeds })) {
    assert(buf.every(Number.isFinite), `[${N}] ${nome} tem NaN/Infinity`);
  }

  const em = (i: number) => [posC[i * 3], posC[i * 3 + 1], posC[i * 3 + 2]];
  const dist = (a: number[], b: number[]) =>
    Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  const xs: number[] = [];
  const ys: number[] = [];
  let naPonta = 0;
  for (let i = 0; i < N; i++) {
    const [x, y] = em(i);
    xs.push(x);
    ys.push(y);
    if (Math.hypot(x, y) < 0.35) naPonta++;
  }
  const min = (a: number[]) => Math.min(...a);
  const max = (a: number[]) => Math.max(...a);

  // A ponta do leque cai na origem — e la que o nucleo vermelho brilha e para
  // onde as linhas e as particulas de fluxo ja apontavam.
  assert(max(xs) <= 0.02, `[${N}] a marca deve ficar toda a esquerda da origem`);
  assert(naPonta >= 5, `[${N}] nenhum no convergiu na ponta`);
  assert(min(xs) < -7, `[${N}] marca estreita demais`);
  assert(max(ys) > 3 && min(ys) < -3, `[${N}] leque nao abriu na vertical`);
  // As laminas sao espelhadas, entao o leque tem que fechar simetrico.
  assert(Math.abs(max(ys) + min(ys)) < 0.6, `[${N}] leque assimetrico`);

  // As linhas ligam amostras consecutivas da mesma lamina. Passo grande faz a
  // lamina virar uma sequencia de retas visiveis em vez de uma curva.
  let maiorPasso = 0;
  for (let i = 0; i + LAMINAS < N; i++) {
    maiorPasso = Math.max(maiorPasso, dist(em(i), em(i + LAMINAS)));
  }
  assert(maiorPasso < 1.2, `[${N}] passo entre amostras grande demais: ${maiorPasso}`);

  // O que separa a marca de um triangulo solido sao os VAOS entre as laminas.
  // Na base do leque elas tem que estar bem afastadas.
  let menorVao = Infinity;
  for (let q = 0; q + 1 < LAMINAS; q++) {
    menorVao = Math.min(menorVao, dist(em(q), em(q + 1)));
  }
  assert(menorVao > 1, `[${N}] laminas coladas na base: ${menorVao}`);

  console.log(
    `${N} nós · x ${r2(min(xs))}→${r2(max(xs))} · y ${r2(min(ys))}→${r2(max(ys))} · ` +
      `ponta ${naPonta} · passo ${r2(maiorPasso)} · vão ${r2(menorVao)}`,
  );
}

// As contagens reais que a cena usa — nao copias que podem divergir delas.
for (const n of Object.values(NOS)) conferir(n);
console.log("OK");
