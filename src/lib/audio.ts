/** Lightweight plucked-string voice + metronome. Browser only. */

let ctx: AudioContext | null = null;
let playing = false;
let metroTimer: number | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function isPlaying(): boolean {
  return playing;
}

export async function resumeAudio(): Promise<void> {
  const c = getCtx();
  if (c.state === "suspended") await c.resume();
}

function pluck(c: AudioContext, midi: number, time: number, dur: number, gain = 0.18) {
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const osc = c.createOscillator();
  const fil = c.createBiquadFilter();
  const g = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, time);
  fil.type = "lowpass";
  fil.frequency.setValueAtTime(1200 + freq * 0.4, time);
  fil.frequency.exponentialRampToValueAtTime(400, time + Math.max(dur * 0.8, 0.05));
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gain, time + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(fil);
  fil.connect(g);
  g.connect(c.destination);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function click(c: AudioContext, time: number, accent: boolean) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(accent ? 1400 : 900, time);
  g.gain.setValueAtTime(accent ? 0.08 : 0.045, time);
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(time);
  osc.stop(time + 0.05);
}

export async function playMidis(
  midis: number[],
  bpm = 90,
  onStep?: (i: number) => void,
): Promise<void> {
  if (!midis.length) return;
  await resumeAudio();
  const c = getCtx();
  playing = true;
  const eighth = 60 / bpm / 2;
  const start = c.currentTime + 0.06;
  midis.forEach((m, i) => {
    pluck(c, m, start + i * eighth, eighth * 1.6, 0.16);
  });
  if (onStep) {
    midis.forEach((_, i) => {
      window.setTimeout(() => {
        if (playing) onStep(i);
      }, (60 + i * eighth * 1000));
    });
  }
  const total = midis.length * eighth;
  await new Promise((r) => setTimeout(r, total * 1000 + 80));
  playing = false;
}

export function stopAll() {
  playing = false;
  if (metroTimer != null) {
    window.clearInterval(metroTimer);
    metroTimer = null;
  }
}

export async function startMetronome(bpm: number, onBeat?: (beat: number) => void): Promise<() => void> {
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
  metroTimer = window.setInterval(tick, interval * 1000);
  return () => {
    if (metroTimer != null) window.clearInterval(metroTimer);
    metroTimer = null;
  };
}
