let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function osc(c: AudioContext, type: OscillatorType, freq: number, vol: number, start: number, end: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g); g.connect(c.destination);
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  o.start(start); o.stop(end);
}

export function playCorrect() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  [523, 659, 784].forEach((f, i) => osc(c, 'triangle', f, 0.16, t + i * 0.1, t + i * 0.1 + 0.28));
}

export function playWrong() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(); const g = c.createGain();
  o.connect(g); g.connect(c.destination);
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(260, t);
  o.frequency.linearRampToValueAtTime(120, t + 0.3);
  g.gain.setValueAtTime(0.16, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  o.start(t); o.stop(t + 0.35);
}

export function playAttack() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  // Swoosh
  const sw = c.createOscillator(); const swg = c.createGain();
  sw.connect(swg); swg.connect(c.destination);
  sw.type = 'sawtooth';
  sw.frequency.setValueAtTime(900, t);
  sw.frequency.linearRampToValueAtTime(200, t + 0.15);
  swg.gain.setValueAtTime(0.1, t);
  swg.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
  sw.start(t); sw.stop(t + 0.15);
  // Impact
  osc(c, 'sine', 160, 0.24, t + 0.13, t + 0.38);
  const n = c.createOscillator(); const ng = c.createGain();
  n.connect(ng); ng.connect(c.destination);
  n.type = 'sawtooth'; n.frequency.value = 80;
  ng.gain.setValueAtTime(0.12, t + 0.13);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  n.start(t + 0.13); n.stop(t + 0.25);
}

export function playDragonRoar() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(); const f = c.createBiquadFilter(); const g = c.createGain();
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.type = 'sawtooth'; o.frequency.setValueAtTime(90, t);
  o.frequency.linearRampToValueAtTime(55, t + 0.5);
  f.type = 'lowpass'; f.frequency.value = 350;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  o.start(t); o.stop(t + 0.55);
}

export function playTimerTick() {
  const c = getCtx(); if (!c) return;
  osc(c, 'sine', 900, 0.07, c.currentTime, c.currentTime + 0.07);
}

export function playTimerUrgent() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  osc(c, 'square', 440, 0.1, t, t + 0.06);
  osc(c, 'square', 550, 0.1, t + 0.08, t + 0.14);
}

export function playVictory() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  const notes = [523, 659, 784, 1047];
  const times = [0, 0.14, 0.28, 0.44];
  notes.forEach((f, i) => osc(c, 'triangle', f, 0.18, t + times[i], t + times[i] + (i === 3 ? 0.7 : 0.24)));
  // Bass
  osc(c, 'sine', 130, 0.14, t, t + 0.9);
}

export function playDefeat() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  [440, 392, 349, 262].forEach((f, i) => osc(c, 'sine', f, 0.14, t + i * 0.22, t + i * 0.22 + (i === 3 ? 0.8 : 0.3)));
}

export function playClick() {
  const c = getCtx(); if (!c) return;
  osc(c, 'sine', 700, 0.07, c.currentTime, c.currentTime + 0.055);
}

export function playWorldTransition() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  [523, 659, 784, 1047, 1319].forEach((f, i) => osc(c, 'sine', f, 0.08, t + i * 0.07, t + i * 0.07 + 0.22));
}

export function playCombo() {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime;
  [784, 988, 1175].forEach((f, i) => osc(c, 'triangle', f, 0.14, t + i * 0.08, t + i * 0.08 + 0.2));
}
