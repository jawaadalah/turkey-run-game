// Gus the Turkey: Thanksgiving Breakout — entry for turkey-run-game-01.
// The game is plain static files under game/ (ES modules, canvas-drawn,
// no network, no library). This program hands it in: it copies game/
// and screenshots/ beside this file into /output and writes the dossier
// the judge reads, using the kit's vendored makefun-game library.
//
// Local check (outside the grader): MAKEFUN_OUTPUT_DIR=out node main.ts
// then serve game/ with `node serve.ts` and open http://localhost:8080.
// The dossier must be byte-identical across runs: buildDossier is a pure
// function of game/ + screenshots/, so run it twice before submitting.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(msg) {
  throw new Error(`turkey entry: ${msg}`);
}

function checkShots(dir) {
  if (!existsSync(dir)) fail('screenshots/ is missing');
  const names = readdirSync(dir).filter((n) => !n.startsWith('.')).sort();
  if (names.length < 3 || names.length > 4) fail(`need 3-4 screenshots, found ${names.length}`);
  for (const n of names) {
    const st = statSync(join(dir, n));
    if (st.size > 262144) fail(`screenshot ${n} is ${st.size} bytes (cap 256 KiB)`);
    if (!/^[A-Za-z0-9._-]+$/.test(n)) fail(`screenshot name ${n} has an illegal character`);
  }
  return names;
}

const shots = checkShots(join(root, 'screenshots'));
mkdirSync(outDir, { recursive: true });
cpSync(join(root, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(root, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`turkey entry: ${shots.length} screenshots, dossier ${Buffer.byteLength(dossier)} bytes`);
