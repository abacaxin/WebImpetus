"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { LogoImpetus } from "@/components/LogoImpetus";
import { nav, site } from "@/content/site";

export function Header() {
  const { scrollYProgress } = useScroll();
  const [descolado, setDescolado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Spring na barra de progresso: o scroll cru treme em trackpad, e a barra
  // amplifica esse tremor porque atravessa a tela inteira.
  const progresso = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 40,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => setDescolado(v > 0.01));

  // Escape fecha o menu — sem isso, quem navega por teclado fica preso nele.
  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    window.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        descolado ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center justify-between px-(--spacing-gutter)">
        <a
          href="#"
          className="-ml-1 flex min-h-11 items-center gap-2.5 px-1"
          aria-label={`${site.name} — início`}
        >
          <LogoImpetus className="h-[17px] w-auto" />
          <span className="text-[0.95rem] font-semibold tracking-tight">{site.name}</span>
          <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.14em] text-text-faint sm:inline">
            fase 0
          </span>
        </a>

        {/* `min-h-11` em vez de so texto: o tablet usa esta navegacao com o dedo,
            e 17px de altura de linha nao e alvo de toque. */}
        <nav aria-label="Seções" className="hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center px-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-text-dim transition-colors duration-(--duration-hover) hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          className="-mr-2 flex size-11 items-center justify-center md:hidden"
        >
          <span className="sr-only">{menuAberto ? "Fechar menu" : "Abrir menu"}</span>
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-px w-full bg-text transition-all duration-(--duration-reveal) ${
                menuAberto ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-text transition-all duration-(--duration-reveal) ${
                menuAberto ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {menuAberto && (
        <nav
          id="menu-mobile"
          aria-label="Seções"
          className="border-t border-line bg-bg/95 backdrop-blur-xl md:hidden"
        >
          <ul className="px-(--spacing-gutter) py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className="block border-b border-line-soft py-4 font-mono text-sm uppercase tracking-[0.1em] text-text-dim"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <motion.div
        aria-hidden
        style={{ scaleX: progresso }}
        className="h-px origin-left bg-red-bright"
      />
    </header>
  );
}
