import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CesfUo57.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var LETTERS = [
	"C",
	"D",
	"E",
	"F",
	"G",
	"A",
	"B"
];
var LETTER_PC = [
	0,
	2,
	4,
	5,
	7,
	9,
	11
];
var KEYS = [
	{
		id: "C",
		letter: 0,
		acc: 0
	},
	{
		id: "G",
		letter: 4,
		acc: 0
	},
	{
		id: "D",
		letter: 1,
		acc: 0
	},
	{
		id: "A",
		letter: 5,
		acc: 0
	},
	{
		id: "E",
		letter: 2,
		acc: 0
	},
	{
		id: "B",
		letter: 6,
		acc: 0
	},
	{
		id: "F#",
		letter: 3,
		acc: 1
	},
	{
		id: "Db",
		letter: 1,
		acc: -1
	},
	{
		id: "Ab",
		letter: 5,
		acc: -1
	},
	{
		id: "Eb",
		letter: 2,
		acc: -1
	},
	{
		id: "Bb",
		letter: 6,
		acc: -1
	},
	{
		id: "F",
		letter: 3,
		acc: 0
	},
	{
		id: "Gb",
		letter: 4,
		acc: -1
	},
	{
		id: "C#",
		letter: 0,
		acc: 1
	}
];
var COMMON_KEYS_L1 = [
	"F",
	"G",
	"D",
	"Bb",
	"A",
	"Eb"
];
var COMMON_KEYS_L2 = [
	"F",
	"G",
	"D",
	"Bb",
	"A",
	"Eb",
	"E",
	"Ab"
];
var COMMON_KEYS_L3 = [
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
	"Gb"
];
var LETTER_INDEX = {
	C: 0,
	D: 1,
	E: 2,
	F: 3,
	G: 4,
	A: 5,
	B: 6
};
function pcOf(p) {
	return ((LETTER_PC[p.letter] + p.acc) % 12 + 12) % 12;
}
function midiOf(p) {
	return (p.octave + 1) * 12 + pcOf(p);
}
function keyPc(k) {
	return pcOf({
		letter: k.letter,
		acc: k.acc
	});
}
function parseKey(raw) {
	const t = raw.trim().replace("♯", "#").replace("♭", "b");
	return KEYS.find((k) => k.id.toLowerCase() === t.toLowerCase()) ?? null;
}
function mustKey(id) {
	const k = parseKey(id);
	if (!k) throw new Error(`Unknown key ${id}`);
	return k;
}
/** Parse "A5", "Bb4", "C#5", "Cn5" (explicit natural), "F♮4". */
function parseNote(token) {
	const m = token.trim().match(/^([A-G])([#b♯♭n♮]?)(\d)$/);
	if (!m) throw new Error(`Bad note token: ${token}`);
	const letter = LETTER_INDEX[m[1]];
	const accRaw = m[2] ?? "";
	return {
		letter,
		acc: accRaw === "#" || accRaw === "♯" ? 1 : accRaw === "b" || accRaw === "♭" ? -1 : 0,
		octave: Number(m[3])
	};
}
function formatAcc(acc, forceNatural = false) {
	if (acc === 1) return "♯";
	if (acc === -1) return "♭";
	if (acc === 2) return "𝄪";
	if (acc === -2) return "𝄫";
	return forceNatural ? "♮" : "";
}
function formatPitch(p, forceNatural = false) {
	return `${LETTERS[p.letter]}${formatAcc(p.acc, forceNatural)}`;
}
/**
* Transpose from C-reference by the letter + semitone span of destination key.
* Preserves chromatic vs diatonic spelling (C♯ stays a sharp of the same letter degree).
*/
function transposeFromC(p, dest) {
	const letterShift = dest.letter;
	const pcShift = keyPc(dest);
	const newLetter = (p.letter + letterShift) % 7;
	const newPc = (pcOf(p) + pcShift) % 12;
	let acc = newPc - LETTER_PC[newLetter];
	if (acc > 2) acc -= 12;
	if (acc < -2) acc += 12;
	const midi = midiOf(p) + pcShift;
	const octave = Math.floor((midi - newPc) / 12) - 1;
	return {
		letter: newLetter,
		acc,
		octave
	};
}
function semitonesCto(dest) {
	return keyPc(dest);
}
function describeInterval(dest) {
	const n = semitonesCto(dest);
	const up = n;
	const down = (12 - n) % 12;
	if (n === 0) return "C → C : 0 demi-ton";
	if (n <= 6) return `C → ${dest.id} : +${up} demi-ton${up > 1 ? "s" : ""}`;
	return `C → ${dest.id} : −${down} demi-ton${down > 1 ? "s" : ""} / +${up} demi-tons`;
}
function parseChord(symbol) {
	const m = symbol.trim().match(/^([A-G])([#b♯♭]?)(.*)$/);
	if (!m) throw new Error(`Bad chord: ${symbol}`);
	const letter = LETTER_INDEX[m[1]];
	const accRaw = m[2] ?? "";
	return {
		rootLetter: letter,
		rootAcc: accRaw === "#" || accRaw === "♯" ? 1 : accRaw === "b" || accRaw === "♭" ? -1 : 0,
		quality: (m[3] ?? "").trim()
	};
}
function formatChord(root, quality) {
	return `${formatPitch(root)}${quality}`;
}
function transposeChordFromC(symbol, dest) {
	const { rootLetter, rootAcc, quality } = parseChord(symbol);
	return formatChord(transposeFromC({
		letter: rootLetter,
		acc: rootAcc,
		octave: 4
	}, dest), quality);
}
var MAJOR_INTERVALS = [
	0,
	2,
	4,
	5,
	7,
	9,
	11
];
function majorScale(key, startOctave = 4) {
	const rootPc = keyPc(key);
	let prevLetter = key.letter;
	let octave = startOctave;
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((i) => {
		const letter = (key.letter + i) % 7;
		if (i > 0 && letter <= prevLetter) octave += 1;
		prevLetter = letter;
		let acc = (rootPc + MAJOR_INTERVALS[i]) % 12 - LETTER_PC[letter];
		if (acc > 2) acc -= 12;
		if (acc < -2) acc += 12;
		return {
			letter,
			acc,
			octave
		};
	});
}
var TRIAD_QUALITIES = [
	"",
	"m",
	"m",
	"",
	"",
	"m",
	"dim"
];
var SEVENTH_QUALITIES = [
	"maj7",
	"m7",
	"m7",
	"maj7",
	"7",
	"m7",
	"ø"
];
function diatonicThirds(scale) {
	return scale.map((n, i) => {
		const upper = scale[(i + 2) % 7];
		const pitched = { ...upper };
		if (i + 2 >= 7) pitched.octave = upper.octave + 1;
		else if (midiOf(upper) < midiOf(n)) pitched.octave = upper.octave + 1;
		return [n, pitched];
	});
}
function stack(scale, degree, steps) {
	return steps.map((s) => {
		const idx = degree + s;
		const octAdd = Math.floor(idx / 7);
		const note = scale[(idx % 7 + 7) % 7];
		let octave = note.octave + octAdd;
		const proto = {
			...note,
			octave
		};
		if (s > 0 && midiOf(proto) < midiOf({
			...scale[degree],
			octave: scale[degree].octave
		})) octave += 1;
		return {
			...note,
			octave
		};
	});
}
function triad(scale, degree) {
	return stack(scale, degree, [
		0,
		2,
		4
	]);
}
function seventh(scale, degree) {
	return stack(scale, degree, [
		0,
		2,
		4,
		6
	]);
}
function chordTonesOf(quality, root) {
	return (quality === "maj7" ? [
		[
			0,
			0,
			"1"
		],
		[
			2,
			4,
			"3"
		],
		[
			4,
			7,
			"5"
		],
		[
			6,
			11,
			"7"
		]
	] : quality === "7" ? [
		[
			0,
			0,
			"1"
		],
		[
			2,
			4,
			"3"
		],
		[
			4,
			7,
			"5"
		],
		[
			6,
			10,
			"b7"
		]
	] : quality === "m7" ? [
		[
			0,
			0,
			"1"
		],
		[
			2,
			3,
			"b3"
		],
		[
			4,
			7,
			"5"
		],
		[
			6,
			10,
			"b7"
		]
	] : [
		[
			0,
			0,
			"1"
		],
		[
			2,
			3,
			"b3"
		],
		[
			4,
			6,
			"b5"
		],
		[
			6,
			10,
			"b7"
		]
	]).map(([letterSpan, semitones, role]) => {
		const letter = (root.letter + letterSpan) % 7;
		let acc = (pcOf(root) + semitones) % 12 - LETTER_PC[letter];
		if (acc > 2) acc -= 12;
		if (acc < -2) acc += 12;
		let octave = root.octave;
		if (letterSpan > 0 && midiOf({
			letter,
			acc,
			octave
		}) < midiOf(root)) octave += 1;
		return {
			role,
			note: {
				letter,
				acc,
				octave
			}
		};
	});
}
function isSemitoneApart(a, b) {
	return Math.abs(midiOf(a) - midiOf(b)) === 1;
}
function contourOf(notes) {
	if (notes.length < 2) return "flat";
	const diffs = notes.slice(1).map((n, i) => midiOf(n) - midiOf(notes[i]));
	const up = diffs.every((d) => d > 0);
	const down = diffs.every((d) => d < 0);
	if (up) return "up";
	if (down) return "down";
	if (diffs.every((d) => d === 0)) return "flat";
	return "mixed";
}
function allConjunct(notes) {
	for (let i = 1; i < notes.length; i++) if (Math.abs(midiOf(notes[i]) - midiOf(notes[i - 1])) > 2) return false;
	return true;
}
/** Standard tuning, string 0 = high E. */
var OPEN_MIDI = [
	64,
	59,
	55,
	50,
	45,
	40
];
var STRING_NAMES = [
	"e",
	"B",
	"G",
	"D",
	"A",
	"E"
];
function findFingering(midis, maxFret = 19) {
	const cands = midis.map((m) => {
		const out = [];
		for (let s = 0; s < 6; s++) {
			const f = m - OPEN_MIDI[s];
			if (f >= 0 && f <= maxFret) out.push({
				string: s,
				fret: f
			});
		}
		return out;
	});
	if (cands.some((c) => c.length === 0)) {
		const shifted = midis.map((m) => m - 12);
		if (shifted.every((m) => m >= 40)) return findFingering(shifted, maxFret);
		return null;
	}
	let best = null;
	let bestScore = Infinity;
	const rec = (i, acc, minF, maxF) => {
		if (maxF - minF > 5) return;
		if (i === cands.length) {
			const stretch = maxF - minF;
			let jumps = 0;
			for (let j = 1; j < acc.length; j++) jumps += Math.abs(acc[j].string - acc[j - 1].string);
			const score = stretch * 8 + jumps;
			if (score < bestScore) {
				bestScore = score;
				best = acc.slice();
			}
			return;
		}
		for (const c of cands[i]) {
			if (i > 0 && Math.abs(c.string - acc[i - 1].string) > 2) continue;
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
function verifyFingering(midis, fingering) {
	if (midis.length !== fingering.length) return false;
	return fingering.every((p, i) => OPEN_MIDI[p.string] + p.fret === midis[i]);
}
/** Shell: root on 6th (index 5) + 7th on D (3) + 3rd on G (2). */
function shellSixthRoot(root, third, seventh) {
	const rootMidiCandidates = [midiOf({
		...root,
		octave: 2
	}), midiOf({
		...root,
		octave: 3
	})];
	for (const rMidi of rootMidiCandidates) {
		const rFret = rMidi - 40;
		if (rFret < 0 || rFret > 15) continue;
		const sevOptions = [midiOf({
			...seventh,
			octave: 3
		}), midiOf({
			...seventh,
			octave: 4
		})];
		const thiOptions = [midiOf({
			...third,
			octave: 3
		}), midiOf({
			...third,
			octave: 4
		})];
		for (const sMidi of sevOptions) {
			const sFret = sMidi - 50;
			if (sFret < 0 || sFret > 19) continue;
			if (Math.abs(sFret - rFret) > 4) continue;
			for (const tMidi of thiOptions) {
				const tFret = tMidi - 55;
				if (tFret < 0 || tFret > 19) continue;
				if (Math.abs(tFret - rFret) > 4) continue;
				const pos = [
					{
						string: 5,
						fret: rFret
					},
					{
						string: 3,
						fret: sFret
					},
					{
						string: 2,
						fret: tFret
					}
				];
				if (verifyFingering([
					rMidi,
					sMidi,
					tMidi
				], pos)) return pos;
			}
		}
	}
	return null;
}
/** Shell: root on 5th (index 4) + 7th on G (2) + 3rd on B (1). */
function shellFifthRoot(root, third, seventh) {
	const rootMidiCandidates = [midiOf({
		...root,
		octave: 2
	}), midiOf({
		...root,
		octave: 3
	})];
	for (const rMidi of rootMidiCandidates) {
		const rFret = rMidi - 45;
		if (rFret < 0 || rFret > 15) continue;
		const sevOptions = [midiOf({
			...seventh,
			octave: 3
		}), midiOf({
			...seventh,
			octave: 4
		})];
		const thiOptions = [midiOf({
			...third,
			octave: 3
		}), midiOf({
			...third,
			octave: 4
		})];
		for (const sMidi of sevOptions) {
			const sFret = sMidi - 55;
			if (sFret < 0 || sFret > 19) continue;
			if (Math.abs(sFret - rFret) > 4) continue;
			for (const tMidi of thiOptions) {
				const tFret = tMidi - 59;
				if (tFret < 0 || tFret > 19) continue;
				if (Math.abs(tFret - rFret) > 4) continue;
				const pos = [
					{
						string: 4,
						fret: rFret
					},
					{
						string: 2,
						fret: sFret
					},
					{
						string: 1,
						fret: tFret
					}
				];
				if (verifyFingering([
					rMidi,
					sMidi,
					tMidi
				], pos)) return pos;
			}
		}
	}
	return null;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function pickOne(rng, items, avoid) {
	const pool = avoid?.length ? items.filter((x) => !avoid.includes(x)) : [...items];
	const list = pool.length ? pool : [...items];
	return list[Math.floor(rng() * list.length)];
}
function pickN(rng, items, n) {
	const copy = [...items];
	const out = [];
	while (out.length < n && copy.length) {
		const i = Math.floor(rng() * copy.length);
		out.push(copy.splice(i, 1)[0]);
	}
	return out;
}
function pad2(n) {
	return String(n).padStart(2, "0");
}
/**
* Canonical HTPB10 tetrachord patterns transcribed from Htpb1O.pdf.
* Notes, accidentals, directions and cell splits are taken from the score.
* Do not invent, "correct", or diatonicize this material.
*/
var HTPB_PATTERNS = [
	{
		id: "D1",
		order: 1,
		originalChord: "Dm7",
		cellA: [
			"A5",
			"G5",
			"F5",
			"E5"
		],
		cellB: [
			"F5",
			"G5",
			"A5",
			"Bb5"
		],
		tags: [
			"changement-de-direction",
			"mouvement-conjoint",
			"descendant-puis-ascendant"
		]
	},
	{
		id: "D2",
		order: 2,
		originalChord: "Dm7",
		cellA: [
			"A5",
			"G5",
			"F5",
			"E5"
		],
		cellB: [
			"D5",
			"E5",
			"F5",
			"G5"
		],
		tags: [
			"changement-de-direction",
			"mouvement-conjoint",
			"saut-entre-cellules"
		]
	},
	{
		id: "D3",
		order: 3,
		originalChord: "Dm7",
		cellA: [
			"F5",
			"E5",
			"D5",
			"C#5"
		],
		cellB: [
			"Cn5",
			"D5",
			"E5",
			"F5"
		],
		tags: [
			"jonction-chromatique",
			"C♯→C",
			"changement-de-direction"
		]
	},
	{
		id: "D4",
		order: 4,
		originalChord: "Dm7",
		cellA: [
			"E5",
			"D5",
			"C5",
			"B4"
		],
		cellB: [
			"A4",
			"B4",
			"C5",
			"C#5"
		],
		tags: [
			"changement-de-direction",
			"mouvement-conjoint",
			"arrivée-chromatique"
		]
	},
	{
		id: "D5",
		order: 5,
		originalChord: "Dm7",
		cellA: [
			"D5",
			"C5",
			"Bb4",
			"A4"
		],
		cellB: [
			"B4",
			"C5",
			"D5",
			"E5"
		],
		tags: [
			"changement-de-direction",
			"mouvement-conjoint",
			"Bb-diatonique-au-document"
		]
	},
	{
		id: "G1",
		order: 6,
		originalChord: "G7",
		cellA: [
			"F5",
			"E5",
			"D5",
			"C5"
		],
		cellB: [
			"B4",
			"C5",
			"D5",
			"E5"
		],
		tags: [
			"changement-de-direction",
			"mouvement-conjoint",
			"saut-entre-cellules"
		]
	},
	{
		id: "G2",
		order: 7,
		originalChord: "G7",
		cellA: [
			"D5",
			"C5",
			"B4",
			"A4"
		],
		cellB: [
			"G4",
			"A4",
			"B4",
			"C5"
		],
		tags: ["changement-de-direction", "mouvement-conjoint"]
	},
	{
		id: "G3",
		order: 8,
		originalChord: "G7",
		cellA: [
			"B4",
			"A4",
			"G4",
			"F#4"
		],
		cellB: [
			"Fn4",
			"G4",
			"A4",
			"Bb4"
		],
		tags: [
			"jonction-chromatique",
			"F♯→F",
			"changement-de-direction"
		]
	},
	{
		id: "G4",
		order: 9,
		originalChord: "G7",
		cellA: [
			"A4",
			"G4",
			"F4",
			"E4"
		],
		cellB: [
			"D4",
			"E4",
			"F4",
			"F#4"
		],
		tags: [
			"changement-de-direction",
			"arrivée-chromatique",
			"F♯"
		]
	},
	{
		id: "G5",
		order: 10,
		originalChord: "G7",
		cellA: [
			"F4",
			"E4",
			"D4",
			"C4"
		],
		cellB: null,
		tags: [
			"cellule-isolée",
			"cadence",
			"mouvement-conjoint"
		]
	},
	{
		id: "C1",
		order: 11,
		originalChord: "C7",
		cellA: [
			"A5",
			"G5",
			"F5",
			"E5"
		],
		cellB: [
			"D5",
			"E5",
			"F5",
			"G5"
		],
		tags: [
			"changement-de-direction",
			"mouvement-conjoint",
			"saut-entre-cellules"
		]
	},
	{
		id: "C2",
		order: 12,
		originalChord: "C7",
		cellA: [
			"F5",
			"E5",
			"D5",
			"C5"
		],
		cellB: [
			"B4",
			"C5",
			"D5",
			"E5"
		],
		tags: ["changement-de-direction", "mouvement-conjoint"]
	},
	{
		id: "C3",
		order: 13,
		originalChord: "C7",
		cellA: [
			"A4",
			"G4",
			"F#4",
			"Fn4"
		],
		cellB: [
			"E4",
			"F4",
			"G4",
			"A4"
		],
		tags: [
			"jonction-chromatique",
			"F♯→F",
			"descente-puis-montée"
		]
	}
];
function pitchesOfCell(tokens) {
	return tokens.map((t) => {
		const explicitNatural = /n|♮/.test(t);
		const p = parseNote(t.replace("n", "").replace("♮", ""));
		return explicitNatural ? {
			...p,
			acc: 0
		} : p;
	});
}
function cellHasExplicitNatural(tokens) {
	return tokens.map((t) => /n|♮/.test(t));
}
function analyzePattern(p) {
	const a = pitchesOfCell(p.cellA);
	const b = p.cellB ? pitchesOfCell(p.cellB) : [];
	const join = b.length > 0 ? isSemitoneApart(a[a.length - 1], b[0]) : false;
	return {
		contourA: contourOf(a),
		contourB: b.length ? contourOf(b) : null,
		conjunctA: allConjunct(a),
		conjunctB: b.length ? allConjunct(b) : null,
		chromaticJoin: join,
		singleCell: p.cellB === null
	};
}
HTPB_PATTERNS.filter((p) => p.originalChord === "Dm7"), HTPB_PATTERNS.filter((p) => p.originalChord === "G7"), HTPB_PATTERNS.filter((p) => p.originalChord === "C7");
function stepsOf(p) {
	return p.octave * 7 + p.letter;
}
function played(tokens, dest) {
	const naturals = cellHasExplicitNatural(tokens);
	const src = pitchesOfCell(tokens);
	const notes = dest ? src.map((p) => transposeFromC(p, dest)) : src;
	return {
		tokens,
		display: notes.map((p, i) => formatPitch(p, naturals[i])),
		forceNatural: naturals,
		midis: notes.map(midiOf),
		steps: notes.map(stepsOf)
	};
}
function viewOf(p, dest) {
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
		fingering
	};
}
function chooseKey$1(difficulty, rng, recent) {
	return pickOne(rng, difficulty === 1 ? COMMON_KEYS_L1 : difficulty === 2 ? COMMON_KEYS_L2 : COMMON_KEYS_L3, recent);
}
function choosePatterns(difficulty, rng) {
	const dm = HTPB_PATTERNS.filter((p) => p.originalChord === "Dm7");
	const g7 = HTPB_PATTERNS.filter((p) => p.originalChord === "G7");
	const c7 = HTPB_PATTERNS.filter((p) => p.originalChord === "C7");
	if (difficulty === 1) {
		const family = pickOne(rng, [
			dm,
			g7,
			c7
		]);
		return pickN(rng, family, Math.min(2, family.length)).sort((a, b) => a.order - b.order);
	}
	if (difficulty === 2) {
		const families = pickN(rng, [
			dm,
			g7,
			c7
		], 2);
		const a = pickN(rng, families[0], 2);
		const b = pickN(rng, families[1], 2);
		return [...a, ...b].sort((a, b) => a.order - b.order);
	}
	const d = pickN(rng, dm, 2);
	const g = pickN(rng, g7.filter((p) => p.cellB), 2);
	const c = pickN(rng, c7, Math.min(2, c7.length));
	return [
		...d,
		...g,
		...c
	].sort((a, b) => a.order - b.order);
}
function trainingText(patterns, dest, difficulty) {
	const analyses = patterns.map(analyzePattern);
	const chromatic = patterns.filter((_, i) => analyses[i].chromaticJoin);
	const dirChange = patterns.filter((_, i) => {
		const a = analyses[i];
		return a.contourA === "down" && a.contourB === "up";
	});
	const chords = [...new Set(patterns.map((p) => p.originalChord))];
	const bits = [];
	if (dirChange.length) bits.push(`Les cellules ${dirChange.map((p) => p.id).join(", ")} inversent la direction : une descente de quatre notes, puis une montée. La main apprend une courbe, pas une collection.`);
	if (chromatic.length) {
		const joins = chromatic.map((p) => p.tags.find((t) => t.includes("→")) ?? "jonction chromatique").join(", ");
		bits.push(`Les jonctions ${joins} doivent rester chromatiques après transposition vers ${dest.id}. Ne les « range » pas dans la gamme.`);
	}
	if (patterns.some((p) => p.cellB === null)) bits.push(`Une cellule isolée sert d’ancrage : quatre notes tenues comme une seule unité, sans enchaînement.`);
	if (difficulty >= 2 && chords.length > 1) bits.push(`Tu enchaînes ${chords.map((c) => transposeChordFromC(c, dest)).join(" / ")}. Le chunking doit survivre au changement d’accord : cellule A → cellule B sans reconstruire chaque note.`);
	if (difficulty === 3) bits.push(`L’enjeu n’est plus d’apprendre un pattern : c’est de conserver l’identité exacte de chaque cellule pendant que l’harmonie et le registre bougent.`);
	if (!bits.length) bits.push(`Quatre notes = une unité. Tu réduis la charge cognitive du mouvement conjoint jusqu’à pouvoir démarrer la cellule sans la recalculer.`);
	return bits.join(" ");
}
function execution(difficulty, durationMin) {
	const steps = [
		"Isoler la cellule A. La répéter jusqu’à ce qu’elle parte d’un geste, pas d’un décompte.",
		"Isoler la cellule B de la même façon.",
		"Les connecter : dernière note de A → première note de B, sans pause. Écouter la jonction.",
		"Jouer le pattern complet en croches régulières (♩ = 90 dans le document). Continuité avant vitesse."
	];
	if (difficulty >= 2) steps.push("Enchaîner deux patterns sans s’arrêter. Comparer les deux chemins moteurs.");
	if (difficulty === 3) steps.push("Traverser les changements d’accord en gardant le même découpage cellulaire. Si une cellule se déforme, revenir à l’isolation.");
	steps.push("Option : déplacer le pattern d’une octave, ou d’une position, sans changer les notes.");
	if (durationMin) steps.push(`Reste dans cette séance environ ${durationMin} minutes. Pas de deuxième exercice.`);
	return steps;
}
var SUCCESS_HTPB = [
	"Tu démarres chaque cellule sans reconstruire ses quatre notes.",
	"Le contour (descente / montée) est reconnaissable à l’oreille, même lent.",
	"Les jonctions chromatiques restent chromatiques — aucune note « corrigée ».",
	"Le flux de croches est continu : l’hésitation a disparu, pas nécessairement la lenteur."
];
var TRANSFER$1 = "Reviens sur le standard actuellement travaillé et joue librement quelques minutes. N’essaie pas de placer volontairement tous les patterns. Observe simplement si l’une des nouvelles trajectoires devient disponible.";
function generateHtpb(opts) {
	const rng = mulberry32(opts.seed);
	const dest = mustKey(opts.key === "auto" ? chooseKey$1(opts.difficulty, rng, opts.recentKeys) : opts.key);
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
		transfer: TRANSFER$1,
		seed: opts.seed,
		createdAt: Date.now()
	};
}
var NAMES = {
	1: "Melodic Harmony",
	2: "Harmony That Works / Shell Voicings",
	3: "Use The Good Notes / Chord-Tone Soloing",
	4: "Practice Improvisation Very Slowly",
	5: "Be More Melodic"
};
var REASONS = {
	1: "Construire, dans une seule région du manche, la cartographie imbriquée : gamme → tierces → triades → arpèges de septième.",
	2: "Passer d’une « shape » d’accord à une représentation compacte : fondamentale + 3e + 7e, et sentir le voice leading.",
	3: "Réduire le choix aux chord tones pour libérer l’attention : navigation harmonique, rythme, phrasé.",
	4: "Composer des petites lignes. Le critère n’est pas la vitesse : la phrase produite est-elle musicalement convaincante ?",
	5: "Faire engendrer une phrase par la précédente — développement motivique et call and response, d’abord rubato."
};
var TRANSFER = "Reviens sur le standard actuellement travaillé et joue librement quelques minutes. N’essaie pas de forcer le matériau. Observe s’il devient disponible.";
function chooseKey(difficulty, rng, recent) {
	return pickOne(rng, difficulty === 1 ? COMMON_KEYS_L1 : difficulty === 2 ? COMMON_KEYS_L2 : COMMON_KEYS_L3, recent);
}
function chooseExercises(requested, difficulty, rng, last) {
	if (requested !== "auto") {
		if (difficulty === 3) return [requested, {
			1: 3,
			2: 3,
			3: 4,
			4: 5,
			5: 4
		}[requested]];
		return [requested];
	}
	if (difficulty === 3) return pickOne(rng, [
		[1, 3],
		[3, 4],
		[4, 5],
		[2, 3]
	]);
	return [pickOne(rng, [
		1,
		2,
		3,
		4,
		5
	], last ? [last] : [])];
}
function scaleNotes(key) {
	return majorScale(key, 4);
}
function nameTriad(scale, i) {
	const q = TRIAD_QUALITIES[i];
	return `${formatPitch(scale[i])}${q}`;
}
function nameSeventh(scale, i) {
	const q = SEVENTH_QUALITIES[i];
	return formatChord(scale[i], q);
}
function turnaround(key) {
	const scale = scaleNotes(key);
	const I = scale[0];
	const VI = scale[5];
	const ii = scale[1];
	const V = scale[4];
	return [
		{
			roman: "Imaj7",
			chord: formatChord(I, "maj7"),
			quality: "maj7",
			root: I
		},
		{
			roman: "VI7",
			chord: formatChord(VI, "7"),
			quality: "7",
			root: VI
		},
		{
			roman: "ii7",
			chord: formatChord(ii, "m7"),
			quality: "m7",
			root: ii
		},
		{
			roman: "V7",
			chord: formatChord(V, "7"),
			quality: "7",
			root: V
		}
	];
}
function shellsForKey(key) {
	const scale = scaleNotes(key);
	const out = [];
	for (let i = 0; i < 7; i++) {
		const root = scale[i];
		const chord = nameSeventh(scale, i);
		const tones = seventh(scale, i);
		const third = tones[1];
		const sev = tones[3];
		const s6 = shellSixthRoot(root, third, sev);
		const s5 = shellFifthRoot(root, third, sev);
		out.push({
			chord,
			root: formatPitch(root),
			third: formatPitch(third),
			seventh: formatPitch(sev),
			set: "6",
			fingering: s6
		});
		out.push({
			chord,
			root: formatPitch(root),
			third: formatPitch(third),
			seventh: formatPitch(sev),
			set: "5",
			fingering: s5
		});
	}
	return out;
}
function fillExercise(session, ex, key, difficulty) {
	const scale = scaleNotes(key);
	if (ex === 1) {
		session.scale = scale.map((p) => formatPitch(p));
		session.thirds = diatonicThirds(scale).map(([a, b]) => [formatPitch(a), formatPitch(b)]);
		session.triads = scale.map((_, i) => ({
			name: nameTriad(scale, i),
			notes: triad(scale, i).map((p) => formatPitch(p))
		}));
		session.sevenths = scale.map((_, i) => ({
			name: nameSeventh(scale, i),
			notes: seventh(scale, i).map((p) => formatPitch(p))
		}));
		session.training += (session.training ? " " : "") + `Cartographier ${key.id} majeur dans une seule position : la même région contient ${session.sevenths.map((s) => s.name).join(", ")}. La main doit voir plusieurs structures imbriquées, pas une grande forme de gamme.`;
		session.execution.push("Jouer la gamme, une position, lentement.", "Enchaîner les tierces diatoniques (même position).", "Triades ascendantes, puis descendantes.", "Arpèges de septième. Retrouver chaque structure sans recalculer la gamme.");
		if (difficulty >= 2) session.execution.push("Relier deux arpèges voisins sans quitter la position.");
		session.success.push("Retrouver triades et arpèges sans recalculer entièrement la gamme.");
	}
	if (ex === 2) {
		session.shells = shellsForKey(key);
		session.progression = turnaround(key).map((t) => t.chord);
		session.training += (session.training ? " " : "") + `Un accord n’est plus une grande shape : fondamentale + 3e + 7e. Deux jeux de cordes (6e et 5e). Le déplacement le long du manche entraîne le voice leading.`;
		session.execution.push("Poser les shells à fondamentale 6e corde, diatoniques, en montant le manche.", "Même chose, fondamentale 5e corde.", `Les appliquer au turnaround ${session.progression.join(" – ")}.`, "Écouter le mouvement des 3es et des 7es d’un accord à l’autre.");
		session.success.push("Voir physiquement le mouvement des 3es et des 7es entre les accords.");
	}
	if (ex === 3) {
		const prog = turnaround(key);
		session.progression = prog.map((t) => t.chord);
		session.chordTones = prog.map((t) => ({
			chord: t.chord,
			roman: t.roman,
			tones: chordTonesOf(t.quality, t.root).map((x) => ({
				role: x.role,
				note: formatPitch(x.note)
			}))
		}));
		session.training += (session.training ? " " : "") + `Limitation temporaire : seulement les chord tones du turnaround ${session.progression.join(" – ")} (Imaj7 – VI7 – ii7 – V7). Ce n’est pas du langage bebop complet — c’est localiser immédiatement les notes importantes quand l’accord change.`;
		session.execution.push("Mémoriser les quatre notes de chaque accord.", "Improviser très simplement, une ou deux notes par temps, en suivant les changements.", "Priorité : continuité mélodique au moment où l’accord change.");
		if (difficulty >= 2) session.execution.push("Ouvrir ensuite à toutes les chord tones de la position, sans quitter le turnaround.");
		session.success.push("Suivre les changements sans perdre la continuité mélodique.");
	}
	if (ex === 4) {
		const iii = scale[2];
		const I = scale[0];
		const arp = seventh(scale, 2);
		session.compose = {
			structure: `${formatChord(iii, "m7")} sur ${formatChord(I, "maj7")}`,
			relation: "arpège depuis la tierce : 3 – 5 – 7 – 9",
			notes: arp.map((p) => formatPitch(p)),
			prompt: "Compose une petite ligne. Tu peux t’arrêter, modifier une note, changer un rythme. Relie l’arpège à un fragment chromatique, ou précède-le d’une enclosure. Le critère : la phrase te convainc-elle ?"
		};
		session.training += (session.training ? " " : "") + `Pont structure → phrase. L’arpège ${session.compose.notes.join(" ")} (${session.compose.relation}) n’est pas encore du vocabulaire : il le devient quand tu le transformes en ligne que tu as envie de rejouer.`;
		session.execution.push(`Jouer l’arpège ${session.compose.notes.join(" – ")} sur ${formatChord(I, "maj7")}.`, "Écrire (ou retenir) une phrase de 2 à 4 mesures qui l’utilise.", "Ajouter une enclosure ou un chromatisme — seulement s’il sert la phrase.", "Rejouer la phrase jusqu’à ce qu’elle tienne sans effort de calcul.");
		session.success.push("Produire une petite phrase que tu trouves réellement musicale.");
	}
	if (ex === 5) {
		const prog = turnaround(key);
		session.progression = prog.map((t) => t.chord);
		session.melodic = {
			constraint: difficulty === 1 ? "3 notes par accord, rubato." : "3 à 5 notes par accord. Motivic development, puis call and response.",
			prompt: `Progression ${prog.map((t) => t.chord).join(" – ")}. Joue une petite phrase. Écoute. La suivante doit avoir une relation perceptible avec la première — même contour, même rythme, ou réponse. À un moment approprié, réponds par une idée différente.`
		};
		session.training += (session.training ? " " : "") + `Le problème n’est plus « quelles notes ? » mais « comment une phrase engendre-t-elle la suivante ? ». Continuité du discours, pas densité d’information.`;
		session.execution.push("Rubato. Phrase 1 sur le premier accord. S’arrêter. Écouter.", "Phrase 2 : même identité, adaptée à l’accord suivant (motivic) — ou réponse (call and response).", "Traverser le turnaround. Si ça se délite, réduire le nombre de notes.");
		session.success.push("Produire plusieurs phrases possédant une relation audible entre elles.");
	}
}
function generateLarsen(opts) {
	const rng = mulberry32(opts.seed);
	const dest = mustKey(opts.key === "auto" ? chooseKey(opts.difficulty, rng, opts.recentKeys) : opts.key);
	const exercises = chooseExercises(opts.exercise, opts.difficulty, rng, opts.lastExercise);
	const session = {
		kind: "Larsen",
		sessionKey: `LARSEN-${dest.id}-L${opts.difficulty}-E${exercises.join("+")}`,
		destKey: dest.id,
		difficulty: opts.difficulty,
		durationMin: opts.durationMin,
		exercises: exercises.map((n) => ({
			number: n,
			name: NAMES[n],
			reason: REASONS[n]
		})),
		training: "",
		execution: [],
		success: [],
		transfer: TRANSFER,
		seed: opts.seed,
		createdAt: Date.now()
	};
	for (const ex of exercises) fillExercise(session, ex, dest, opts.difficulty);
	if (opts.durationMin) session.execution.push(`Reste dans cette séance environ ${opts.durationMin} minutes. Pas de programme autour.`);
	return session;
}
var defaultRequest = {
	method: "HTPB10",
	difficulty: 1,
	key: "auto",
	exercise: "auto",
	durationMin: null
};
var useApp = create()(persist((set, get) => ({
	request: defaultRequest,
	session: null,
	history: [],
	serial: 1,
	setRequest: (patch) => set((s) => ({ request: {
		...s.request,
		...patch
	} })),
	generate: () => {
		const { request, serial, history } = get();
		const seed = (Date.now() ^ serial * 9973) >>> 0;
		const recentKeys = history.slice(0, 4).map((h) => h.destKey);
		const lastEx = history.find((h) => h.kind === "Larsen")?.exercises[0]?.number;
		const session = request.method === "HTPB10" ? generateHtpb({
			difficulty: request.difficulty,
			key: request.key,
			durationMin: request.durationMin,
			serial,
			seed,
			recentKeys
		}) : generateLarsen({
			difficulty: request.difficulty,
			key: request.key,
			exercise: request.exercise,
			durationMin: request.durationMin,
			serial,
			seed,
			recentKeys,
			lastExercise: lastEx
		});
		set({
			session,
			serial: serial + 1,
			history: [session, ...history].slice(0, 16)
		});
		return session;
	},
	load: (session) => set({ session }),
	clearSession: () => set({ session: null })
}), {
	name: "seance-atelier",
	partialize: (s) => ({
		request: s.request,
		session: s.session,
		history: s.history,
		serial: s.serial
	})
}));
function useHydrated() {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const done = () => setHydrated(true);
		if (useApp.persist.hasHydrated()) done();
		return useApp.persist.onFinishHydration(done);
	}, []);
	return hydrated;
}
//#endregion
export { useHydrated as a, useApp as i, STRING_NAMES as n, parseKey as r, KEYS as t };
