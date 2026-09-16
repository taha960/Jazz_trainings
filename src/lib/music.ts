/** Scientific pitch, letter-based spelling. C4 = middle C. */

export type Accidental = -2 | -1 | 0 | 1 | 2;
export type Letter = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SpelledPitch {
  letter: Letter;
  acc: Accidental;
  octave: number;
}

export interface KeyInfo {
  id: string;
  letter: Letter;
  acc: Accidental;
}

export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
export const LETTER_PC = [0, 2, 4, 5, 7, 9, 11] as const;

export const KEYS: KeyInfo[] = [
  { id: "C", letter: 0, acc: 0 },
  { id: "G", letter: 4, acc: 0 },
  { id: "D", letter: 1, acc: 0 },
  { id: "A", letter: 5, acc: 0 },
  { id: "E", letter: 2, acc: 0 },
  { id: "B", letter: 6, acc: 0 },
  { id: "F#", letter: 3, acc: 1 },
  { id: "Db", letter: 1, acc: -1 },
  { id: "Ab", letter: 5, acc: -1 },
  { id: "Eb", letter: 2, acc: -1 },
  { id: "Bb", letter: 6, acc: -1 },
  { id: "F", letter: 3, acc: 0 },
  { id: "Gb", letter: 4, acc: -1 },
  { id: "C#", letter: 0, acc: 1 },
];

export const COMMON_KEYS_L1 = ["F", "G", "D", "Bb", "A", "Eb"] as const;
export const COMMON_KEYS_L2 = ["F", "G", "D", "Bb", "A", "Eb", "E", "Ab"] as const;
export const COMMON_KEYS_L3 = [
  "F",
  "G",
  "D",
  "Bb",
  "A",
  "Eb",
  "E",
  "Ab",
  "Db",
  "F#",
  "B",
  "Gb",
] as const;

const LETTER_INDEX: Record<string, Letter> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

export function pcOf(p: Pick<SpelledPitch, "letter" | "acc">): number {
  return (((LETTER_PC[p.letter] + p.acc) % 12) + 12) % 12;
}

export function midiOf(p: SpelledPitch): number {
  return (p.octave + 1) * 12 + pcOf(p);
}

export function keyPc(k: KeyInfo): number {
  return pcOf({ letter: k.letter, acc: k.acc });
}

export function parseKey(raw: string): KeyInfo | null {
  const t = raw.trim().replace("♯", "#").replace("♭", "b");
  const found = KEYS.find((k) => k.id.toLowerCase() === t.toLowerCase());
  return found ?? null;
}

export function mustKey(id: string): KeyInfo {
  const k = parseKey(id);
  if (!k) throw new Error(`Unknown key ${id}`);
  return k;
}

/** Parse "A5", "Bb4", "C#5", "Cn5" (explicit natural), "F♮4". */
export function parseNote(token: string): SpelledPitch {
  const m = token.trim().match(/^([A-G])([#b♯♭n♮]?)(\d)$/);
  if (!m) throw new Error(`Bad note token: ${token}`);
  const letter = LETTER_INDEX[m[1]!];
  const accRaw = m[2] ?? "";
  const acc: Accidental =
    accRaw === "#" || accRaw === "♯"
      ? 1
      : accRaw === "b" || accRaw === "♭"
        ? -1
        : 0;
  return { letter, acc, octave: Number(m[3]) };
}

export function formatAcc(acc: Accidental, forceNatural = false): string {
  if (acc === 1) return "♯";
  if (acc === -1) return "♭";
  if (acc === 2) return "𝄪";
  if (acc === -2) return "𝄫";
  return forceNatural ? "♮" : "";
}

export function formatPitch(p: SpelledPitch, forceNatural = false): string {
  return `${LETTERS[p.letter]}${formatAcc(p.acc, forceNatural)}`;
}

export function formatPitchOctave(p: SpelledPitch, forceNatural = false): string {
  return `${formatPitch(p, forceNatural)}${p.octave}`;
}

export function asciiPitch(p: SpelledPitch, forceNatural = false): string {
  const acc =
    p.acc === 1
      ? "#"
      : p.acc === -1
        ? "b"
        : p.acc === 2
          ? "x"
          : p.acc === -2
            ? "bb"
            : forceNatural
              ? "n"
              : "";
  return `${LETTERS[p.letter]}${acc}`;
}

/**
 * Transpose from C-reference by the letter + semitone span of destination key.
 * Preserves chromatic vs diatonic spelling (C♯ stays a sharp of the same letter degree).
 */
export function transposeFromC(p: SpelledPitch, dest: KeyInfo): SpelledPitch {
  const letterShift = dest.letter;
  const pcShift = keyPc(dest);
  const newLetter = ((p.letter + letterShift) % 7) as Letter;
  const newPc = (pcOf(p) + pcShift) % 12;
  const naturalPc = LETTER_PC[newLetter];
  let acc = newPc - naturalPc;
  if (acc > 2) acc -= 12;
  if (acc < -2) acc += 12;
  const midi = midiOf(p) + pcShift;
  const octave = Math.floor((midi - newPc) / 12) - 1;
  return { letter: newLetter, acc: acc as Accidental, octave };
}

export function semitonesCto(dest: KeyInfo): number {
  return keyPc(dest);
}

export function describeInterval(dest: KeyInfo): string {
  const n = semitonesCto(dest);
  const up = n;
  const down = (12 - n) % 12;
  if (n === 0) return "C → C : 0 demi-ton";
  if (n <= 6) return `C → ${dest.id} : +${up} demi-ton${up > 1 ? "s" : ""}`;
  return `C → ${dest.id} : −${down} demi-ton${down > 1 ? "s" : ""} / +${up} demi-tons`;
}

export type ChordQuality = "maj7" | "7" | "m7" | "ø" | "dim" | "" | "m";

export function parseChord(symbol: string): { rootLetter: Letter; rootAcc: Accidental; quality: string } {
  const m = symbol.trim().match(/^([A-G])([#b♯♭]?)(.*)$/);
  if (!m) throw new Error(`Bad chord: ${symbol}`);
  const letter = LETTER_INDEX[m[1]!];
  const accRaw = m[2] ?? "";
  const acc: Accidental = accRaw === "#" || accRaw === "♯" ? 1 : accRaw === "b" || accRaw === "♭" ? -1 : 0;
  const q = (m[3] ?? "").trim();
  return { rootLetter: letter, rootAcc: acc, quality: q };
}

export function formatChord(root: SpelledPitch, quality: string): string {
  return `${formatPitch(root)}${quality}`;
}

export function transposeChordFromC(symbol: string, dest: KeyInfo): string {
  const { rootLetter, rootAcc, quality } = parseChord(symbol);
  const root = transposeFromC({ letter: rootLetter, acc: rootAcc, octave: 4 }, dest);
  return formatChord(root, quality);
}

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

export function majorScale(key: KeyInfo, startOctave = 4): SpelledPitch[] {
  const rootPc = keyPc(key);
  let prevLetter = key.letter;
  let octave = startOctave;
  return ([0, 1, 2, 3, 4, 5, 6] as const).map((i) => {
    const letter = ((key.letter + i) % 7) as Letter;
    if (i > 0 && letter <= prevLetter) octave += 1;
    prevLetter = letter;
    const targetPc = (rootPc + MAJOR_INTERVALS[i]!) % 12;
    const naturalPc = LETTER_PC[letter];
    let acc = targetPc - naturalPc;
    if (acc > 2) acc -= 12;
    if (acc < -2) acc += 12;
    return { letter, acc: acc as Accidental, octave };
  });
}

export const TRIAD_QUALITIES = ["", "m", "m", "", "", "m", "dim"] as const;
export const SEVENTH_QUALITIES = ["maj7", "m7", "m7", "maj7", "7", "m7", "ø"] as const;
export const ROMAN_MAJOR = ["I", "ii", "iii", "IV", "V", "vi", "vii°"] as const;
export const ROMAN_SEVENTH = ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø"] as const;

export function diatonicThirds(scale: SpelledPitch[]): [SpelledPitch, SpelledPitch][] {
  return scale.map((n, i) => {
    const upper = scale[(i + 2) % 7]!;
    const pitched = { ...upper };
    if (i + 2 >= 7) pitched.octave = upper.octave + 1;
    else if (midiOf(upper) < midiOf(n)) pitched.octave = upper.octave + 1;
    return [n, pitched];
  });
}

export function stack(scale: SpelledPitch[], degree: number, steps: number[]): SpelledPitch[] {
  return steps.map((s) => {
    const idx = degree + s;
    const octAdd = Math.floor(idx / 7);
    const note = scale[((idx % 7) + 7) % 7]!;
    let octave = note.octave + octAdd;
    const proto = { ...note, octave };
    if (s > 0 && midiOf(proto) < midiOf({ ...scale[degree]!, octave: scale[degree]!.octave })) {
      octave += 1;
    }
    return { ...note, octave };
  });
}

export function triad(scale: SpelledPitch[], degree: number): SpelledPitch[] {
  return stack(scale, degree, [0, 2, 4]);
}

export function seventh(scale: SpelledPitch[], degree: number): SpelledPitch[] {
  return stack(scale, degree, [0, 2, 4, 6]);
}

/** Build a dominant 7th from a spelled root (for VI7). */
export function dominantSeventh(root: SpelledPitch): SpelledPitch[] {
  const intervals = [0, 4, 7, 10];
  const letters: Letter[] = [
    root.letter,
    ((root.letter + 2) % 7) as Letter,
    ((root.letter + 4) % 7) as Letter,
    ((root.letter + 6) % 7) as Letter,
  ];
  return intervals.map((iv, i) => {
    const letter = letters[i]!;
    const targetPc = (pcOf(root) + iv) % 12;
    const naturalPc = LETTER_PC[letter];
    let acc = targetPc - naturalPc;
    if (acc > 2) acc -= 12;
    if (acc < -2) acc += 12;
    let octave = root.octave;
    const proto = { letter, acc: acc as Accidental, octave };
    if (i > 0 && midiOf(proto) < midiOf(root)) octave += 1;
    return { letter, acc: acc as Accidental, octave };
  });
}

export function chordTonesOf(
  quality: "maj7" | "7" | "m7" | "ø",
  root: SpelledPitch,
): { role: string; note: SpelledPitch }[] {
  const iv: [number, number, string][] =
    quality === "maj7"
      ? [
          [0, 0, "1"],
          [2, 4, "3"],
          [4, 7, "5"],
          [6, 11, "7"],
        ]
      : quality === "7"
        ? [
            [0, 0, "1"],
            [2, 4, "3"],
            [4, 7, "5"],
            [6, 10, "b7"],
          ]
        : quality === "m7"
          ? [
              [0, 0, "1"],
              [2, 3, "b3"],
              [4, 7, "5"],
              [6, 10, "b7"],
            ]
          : [
              [0, 0, "1"],
              [2, 3, "b3"],
              [4, 6, "b5"],
              [6, 10, "b7"],
            ];
  return iv.map(([letterSpan, semitones, role]) => {
    const letter = ((root.letter + letterSpan) % 7) as Letter;
    const targetPc = (pcOf(root) + semitones) % 12;
    const naturalPc = LETTER_PC[letter];
    let acc = targetPc - naturalPc;
    if (acc > 2) acc -= 12;
    if (acc < -2) acc += 12;
    let octave = root.octave;
    const proto = { letter, acc: acc as Accidental, octave };
    if (letterSpan > 0 && midiOf(proto) < midiOf(root)) octave += 1;
    return { role, note: { letter, acc: acc as Accidental, octave } };
  });
}

export function notesEqual(a: SpelledPitch, b: SpelledPitch): boolean {
  return a.letter === b.letter && a.acc === b.acc && a.octave === b.octave;
}

export function isSemitoneApart(a: SpelledPitch, b: SpelledPitch): boolean {
  return Math.abs(midiOf(a) - midiOf(b)) === 1;
}

export function contourOf(notes: SpelledPitch[]): "up" | "down" | "flat" | "mixed" {
  if (notes.length < 2) return "flat";
  const diffs = notes.slice(1).map((n, i) => midiOf(n) - midiOf(notes[i]!));
  const up = diffs.every((d) => d > 0);
  const down = diffs.every((d) => d < 0);
  if (up) return "up";
  if (down) return "down";
  if (diffs.every((d) => d === 0)) return "flat";
  return "mixed";
}

export function allConjunct(notes: SpelledPitch[]): boolean {
  for (let i = 1; i < notes.length; i++) {
    if (Math.abs(midiOf(notes[i]!) - midiOf(notes[i - 1]!)) > 2) return false;
  }
  return true;
}

/** Standard tuning, string 0 = high E. */
export const OPEN_MIDI = [64, 59, 55, 50, 45, 40];
export const STRING_NAMES = ["e", "B", "G", "D", "A", "E"];

export interface FretPos {
  string: number;
  fret: number;
}

export function findFingering(midis: number[], maxFret = 19): FretPos[] | null {
  const cands = midis.map((m) => {
    const out: FretPos[] = [];
    for (let s = 0; s < 6; s++) {
      const f = m - OPEN_MIDI[s]!;
      if (f >= 0 && f <= maxFret) out.push({ string: s, fret: f });
    }
    return out;
  });
  if (cands.some((c) => c.length === 0)) {
    const shifted = midis.map((m) => m - 12);
    if (shifted.every((m) => m >= 40)) return findFingering(shifted, maxFret);
    return null;
  }

  let best: FretPos[] | null = null;
  let bestScore = Infinity;

  const rec = (i: number, acc: FretPos[], minF: number, maxF: number) => {
    if (maxF - minF > 5) return;
    if (i === cands.length) {
      const stretch = maxF - minF;
      let jumps = 0;
      for (let j = 1; j < acc.length; j++) jumps += Math.abs(acc[j]!.string - acc[j - 1]!.string);
      const score = stretch * 8 + jumps;
      if (score < bestScore) {
        bestScore = score;
        best = acc.slice();
      }
      return;
    }
    for (const c of cands[i]!) {
      if (i > 0 && Math.abs(c.string - acc[i - 1]!.string) > 2) continue;
      const nmin = i === 0 ? c.fret : Math.min(minF, c.fret);
      const nmax = i === 0 ? c.fret : Math.max(maxF, c.fret);
      acc.push(c);
      rec(i + 1, acc, nmin, nmax);
      acc.pop();
    }
  };
  rec(0, [], 0, 0);
  return best;
}

export function verifyFingering(midis: number[], fingering: FretPos[]): boolean {
  if (midis.length !== fingering.length) return false;
  return fingering.every((p, i) => OPEN_MIDI[p.string]! + p.fret === midis[i]);
}

/** Shell: root on 6th (index 5) + 7th on D (3) + 3rd on G (2). */
export function shellSixthRoot(root: SpelledPitch, third: SpelledPitch, seventh: SpelledPitch): FretPos[] | null {
  const rootMidiCandidates = [midiOf({ ...root, octave: 2 }), midiOf({ ...root, octave: 3 })];
  for (const rMidi of rootMidiCandidates) {
    const rFret = rMidi - 40;
    if (rFret < 0 || rFret > 15) continue;
    const sevOptions = [midiOf({ ...seventh, octave: 3 }), midiOf({ ...seventh, octave: 4 })];
    const thiOptions = [midiOf({ ...third, octave: 3 }), midiOf({ ...third, octave: 4 })];
    for (const sMidi of sevOptions) {
      const sFret = sMidi - 50;
      if (sFret < 0 || sFret > 19) continue;
      if (Math.abs(sFret - rFret) > 4) continue;
      for (const tMidi of thiOptions) {
        const tFret = tMidi - 55;
        if (tFret < 0 || tFret > 19) continue;
        if (Math.abs(tFret - rFret) > 4) continue;
        const pos = [
          { string: 5, fret: rFret },
          { string: 3, fret: sFret },
          { string: 2, fret: tFret },
        ];
        if (
          verifyFingering([rMidi, sMidi, tMidi], pos)
        ) {
          return pos;
        }
      }
    }
  }
  return null;
}

/** Shell: root on 5th (index 4) + 7th on G (2) + 3rd on B (1). */
export function shellFifthRoot(root: SpelledPitch, third: SpelledPitch, seventh: SpelledPitch): FretPos[] | null {
  const rootMidiCandidates = [midiOf({ ...root, octave: 2 }), midiOf({ ...root, octave: 3 })];
  for (const rMidi of rootMidiCandidates) {
    const rFret = rMidi - 45;
    if (rFret < 0 || rFret > 15) continue;
    const sevOptions = [midiOf({ ...seventh, octave: 3 }), midiOf({ ...seventh, octave: 4 })];
    const thiOptions = [midiOf({ ...third, octave: 3 }), midiOf({ ...third, octave: 4 })];
    for (const sMidi of sevOptions) {
      const sFret = sMidi - 55;
      if (sFret < 0 || sFret > 19) continue;
      if (Math.abs(sFret - rFret) > 4) continue;
      for (const tMidi of thiOptions) {
        const tFret = tMidi - 59;
        if (tFret < 0 || tFret > 19) continue;
        if (Math.abs(tFret - rFret) > 4) continue;
        const pos = [
          { string: 4, fret: rFret },
          { string: 2, fret: sFret },
          { string: 1, fret: tFret },
        ];
        if (verifyFingering([rMidi, sMidi, tMidi], pos)) return pos;
      }
    }
  }
  return null;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickOne<T>(rng: () => number, items: readonly T[], avoid?: T[]): T {
  const pool = avoid?.length ? items.filter((x) => !avoid.includes(x)) : [...items];
  const list = pool.length ? pool : [...items];
  return list[Math.floor(rng() * list.length)]!;
}

export function pickN<T>(rng: () => number, items: readonly T[], n: number): T[] {
  const copy = [...items];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(rng() * copy.length);
    out.push(copy.splice(i, 1)[0]!);
  }
  return out;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
