import {
  COMMON_KEYS_L1,
  COMMON_KEYS_L2,
  COMMON_KEYS_L3,
  SEVENTH_QUALITIES,
  TRIAD_QUALITIES,
  chordTonesOf,
  diatonicThirds,
  formatChord,
  formatPitch,
  majorScale,
  mulberry32,
  mustKey,
  pickOne,
  seventh,
  shellFifthRoot,
  shellSixthRoot,
  triad,
  type KeyInfo,
  type SpelledPitch,
} from "./music";
import type { Difficulty, LarsenExercise, LarsenSession, ShellVoicing } from "./types";

const NAMES: Record<LarsenExercise, string> = {
  1: "Melodic Harmony",
  2: "Harmony That Works / Shell Voicings",
  3: "Use The Good Notes / Chord-Tone Soloing",
  4: "Practice Improvisation Very Slowly",
  5: "Be More Melodic",
};

const REASONS: Record<LarsenExercise, string> = {
  1: "Construire, dans une seule région du manche, la cartographie imbriquée : gamme → tierces → triades → arpèges de septième.",
  2: "Passer d’une « shape » d’accord à une représentation compacte : fondamentale + 3e + 7e, et sentir le voice leading.",
  3: "Réduire le choix aux chord tones pour libérer l’attention : navigation harmonique, rythme, phrasé.",
  4: "Composer des petites lignes. Le critère n’est pas la vitesse : la phrase produite est-elle musicalement convaincante ?",
  5: "Faire engendrer une phrase par la précédente — développement motivique et call and response, d’abord rubato.",
};

const TRANSFER =
  "Reviens sur le standard actuellement travaillé et joue librement quelques minutes. N’essaie pas de forcer le matériau. Observe s’il devient disponible.";

function chooseKey(difficulty: Difficulty, rng: () => number, recent: string[]): string {
  const pool =
    difficulty === 1 ? COMMON_KEYS_L1 : difficulty === 2 ? COMMON_KEYS_L2 : COMMON_KEYS_L3;
  return pickOne(rng, pool, recent);
}

function chooseExercises(
  requested: LarsenExercise | "auto",
  difficulty: Difficulty,
  rng: () => number,
  last?: LarsenExercise,
): LarsenExercise[] {
  if (requested !== "auto") {
    if (difficulty === 3) {
      const links: Record<LarsenExercise, LarsenExercise> = {
        1: 3,
        2: 3,
        3: 4,
        4: 5,
        5: 4,
      };
      return [requested, links[requested]];
    }
    return [requested];
  }
  if (difficulty === 3) {
    const pairs: [LarsenExercise, LarsenExercise][] = [
      [1, 3],
      [3, 4],
      [4, 5],
      [2, 3],
    ];
    return pickOne(rng, pairs);
  }
  const pool: LarsenExercise[] = [1, 2, 3, 4, 5];
  return [pickOne(rng, pool, last ? [last] : [])];
}

function scaleNotes(key: KeyInfo): SpelledPitch[] {
  return majorScale(key, 4);
}

function nameTriad(scale: SpelledPitch[], i: number): string {
  const q = TRIAD_QUALITIES[i]!;
  return `${formatPitch(scale[i]!)}${q}`;
}

function nameSeventh(scale: SpelledPitch[], i: number): string {
  const q = SEVENTH_QUALITIES[i]!;
  return formatChord(scale[i]!, q);
}

function turnaround(key: KeyInfo) {
  const scale = scaleNotes(key);
  const I = scale[0]!;
  const VI = scale[5]!;
  const ii = scale[1]!;
  const V = scale[4]!;
  return [
    { roman: "Imaj7", chord: formatChord(I, "maj7"), quality: "maj7" as const, root: I },
    { roman: "VI7", chord: formatChord(VI, "7"), quality: "7" as const, root: VI },
    { roman: "ii7", chord: formatChord(ii, "m7"), quality: "m7" as const, root: ii },
    { roman: "V7", chord: formatChord(V, "7"), quality: "7" as const, root: V },
  ];
}

function shellsForKey(key: KeyInfo): ShellVoicing[] {
  const scale = scaleNotes(key);
  const out: ShellVoicing[] = [];
  for (let i = 0; i < 7; i++) {
    const root = scale[i]!;
    const chord = nameSeventh(scale, i);
    const tones = seventh(scale, i);
    const third = tones[1]!;
    const sev = tones[3]!;
    const s6 = shellSixthRoot(root, third, sev);
    const s5 = shellFifthRoot(root, third, sev);
    out.push({
      chord,
      root: formatPitch(root),
      third: formatPitch(third),
      seventh: formatPitch(sev),
      set: "6",
      fingering: s6,
    });
    out.push({
      chord,
      root: formatPitch(root),
      third: formatPitch(third),
      seventh: formatPitch(sev),
      set: "5",
      fingering: s5,
    });
  }
  return out;
}

function fillExercise(
  session: LarsenSession,
  ex: LarsenExercise,
  key: KeyInfo,
  difficulty: Difficulty,
) {
  const scale = scaleNotes(key);

  if (ex === 1) {
    session.scale = scale.map((p) => formatPitch(p));
    session.thirds = diatonicThirds(scale).map(([a, b]) => [formatPitch(a), formatPitch(b)]);
    session.triads = scale.map((_, i) => ({
      name: nameTriad(scale, i),
      notes: triad(scale, i).map((p) => formatPitch(p)),
    }));
    session.sevenths = scale.map((_, i) => ({
      name: nameSeventh(scale, i),
      notes: seventh(scale, i).map((p) => formatPitch(p)),
    }));
    session.training +=
      (session.training ? " " : "") +
      `Cartographier ${key.id} majeur dans une seule position : la même région contient ${session.sevenths.map((s) => s.name).join(", ")}. La main doit voir plusieurs structures imbriquées, pas une grande forme de gamme.`;
    session.execution.push(
      "Jouer la gamme, une position, lentement.",
      "Enchaîner les tierces diatoniques (même position).",
      "Triades ascendantes, puis descendantes.",
      "Arpèges de septième. Retrouver chaque structure sans recalculer la gamme.",
    );
    if (difficulty >= 2) {
      session.execution.push("Relier deux arpèges voisins sans quitter la position.");
    }
    session.success.push("Retrouver triades et arpèges sans recalculer entièrement la gamme.");
  }

  if (ex === 2) {
    session.shells = shellsForKey(key);
    session.progression = turnaround(key).map((t) => t.chord);
    session.training +=
      (session.training ? " " : "") +
      `Un accord n’est plus une grande shape : fondamentale + 3e + 7e. Deux jeux de cordes (6e et 5e). Le déplacement le long du manche entraîne le voice leading.`;
    session.execution.push(
      "Poser les shells à fondamentale 6e corde, diatoniques, en montant le manche.",
      "Même chose, fondamentale 5e corde.",
      `Les appliquer au turnaround ${session.progression.join(" – ")}.`,
      "Écouter le mouvement des 3es et des 7es d’un accord à l’autre.",
    );
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
        note: formatPitch(x.note),
      })),
    }));
    session.training +=
      (session.training ? " " : "") +
      `Limitation temporaire : seulement les chord tones du turnaround ${session.progression.join(" – ")} (Imaj7 – VI7 – ii7 – V7). Ce n’est pas du langage bebop complet — c’est localiser immédiatement les notes importantes quand l’accord change.`;
    session.execution.push(
      "Mémoriser les quatre notes de chaque accord.",
      "Improviser très simplement, une ou deux notes par temps, en suivant les changements.",
      "Priorité : continuité mélodique au moment où l’accord change.",
    );
    if (difficulty >= 2) {
      session.execution.push("Ouvrir ensuite à toutes les chord tones de la position, sans quitter le turnaround.");
    }
    session.success.push("Suivre les changements sans perdre la continuité mélodique.");
  }

  if (ex === 4) {
    const iii = scale[2]!;
    const I = scale[0]!;
    const arp = seventh(scale, 2);
    session.compose = {
      structure: `${formatChord(iii, "m7")} sur ${formatChord(I, "maj7")}`,
      relation: "arpège depuis la tierce : 3 – 5 – 7 – 9",
      notes: arp.map((p) => formatPitch(p)),
      prompt:
        "Compose une petite ligne. Tu peux t’arrêter, modifier une note, changer un rythme. Relie l’arpège à un fragment chromatique, ou précède-le d’une enclosure. Le critère : la phrase te convainc-elle ?",
    };
    session.training +=
      (session.training ? " " : "") +
      `Pont structure → phrase. L’arpège ${session.compose.notes.join(" ")} (${session.compose.relation}) n’est pas encore du vocabulaire : il le devient quand tu le transformes en ligne que tu as envie de rejouer.`;
    session.execution.push(
      `Jouer l’arpège ${session.compose.notes.join(" – ")} sur ${formatChord(I, "maj7")}.`,
      "Écrire (ou retenir) une phrase de 2 à 4 mesures qui l’utilise.",
      "Ajouter une enclosure ou un chromatisme — seulement s’il sert la phrase.",
      "Rejouer la phrase jusqu’à ce qu’elle tienne sans effort de calcul.",
    );
    session.success.push("Produire une petite phrase que tu trouves réellement musicale.");
  }

  if (ex === 5) {
    const prog = turnaround(key);
    session.progression = prog.map((t) => t.chord);
    session.melodic = {
      constraint:
        difficulty === 1
          ? "3 notes par accord, rubato."
          : "3 à 5 notes par accord. Motivic development, puis call and response.",
      prompt: `Progression ${prog.map((t) => t.chord).join(" – ")}. Joue une petite phrase. Écoute. La suivante doit avoir une relation perceptible avec la première — même contour, même rythme, ou réponse. À un moment approprié, réponds par une idée différente.`,
    };
    session.training +=
      (session.training ? " " : "") +
      `Le problème n’est plus « quelles notes ? » mais « comment une phrase engendre-t-elle la suivante ? ». Continuité du discours, pas densité d’information.`;
    session.execution.push(
      "Rubato. Phrase 1 sur le premier accord. S’arrêter. Écouter.",
      "Phrase 2 : même identité, adaptée à l’accord suivant (motivic) — ou réponse (call and response).",
      "Traverser le turnaround. Si ça se délite, réduire le nombre de notes.",
    );
    session.success.push("Produire plusieurs phrases possédant une relation audible entre elles.");
  }
}

export function generateLarsen(opts: {
  difficulty: Difficulty;
  key: string | "auto";
  exercise: LarsenExercise | "auto";
  durationMin: number | null;
  serial: number;
  seed: number;
  recentKeys: string[];
  lastExercise?: LarsenExercise;
}): LarsenSession {
  const rng = mulberry32(opts.seed);
  const keyId = opts.key === "auto" ? chooseKey(opts.difficulty, rng, opts.recentKeys) : opts.key;
  const dest = mustKey(keyId);
  const exercises = chooseExercises(opts.exercise, opts.difficulty, rng, opts.lastExercise);

  const session: LarsenSession = {
    kind: "Larsen",
    sessionKey: `LARSEN-${dest.id}-L${opts.difficulty}-E${exercises.join("+")}`,
    destKey: dest.id,
    difficulty: opts.difficulty,
    durationMin: opts.durationMin,
    exercises: exercises.map((n) => ({
      number: n,
      name: NAMES[n],
      reason: REASONS[n],
    })),
    training: "",
    execution: [],
    success: [],
    transfer: TRANSFER,
    seed: opts.seed,
    createdAt: Date.now(),
  };

  for (const ex of exercises) fillExercise(session, ex, dest, opts.difficulty);

  if (opts.durationMin) {
    session.execution.push(
      `Reste dans cette séance environ ${opts.durationMin} minutes. Pas de programme autour.`,
    );
  }

  return session;
}

export { NAMES as LARSEN_NAMES };
