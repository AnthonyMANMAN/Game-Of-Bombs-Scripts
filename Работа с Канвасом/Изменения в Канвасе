// Remove any previous overlay
document.getElementById("__tileOverlay")?.remove();

const game = document.getElementById("layer0");
const rect = game.getBoundingClientRect();

const overlay = document.createElement("canvas");
overlay.id = "__tileOverlay";
overlay.width = rect.width;
overlay.height = rect.height;
overlay.style.cssText = `position:fixed; left:${rect.left}px; top:${rect.top}px; width:${rect.width}px; height:${rect.height}px; pointer-events:none; z-index:9999;`;
document.body.appendChild(overlay); // body, not game parent — no layout impact
const oc = overlay.getContext("2d");

// Track where each offscreen canvas is blitted onto layer0
// key: canvas element → {x, y} on screen
const canvasScreenPos = new WeakMap();

const hits = [];
setInterval(() => {
  oc.clearRect(0, 0, overlay.width, overlay.height);
  const now = Date.now();
  hits.forEach(h => {
    const age = (now - h.t) / 800;
    if (age > 1) return;
    const a = 1 - age;
    oc.fillStyle = `rgba(255,50,50,${a * 0.35})`;
    oc.fillRect(h.x, h.y, 32, 32);
    oc.strokeStyle = `rgba(255,220,0,${a})`;
    oc.lineWidth = 1;
    oc.strokeRect(h.x + 0.5, h.y + 0.5, 31, 31);
    oc.fillStyle = `rgba(255,255,255,${a})`;
    oc.font = "bold 8px monospace";
    oc.fillText(h.name, h.x + 2, h.y + 10);
  });
  while (hits.length && hits[0].t < Date.now() - 900) hits.shift();
}, 16);

const iframe = document.createElement("iframe");
document.body.appendChild(iframe);
const nativeDraw = iframe.contentWindow.CanvasRenderingContext2D.prototype.drawImage;
document.body.removeChild(iframe);

const stride = 33;
const TILES = {};
const rows = [
  ["grass1","","deep","","sand","","dirt"],
  [],[],
  ["rocky1","grass2","grass3","field","hole1","hole2","hole3","hole4"],
  ["","rocky_hole","","dirty_hole","bridge_h","bridge_v","bridge_metal_v","bridge_metal_h"],
  ["tile","tile2","tile3","tile4","left","up","right","down"],
  ["button_off","button_on","bridge_off","bridge_on","tile_red","tile_blue","tile_yellow","tile_purple"],
  ["deep_default","deep_bridge","","","skeleton","well"],
  ["rock3-plain","rock3","rock2-plain","rock2","rock1-plain","rock1","rock0-plain","rock0"],
  ["chest_in_rock-plain","chest_in_rock","silver2-plain","silver2","silver1-plain","silver1","silver0-plain","silver0"],
  ["tough9","tough6","gold2-plain","gold2","gold1-plain","gold1","gold0-plain","gold0"],
  ["tough4","tough2","diamond2-plain","diamond2","diamond1-plain","diamond1","diamond0-plain","diamond0"],
  ["wall6-plain","wall6","wall4-plain","wall4","wall2-plain","wall2","metal"],
  ["brick-plain","brick","bush-plain","bush","box_block","logs","cactus"],
  ["chest","gold_chest","diamond_chest","metal_chest","portalGreen","portalBlue","portalOrange","portalRed"],
  ["box1","box_with_bombs","goal","wc"],
  ["gate_closed","tunnel","gate_opened","red_chest"],
  ["tube1","tube2","tube3","tube4","spike_off","spike_on","spike_bones_off","spike_bones_on"],
  ["flag_white","flag_red","flag_blue","flag_yellow","flag_purple","walls-sn1","walls-ew1"],
  ["base-s","base-es","base-esw","base-sw","walls-s","walls-es","walls-esw","walls-sw"],
  ["base-sn","base-esn","base-eswn","base-swn","walls-sn","walls-esn","walls-eswn","walls-swn"],
  ["base-n","base-en","base-ewn","base-wn","walls-n","walls-en","walls-ewn","walls-wn"],
  ["base-e","base-ew","base-w","base","walls-e","walls-ew","walls-w","walls"],
  ["box_with_pumpkins","box_with_candies","pumpkin11","pumpkin12","","pumpkin22_","teleport0_off","teleport1_off","teleport2_off","teleport_disabled"],
  ["arena_castle1hp1","arena_castle2hp1","pumpkin21","pumpkin22","","pumpkin12_","teleport0_on","teleport1_on","teleport2_on","recycler"],
  ["arena_castle1hp0","arena_castle2hp0","arena_castle1","arena_castle2","arena_spawn_point0","arena_spawn_point1","arena_spawn_point2","arena_cup_chest"],
  ["tomb","tomb_ruins","tomb_and_ruins","","catapult_right_off","catapult_down_off","catapult_left_off","catapult_up_off"],
  ["","","","","catapult_right_on","catapult_down_on","catapult_left_on","catapult_up_on"],
];
rows.forEach((row, r) => row.forEach((name, c) => {
  if (name) TILES[`${c*stride},${r*stride}`] = name;
}));

// Pending tile hits: drawn into offscreen canvas, waiting for the blit to layer0
const pendingHits = new WeakMap(); // canvas → [{name, dx, dy}]

CanvasRenderingContext2D.prototype.drawImage = function(src, ...args) {
  const targetId = this.canvas.id;

  // 1. Intercept canvas→layer0 blits to record where each tile canvas lands on screen
  if (targetId === "layer0" && src instanceof HTMLCanvasElement) {
    const [sx, sy, sw, sh, dx, dy] = args.length === 8 ? args : [0, 0, src.width, src.height, args[0], args[1]];
    // dx, dy is position on layer0 — transform by layer0's current transform to get screen pos
    const t = this.getTransform();
    const screenX = t.e + dx * t.a;
    const screenY = t.f + dy * t.d;
    canvasScreenPos.set(src, { x: screenX, y: screenY });

    // Flush any pending hits for this tile canvas
    const pending = pendingHits.get(src) || [];
    pending.forEach(p => {
      hits.push({ x: screenX + p.dx, y: screenY + p.dy, name: p.name, t: Date.now() });
    });
    pendingHits.delete(src);
  }

  // 2. Intercept tileset draws into offscreen canvases
  if (src instanceof HTMLImageElement && src.src.includes("tileset")) {
    const [sx, sy, sw, sh, dx, dy] = args;
    const name = TILES[`${sx},${sy}`] || `?${sx},${sy}`;
    const screenPos = canvasScreenPos.get(this.canvas);
    if (screenPos) {
      // We already know where this canvas is on screen
      hits.push({ x: screenPos.x + dx, y: screenPos.y + dy, name, t: Date.now() });
    } else {
      // Canvas not yet blitted — queue it
      const pending = pendingHits.get(this.canvas) || [];
      pending.push({ dx, dy, name });
      pendingHits.set(this.canvas, pending);
    }
  }

  return nativeDraw.apply(this, [src, ...args]);
};

console.log("✓ overlay active — destroy a block to test");
