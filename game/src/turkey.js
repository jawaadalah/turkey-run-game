// Gus the turkey: position, jumping, hiding and getting caught.
// The turkey auto-runs right; the player steers speed, jumps and hides.
import { CFG } from './config.js';
import { nearHaystack, inOven } from './world.js';

export function makeTurkey() {
  return {
    x: 120, y: CFG.groundY, vy: 0,
    onGround: true, hidden: false, hiding: false,
    lives: CFG.lives, score: 0, bonus: 0, corn: 0,
    lastHiddenAt: -10000,
    invulnUntil: 0, ovenHitAt: 0,
    facing: 1, step: 0, dead: false, escaped: false,
  };
}

export function turkeyUpdate(t, input, world, now) {
  if (t.dead || t.escaped) return;
  const hay = nearHaystack(world, t.x);
  t.hiding = !!hay && input.down && t.onGround;
  t.hidden = t.hiding;
  if (t.hidden) t.lastHiddenAt = now;
  let speed = CFG.runSpeed;
  if (input.right) speed = CFG.sprintSpeed;
  if (input.left) speed = CFG.walkSpeed;
  if (t.hiding) speed = 0;
  t.x += speed;
  t.step += speed;
  if (input.jump && t.onGround && !t.hiding) {
    t.vy = CFG.jumpVel;
    t.onGround = false;
  }
  t.vy += CFG.gravity;
  t.y += t.vy;
  if (t.y >= CFG.groundY) { t.y = CFG.groundY; t.vy = 0; t.onGround = true; }
  // Corn and pie pickups.
  for (const c of world.corns) {
    if (!c.taken && Math.abs(t.x - c.x) < 44 && Math.abs(t.y - c.y) < 70) {
      c.taken = true; t.bonus += CFG.cornScore; t.corn += 1;
    }
  }
  for (const p of world.pies) {
    if (!p.taken && Math.abs(t.x - p.x) < 46 && Math.abs(t.y - p.y) < 74) {
      p.taken = true; t.bonus += CFG.pieScore;
    }
  }
  // Oven heat: standing in an oven zone hurts once per drain interval.
  const oven = inOven(world, t.x);
  if (oven && t.onGround && now - t.ovenHitAt > CFG.ovenDrainMs) {
    t.ovenHitAt = now;
    hurtTurkey(t, now, t.x - 120);
  }
  // Score is distance covered plus every pickup bonus.
  t.score = Math.floor(t.x / CFG.pxPerM) + t.bonus;
  if (t.x >= world.gateX) {
    t.escaped = true;
    t.bonus += CFG.escapeBonus;
    t.score = Math.floor(t.x / CFG.pxPerM) + t.bonus;
  }
}

export function hurtTurkey(t, now, knockX) {
  if (now < t.invulnUntil || t.dead) return false;
  t.lives -= 1;
  t.invulnUntil = now + CFG.invulnMs;
  t.x = Math.max(120, knockX);
  if (t.lives <= 0) t.dead = true;
  return true;
}
