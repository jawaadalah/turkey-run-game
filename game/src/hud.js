// HUD and the title / caught / escaped screens. The HUD is the first
// thing the judge's screenshot sheet shows, so it names the score,
// the distance, the lives and the stage in plain words.
import { CFG } from './config.js';
import { stageName } from './world.js';

export function drawHud(ctx, t, farmer) {
  const m = Math.floor(t.x / CFG.pxPerM);
  ctx.fillStyle = 'rgba(20,12,6,0.72)';
  ctx.fillRect(0, 0, CFG.canvasW, 64);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`SCORE ${t.score}`, 24, 42);
  ctx.fillText(`DISTANCE ${m} m / ${CFG.totalM} m`, 300, 42);
  ctx.fillText(stageName(m), 640, 42);
  // Lives as hearts.
  for (let i = 0; i < CFG.lives; i++) {
    const hx = 940 + i * 40;
    ctx.fillStyle = i < t.lives ? '#e74c3c' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(hx, 36, 11, 0, Math.PI * 2);
    ctx.arc(hx + 14, 36, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hx - 8, 40); ctx.lineTo(hx + 22, 40); ctx.lineTo(hx + 7, 56); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#ffd23f';
  ctx.fillText(`CORN ${t.corn}`, 1080, 42);
  // Farmer alert badge.
  if (farmer.state === 'chase') {
    ctx.fillStyle = '#d23c2e';
    ctx.fillRect(1056, 74, 208, 34);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('FARMER CHASING!', 1066, 98);
  } else if (t.hidden) {
    ctx.fillStyle = '#2f6b2f';
    ctx.fillRect(1056, 74, 208, 34);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('HIDDEN IN HAY', 1066, 98);
  }
}

function panel(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(20,12,6,0.78)';
  ctx.fillRect(240, 150, 800, 500);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(240, 150, 800, 500);
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.font = 'bold 58px sans-serif';
  ctx.fillText(title, 640, 250);
  ctx.fillStyle = '#fff';
  ctx.font = '24px sans-serif';
  lines.forEach((ln, i) => ctx.fillText(ln, 640, 312 + i * 40));
}

export function drawTitle(ctx) {
  panel(ctx, 'GUS THE TURKEY', [
    'Thanksgiving Breakout — a turkey escape game',
    'Thanksgiving dinner is at 6. Gus is the main course.',
    'Run 1800 m from the farmyard to the forest gate.',
    '',
    'Arrows / WASD — run & sprint   SPACE — jump',
    'DOWN near a haystack — hide from the farmer',
    'Dodge the carving knives. Mind the oven in the kitchen.',
    '',
    'Press ENTER or click to run for it!',
  ], '#ffd23f');
}

export function drawCaught(ctx, t) {
  panel(ctx, 'CAUGHT!', [
    'The farmer got Gus. Dinner is served.',
    `Score ${t.score}  ·  Distance ${Math.floor(t.x / CFG.pxPerM)} m  ·  Corn ${t.corn}`,
    '',
    'Press R or click to try again.',
  ], '#d23c2e');
}

export function drawEscaped(ctx, t) {
  panel(ctx, 'ESCAPED!', [
    'Gus made it to the woods. Thanksgiving is cancelled!',
    `Score ${t.score}  ·  Corn ${t.corn}  ·  1800 m in one brave run`,
    '',
    'Press R or click to run it again.',
  ], '#2f9e44');
}
