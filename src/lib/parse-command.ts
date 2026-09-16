import { parseKey } from "./music";
import type { Difficulty, GenRequest, LarsenExercise } from "./types";

const DEFAULT_REQUEST: GenRequest = {
  method: "HTPB10",
  difficulty: 1,
  key: "auto",
  exercise: "auto",
  durationMin: null,
};

export function parseCommand(raw: string, fallback: Partial<GenRequest> = {}): GenRequest {
  const t = raw.trim();
  const out: GenRequest = {
    ...DEFAULT_REQUEST,
    ...fallback,
  };
  if (!t) return out;

  if (/htpb10/i.test(t)) out.method = "HTPB10";
  else if (/larsen/i.test(t)) out.method = "Larsen";

  const diff = t.match(/difficult[eé]\s*([123])/i) || t.match(/\bL([123])\b/);
  if (diff) out.difficulty = Number(diff[1]) as Difficulty;

  const ex = t.match(/#\s*([1-5])/);
  if (ex) {
    out.method = "Larsen";
    out.exercise = Number(ex[1]) as LarsenExercise;
  }

  const keyMatch = t.match(/\bkey\s+([A-G](?:[#b♯♭])?)\b/i);
  if (keyMatch) {
    const k = parseKey(keyMatch[1]!.replace("♯", "#").replace("♭", "b"));
    if (k) out.key = k.id;
  }

  const dur = t.match(/dur[ée]e\s*(\d+)/i);
  if (dur) out.durationMin = Number(dur[1]);

  return out;
}
