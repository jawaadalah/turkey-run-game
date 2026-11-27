// Gus the Turkey: Thanksgiving Breakout — tuning constants.
// One place for every number the game balances on, so a tweak never
// means hunting through the physics, the farmer AI or the renderer.
export const CFG = {
  canvasW: 1280,
  canvasH: 800,
  groundY: 700,
  gravity: 0.8,
  jumpVel: -16.5,
  // Turkey: auto-runs right; Right sprints, Left brakes to a walk.
  runSpeed: 3.1,
  sprintSpeed: 5.2,
  walkSpeed: 1.6,
  // Farmer: patrol is lazy, chase is faster than the turkey's run but
  // slower than its sprint — sprinting is the only clean getaway.
  farmerPatrol: 1.7,
  farmerChase: 4.0,
  farmerSearch: 2.6,
  spotRange: 380,
  catchRange: 42,
  loseSightMs: 3000,
  // World: 1800 m to the forest gate; 1 m = 10 px.
  pxPerM: 10,
  totalM: 1800,
  stageBounds: [0, 600, 1200, 1800],
  stageNames: ['THE FARMYARD', 'THE BARN', 'THE KITCHEN'],
  lives: 3,
  invulnMs: 2000,
  cornScore: 10,
  pieScore: 50,
  escapeBonus: 500,
  knifeIntervalMs: 2600,
  knifeFallSpeed: 7,
  ovenDrainMs: 900,
};
