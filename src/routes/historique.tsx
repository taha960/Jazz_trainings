import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/historique")({ component: Historique });

function Historique() {
  const history = useApp((s) => s.history);
  const load = useApp((s) => s.load);
  const hydrated = useHydrated();

  return (
    <main className="flex-1 px-5 sm:px-8 pb-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-3">Historique</p>
        <h1 className="font-display text-4xl tracking-tight">Séances précédentes</h1>
        <p className="mt-3 text-sm text-muted">
          Conservées sur cet appareil. Rouvrir une séance ne la régénère pas.
        </p>
        {!hydrated || history.length === 0 ? (
          <p className="mt-10 text-muted">{hydrated ? "Pas encore de séance." : "…"}</p>
        ) : (
          <ul className="mt-8 divide-y divide-border">
            {history.map((s) => (
              <li key={s.sessionKey + s.createdAt} className="py-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-muted">{s.sessionKey}</p>
                  <p className="font-display text-lg mt-0.5">
                    {s.kind === "HTPB10" ? "Trajectoires" : "Coordonnées"} · {s.destKey}
                  </p>
                </div>
                <Link
                  to="/"
                  onClick={() => load(s)}
                  className="text-sm text-accent hover:text-fg transition-colors min-h-11 inline-flex items-center"
                >
                  Rouvrir
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
