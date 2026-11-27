// World layout: the 1800 m escape route from the farmyard, through the
// barn, into the kitchen and out to the forest gate. Everything is
// placed in world coordinates (px) from one seed, so the same seed
// always builds the same farm.
import { CFG } from './config.js';
import { makeRng, range } from './random.js';

export function stageAt(m) {
  if (m < 600) return 0;
  if (m < 1200) return 1;
  return 2;
}

export function stageName(m) {
  return CFG.stageNames[stageAt(m)];
}

export function buildWorld(seed) {
  const rng = makeRng(seed);
  const fences = [];   // {x, w} — jump them
  const haystacks = []; // {x, w} — hide in them (hold Down)
  const corns = [];    // {x, y, taken}
  const pies = [];     // {x, y, taken} — kitchen only
  const ovens = [];    // {x, w} — hot zones, kitchen only
  const trees = [];    // decoration {x, kind}
  const totalPx = CFG.totalM * CFG.pxPerM;

  for (let x = 900; x < totalPx - 1200; x += range(rng, 620, 980)) {
    const m = x / CFG.pxPerM;
    fences.push({ x, w: 26 });
    if (rng() < 0.55) haystacks.push({ x: x + range(rng, 180, 320), w: 110 });
    const n = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) {
      corns.push({ x: x + 90 + i * 70, y: CFG.groundY - 60 - (i % 2) * 46, taken: false });
    }
    if (m > 1200 && rng() < 0.5) pies.push({ x: x + 420, y: CFG.groundY - 70, taken: false });
    if (m > 1200 && rng() < 0.45) ovens.push({ x: x + 520, w: 150 });
  }
  for (let x = 500; x < totalPx; x += range(rng, 700, 1300)) {
    trees.push({ x, kind: Math.floor(rng() * 3) });
  }
  return { fences, haystacks, corns, pies, ovens, trees, totalPx, gateX: totalPx - 300 };
}

export function nearHaystack(world, x) {
  for (const h of world.haystacks) {
    if (Math.abs(x - (h.x + h.w / 2)) < h.w / 2 + 46) return h;
  }
  return null;
}

export function inOven(world, x) {
  for (const o of world.ovens) {
    if (x > o.x && x < o.x + o.w) return o;
  }
  return null;
}
