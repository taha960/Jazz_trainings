import { useState, type ReactNode } from "react";
import { Check, Copy, Pause, Play } from "lucide-react";
import { playMidis, startMetronome, stopAll } from "@/lib/audio";
import type { HtpbPatternView, HtpbSession, LarsenSession, Session, ShellVoicing } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/components/staff";
import { Neck } from "@/components/neck";
import { cn } from "@/lib/utils";

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-t border-rule/50 pt-5 mt-5">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink-muted mb-2">
        {label}
      </p>
      {children}
    </section>
  );
}

function CellNotes({ notes, dim }: { notes: string[]; dim?: boolean }) {
  return (
    <span className={cn("font-display text-xl tracking-wide", dim && "text-ink-muted")}>
      {notes.join(" ")}
    </span>
  );
}

function PatternBlock({
  p,
  playingId,
  onPlay,
}: {
  p: HtpbPatternView;
  playingId: string | null;
  onPlay: (p: HtpbPatternView, which: "a" | "b" | "full") => void;
}) {
  const busy = playingId === p.id;
  return (
    <article className="rounded-lg bg-rule/20 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-ink-muted">{p.id}</span>
          <span className="font-display text-lg text-ink">{p.destChord}</span>
          <span className="text-xs text-ink-muted">← {p.originalChord}</span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="border-rule text-ink h-9" onClick={() => onPlay(p, "a")}>
            Cellule A
          </Button>
          {p.destB ? (
            <Button size="sm" variant="outline" className="border-rule text-ink h-9" onClick={() => onPlay(p, "b")}>
              Cellule B
            </Button>
          ) : null}
          <Button size="icon-sm" variant="sheet" onClick={() => onPlay(p, "full")} aria-label="Jouer le pattern">
            {busy ? <Pause /> : <Play className="ml-px" />}
          </Button>
        </div>
      </div>

      <p className="text-[0.7rem] uppercase tracking-widest text-ink-muted mb-1">Source</p>
      <p className="mb-3">
        <CellNotes notes={p.originalA.display} dim />
        {p.originalB ? (
          <>
            <span className="mx-2 text-ink-muted">|</span>
            <CellNotes notes={p.originalB.display} dim />
          </>
        ) : null}
      </p>
      <p className="text-[0.7rem] uppercase tracking-widest text-ink-muted mb-1">Transposé</p>
      <p className="mb-3">
        <CellNotes notes={p.destA.display} />
        {p.destB ? (
          <>
            <span className="mx-2 text-ink-muted">|</span>
            <CellNotes notes={p.destB.display} />
          </>
        ) : (
          <span className="ml-2 text-xs text-ink-muted">(cellule seule)</span>
        )}
      </p>
      <Staff cellA={p.destA} cellB={p.destB} />
      <div className="mt-3">
        <Neck fingering={p.fingering} />
      </div>
    </article>
  );
}

function HtpbSheet({ session }: { session: HtpbSession }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [metroOn, setMetroOn] = useState(false);

  const play = async (p: HtpbPatternView, which: "a" | "b" | "full") => {
    const midis =
      which === "a"
        ? p.destA.midis
        : which === "b"
          ? (p.destB?.midis ?? [])
          : p.destB
            ? [...p.destA.midis, ...p.destB.midis]
            : p.destA.midis;
    setPlayingId(p.id);
    await playMidis(midis, 90);
    setPlayingId(null);
  };

  const toggleMetro = async () => {
    if (metroOn) {
      stopAll();
      setMetroOn(false);
      return;
    }
    setMetroOn(true);
    await startMetronome(90);
  };

  return (
    <>
      <Section label="Tonalité / transposition">
        <p className="font-display text-2xl text-ink">{session.intervalLabel}</p>
        <p className="text-sm text-ink-muted mt-1">
          Référence originale C · destination {session.destKey} · les altérations du document sont conservées
        </p>
      </Section>
      <Section label="Matériau source & version transposée">
        <div className="flex justify-end mb-3">
          <Button size="sm" variant="outline" className="border-rule text-ink" onClick={toggleMetro}>
            {metroOn ? "Arrêter le métronome" : "Métronome ♩ = 90"}
          </Button>
        </div>
        <div className="grid gap-4">
          {session.patterns.map((p) => (
            <PatternBlock key={p.id} p={p} playingId={playingId} onPlay={play} />
          ))}
        </div>
      </Section>
      <CopySections session={session} />
    </>
  );
}

function ShellRow({ s }: { s: ShellVoicing }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 border-b border-rule/40 last:border-0">
      <span className="font-display text-base w-20">{s.chord}</span>
      <span className="text-xs text-ink-muted uppercase tracking-wider w-10">
        {s.set === "6" ? "6e" : "5e"}
      </span>
      <span className="font-mono text-sm">
        R {s.root} · 3 {s.third} · 7 {s.seventh}
      </span>
      {s.fingering ? (
        <span className="font-mono text-xs text-ink-muted ml-auto">
          {s.fingering
            .map((f) => `${["e", "B", "G", "D", "A", "E"][f.string]}${f.fret}`)
            .join(" ")}
        </span>
      ) : null}
    </div>
  );
}

function LarsenSheet({ session }: { session: LarsenSession }) {
  return (
    <>
      <Section label="Exercice choisi">
        <ul className="space-y-3">
          {session.exercises.map((e) => (
            <li key={e.number}>
              <p className="font-display text-xl text-ink">
                #{e.number} — {e.name}
              </p>
              <p className="text-sm text-ink-muted mt-1">{e.reason}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section label="Tonalité">
        <p className="font-display text-2xl text-ink">{session.destKey} majeur</p>
        {session.progression?.length ? (
          <p className="mt-2 font-display text-lg">{session.progression.join(" – ")}</p>
        ) : null}
      </Section>
      <Section label="Matériau">
        {session.scale ? (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-1">Gamme</p>
            <p className="font-display text-2xl">{session.scale.join("  ")}</p>
          </div>
        ) : null}
        {session.thirds ? (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-1">Tierces diatoniques</p>
            <p className="font-display text-lg leading-relaxed">
              {session.thirds.map(([a, b]) => `${a}–${b}`).join("   ")}
            </p>
          </div>
        ) : null}
        {session.triads ? (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-2">Triades</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {session.triads.map((t) => (
                <li key={t.name} className="flex justify-between gap-3 text-sm">
                  <span className="font-display">{t.name}</span>
                  <span className="font-mono text-ink-muted">{t.notes.join(" ")}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {session.sevenths ? (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-2">Arpèges de septième</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {session.sevenths.map((t) => (
                <li key={t.name} className="flex justify-between gap-3 text-sm">
                  <span className="font-display">{t.name}</span>
                  <span className="font-mono text-ink-muted">{t.notes.join(" ")}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {session.shells ? (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-ink-muted mb-2">
              Shell voicings — fondamentale, 3e, 7e
            </p>
            <div>
              {session.shells
                .filter((s) => s.set === "6")
                .map((s) => (
                  <ShellRow key={`6-${s.chord}`} s={s} />
                ))}
            </div>
            <p className="text-xs uppercase tracking-widest text-ink-muted mt-4 mb-2">Fondamentale 5e corde</p>
            <div>
              {session.shells
                .filter((s) => s.set === "5")
                .map((s) => (
                  <ShellRow key={`5-${s.chord}`} s={s} />
                ))}
            </div>
          </div>
        ) : null}
        {session.chordTones ? (
          <div className="mb-4 grid gap-3">
            {session.chordTones.map((c) => (
              <div key={c.chord} className="rounded-md bg-rule/20 px-3 py-2">
                <p className="font-display text-lg">
                  {c.chord} <span className="text-sm text-ink-muted">{c.roman}</span>
                </p>
                <p className="font-mono text-sm mt-1">
                  {c.tones.map((t) => `${t.note} (${t.role})`).join("   ")}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {session.compose ? (
          <div className="mb-4">
            <p className="font-display text-xl">{session.compose.structure}</p>
            <p className="text-sm text-ink-muted mt-1">{session.compose.relation}</p>
            <p className="font-display text-2xl mt-2">{session.compose.notes.join("  ")}</p>
            <p className="text-sm mt-3 leading-relaxed">{session.compose.prompt}</p>
          </div>
        ) : null}
        {session.melodic ? (
          <div className="mb-2">
            <p className="text-sm font-medium">{session.melodic.constraint}</p>
            <p className="text-sm mt-2 leading-relaxed">{session.melodic.prompt}</p>
          </div>
        ) : null}
      </Section>
      <CopySections session={session} />
    </>
  );
}

function CopySections({ session }: { session: Session }) {
  return (
    <>
      <Section label="Ce que tu exerces">
        <p className="text-[0.975rem] leading-relaxed text-ink">{session.training}</p>
      </Section>
      <Section label="Exécution">
        <ol className="space-y-2 text-[0.975rem] leading-relaxed">
          {session.execution.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs text-ink-muted mt-1 w-4">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>
      <Section label="Critère de réussite">
        <ul className="space-y-2 text-[0.975rem] leading-relaxed">
          {session.success.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-ink-muted">—</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section label="Transfert facultatif">
        <p className="text-sm leading-relaxed text-ink-muted italic">{session.transfer}</p>
      </Section>
    </>
  );
}

function sessionText(s: Session): string {
  const lines: string[] = [`${s.sessionKey}`, `Tonalité ${s.destKey}`, ""];
  if (s.kind === "HTPB10") {
    lines.push(s.intervalLabel, "", s.training, "");
    for (const p of s.patterns) {
      lines.push(
        `${p.id}  ${p.originalChord} → ${p.destChord}`,
        `  [${p.originalA.display.join(" ")}] | [${p.originalB?.display.join(" ") ?? "—"}]`,
        `  [${p.destA.display.join(" ")}] | [${p.destB?.display.join(" ") ?? "—"}]`,
        "",
      );
    }
  } else {
    for (const e of s.exercises) lines.push(`#${e.number} ${e.name}`, e.reason, "");
    if (s.scale) lines.push("Gamme " + s.scale.join(" "));
    if (s.sevenths) for (const x of s.sevenths) lines.push(`${x.name}: ${x.notes.join(" ")}`);
    if (s.progression) lines.push(s.progression.join(" – "));
    if (s.compose) lines.push(s.compose.structure, s.compose.notes.join(" "), s.compose.prompt);
    lines.push("", s.training);
  }
  lines.push("", "Exécution:");
  s.execution.forEach((e, i) => lines.push(`${i + 1}. ${e}`));
  return lines.join("\n");
}

export function SessionSheet({ session }: { session: Session }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(sessionText(session));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="sheet-enter rounded-xl bg-sheet text-ink px-5 py-6 sm:px-8 sm:py-8 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.7rem] tracking-wider text-ink-muted">{session.sessionKey}</p>
          <h2 className="font-display text-3xl sm:text-4xl mt-1 tracking-tight">
            {session.kind === "HTPB10" ? "Trajectoires" : "Coordonnées"}
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="ink">{session.kind}</Badge>
            <Badge variant="sheet">difficulté {session.difficulty}</Badge>
            <Badge variant="sheet">{session.destKey}</Badge>
            {session.durationMin ? <Badge variant="sheet">{session.durationMin} min</Badge> : null}
          </div>
        </div>
        <Button size="sm" variant="outline" className="border-rule text-ink" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </header>
      {session.kind === "HTPB10" ? <HtpbSheet session={session} /> : <LarsenSheet session={session} />}
    </article>
  );
}
