import { useState, type ReactNode } from "react";
import { KEYS } from "@/lib/music";
import { parseCommand } from "@/lib/parse-command";
import { useApp } from "@/lib/store";
import type { Difficulty, LarsenExercise, Method } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DIFFS: { n: Difficulty; label: string; hint: string }[] = [
  { n: 1, label: "Acquisition", hint: "peu de matériau, une zone" },
  { n: 2, label: "Connexion", hint: "enchaîner sans s’arrêter" },
  { n: 3, label: "Intégration", hint: "plusieurs objets, une séance" },
];

const EXS: { n: LarsenExercise | "auto"; label: string }[] = [
  { n: "auto", label: "Auto" },
  { n: 1, label: "#1 Harmonie" },
  { n: 2, label: "#2 Shells" },
  { n: 3, label: "#3 Chord tones" },
  { n: 4, label: "#4 Composer" },
  { n: 5, label: "#5 Mélodique" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 px-3.5 rounded-md text-sm font-medium transition-[background-color,color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96]",
        active ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function Generator({ onGenerated }: { onGenerated: () => void }) {
  const { request, setRequest, generate } = useApp();
  const [cmd, setCmd] = useState("");

  const run = () => {
    generate();
    onGenerated();
  };

  const runCommand = () => {
    const parsed = parseCommand(cmd, request);
    setRequest(parsed);
    window.setTimeout(() => {
      useApp.getState().generate();
      onGenerated();
    }, 0);
  };

  return (
    <div className="stagger-in space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(["HTPB10", "Larsen"] as Method[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setRequest({ method: m })}
            className={cn(
              "rounded-lg p-4 text-left min-h-[5.5rem] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
              request.method === m ? "bg-accent text-accent-foreground" : "bg-surface-2 text-fg",
            )}
          >
            <p className="font-display text-xl">{m === "HTPB10" ? "HTPB10" : "Larsen"}</p>
            <p className={cn("text-xs mt-1", request.method === m ? "opacity-70" : "text-muted")}>
              {m === "HTPB10" ? "Trajectoires · tétras" : "Coordonnées · structures"}
            </p>
          </button>
        ))}
      </div>

      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2">Difficulté</p>
        <div className="flex flex-wrap gap-2">
          {DIFFS.map((d) => (
            <Chip key={d.n} active={request.difficulty === d.n} onClick={() => setRequest({ difficulty: d.n })}>
              {d.n} · {d.label}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-faint mt-2">
          {DIFFS.find((d) => d.n === request.difficulty)?.hint}. Pas la vitesse.
        </p>
      </div>

      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2">Tonalité</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={request.key === "auto"} onClick={() => setRequest({ key: "auto" })}>
            Auto
          </Chip>
          {KEYS.filter((k) => k.id !== "C#").map((k) => (
            <Chip key={k.id} active={request.key === k.id} onClick={() => setRequest({ key: k.id })}>
              {k.id}
            </Chip>
          ))}
        </div>
      </div>

      {request.method === "Larsen" ? (
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2">Exercice Larsen</p>
          <div className="flex flex-wrap gap-2">
            {EXS.map((e) => (
              <Chip
                key={String(e.n)}
                active={request.exercise === e.n}
                onClick={() => setRequest({ exercise: e.n })}
              >
                {e.label}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2">Durée (facultative)</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={request.durationMin === null} onClick={() => setRequest({ durationMin: null })}>
            Libre
          </Chip>
          {[12, 20, 30].map((n) => (
            <Chip
              key={n}
              active={request.durationMin === n}
              onClick={() => setRequest({ durationMin: n })}
            >
              {n} min
            </Chip>
          ))}
        </div>
      </div>

      <Button size="lg" className="w-full h-12" onClick={run}>
        Générer la séance
      </Button>

      <div>
        <label htmlFor="cmd" className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          Commande
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="cmd"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runCommand();
            }}
            placeholder="HTPB10 key Ab difficulté 2"
            className="h-11 flex-1 rounded-md bg-surface-2 px-3 text-sm text-fg placeholder:text-faint outline-none ring-offset-bg focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button variant="outline" onClick={runCommand}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
