// The farmer: patrols his ground, chases when he spots Gus, searches
// the last place he saw him, and corners him near the oven. He never
// sees a turkey hidden in a haystack.
import { CFG } from './config.js';
import { hurtTurkey } from './turkey.js';

export function makeFarmer(startX) {
  return {
    x: startX, y: CFG.groundY, dir: -1,
    state: 'patrol', // patrol | chase | search | return
    patrolMin: startX - 260, patrolMax: startX + 260,
    lastSeenX: startX, lostAt: 0, searchAt: 0, searchT: 0,
    step: 0, spotted: false,
  };
}

export function farmerUpdate(f, t, now) {
  const dx = t.x - f.x;
  const canSee = !t.hidden && !t.dead && !t.escaped && Math.abs(dx) < CFG.spotRange;
  if (canSee) {
    f.lastSeenX = t.x;
    f.lostAt = now;
    if (f.state !== 'chase') { f.state = 'chase'; f.spotted = true; }
  } else if (f.state === 'chase' && now - f.lostAt > CFG.loseSightMs) {
    f.state = 'search';
    f.searchAt = now; f.searchT = 0;
  }
  if (f.state === 'patrol') {
    f.x += f.dir * CFG.farmerPatrol;
    if (f.x < f.patrolMin) { f.x = f.patrolMin; f.dir = 1; }
    if (f.x > f.patrolMax) { f.x = f.patrolMax; f.dir = -1; }
  } else if (f.state === 'chase') {
    f.dir = dx >= 0 ? 1 : -1;
    f.x += f.dir * CFG.farmerChase;
  } else if (f.state === 'search') {
    const sdx = f.lastSeenX - f.x;
    if (Math.abs(sdx) > 12) {
      f.dir = sdx >= 0 ? 1 : -1;
      f.x += f.dir * CFG.farmerSearch;
    } else {
      f.searchT = now - f.searchAt;
      if (f.searchT > 2200) { f.state = 'return'; }
    }
  } else if (f.state === 'return') {
    const rdx = (f.patrolMin + f.patrolMax) / 2 - f.x;
    if (Math.abs(rdx) > 14) {
      f.dir = rdx >= 0 ? 1 : -1;
      f.x += f.dir * CFG.farmerPatrol;
    } else {
      f.state = 'patrol'; f.spotted = false;
    }
  }
  f.step += Math.abs(f.dir) * 0.2;
  // Caught: the farmer grabs Gus — but only once Gus has been visible
  // for a beat, so unhiding right under his nose is not an instant loss.
  if (!t.dead && !t.escaped && !t.hidden && now - t.lastHiddenAt > 400 &&
      Math.abs(dx) < CFG.catchRange && Math.abs(t.y - f.y) < 70) {
    if (hurtTurkey(t, now, f.x - 260)) f.state = 'return';
  }
}
