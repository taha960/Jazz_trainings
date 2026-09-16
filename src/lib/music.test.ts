import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  describeInterval,
  formatPitch,
  majorScale,
  midiOf,
  mustKey,
  parseNote,
  seventh,
  transposeChordFromC,
  transposeFromC,
  verifyFingering,
  findFingering,
} from "./music";
import { HTPB_PATTERNS, pitchesOfCell } from "./htpb-corpus";
import { generateHtpb } from "./generate-htpb";
import { generateLarsen } from "./generate-larsen";

describe("transpose C → F (+5)", () => {
  const F = mustKey("F");
  it("C# becomes F#", () => {
    const n = transposeFromC(parseNote("C#5"), F);
    assert.equal(formatPitch(n), "F♯");
  });
  it("Bb becomes Eb", () => {
    const n = transposeFromC(parseNote("Bb4"), F);
    assert.equal(formatPitch(n), "E♭");
  });
  it("chords Dm7 G7 C7 become Gm7 C7 F7", () => {
    assert.equal(transposeChordFromC("Dm7", F), "Gm7");
    assert.equal(transposeChordFromC("G7", F), "C7");
    assert.equal(transposeChordFromC("C7", F), "F7");
  });
  it("chromatic C# → C becomes F# → F", () => {
    const a = transposeFromC(parseNote("C#5"), F);
    const b = transposeFromC(parseNote("C5"), F);
    assert.equal(formatPitch(a), "F♯");
    assert.equal(formatPitch(b), "F");
    assert.equal(Math.abs(midiOf(a) - midiOf(b)), 1);
  });
});

describe("Larsen F major", () => {
  it("scale spelling", () => {
    const s = majorScale(mustKey("F")).map((p) => formatPitch(p));
    assert.deepEqual(s, ["F", "G", "A", "B♭", "C", "D", "E"]);
  });
  it("Imaj7 arpeggio", () => {
    const s = majorScale(mustKey("F"));
    assert.deepEqual(seventh(s, 0).map((p) => formatPitch(p)), ["F", "A", "C", "E"]);
  });
});

describe("HTPB corpus", () => {
  it("has only source chords", () => {
    for (const p of HTPB_PATTERNS) {
      assert.ok(["Dm7", "G7", "C7"].includes(p.originalChord));
      assert.equal(p.cellA.length, 4);
    }
  });
  it("D3 chromatic join is a semitone", () => {
    const p = HTPB_PATTERNS.find((x) => x.id === "D3")!;
    const a = pitchesOfCell(p.cellA);
    const b = pitchesOfCell(p.cellB!);
    assert.equal(Math.abs(midiOf(a[3]!) - midiOf(b[0]!)), 1);
  });
});

describe("generators", () => {
  it("HTPB session in Ab", () => {
    const s = generateHtpb({
      difficulty: 2,
      key: "Ab",
      durationMin: 12,
      serial: 3,
      seed: 1,
      recentKeys: [],
    });
    assert.match(s.sessionKey, /^HTPB10-Ab-L2-03$/);
    assert.equal(s.patterns.length >= 2, true);
    for (const p of s.patterns) {
      if (p.fingering) {
        const midis = p.destB ? [...p.destA.midis, ...p.destB.midis] : p.destA.midis;
        assert.equal(verifyFingering(midis, p.fingering), true);
      }
    }
  });
  it("Larsen #3 turnaround in F is Fmaj7 D7 Gm7 C7", () => {
    const s = generateLarsen({
      difficulty: 1,
      key: "F",
      exercise: 3,
      durationMin: null,
      serial: 1,
      seed: 1,
      recentKeys: [],
    });
    assert.deepEqual(s.progression, ["Fmaj7", "D7", "Gm7", "C7"]);
  });
});

describe("fingering verify", () => {
  it("rejects mismatched midi", () => {
    const midis = [60, 62, 64, 65];
    const f = findFingering(midis);
    if (f) assert.equal(verifyFingering(midis, f), true);
    if (f) assert.equal(verifyFingering([60, 61, 64, 65], f), false);
  });
});
