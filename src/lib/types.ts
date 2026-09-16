import type { FretPos } from "./music";

export type Method = "HTPB10" | "Larsen";
export type Difficulty = 1 | 2 | 3;
export type LarsenExercise = 1 | 2 | 3 | 4 | 5;

export interface GenRequest {
  method: Method;
  difficulty: Difficulty;
  key: string | "auto";
  exercise: LarsenExercise | "auto";
  durationMin: number | null;
}

export interface PlayedCell {
  tokens: string[];
  display: string[];
  forceNatural: boolean[];
  midis: number[];
  steps: number[];
}

export interface HtpbPatternView {
  id: string;
  originalChord: string;
  destChord: string;
  originalA: PlayedCell;
  originalB: PlayedCell | null;
  destA: PlayedCell;
  destB: PlayedCell | null;
  tags: string[];
  fingering: FretPos[] | null;
}

export interface HtpbSession {
  kind: "HTPB10";
  sessionKey: string;
  destKey: string;
  intervalLabel: string;
  semitones: number;
  difficulty: Difficulty;
  durationMin: number | null;
  patterns: HtpbPatternView[];
  training: string;
  execution: string[];
  success: string[];
  transfer: string;
  seed: number;
  createdAt: number;
}

export interface ShellVoicing {
  chord: string;
  root: string;
  third: string;
  seventh: string;
  set: "6" | "5";
  fingering: FretPos[] | null;
}

export interface LarsenChordTones {
  chord: string;
  roman: string;
  tones: { role: string; note: string }[];
}

export interface LarsenSession {
  kind: "Larsen";
  sessionKey: string;
  destKey: string;
  difficulty: Difficulty;
  durationMin: number | null;
  exercises: {
    number: LarsenExercise;
    name: string;
    reason: string;
  }[];
  scale?: string[];
  thirds?: [string, string][];
  triads?: { name: string; notes: string[] }[];
  sevenths?: { name: string; notes: string[] }[];
  shells?: ShellVoicing[];
  progression?: string[];
  chordTones?: LarsenChordTones[];
  compose?: {
    structure: string;
    relation: string;
    notes: string[];
    prompt: string;
  };
  melodic?: {
    constraint: string;
    prompt: string;
  };
  training: string;
  execution: string[];
  success: string[];
  transfer: string;
  seed: number;
  createdAt: number;
}

export type Session = HtpbSession | LarsenSession;
