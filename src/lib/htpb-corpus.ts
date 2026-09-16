/**
 * Canonical HTPB10 tetrachord patterns transcribed from Htpb1O.pdf.
 * Notes, accidentals, directions and cell splits are taken from the score.
 * Do not invent, "correct", or diatonicize this material.
 */
import {
  allConjunct,
  contourOf,
  isSemitoneApart,
  parseNote,
  type SpelledPitch,
} from "./music";

export interface HtpbPattern {
  id: string;
  /** Order of appearance in Htpb1O.pdf */
  order: number;
  originalChord: "Dm7" | "G7" | "C7";
  /** Source tokens with octave, "n" = explicit natural */
  cellA: string[];
  cellB: string[] | null;
  tags: string[];
}

export const HTPB_PATTERNS: HtpbPattern[] = [
  {
    id: "D1",
    order: 1,
    originalChord: "Dm7",
    cellA: ["A5", "G5", "F5", "E5"],
    cellB: ["F5", "G5", "A5", "Bb5"],
    tags: ["changement-de-direction", "mouvement-conjoint", "descendant-puis-ascendant"],
  },
  {
    id: "D2",
    order: 2,
    originalChord: "Dm7",
    cellA: ["A5", "G5", "F5", "E5"],
    cellB: ["D5", "E5", "F5", "G5"],
    tags: ["changement-de-direction", "mouvement-conjoint", "saut-entre-cellules"],
  },
  {
    id: "D3",
    order: 3,
    originalChord: "Dm7",
    cellA: ["F5", "E5", "D5", "C#5"],
    cellB: ["Cn5", "D5", "E5", "F5"],
    tags: ["jonction-chromatique", "C♯→C", "changement-de-direction"],
  },
  {
    id: "D4",
    order: 4,
    originalChord: "Dm7",
    cellA: ["E5", "D5", "C5", "B4"],
    cellB: ["A4", "B4", "C5", "C#5"],
    tags: ["changement-de-direction", "mouvement-conjoint", "arrivée-chromatique"],
  },
  {
    id: "D5",
    order: 5,
    originalChord: "Dm7",
    cellA: ["D5", "C5", "Bb4", "A4"],
    cellB: ["B4", "C5", "D5", "E5"],
    tags: ["changement-de-direction", "mouvement-conjoint", "Bb-diatonique-au-document"],
  },
  {
    id: "G1",
    order: 6,
    originalChord: "G7",
    cellA: ["F5", "E5", "D5", "C5"],
    cellB: ["B4", "C5", "D5", "E5"],
    tags: ["changement-de-direction", "mouvement-conjoint", "saut-entre-cellules"],
  },
  {
    id: "G2",
    order: 7,
    originalChord: "G7",
    cellA: ["D5", "C5", "B4", "A4"],
    cellB: ["G4", "A4", "B4", "C5"],
    tags: ["changement-de-direction", "mouvement-conjoint"],
  },
  {
    id: "G3",
    order: 8,
    originalChord: "G7",
    cellA: ["B4", "A4", "G4", "F#4"],
    cellB: ["Fn4", "G4", "A4", "Bb4"],
    tags: ["jonction-chromatique", "F♯→F", "changement-de-direction"],
  },
  {
    id: "G4",
    order: 9,
    originalChord: "G7",
    cellA: ["A4", "G4", "F4", "E4"],
    cellB: ["D4", "E4", "F4", "F#4"],
    tags: ["changement-de-direction", "arrivée-chromatique", "F♯"],
  },
  {
    id: "G5",
    order: 10,
    originalChord: "G7",
    cellA: ["F4", "E4", "D4", "C4"],
    cellB: null,
    tags: ["cellule-isolée", "cadence", "mouvement-conjoint"],
  },
  {
    id: "C1",
    order: 11,
    originalChord: "C7",
    cellA: ["A5", "G5", "F5", "E5"],
    cellB: ["D5", "E5", "F5", "G5"],
    tags: ["changement-de-direction", "mouvement-conjoint", "saut-entre-cellules"],
  },
  {
    id: "C2",
    order: 12,
    originalChord: "C7",
    cellA: ["F5", "E5", "D5", "C5"],
    cellB: ["B4", "C5", "D5", "E5"],
    tags: ["changement-de-direction", "mouvement-conjoint"],
  },
  {
    id: "C3",
    order: 13,
    originalChord: "C7",
    cellA: ["A4", "G4", "F#4", "Fn4"],
    cellB: ["E4", "F4", "G4", "A4"],
    tags: ["jonction-chromatique", "F♯→F", "descente-puis-montée"],
  },
];

export function pitchesOfCell(tokens: string[]): SpelledPitch[] {
  return tokens.map((t) => {
    const explicitNatural = /n|♮/.test(t);
    const p = parseNote(t.replace("n", "").replace("♮", ""));
    return explicitNatural ? { ...p, acc: 0 } : p;
  });
}

export function cellHasExplicitNatural(tokens: string[]): boolean[] {
  return tokens.map((t) => /n|♮/.test(t));
}

export function analyzePattern(p: HtpbPattern) {
  const a = pitchesOfCell(p.cellA);
  const b = p.cellB ? pitchesOfCell(p.cellB) : [];
  const join =
    b.length > 0 ? isSemitoneApart(a[a.length - 1]!, b[0]!) : false;
  return {
    contourA: contourOf(a),
    contourB: b.length ? contourOf(b) : null,
    conjunctA: allConjunct(a),
    conjunctB: b.length ? allConjunct(b) : null,
    chromaticJoin: join,
    singleCell: p.cellB === null,
  };
}

export const BY_CHORD = {
  Dm7: HTPB_PATTERNS.filter((p) => p.originalChord === "Dm7"),
  G7: HTPB_PATTERNS.filter((p) => p.originalChord === "G7"),
  C7: HTPB_PATTERNS.filter((p) => p.originalChord === "C7"),
} as const;

export const CHORDS = ["Dm7", "G7", "C7"] as const;
