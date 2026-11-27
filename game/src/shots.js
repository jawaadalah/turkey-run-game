// Deterministic screenshot scenes (?shot=start|play|kitchen|escape).
// Each builds one fixed, seeded game state and renders a single frame,
// so the four screenshots are reproducible and show the game at its
// best: title, a farmyard chase, the kitchen knife storm, the escape.
import { CFG } from './config.js';
import { buildWorld } from './world.js';
import { makeTurkey } from './turkey.js';
import { makeFarmer } from './farmer.js';
import { makeKnives } from './knives.js';

export function shotState(shot, seed) {
  const world = buildWorld(seed);
  const t = makeTurkey();
  const farmer = makeFarmer(700);
  const knives = makeKnives(seed);
  const now = 1000;
  if (shot === 'start') {
    t.x = 120;
    farmer.x = 760; farmer.state = 'patrol';
  } else if (shot === 'play') {
    t.x = 4200; t.y = CFG.groundY - 40; t.vy = -6; t.onGround = false;
    t.score = 430; t.corn = 6;
    farmer.x = 4050; farmer.state = 'chase'; farmer.dir = 1;
    knives.list = [
      { x: 4450, y: 300, vy: 7, stuck: false, stuckAt: 0 },
      { x: 4700, y: CFG.groundY - 8, vy: 7, stuck: true, stuckAt: 0 },
    ];
  } else if (shot === 'kitchen') {
    t.x = 13200; t.score = 1480; t.corn = 21; t.lives = 2;
    farmer.x = 13050; farmer.state = 'chase'; farmer.dir = 1;
    // Stage the kitchen's signature hazards in frame for the shot.
    world.ovens.push({ x: 13600, w: 150 });
    world.pies.push({ x: 13480, y: CFG.groundY - 70, taken: false });
    knives.list = [
      { x: 13350, y: 180, vy: 8, stuck: false, stuckAt: 0 },
      { x: 13580, y: 420, vy: 8, stuck: false, stuckAt: 0 },
      { x: 13100, y: CFG.groundY - 8, vy: 8, stuck: true, stuckAt: 0 },
    ];
  } else { // escape
    t.x = world.gateX - 40;
    t.escaped = true; t.score = 2310; t.corn = 34;
    farmer.x = world.gateX - 900; farmer.state = 'search';
  }
  return { world, turkey: t, farmer, knives, now };
}

export function shotName(shot) {
  return { start: '1-start', play: '2-play', kitchen: '3-kitchen', escape: '4-escaped' }[shot] || '1-start';
}
