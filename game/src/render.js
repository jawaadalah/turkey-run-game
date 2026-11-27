// All canvas drawing: the autumn farm, the barn, the kitchen, Gus the
// turkey, the farmer, the knives and the forest gate. No images —
// every sprite is drawn from paths, so the game loads nothing.
import { CFG } from './config.js';
import { stageAt } from './world.js';

const SKY = ['#f7b267', '#e07a3f', '#8d4b2a'];
const GROUND = ['#c98f4e', '#a9713a', '#7a4a28'];

function sky(ctx, stage) {
  const g = ctx.createLinearGradient(0, 0, 0, CFG.groundY);
  g.addColorStop(0, SKY[stage]);
  g.addColorStop(1, '#f9d976');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CFG.canvasW, CFG.groundY);
  // Low autumn sun.
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath(); ctx.arc(1080, 110, 52, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,243,176,0.35)';
  ctx.beginPath(); ctx.arc(1080, 110, 84, 0, Math.PI * 2); ctx.fill();
  // Drifting clouds.
  ctx.fillStyle = 'rgba(255,250,235,0.85)';
  for (const [cx, cy, s] of [[220, 90, 1], [520, 150, 0.7], [820, 70, 0.85]]) {
    ctx.beginPath();
    ctx.arc(cx, cy, 26 * s, 0, Math.PI * 2);
    ctx.arc(cx + 30 * s, cy + 6, 20 * s, 0, Math.PI * 2);
    ctx.arc(cx - 32 * s, cy + 8, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ground(ctx, stage, camX) {
  ctx.fillStyle = GROUND[stage];
  ctx.fillRect(0, CFG.groundY, CFG.canvasW, CFG.canvasH - CFG.groundY);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, CFG.groundY, CFG.canvasW, 6);
  // Dirt speckles scrolling with the camera.
  ctx.fillStyle = 'rgba(60,30,10,0.25)';
  for (let x = -((camX % 90) + 90) % 90; x < CFG.canvasW; x += 90) {
    ctx.fillRect(x, CFG.groundY + 34, 14, 4);
    ctx.fillRect(x + 40, CFG.groundY + 66, 10, 4);
  }
}

function drawTree(ctx, x, y, kind) {
  const colors = ['#c2571b', '#d98e1f', '#8a5a19'];
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(x - 7, y - 90, 14, 90);
  ctx.fillStyle = colors[kind % 3];
  ctx.beginPath();
  ctx.arc(x, y - 120, 52, 0, Math.PI * 2);
  ctx.arc(x - 34, y - 92, 34, 0, Math.PI * 2);
  ctx.arc(x + 34, y - 92, 34, 0, Math.PI * 2);
  ctx.fill();
}

function drawFence(ctx, x) {
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x, CFG.groundY - 52); ctx.lineTo(x + 26, CFG.groundY - 52);
  ctx.moveTo(x, CFG.groundY - 26); ctx.lineTo(x + 26, CFG.groundY - 26);
  ctx.stroke();
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(x - 3, CFG.groundY - 62, 7, 62);
  ctx.fillRect(x + 22, CFG.groundY - 62, 7, 62);
}

function drawHaystack(ctx, x, w) {
  ctx.fillStyle = '#e0a92e';
  ctx.beginPath();
  ctx.moveTo(x, CFG.groundY);
  ctx.quadraticCurveTo(x + w / 2, CFG.groundY - 110, x + w, CFG.groundY);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#b9821a';
  ctx.lineWidth = 3;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x + (w * i) / 5, CFG.groundY - 8);
    ctx.quadraticCurveTo(x + (w * i) / 5 - 8, CFG.groundY - 60, x + (w * i) / 5, CFG.groundY - 96);
    ctx.stroke();
  }
}

function drawCorn(ctx, x, y, bob) {
  ctx.save();
  ctx.translate(x, y + Math.sin(bob) * 3);
  ctx.fillStyle = '#ffd23f';
  ctx.beginPath(); ctx.ellipse(0, 0, 10, 16, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c89b1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(5, 10); ctx.moveTo(5, -10); ctx.lineTo(-5, 10); ctx.stroke();
  ctx.fillStyle = '#3f7d2c';
  ctx.beginPath(); ctx.moveTo(0, 16); ctx.quadraticCurveTo(-12, 26, -14, 12); ctx.quadraticCurveTo(0, 18, 0, 16); ctx.fill();
  ctx.restore();
}

function drawPie(ctx, x, y) {
  ctx.fillStyle = '#e8b04b';
  ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y); ctx.lineTo(x + 12, y - 14); ctx.lineTo(x - 12, y - 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#b4712e';
  ctx.fillRect(x - 12, y - 16, 24, 4);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x, y - 18, 6, 0, Math.PI * 2); ctx.fill();
}

function drawOven(ctx, x, w, now) {
  ctx.fillStyle = '#4a4a52';
  ctx.fillRect(x, CFG.groundY - 150, w, 150);
  ctx.fillStyle = '#2e2e34';
  ctx.fillRect(x + 12, CFG.groundY - 128, w - 24, 70);
  const flick = 0.65 + 0.35 * Math.sin(now / 90);
  ctx.fillStyle = `rgba(255,${Math.floor(120 + 80 * flick)},20,${0.75 * flick + 0.2})`;
  ctx.beginPath();
  ctx.moveTo(x + 20, CFG.groundY - 62);
  ctx.quadraticCurveTo(x + w / 2, CFG.groundY - 128, x + w - 20, CFG.groundY - 62);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5d3a1a';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OVEN — HOT!', x + w / 2, CFG.groundY - 168);
}

function drawGate(ctx, x) {
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(x - 8, CFG.groundY - 190, 16, 190);
  ctx.fillRect(x + 120, CFG.groundY - 190, 16, 190);
  ctx.fillStyle = '#2f6b2f';
  ctx.fillRect(x - 8, CFG.groundY - 200, 144, 22);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FOREST — FREEDOM', x + 64, CFG.groundY - 214);
  // Pine trees beyond the gate.
  ctx.fillStyle = '#2f6b2f';
  for (const [tx, s] of [[x + 220, 1], [x + 300, 1.25], [x + 390, 0.9]]) {
    ctx.beginPath();
    ctx.moveTo(tx, CFG.groundY - 190 * s);
    ctx.lineTo(tx - 42 * s, CFG.groundY);
    ctx.lineTo(tx + 42 * s, CFG.groundY);
    ctx.closePath(); ctx.fill();
  }
}

export function drawTurkey(ctx, t, now) {
  const x = t.x;
  const y = t.y;
  const bob = t.onGround ? Math.sin(t.step * 0.35) * 3 : 0;
  const blink = now < t.invulnUntil && Math.floor(now / 120) % 2 === 0;
  ctx.save();
  if (blink) ctx.globalAlpha = 0.35;
  ctx.translate(x, y + bob);
  if (t.hidden) ctx.globalAlpha = 0.55;
  // Tail feathers.
  ctx.fillStyle = '#8a5a2b';
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.rotate(i * 0.32);
    ctx.beginPath(); ctx.ellipse(0, -34, 9, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#a06a35';
  ctx.beginPath(); ctx.ellipse(-16, -30, 8, 20, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(16, -30, 8, 20, 0.4, 0, Math.PI * 2); ctx.fill();
  // Body.
  ctx.fillStyle = '#6b4423';
  ctx.beginPath(); ctx.ellipse(0, -18, 26, 22, 0, 0, Math.PI * 2); ctx.fill();
  // Wing.
  ctx.fillStyle = '#4e3018';
  ctx.beginPath(); ctx.ellipse(-6, -16, 14, 10, -0.5, 0, Math.PI * 2); ctx.fill();
  // Neck + head.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(14, -52, 10, 34);
  ctx.fillStyle = '#c98f4e';
  ctx.beginPath(); ctx.arc(20, -56, 12, 0, Math.PI * 2); ctx.fill();
  // Beak + wattle.
  ctx.fillStyle = '#e07a3f';
  ctx.beginPath(); ctx.moveTo(30, -58); ctx.lineTo(42, -54); ctx.lineTo(30, -50); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d23c2e';
  ctx.beginPath(); ctx.ellipse(26, -46, 4, 7, 0, 0, Math.PI * 2); ctx.fill();
  // Eye.
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(23, -59, 2.6, 0, Math.PI * 2); ctx.fill();
  // Legs (scissor while running).
  const legSwing = t.onGround ? Math.sin(t.step * 0.5) * 8 : 4;
  ctx.strokeStyle = '#e07a3f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-8, 2); ctx.lineTo(-8 + legSwing, 12);
  ctx.moveTo(8, 2); ctx.lineTo(8 - legSwing, 12);
  ctx.stroke();
  ctx.restore();
  if (t.hidden) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HIDDEN', x, y - 92);
  }
}

export function drawFarmer(ctx, f, now) {
  const x = f.x;
  const y = f.y;
  const swing = Math.sin(f.step) * 6;
  ctx.save();
  ctx.translate(x, y);
  // Legs.
  ctx.strokeStyle = '#2e4a7a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-6, -34); ctx.lineTo(-6 + swing, 0);
  ctx.moveTo(6, -34); ctx.lineTo(6 - swing, 0);
  ctx.stroke();
  // Overalls + shirt.
  ctx.fillStyle = '#2e4a7a';
  ctx.fillRect(-14, -66, 28, 34);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(-16, -96, 32, 32);
  // Arms + pitchfork.
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(12, -88); ctx.lineTo(26, -62); ctx.stroke();
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(26, -116); ctx.lineTo(26, -48); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(18, -116); ctx.lineTo(18, -100);
  ctx.moveTo(26, -118); ctx.lineTo(26, -100);
  ctx.moveTo(34, -116); ctx.lineTo(34, -100);
  ctx.stroke();
  // Head + hat.
  ctx.fillStyle = '#e8b88a';
  ctx.beginPath(); ctx.arc(0, -106, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f5d76e';
  ctx.fillRect(-16, -122, 32, 8);
  ctx.fillRect(-9, -138, 18, 16);
  // Moustache + angry eyes when chasing.
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(-8, -100, 16, 4);
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(-5, -110, 2, 0, Math.PI * 2); ctx.arc(5, -110, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  if (f.state === 'chase') {
    ctx.fillStyle = '#d23c2e';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('! SPOTTED !', x, y - 156);
  } else if (f.state === 'search') {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('? WHERE\'D HE GO ?', x, y - 156);
  }
}

export function drawKnife(ctx, n, now) {
  ctx.save();
  ctx.translate(n.x, n.y);
  if (!n.stuck) {
    // Landing shadow telegraph.
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(0, CFG.groundY - n.y, 26, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(0.5);
  }
  ctx.fillStyle = '#cfd6dd';
  ctx.beginPath();
  ctx.moveTo(-5, -26); ctx.lineTo(5, -26); ctx.lineTo(0, 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(-4, 6, 8, 16);
  ctx.restore();
}

export function drawScene(ctx, world, turkey, farmer, knives, camX, now) {
  const stage = stageAt(turkey.x / CFG.pxPerM);
  sky(ctx, stage);
  ground(ctx, stage, camX);
  ctx.save();
  ctx.translate(-camX, 0);
  for (const tr of world.trees) {
    if (tr.x > camX - 200 && tr.x < camX + CFG.canvasW + 200) drawTree(ctx, tr.x, CFG.groundY, tr.kind);
  }
  // Barn backdrop in stage 2.
  if (stage === 1) {
    ctx.fillStyle = '#a93226';
    ctx.fillRect(camX + 60, CFG.groundY - 260, 340, 260);
    ctx.fillStyle = '#7b241c';
    ctx.beginPath();
    ctx.moveTo(camX + 40, CFG.groundY - 260);
    ctx.lineTo(camX + 230, CFG.groundY - 340);
    ctx.lineTo(camX + 420, CFG.groundY - 260);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f5d76e';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BARN', camX + 230, CFG.groundY - 170);
  }
  // Kitchen backdrop in stage 3: tiled wall band down to the floor.
  if (stage === 2) {
    ctx.fillStyle = '#e8e0d0';
    ctx.fillRect(camX, CFG.groundY - 320, CFG.canvasW, 320);
    ctx.strokeStyle = '#c9bfa8';
    ctx.lineWidth = 2;
    for (let x = camX - (camX % 64); x < camX + CFG.canvasW; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, CFG.groundY - 320); ctx.lineTo(x, CFG.groundY); ctx.stroke();
    }
    ctx.fillStyle = '#8d4b2a';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('KITCHEN — DINNER IS AT 6', camX + 40, CFG.groundY - 280);
  }
  for (const h of world.haystacks) {
    if (h.x > camX - 200 && h.x < camX + CFG.canvasW + 200) drawHaystack(ctx, h.x, h.w);
  }
  for (const o of world.ovens) {
    if (o.x > camX - 200 && o.x < camX + CFG.canvasW + 200) drawOven(ctx, o.x, o.w, now);
  }
  for (const f of world.fences) {
    if (f.x > camX - 100 && f.x < camX + CFG.canvasW + 100) drawFence(ctx, f.x);
  }
  for (const c of world.corns) {
    if (!c.taken && c.x > camX - 60 && c.x < camX + CFG.canvasW + 60) drawCorn(ctx, c.x, c.y, now / 400 + c.x);
  }
  for (const p of world.pies) {
    if (!p.taken && p.x > camX - 60 && p.x < camX + CFG.canvasW + 60) drawPie(ctx, p.x, p.y);
  }
  drawGate(ctx, world.gateX);
  for (const n of knives.list) drawKnife(ctx, n, now);
  drawFarmer(ctx, farmer, now);
  drawTurkey(ctx, turkey, now);
  ctx.restore();
  // Falling leaves drift over everything.
  ctx.fillStyle = 'rgba(210,120,30,0.7)';
  for (let i = 0; i < 14; i++) {
    const lx = ((i * 173 + now / 28) % (CFG.canvasW + 80)) - 40;
    const ly = (i * 97 + now / 12) % 320;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(Math.sin(now / 500 + i) * 0.8);
    ctx.fillRect(-5, -2, 10, 4);
    ctx.restore();
  }
}
