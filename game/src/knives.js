// Carving knives: the farmer's wife throws them from the kitchen
// window. Each knife telegraphs its landing spot with a shadow, then
// falls; a knife that hits Gus costs a life.
import { CFG } from './config.js';
import { makeRng } from './random.js';
import { hurtTurkey } from './turkey.js';

export function makeKnives(seed) {
  return { rng: makeRng(seed ^ 0x9e37), list: [], nextAt: 4000 };
}

export function knivesUpdate(k, t, now, camX) {
  if (now > k.nextAt && !t.dead && !t.escaped) {
    const stage = t.x / CFG.pxPerM < 1200 ? 1 : 0.62; // kitchen throws faster
    k.nextAt = now + CFG.knifeIntervalMs * stage;
    const x = camX + 650 + k.rng() * 500;
    k.list.push({ x, y: -30, vy: CFG.knifeFallSpeed + k.rng() * 2, stuck: false, stuckAt: 0 });
  }
  for (const n of k.list) {
    if (!n.stuck) {
      n.y += n.vy;
      if (n.y >= CFG.groundY - 8) { n.y = CFG.groundY - 8; n.stuck = true; n.stuckAt = now; }
    }
    if (!n.stuck && !t.dead && Math.abs(t.x - n.x) < 34 && Math.abs(t.y - n.y) < 64) {
      if (hurtTurkey(t, now, t.x - 160)) { n.stuck = true; n.stuckAt = now; }
    }
  }
  k.list = k.list.filter((n) => n.x > camX - 200 && now - n.stuckAt < 2600);
}
