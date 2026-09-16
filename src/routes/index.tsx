import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Generator } from "@/components/generator";
import { SessionSheet } from "@/components/session-sheet";
import { DEFAULT_SESSION, useApp, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const session = useApp((s) => s.session);
  const hydrated = useHydrated();
  const sheetRef = useRef<HTMLDivElement>(null);
  const shown = (hydrated ? session : DEFAULT_SESSION) ?? DEFAULT_SESSION;

  return (
    <main className="flex-1 px-5 sm:px-8 pb-16">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12 items-start">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-3">
            Guitare jazz · une séance à la fois
          </p>
          <h1 className="font-display text-[2.35rem] sm:text-5xl leading-[1.08] tracking-tight">
            Larsen, les coordonnées.
            <br />
            HTPB10, les trajectoires.
          </h1>
          <p className="mt-4 text-muted text-[0.975rem] leading-relaxed max-w-md">
            Pas un cursus. Une séance ciblée, transposée, assez précise pour être jouée tout de suite — et
            assez limitée pour installer un geste.
          </p>
          <div className="mt-8">
            <Generator
              onGenerated={() => {
                window.setTimeout(() => {
                  sheetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }}
            />
          </div>
        </div>
        <div ref={sheetRef} className="min-w-0">
          <SessionSheet session={shown} />
        </div>
      </div>
    </main>
  );
}
