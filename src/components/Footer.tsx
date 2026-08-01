import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-(--spacing-gutter) py-14">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-label uppercase tracking-[0.14em] text-text-faint">
            {site.name} · Fase 0
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-dim">
            Um projeto interno da DMG. Sem cliente externo, sem cadastro público —
            e esta página não vai fingir o contrário.
          </p>
        </div>

        <p className="font-mono text-xs text-text-faint">
          © {new Date().getFullYear()} DMG
        </p>
      </div>
    </footer>
  );
}
