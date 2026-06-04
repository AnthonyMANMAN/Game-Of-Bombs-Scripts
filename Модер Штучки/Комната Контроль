// ==UserScript==
// @name         GoB Map Editor Panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Map editor command panel for gameofbombs.com
// @match        *://gameofbombs.com/*
// @match        *://*.gameofbombs.com/*
// @grant        none
// ==/UserScript==

(function(){
'use strict';

function sendCmd(cmd){
  const input = document.getElementById('msgText');
  if(!input) return;
  input.value = cmd;
  input.dispatchEvent(new Event('input', {bubbles:true}));
  setTimeout(()=>{
    input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
    input.value = '';
  }, 100);
}

function promptCmd(template, placeholders){
  let cmd = template;
  for(const [key, label] of placeholders){
    const val = prompt(label);
    if(val === null) return;
    cmd = cmd.replace(key, val.trim());
  }
  sendCmd(cmd);
}

const ui = document.createElement('div');
ui.id = '__gobmapbot__';

ui.innerHTML = `
<div id="gob-panel" style="position:fixed;top:16px;right:16px;z-index:99999;width:280px;font-family:sans-serif;font-size:12px;background:#1a1a1a;color:#eee;border-radius:10px;border:1px solid #333;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.6)">

  <div id="gob-header" style="padding:8px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:#111;border-bottom:1px solid #2a2a2a;user-select:none">
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:15px">🗺️</span>
      <b style="font-size:13px">Map Editor</b>
    </div>
    <span id="gob-chevron" style="color:#555;font-size:10px">▲</span>
  </div>

  <div id="gob-body">

    <!-- MODE -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Mode</div>
    <div style="padding:6px 10px;display:flex;gap:5px;flex-wrap:wrap;border-bottom:1px solid #222">
      <button data-cmd="/editmap"  class="gob-btn gob-green"  title="Enter edit mode">✏️ Edit</button>
      <button data-cmd="/editmap:" class="gob-btn gob-green"  id="gob-editmap-named" title="Edit specific room">✏️ Edit Room…</button>
      <button data-cmd="/openmap"  class="gob-btn gob-blue"   title="Open map / exit edit mode">🔓 Open</button>
      <button data-cmd="/obs"      class="gob-btn gob-gray"   title="Go to observer (needed before /editmap)">/obs</button>
    </div>

    <!-- SAVE / LOAD -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Save / Load</div>
    <div style="padding:6px 10px;display:flex;flex-direction:column;gap:5px;border-bottom:1px solid #222">
      <div style="display:flex;gap:5px">
        <button data-cmd="/savemap" class="gob-btn gob-yellow" style="flex:1" title="Save to current slot">💾 Save</button>
        <button data-cmd="/loadmap" class="gob-btn gob-yellow" style="flex:1" title="Load from current slot">📂 Load</button>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        ${[1,2,3,4,5,6,7,8,9].map(n=>`
          <button class="gob-btn gob-slot" style="min-width:24px;padding:4px 5px" title="Save/Load slot ${n}" data-slot="${n}">
            ${n}
          </button>`).join('')}
        <span style="color:#555;font-size:10px;align-self:center;margin-left:2px">slot▸</span>
      </div>
      <div style="display:flex;gap:5px">
        <button id="gob-save-slot" class="gob-btn gob-yellow" style="flex:1">💾 Save #…</button>
        <button id="gob-load-slot" class="gob-btn gob-yellow" style="flex:1">📂 Load #…</button>
      </div>
    </div>

    <!-- FILL / REPLACE -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Fill / Replace</div>
    <div style="padding:6px 10px;display:flex;gap:5px;flex-wrap:wrap;border-bottom:1px solid #222">
      <button data-cmd="/fillmap"         class="gob-btn gob-orange" title="Fill with grass (default)">🌿 Fill Grass</button>
      <button id="gob-fillmap-tile"       class="gob-btn gob-orange" title="Fill with specific tile">🪣 Fill Tile…</button>
      <button id="gob-replacetile"        class="gob-btn gob-orange" title="Replace one tile with another">🔄 Replace…</button>
      <button data-cmd="/restoremap"      class="gob-btn gob-red"    title="Undo last fill/mirror/replace">↩️ Restore</button>
    </div>

    <!-- MIRROR -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Mirror</div>
    <div style="padding:6px 10px;display:flex;gap:5px;flex-wrap:wrap;border-bottom:1px solid #222">
      <button data-cmd="/mirrormap left"  class="gob-btn gob-purple">◀ Left</button>
      <button data-cmd="/mirrormap right" class="gob-btn gob-purple">▶ Right</button>
      <button data-cmd="/mirrormap up"    class="gob-btn gob-purple">▲ Up</button>
      <button data-cmd="/mirrormap down"  class="gob-btn gob-purple">▼ Down</button>
      <button id="gob-mirror-opts"        class="gob-btn gob-purple" title="Mirror with flip/odd options">⚙️ Mirror…</button>
    </div>

    <!-- SHIFT -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Shift</div>
    <div style="padding:6px 10px;display:flex;gap:5px;flex-wrap:wrap;border-bottom:1px solid #222">
      <button id="gob-shift-left"  class="gob-btn gob-teal">◀ Left</button>
      <button id="gob-shift-right" class="gob-btn gob-teal">▶ Right</button>
      <button id="gob-shift-up"    class="gob-btn gob-teal">▲ Up</button>
      <button id="gob-shift-down"  class="gob-btn gob-teal">▼ Down</button>
      <button id="gob-shift-xy"    class="gob-btn gob-teal">📐 Shift X,Y…</button>
    </div>

    <!-- BUILDERS -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Builders</div>
    <div style="padding:6px 10px;display:flex;gap:5px;flex-wrap:wrap;border-bottom:1px solid #222">
      <button id="gob-addbuilder"     class="gob-btn gob-blue">➕ Add…</button>
      <button id="gob-removebuilder"  class="gob-btn gob-red">➖ Remove…</button>
      <button data-cmd="/removebuilders" class="gob-btn gob-red">🚫 Remove All</button>
    </div>

    <!-- CHOOSE MAP -->
    <div style="padding:6px 10px 4px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #222">Multi-Room</div>
    <div style="padding:6px 10px 8px;display:flex;gap:5px;flex-wrap:wrap">
      <button id="gob-choosemap" class="gob-btn gob-gray">🗂️ Choose Map…</button>
    </div>

  </div>
</div>`;

// Styles
const style = document.createElement('style');
style.textContent = `
  .gob-btn {
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    border: 1px solid transparent;
    transition: filter 0.1s;
    white-space: nowrap;
  }
  .gob-btn:hover { filter: brightness(1.25); }
  .gob-btn:active { filter: brightness(0.9); }
  .gob-green  { background:#14532d; color:#4ade80; border-color:#166534; }
  .gob-blue   { background:#0c3a5a; color:#38bdf8; border-color:#0369a1; }
  .gob-yellow { background:#422006; color:#fbbf24; border-color:#92400e; }
  .gob-orange { background:#431407; color:#fb923c; border-color:#9a3412; }
  .gob-red    { background:#450a0a; color:#f87171; border-color:#7f1d1d; }
  .gob-purple { background:#2e1065; color:#c084fc; border-color:#6b21a8; }
  .gob-teal   { background:#042f2e; color:#2dd4bf; border-color:#0f766e; }
  .gob-gray   { background:#222;    color:#aaa;    border-color:#444;    }
  .gob-slot   { background:#1e293b; color:#94a3b8; border-color:#334155; font-size:11px; }
  .gob-slot:hover { background:#334155; }
`;
document.head.appendChild(style);
document.body.appendChild(ui);

// Collapse toggle
let collapsed = false;
document.getElementById('gob-header').onclick = () => {
  collapsed = !collapsed;
  document.getElementById('gob-body').style.display = collapsed ? 'none' : 'block';
  document.getElementById('gob-chevron').textContent = collapsed ? '▼' : '▲';
};

// Wire up simple data-cmd buttons
ui.querySelectorAll('[data-cmd]').forEach(btn => {
  btn.onclick = () => sendCmd(btn.dataset.cmd);
});

// --- Mode ---
document.getElementById('gob-editmap-named').onclick = () =>
  promptCmd('/editmap ROOM', [['ROOM','Room name (e.g. Arena_16):']]);

// --- Save/Load slots (the numbered slot buttons are for quick save/load prompting) ---
ui.querySelectorAll('.gob-slot').forEach(btn => {
  btn.onclick = () => {
    const n = btn.dataset.slot;
    const action = confirm(`Slot ${n}\n\nOK = Save   Cancel = Load`);
    sendCmd(action ? `/savemap ${n}` : `/loadmap ${n}`);
  };
});
document.getElementById('gob-save-slot').onclick = () =>
  promptCmd('/savemap N', [['N','Slot number (1-9):']]);
document.getElementById('gob-load-slot').onclick = () =>
  promptCmd('/loadmap N', [['N','Slot number (1-9):']]);

// --- Fill / Replace ---
document.getElementById('gob-fillmap-tile').onclick = () =>
  promptCmd('/fillmap TILE', [['TILE','Tile name (e.g. bush_hollow):']]);
document.getElementById('gob-replacetile').onclick = () =>
  promptCmd('/replacetile FROM TO', [['FROM','Tile to replace (e.g. bush_hollow):'],['TO','Replace with (e.g. grass):']]);

// --- Mirror with options ---
document.getElementById('gob-mirror-opts').onclick = () => {
  const dir = prompt('Direction? (left / right / up / down)');
  if(!dir) return;
  const flip = confirm('Add "flip" option?');
  const odd  = confirm('Add "odd" option?');
  let cmd = `/mirrormap ${dir.trim()}`;
  if(flip) cmd += ' flip';
  if(odd)  cmd += ' odd';
  sendCmd(cmd);
};

// --- Shift ---
document.getElementById('gob-shift-left').onclick  = () => { const n=prompt('Tiles to shift left:');  if(n) sendCmd(`/shiftmap -${Math.abs(+n)} 0`); };
document.getElementById('gob-shift-right').onclick = () => { const n=prompt('Tiles to shift right:'); if(n) sendCmd(`/shiftmap ${Math.abs(+n)} 0`);  };
document.getElementById('gob-shift-up').onclick    = () => { const n=prompt('Tiles to shift up:');    if(n) sendCmd(`/shiftmap 0 -${Math.abs(+n)}`); };
document.getElementById('gob-shift-down').onclick  = () => { const n=prompt('Tiles to shift down:');  if(n) sendCmd(`/shiftmap 0 ${Math.abs(+n)}`);  };
document.getElementById('gob-shift-xy').onclick    = () =>
  promptCmd('/shiftmap DX DY', [['DX','X shift (negative = left):'],['DY','Y shift (negative = up):']]);

// --- Builders ---
document.getElementById('gob-addbuilder').onclick    = () =>
  promptCmd('/addbuilder @PLAYER',   [['@PLAYER','Player name (without @):']]);
document.getElementById('gob-removebuilder').onclick = () =>
  promptCmd('/removebuilder @PLAYER',[['@PLAYER','Player name (without @):']]);

// --- Choose map ---
document.getElementById('gob-choosemap').onclick = () =>
  promptCmd('/choosemap ROOM', [['ROOM','Room name:']]);

console.log('%cGoB Map Editor Panel injected!','color:#2dd4bf;font-size:14px;font-weight:bold');
})();
