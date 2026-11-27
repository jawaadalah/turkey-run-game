// Tiny WebAudio synth: no audio files, every sound is an oscillator.
// Silent until the first user gesture creates the context.
let ctx = null;

export function ensureAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch (e) { /* headless or no audio: stay silent */ }
}

function tone(freq, dur, type, vol, slideTo) {
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch (e) { /* ignore */ }
}

export function sfxJump() { tone(280, 0.16, 'square', 0.06, 520); }
export function sfxCorn() { tone(880, 0.1, 'sine', 0.1); setTimeout(() => tone(1320, 0.12, 'sine', 0.1), 70); }
export function sfxGobble() { tone(180, 0.12, 'sawtooth', 0.08, 90); setTimeout(() => tone(160, 0.12, 'sawtooth', 0.08, 80), 120); }
export function sfxAlarm() { tone(660, 0.14, 'square', 0.07, 440); setTimeout(() => tone(660, 0.14, 'square', 0.07, 440), 180); }
export function sfxHurt() { tone(220, 0.3, 'sawtooth', 0.1, 60); }
export function sfxEscape() {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.12), i * 130));
}
