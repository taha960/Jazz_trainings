import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as useHydrated, i as useApp, n as STRING_NAMES, r as parseKey, t as KEYS } from "./store-CesfUo57.mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Check, i as Copy, n as Play, r as Pause } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DAR0E-R7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_REQUEST = {
	method: "HTPB10",
	difficulty: 1,
	key: "auto",
	exercise: "auto",
	durationMin: null
};
function parseCommand(raw, fallback = {}) {
	const t = raw.trim();
	const out = {
		...DEFAULT_REQUEST,
		...fallback
	};
	if (!t) return out;
	if (/htpb10/i.test(t)) out.method = "HTPB10";
	else if (/larsen/i.test(t)) out.method = "Larsen";
	const diff = t.match(/difficult[eé]\s*([123])/i) || t.match(/\bL([123])\b/);
	if (diff) out.difficulty = Number(diff[1]);
	const ex = t.match(/#\s*([1-5])/);
	if (ex) {
		out.method = "Larsen";
		out.exercise = Number(ex[1]);
	}
	const keyMatch = t.match(/\bkey\s+([A-G](?:[#b♯♭])?)\b/i);
	if (keyMatch) {
		const k = parseKey(keyMatch[1].replace("♯", "#").replace("♭", "b"));
		if (k) out.key = k.id;
	}
	const dur = t.match(/dur[ée]e\s*(\d+)/i);
	if (dur) out.durationMin = Number(dur[1]);
	return out;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90",
			invert: "bg-ink text-sheet hover:bg-ink/90",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			sheet: "bg-ink text-sheet hover:bg-ink/85"
		},
		size: {
			default: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-md px-5 text-base",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var DIFFS = [
	{
		n: 1,
		label: "Acquisition",
		hint: "peu de matériau, une zone"
	},
	{
		n: 2,
		label: "Connexion",
		hint: "enchaîner sans s’arrêter"
	},
	{
		n: 3,
		label: "Intégration",
		hint: "plusieurs objets, une séance"
	}
];
var EXS = [
	{
		n: "auto",
		label: "Auto"
	},
	{
		n: 1,
		label: "#1 Harmonie"
	},
	{
		n: 2,
		label: "#2 Shells"
	},
	{
		n: 3,
		label: "#3 Chord tones"
	},
	{
		n: 4,
		label: "#4 Composer"
	},
	{
		n: 5,
		label: "#5 Mélodique"
	}
];
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 px-3.5 rounded-md text-sm font-medium transition-[background-color,color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96]", active ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted hover:text-fg"),
		children
	});
}
function Generator({ onGenerated }) {
	const { request, setRequest, generate } = useApp();
	const [cmd, setCmd] = (0, import_react.useState)("");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: ["HTPB10", "Larsen"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setRequest({ method: m }),
					className: cn("rounded-lg p-4 text-left min-h-[5.5rem] transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-out)]", request.method === m ? "bg-accent text-accent-foreground" : "bg-surface-2 text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: m === "HTPB10" ? "HTPB10" : "Larsen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-xs mt-1", request.method === m ? "opacity-70" : "text-muted"),
						children: m === "HTPB10" ? "Trajectoires · tétras" : "Coordonnées · structures"
					})]
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2",
					children: "Difficulté"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: DIFFS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
						active: request.difficulty === d.n,
						onClick: () => setRequest({ difficulty: d.n }),
						children: [
							d.n,
							" · ",
							d.label
						]
					}, d.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-faint mt-2",
					children: [DIFFS.find((d) => d.n === request.difficulty)?.hint, ". Pas la vitesse."]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2",
				children: "Tonalité"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: request.key === "auto",
					onClick: () => setRequest({ key: "auto" }),
					children: "Auto"
				}), KEYS.filter((k) => k.id !== "C#").map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: request.key === k.id,
					onClick: () => setRequest({ key: k.id }),
					children: k.id
				}, k.id))]
			})] }),
			request.method === "Larsen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2",
				children: "Exercice Larsen"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: EXS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: request.exercise === e.n,
					onClick: () => setRequest({ exercise: e.n }),
					children: e.label
				}, String(e.n)))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.65rem] uppercase tracking-[0.18em] text-muted mb-2",
				children: "Durée (facultative)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: request.durationMin === null,
					onClick: () => setRequest({ durationMin: null }),
					children: "Libre"
				}), [
					12,
					20,
					30
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					active: request.durationMin === n,
					onClick: () => setRequest({ durationMin: n }),
					children: [n, " min"]
				}, n))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "w-full h-12",
				onClick: run,
				children: "Générer la séance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: "cmd",
				className: "text-[0.65rem] uppercase tracking-[0.18em] text-muted",
				children: "Commande"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "cmd",
					value: cmd,
					onChange: (e) => setCmd(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") runCommand();
					},
					placeholder: "HTPB10 key Ab difficulté 2",
					className: "h-11 flex-1 rounded-md bg-surface-2 px-3 text-sm text-fg placeholder:text-faint outline-none ring-offset-bg focus-visible:ring-2 focus-visible:ring-ring"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: runCommand,
					children: "OK"
				})]
			})] })
		]
	});
}
/** Lightweight plucked-string voice + metronome. Browser only. */
var ctx = null;
var playing = false;
var metroTimer = null;
function getCtx() {
	if (!ctx) ctx = new AudioContext();
	return ctx;
}
async function resumeAudio() {
	const c = getCtx();
	if (c.state === "suspended") await c.resume();
}
function pluck(c, midi, time, dur, gain = .18) {
	const freq = 440 * Math.pow(2, (midi - 69) / 12);
	const osc = c.createOscillator();
	const fil = c.createBiquadFilter();
	const g = c.createGain();
	osc.type = "triangle";
	osc.frequency.setValueAtTime(freq, time);
	fil.type = "lowpass";
	fil.frequency.setValueAtTime(1200 + freq * .4, time);
	fil.frequency.exponentialRampToValueAtTime(400, time + Math.max(dur * .8, .05));
	g.gain.setValueAtTime(1e-4, time);
	g.gain.exponentialRampToValueAtTime(gain, time + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, time + dur);
	osc.connect(fil);
	fil.connect(g);
	g.connect(c.destination);
	osc.start(time);
	osc.stop(time + dur + .05);
}
function click(c, time, accent) {
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(accent ? 1400 : 900, time);
	g.gain.setValueAtTime(accent ? .08 : .045, time);
	g.gain.exponentialRampToValueAtTime(1e-4, time + .04);
	osc.connect(g);
	g.connect(c.destination);
	osc.start(time);
	osc.stop(time + .05);
}
async function playMidis(midis, bpm = 90, onStep) {
	if (!midis.length) return;
	await resumeAudio();
	const c = getCtx();
	playing = true;
	const eighth = 60 / bpm / 2;
	const start = c.currentTime + .06;
	midis.forEach((m, i) => {
		pluck(c, m, start + i * eighth, eighth * 1.6, .16);
	});
	if (onStep) midis.forEach((_, i) => {
		window.setTimeout(() => {
			if (playing) onStep(i);
		}, 60 + i * eighth * 1e3);
	});
	const total = midis.length * eighth;
	await new Promise((r) => setTimeout(r, total * 1e3 + 80));
	playing = false;
}
function stopAll() {
	playing = false;
	if (metroTimer != null) {
		window.clearInterval(metroTimer);
		metroTimer = null;
	}
}
async function startMetronome(bpm, onBeat) {
	await resumeAudio();
	const c = getCtx();
	let beat = 0;
	const interval = 60 / bpm;
	const tick = () => {
		click(c, c.currentTime, beat % 4 === 0);
		onBeat?.(beat);
		beat += 1;
	};
	tick();
	metroTimer = window.setInterval(tick, interval * 1e3);
	return () => {
		if (metroTimer != null) window.clearInterval(metroTimer);
		metroTimer = null;
	};
}
var badgeVariants = cva("inline-flex items-center rounded-pill px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "bg-surface-2 text-muted",
		ink: "bg-ink text-sheet",
		sheet: "bg-rule/40 text-ink"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function staffY(steps, e4Steps, lineGap, top) {
	const delta = steps - e4Steps;
	return top + 4 * lineGap - delta * (lineGap / 2);
}
function Staff({ cellA, cellB, activeIndex = null, className }) {
	const displays = [...cellA.display, ...cellB?.display ?? []];
	const steps = [...cellA.steps, ...cellB?.steps ?? []];
	const split = cellA.display.length;
	const e4 = 30;
	const lineGap = 10;
	const top = 22;
	const left = 36;
	const noteGap = 22;
	const width = left + displays.length * noteGap + (cellB ? 18 : 8) + 16;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${width} 92`,
		className: cn("w-full max-w-lg text-ink", className),
		role: "img",
		"aria-label": displays.join(" "),
		children: [
			[
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: 8,
				x2: width - 8,
				y1: top + i * lineGap,
				y2: top + i * lineGap,
				stroke: "currentColor",
				strokeOpacity: .28,
				strokeWidth: 1
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 12,
				y: 53.5,
				fontSize: 28,
				fontFamily: "Georgia, serif",
				fill: "currentColor",
				children: "𝄞"
			}),
			cellB ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: left + split * noteGap - 4,
				x2: left + split * noteGap - 4,
				y1: 16,
				y2: 68,
				stroke: "currentColor",
				strokeOpacity: .35,
				strokeWidth: 1,
				strokeDasharray: "2 3"
			}) : null,
			displays.map((disp, i) => {
				const y = staffY(steps[i], e4, lineGap, top);
				const x = left + i * noteGap + (cellB && i >= split ? 10 : 0);
				const acc = disp.slice(1);
				const bottomLine = 62;
				const topLine = top;
				const ledgers = [];
				if (y < topLine) for (let ly = 12; ly >= y - 1; ly -= lineGap) ledgers.push(ly);
				if (y > bottomLine) for (let ly = 72; ly <= y + 1; ly += lineGap) ledgers.push(ly);
				const active = activeIndex === i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					ledgers.map((ly) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: x - 8,
						x2: x + 8,
						y1: ly,
						y2: ly,
						stroke: "currentColor",
						strokeOpacity: .4,
						strokeWidth: 1
					}, ly)),
					acc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: x - 11,
						y: y + 4,
						fontSize: 11,
						fontFamily: "Georgia, serif",
						fill: "currentColor",
						children: acc
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: x,
						cy: y,
						rx: 5.2,
						ry: 3.7,
						transform: `rotate(-18 ${x} ${y})`,
						fill: active ? "currentColor" : "none",
						stroke: "currentColor",
						strokeWidth: 1.2
					})
				] }, i);
			})
		]
	});
}
function Neck({ fingering, className }) {
	if (!fingering?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-xs text-ink-muted", className),
		children: "Doigté laissé libre — travailler les notes, pas une box."
	});
	const frets = fingering.map((p) => p.fret);
	const minF = Math.max(0, Math.min(...frets) - 1);
	const cols = Math.min(19, Math.max(...frets, minF + 5)) - minF + 1;
	const cellW = 28;
	const cellH = 16;
	const nut = minF === 0;
	const w = 28 + cols * cellW;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${w} 110`,
		className: cn("w-full max-w-md text-ink", className),
		children: [
			STRING_NAMES.map((name, s) => {
				const y = 10 + s * cellH;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 2,
					y: y + 4,
					fontSize: 8,
					fill: "currentColor",
					opacity: .45,
					fontFamily: "ui-monospace, monospace",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 22,
					x2: w - 4,
					y1: y,
					y2: y,
					stroke: "currentColor",
					strokeOpacity: .35,
					strokeWidth: s === 0 || s === 5 ? 1.4 : 1
				})] }, name);
			}),
			Array.from({ length: cols + 1 }, (_, i) => {
				const x = 22 + i * cellW;
				const isNut = nut && i === 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: x,
					x2: x,
					y1: 10,
					y2: 90,
					stroke: "currentColor",
					strokeOpacity: isNut ? .8 : .22,
					strokeWidth: isNut ? 3 : 1
				}, i);
			}),
			fingering.map((p, i) => {
				const cx = p.fret === 0 ? 16 : 22 + (p.fret - minF - .5) * cellW;
				const y = 10 + p.string * cellH;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx,
					cy: y,
					r: 6.2,
					fill: "currentColor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: cx,
					y: y + 3,
					textAnchor: "middle",
					fontSize: 8,
					fill: "var(--color-sheet)",
					fontFamily: "ui-monospace, monospace",
					children: i + 1
				})] }, `${p.string}-${p.fret}-${i}`);
			})
		]
	});
}
function Section({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-rule/50 pt-5 mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink-muted mb-2",
			children: label
		}), children]
	});
}
function CellNotes({ notes, dim }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-display text-xl tracking-wide", dim && "text-ink-muted"),
		children: notes.join(" ")
	});
}
function PatternBlock({ p, playingId, onPlay }) {
	const busy = playingId === p.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg bg-rule/20 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-ink-muted",
							children: p.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg text-ink",
							children: p.destChord
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-ink-muted",
							children: ["← ", p.originalChord]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-rule text-ink h-9",
							onClick: () => onPlay(p, "a"),
							children: "Cellule A"
						}),
						p.destB ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-rule text-ink h-9",
							onClick: () => onPlay(p, "b"),
							children: "Cellule B"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "sheet",
							onClick: () => onPlay(p, "full"),
							"aria-label": "Jouer le pattern",
							children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-px" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] uppercase tracking-widest text-ink-muted mb-1",
				children: "Source"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellNotes, {
					notes: p.originalA.display,
					dim: true
				}), p.originalB ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-2 text-ink-muted",
					children: "|"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellNotes, {
					notes: p.originalB.display,
					dim: true
				})] }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] uppercase tracking-widest text-ink-muted mb-1",
				children: "Transposé"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellNotes, { notes: p.destA.display }), p.destB ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-2 text-ink-muted",
					children: "|"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellNotes, { notes: p.destB.display })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-xs text-ink-muted",
					children: "(cellule seule)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Staff, {
				cellA: p.destA,
				cellB: p.destB
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Neck, { fingering: p.fingering })
			})
		]
	});
}
function HtpbSheet({ session }) {
	const [playingId, setPlayingId] = (0, import_react.useState)(null);
	const [metroOn, setMetroOn] = (0, import_react.useState)(false);
	const play = async (p, which) => {
		const midis = which === "a" ? p.destA.midis : which === "b" ? p.destB?.midis ?? [] : p.destB ? [...p.destA.midis, ...p.destB.midis] : p.destA.midis;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			label: "Tonalité / transposition",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-ink",
				children: session.intervalLabel
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink-muted mt-1",
				children: [
					"Référence originale C · destination ",
					session.destKey,
					" · les altérations du document sont conservées"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			label: "Matériau source & version transposée",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					className: "border-rule text-ink",
					onClick: toggleMetro,
					children: metroOn ? "Arrêter le métronome" : "Métronome ♩ = 90"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: session.patterns.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternBlock, {
					p,
					playingId,
					onPlay: play
				}, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopySections, { session })
	] });
}
function ShellRow({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-x-3 gap-y-1 py-2 border-b border-rule/40 last:border-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-base w-20",
				children: s.chord
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-ink-muted uppercase tracking-wider w-10",
				children: s.set === "6" ? "6e" : "5e"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-sm",
				children: [
					"R ",
					s.root,
					" · 3 ",
					s.third,
					" · 7 ",
					s.seventh
				]
			}),
			s.fingering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-ink-muted ml-auto",
				children: s.fingering.map((f) => `${[
					"e",
					"B",
					"G",
					"D",
					"A",
					"E"
				][f.string]}${f.fret}`).join(" ")
			}) : null
		]
	});
}
function LarsenSheet({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			label: "Exercice choisi",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: session.exercises.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-xl text-ink",
					children: [
						"#",
						e.number,
						" — ",
						e.name
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-muted mt-1",
					children: e.reason
				})] }, e.number))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			label: "Tonalité",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-2xl text-ink",
				children: [session.destKey, " majeur"]
			}), session.progression?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-lg",
				children: session.progression.join(" – ")
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			label: "Matériau",
			children: [
				session.scale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-ink-muted mb-1",
						children: "Gamme"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: session.scale.join("  ")
					})]
				}) : null,
				session.thirds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-ink-muted mb-1",
						children: "Tierces diatoniques"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg leading-relaxed",
						children: session.thirds.map(([a, b]) => `${a}–${b}`).join("   ")
					})]
				}) : null,
				session.triads ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-ink-muted mb-2",
						children: "Triades"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-1",
						children: session.triads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink-muted",
								children: t.notes.join(" ")
							})]
						}, t.name))
					})]
				}) : null,
				session.sevenths ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-ink-muted mb-2",
						children: "Arpèges de septième"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-1",
						children: session.sevenths.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-ink-muted",
								children: t.notes.join(" ")
							})]
						}, t.name))
					})]
				}) : null,
				session.shells ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-ink-muted mb-2",
							children: "Shell voicings — fondamentale, 3e, 7e"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: session.shells.filter((s) => s.set === "6").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellRow, { s }, `6-${s.chord}`)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-ink-muted mt-4 mb-2",
							children: "Fondamentale 5e corde"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: session.shells.filter((s) => s.set === "5").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellRow, { s }, `5-${s.chord}`)) })
					]
				}) : null,
				session.chordTones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid gap-3",
					children: session.chordTones.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-rule/20 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-lg",
							children: [
								c.chord,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-ink-muted",
									children: c.roman
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm mt-1",
							children: c.tones.map((t) => `${t.note} (${t.role})`).join("   ")
						})]
					}, c.chord))
				}) : null,
				session.compose ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: session.compose.structure
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink-muted mt-1",
							children: session.compose.relation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl mt-2",
							children: session.compose.notes.join("  ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm mt-3 leading-relaxed",
							children: session.compose.prompt
						})
					]
				}) : null,
				session.melodic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: session.melodic.constraint
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm mt-2 leading-relaxed",
						children: session.melodic.prompt
					})]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopySections, { session })
	] });
}
function CopySections({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			label: "Ce que tu exerces",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.975rem] leading-relaxed text-ink",
				children: session.training
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			label: "Exécution",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2 text-[0.975rem] leading-relaxed",
				children: session.execution.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-ink-muted mt-1 w-4",
						children: [i + 1, "."]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
				}, i))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			label: "Critère de réussite",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-[0.975rem] leading-relaxed",
				children: session.success.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-ink-muted",
						children: "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
				}, i))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			label: "Transfert facultatif",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-ink-muted italic",
				children: session.transfer
			})
		})
	] });
}
function sessionText(s) {
	const lines = [
		`${s.sessionKey}`,
		`Tonalité ${s.destKey}`,
		""
	];
	if (s.kind === "HTPB10") {
		lines.push(s.intervalLabel, "", s.training, "");
		for (const p of s.patterns) lines.push(`${p.id}  ${p.originalChord} → ${p.destChord}`, `  [${p.originalA.display.join(" ")}] | [${p.originalB?.display.join(" ") ?? "—"}]`, `  [${p.destA.display.join(" ")}] | [${p.destB?.display.join(" ") ?? "—"}]`, "");
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
function SessionSheet({ session }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const copy = async () => {
		await navigator.clipboard.writeText(sessionText(session));
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "sheet-enter rounded-xl bg-sheet text-ink px-5 py-6 sm:px-8 sm:py-8 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.7rem] tracking-wider text-ink-muted",
					children: session.sessionKey
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl sm:text-4xl mt-1 tracking-tight",
					children: session.kind === "HTPB10" ? "Trajectoires" : "Coordonnées"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 mt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "ink",
							children: session.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "sheet",
							children: ["difficulté ", session.difficulty]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "sheet",
							children: session.destKey
						}),
						session.durationMin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "sheet",
							children: [session.durationMin, " min"]
						}) : null
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "border-rule text-ink",
				onClick: copy,
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copié" : "Copier"]
			})]
		}), session.kind === "HTPB10" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HtpbSheet, { session }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LarsenSheet, { session })]
	});
}
function Home() {
	const session = useApp((s) => s.session);
	const generate = useApp((s) => s.generate);
	const hydrated = useHydrated();
	const sheetRef = (0, import_react.useRef)(null);
	const shown = hydrated ? session : null;
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (!useApp.getState().session) generate();
	}, [hydrated, generate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex-1 px-5 sm:px-8 pb-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-3",
					children: "Guitare jazz · une séance à la fois"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-[2.35rem] sm:text-5xl leading-[1.08] tracking-tight",
					children: [
						"Larsen, les coordonnées.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"HTPB10, les trajectoires."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted text-[0.975rem] leading-relaxed max-w-md",
					children: "Pas un cursus. Une séance ciblée, transposée, assez précise pour être jouée tout de suite — et assez limitée pour installer un geste."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Generator, { onGenerated: () => {
						window.setTimeout(() => {
							sheetRef.current?.scrollIntoView({
								behavior: "smooth",
								block: "start"
							});
						}, 50);
					} })
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sheetRef,
				className: "min-w-0",
				children: shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionSheet, { session: shown }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border px-6 py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-fg",
						children: "Préparation de la séance…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted mt-3 max-w-sm mx-auto leading-relaxed",
						children: "Une première séance va apparaître. Tu pourras en générer une autre à tout moment."
					})]
				})
			})]
		})
	});
}
//#endregion
export { Home as component };
