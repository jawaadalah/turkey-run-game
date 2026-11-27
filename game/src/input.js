// Keyboard + mouse input. Arrows/WASD move, Space jumps, Down hides,
// Enter starts, R restarts, M mutes. Click also starts / restarts.
export function makeInput() {
  const input = { left: false, right: false, down: false, jump: false, jumpQueued: false, muted: false };
  const keys = {};
  function down(e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
    keys[e.key] = true;
    sync();
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') input.jumpQueued = true;
    if (e.key === 'm' || e.key === 'M') input.muted = !input.muted;
  }
  function up(e) { keys[e.key] = false; sync(); }
  function sync() {
    input.left = !!(keys.ArrowLeft || keys.a || keys.A);
    input.right = !!(keys.ArrowRight || keys.d || keys.D);
    input.down = !!(keys.ArrowDown || keys.s || keys.S);
    input.jump = !!(keys[' '] || keys.ArrowUp || keys.w || keys.W);
  }
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  return { input, keys };
}
