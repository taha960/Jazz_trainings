import { HTPB_PATTERNS, analyzePattern, cellHasExplicitNatural, pitchesOfCell, type HtpbPattern } from "./htpb-corpus";
import {
  COMMON_KEYS_L1,
  COMMON_KEYS_L2,
  COMMON_KEYS_L3,
  describeInterval,
  findFingering,
  formatPitch,
  keyPc,
  midiOf,
  mulberry32,
  mustKey,
  pad2,
  pickN,
  pickOne,
  transposeChordFromC,
  transposeFromC,
  verifyFingering,
  type KeyInfo,
  type SpelledPitch,
} from "./music";
import type { Difficulty, HtpbPatternView, HtpbSession, PlayedCell } from "./types";

function stepsOf(p: SpelledPitch): number {
  return p.octave * 7 + p.letter;
}

function played(tokens: string[], dest: KeyInfo | null): PlayedCell {
  const naturals = cellHasExplicitNatural(tokens);
  const src = pitchesOfCell(tokens);
  const notes = dest ? src.map((p) => transposeFromC(p, dest)) : src;
  return {
    tokens,
    display: notes.map((p, i) => formatPitch(p, naturals[i])),
    forceNatural: naturals,
    midis: notes.map(midiOf),
    steps: notes.map(stepsOf),
  };
}

function viewOf(p: HtpbPattern, dest: KeyInfo): HtpbPatternView {
  const destA = played(p.cellA, dest);
  const destB = p.cellB ? played(p.cellB, dest) : null;
  const midis = destB ? [...destA.midis, ...destB.midis] : destA.midis;
  let fingering = findFingering(midis);
  if (fingering && !verifyFingering(midis, fingering)) fingering = null;
  return {
    id: p.id,
    originalChord: p.originalChord,
    destChord: transposeChordFromC(p.originalChord, dest),
    originalA: played(p.cellA, null),
    originalB: p.cellB ? played(p.cellB, null) : null,
    destA,
    destB,
    tags: p.tags,
    fingering,
  };
}

function chooseKey(difficulty: Difficulty, rng: () => number, recent: string[]): string {
  const pool =
    difficulty === 1 ? COMMON_KEYS_L1 : difficulty === 2 ? COMMON_KEYS_L2 : COMMON_KEYS_L3;
  return pickOne(rng, pool, recent);
}

function choosePatterns(difficulty: Difficulty, rng: () => number): HtpbPattern[] {
  const dm = HTPB_PATTERNS.filter((p) => p.originalChord === "Dm7");
  const g7 = HTPB_PATTERNS.filter((p) => p.originalChord === "G7");
  const c7 = HTPB_PATTERNS.filter((p) => p.originalChord === "C7");

  if (difficulty === 1) {
    const family = pickOne(rng, [dm, g7, c7]);
    const n = Math.min(2, family.length);
    return pickN(rng, family, n).sort((a, b) => a.order - b.order);
  }

  if (difficulty === 2) {
    const families = pickN(rng, [dm, g7, c7], 2);
    const a = pickN(rng, families[0]!, 2);
    const b = pickN(rng, families[1]!, 2);
    return [...a, ...b].sort((a, b) => a.order - b.order);
  }

  const d = pickN(rng, dm, 2);
  const g = pickN(
    rng,
    g7.filter((p) => p.cellB),
    2,
  );
  const c = pickN(rng, c7, Math.min(2, c7.length));
  return [...d, ...g, ...c].sort((a, b) => a.order - b.order);
}

function trainingText(patterns: HtpbPattern[], dest: KeyInfo, difficulty: Difficulty): string {
  const analyses = patterns.map(analyzePattern);
  const chromatic = patterns.filter((_, i) => analyses[i]!.chromaticJoin);
  const dirChange = patterns.filter((_, i) => {
    const a = analyses[i]!;
    return a.contourA === "down" && a.contourB === "up";
  });
  const chords = [...new Set(patterns.map((p) => p.originalChord))];
  const bits: string[] = [];

  if (dirChange.length) {
    bits.push(
      `Les cellules ${dirChange.map((p) => p.id).join(", ")} inversent la direction : une descente de quatre notes, puis une montée. La main apprend une courbe, pas une collection.`,
    );
  }
  if (chromatic.length) {
    const joins = chromatic
      .map((p) => p.tags.find((t) => t.includes("→")) ?? "jonction chromatique")
      .join(", ");
    bits.push(
      `Les jonctions ${joins} doivent rester chromatiques après transposition vers ${dest.id}. Ne les « range » pas dans la gamme.`,
    );
  }
  if (patterns.some((p) => p.cellB === null)) {
    bits.push(
      `Une cellule isolée sert d’ancrage : quatre notes tenues comme une seule unité, sans enchaînement.`,
    );
  }
  if (difficulty >= 2 && chords.length > 1) {
    bits.push(
      `Tu enchaînes ${chords.map((c) => transposeChordFromC(c, dest)).join(" / ")}. Le chunking doit survivre au changement d’accord : cellule A → cellule B sans reconstruire chaque note.`,
    );
  }
  if (difficulty === 3) {
    bits.push(
      `L’enjeu n’est plus d’apprendre un pattern : c’est de conserver l’identité exacte de chaque cellule pendant que l’harmonie et le registre bougent.`,
    );
  }
  if (!bits.length) {
    bits.push(
      `Quatre notes = une unité. Tu réduis la charge cognitive du mouvement conjoint jusqu’à pouvoir démarrer la cellule sans la recalculer.`,
    );
  }
  return bits.join(" ");
}

function execution(difficulty: Difficulty, durationMin: number | null): string[] {
  const steps = [
    "Isoler la cellule A. La répéter jusqu’à ce qu’elle parte d’un geste, pas d’un décompte.",
    "Isoler la cellule B de la même façon.",
    "Les connecter : dernière note de A → première note de B, sans pause. Écouter la jonction.",
    "Jouer le pattern complet en croches régulières (♩ = 90 dans le document). Continuité avant vitesse.",
  ];
  if (difficulty >= 2) {
    steps.push("Enchaîner deux patterns sans s’arrêter. Comparer les deux chemins moteurs.");
  }
  if (difficulty === 3) {
    steps.push(
      "Traverser les changements d’accord en gardant le même découpage cellulaire. Si une cellule se déforme, revenir à l’isolation.",
    );
  }
  steps.push("Option : déplacer le pattern d’une octave, ou d’une position, sans changer les notes.");
  if (durationMin) {
    steps.push(`Reste dans cette séance environ ${durationMin} minutes. Pas de deuxième exercice.`);
  }
  return steps;
}

const SUCCESS_HTPB = [
  "Tu démarres chaque cellule sans reconstruire ses quatre notes.",
  "Le contour (descente / montée) est reconnaissable à l’oreille, même lent.",
  "Les jonctions chromatiques restent chromatiques — aucune note « corrigée ».",
  "Le flux de croches est continu : l’hésitation a disparu, pas nécessairement la lenteur.",
];

const TRANSFER =
  "Reviens sur le standard actuellement travaillé et joue librement quelques minutes. N’essaie pas de placer volontairement tous les patterns. Observe simplement si l’une des nouvelles trajectoires devient disponible.";

export function generateHtpb(opts: {
  difficulty: Difficulty;
  key: string | "auto";
  durationMin: number | null;
  serial: number;
  seed: number;
  recentKeys: string[];
}): HtpbSession {
  const rng = mulberry32(opts.seed);
  const keyId = opts.key === "auto" ? chooseKey(opts.difficulty, rng, opts.recentKeys) : opts.key;
  const dest = mustKey(keyId);
  const selected = choosePatterns(opts.difficulty, rng);
  const patterns = selected.map((p) => viewOf(p, dest));

  return {
    kind: "HTPB10",
    sessionKey: `HTPB10-${dest.id}-L${opts.difficulty}-${pad2(opts.serial)}`,
    destKey: dest.id,
    intervalLabel: describeInterval(dest),
    semitones: keyPc(dest),
    difficulty: opts.difficulty,
    durationMin: opts.durationMin,
    patterns,
    training: trainingText(selected, dest, opts.difficulty),
    execution: execution(opts.difficulty, opts.durationMin),
    success: SUCCESS_HTPB,
    transfer: TRANSFER,
    seed: opts.seed,
    createdAt: Date.now(),
  };
}
