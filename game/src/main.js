// Gus the Turkey: Thanksgiving Breakout — game loop and state machine.
// States: title -> playing -> caught | escaped. A ?shot= URL renders
// one fixed scene for screenshots instead of starting the loop.
import { CFG } from './config.js';
import { buildWorld } from './world.js';
import { makeTurkey, turkeyUpdate } from './turkey.js';
import { makeFarmer, farmerUpdate } from './farmer.js';
import { makeKnives, knivesUpdate } from './knives.js';
import { drawScene } from './render.js';
import { drawHud, drawTitle, drawCaught, drawEscaped } from './hud.js';
import { makeInput } from './input.js';
import { ensureAudio, sfxJump, sfxCorn, sfxGobble, sfxAlarm, sfxHurt, sfxEscape } from './audio.js';
import { shotState } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CFG.canvasW;
canvas.height = CFG.canvasH;

const params = new URLSearchParams(location.search);
const seed = parseInt(params.get('seed') || '7', 10);
const shot = params.get('shot');
const { input, keys } = makeInput();

let world = buildWorld(seed);
let turkey = makeTurkey();
let farmer = makeFarmer(1100);
let knives = makeKnives(seed);
let state = 'title'; // title | playing | caught | escaped
let camX = 0;
let lastCorn = 0;
let lastLives = CFG.lives;
let wasChasing = false;

function reset() {
  world = buildWorld(seed);
  turkey = makeTurkey();
  farmer = makeFarmer(1100);
  knives = makeKnives(seed);
  camX = 0;
  lastCorn = 0;
  lastLives = CFG.lives;
  wasChasing = false;
  state = 'playing';
}

function frame(now) {
  if (state === 'playing') {
    if (input.jumpQueued) { input.jumpQueued = false; sfxJump(); }
    const prevCorn = turkey.corn;
    turkeyUpdate(turkey, input, world, now);
    if (turkey.corn > prevCorn) sfxCorn();
    farmerUpdate(farmer, turkey, now);
    if (farmer.state === 'chase' && !wasChasing) sfxAlarm();
    wasChasing = farmer.state === 'chase';
    knivesUpdate(knives, turkey, now, camX);
    if (turkey.lives < lastLives) { sfxHurt(); lastLives = turkey.lives; }
    camX = Math.max(0, turkey.x - 300);
    if (turkey.dead) { state = 'caught'; sfxGobble(); }
    if (turkey.escaped) { state = 'escaped'; sfxEscape(); }
  }
  drawScene(ctx, world, turkey, farmer, knives, camX, now);
  if (state === 'playing') drawHud(ctx, turkey, farmer);
  if (state === 'title') drawTitle(ctx);
  if (state === 'caught') drawCaught(ctx, turkey);
  if (state === 'escaped') drawEscaped(ctx, turkey);
  requestAnimationFrame(frame);
}

function startOnGesture() {
  ensureAudio();
  if (state === 'title') { reset(); return; }
  if ((state === 'caught' || state === 'escaped') && (keys.r || keys.R)) reset();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && state === 'title') startOnGesture();
  if ((e.key === 'r' || e.key === 'R') && (state === 'caught' || state === 'escaped')) reset();
});
canvas.addEventListener('click', startOnGesture);

window.addEventListener('error', (e) => { document.title = 'ERR:' + String(e.message).slice(0, 120); });

if (shot) {
  // Screenshot mode: one fixed scene, one frame, then signal ready.
  const s = shotState(shot, seed);
  world = s.world; turkey = s.turkey; farmer = s.farmer; knives = s.knives;
  camX = Math.max(0, turkey.x - 300);
  drawScene(ctx, world, turkey, farmer, knives, camX, s.now);
  if (shot === 'play' || shot === 'kitchen') drawHud(ctx, turkey, farmer);
  if (shot === 'start') drawTitle(ctx);
  if (shot === 'escape') drawEscaped(ctx, turkey);
  document.title = 'SHOT-READY';
  window.__shotReady = true;
} else {
  document.title = 'Gus the Turkey — Thanksgiving Breakout';
  requestAnimationFrame(frame);
}
