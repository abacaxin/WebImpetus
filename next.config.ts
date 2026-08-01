import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `three` e o ecossistema R3F sao ESM e pesados; transpilar deixa o tree-shaking
  // do bundler alcancar o que a cena realmente importa.
  transpilePackages: ["three"],
  turbopack: {
    // Fixa a raiz neste projeto. Sem isso o Turbopack sobe a arvore, encontra
    // lockfiles de pastas ancestrais e infere a raiz errada.
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
