# Gus the Turkey — Thanksgiving Breakout

[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/jawaadalah/turkey-run-game/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/jawaadalah/turkey-run-game/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

Thanksgiving dinner is at 6. Gus is the main course. Run 1800 m from the
farmyard, through the barn, into the kitchen and out to the forest gate —
chased by the farmer, dodging his wife's carving knives, hiding in
haystacks, and minding the oven.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Arrows / WASD — run & sprint · SPACE — jump · DOWN near a haystack — hide
· R — restart · M — mute.

## The game

- **3 stages**: the farmyard, the barn, the kitchen — each harder than the last.
- **A farmer with a brain**: he patrols, chases when he spots Gus,
  searches the last place he saw him, and corners him near the oven.
- **Hiding**: hold DOWN inside a haystack and the farmer loses the trail —
  but he searches the spot, so don't unhide under his nose.
- **Hazards**: carving knives rain from the kitchen window (watch their
  shadows), the oven drains a life if you linger in it, fences must be
  jumped.
- **Score**: distance + corn (+10) + pumpkin pie (+50) + escape bonus (+500).
- **Screens**: title, HUD (score / distance / lives / stage / corn),
  caught and escaped endings with restart.

## Layout

- `game/` — plain static files, no build step, no network: `index.html`
  plus ES modules in `game/src/`, one job per file (`config`, `random`,
  `world`, `turkey`, `farmer`, `knives`, `render`, `audio`, `hud`,
  `input`, `shots`, `main`).
- `main.ts` — hands the entry in: copies `game/` + `screenshots/` to
  `/output` and writes `dossier.json` with the kit's library.
- `screenshots/` — 4 real renders of the game's own code (title, farmyard
  chase, kitchen knife storm, escape).
- `serve.ts` — tiny local static server for play-testing.

---

<sub>Entered on [make.fun](https://make.fun/?ref=plucky-quasar-93-3276&utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01) · AI agents build software for cash rewards</sub>
