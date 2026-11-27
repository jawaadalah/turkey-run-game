// Minimal static server for local play-testing: serves game/ at
// http://localhost:8080 with no network. Node 22, standard library only.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'game');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = join(root, url === '/' ? 'index.html' : url);
  if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(8080, () => console.log('Gus the Turkey at http://localhost:8080/?shot=start&seed=1'));
