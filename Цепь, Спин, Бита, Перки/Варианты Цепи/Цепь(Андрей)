let spamming = false;

// --- UI ---
const ui = document.createElement('div');
ui.style.cssText = `
  position: fixed; bottom: 20px; right: 20px; z-index: 9999;
  background: #1e1e1e; border: 1px solid #333; border-radius: 10px;
  padding: 8px 12px; display: flex; align-items: center; gap: 10px;
  font-family: sans-serif; font-size: 13px; color: #aaa;
`;
ui.innerHTML = `
  <span style="color:#fff;font-weight:500">Z spam</span>
  <label style="position:relative;width:32px;height:18px;cursor:pointer">
    <input type="checkbox" id="spam-toggle" style="opacity:0;width:0;height:0;position:absolute">
    <div id="spam-track" style="position:absolute;inset:0;border-radius:99px;background:#444;transition:background .18s"></div>
    <div id="spam-thumb" style="position:absolute;top:3px;left:3px;width:12px;height:12px;border-radius:50%;background:#fff;transition:transform .18s"></div>
  </label>
  <span id="spam-status" style="font-size:11px;font-weight:500;color:#666">OFF</span>
`;
document.body.appendChild(ui);

const toggle = ui.querySelector('#spam-toggle');
const track  = ui.querySelector('#spam-track');
const thumb  = ui.querySelector('#spam-thumb');
const status = ui.querySelector('#spam-status');

toggle.addEventListener('change', () => {
  spamming = toggle.checked;
  track.style.background = spamming ? '#4a9' : '#444';
  thumb.style.transform  = spamming ? 'translateX(14px)' : 'none';
  status.textContent     = spamming ? 'ON' : 'OFF';
  status.style.color     = spamming ? '#4a9' : '#666';
});

// --- Key handler (toggle only, no blocker) ---
document.addEventListener('keydown', e => {
  if (e.key === 'x' || e.key === 'X' || e.key === 'ч' || e.key === 'Ч') {
    if (!e.repeat) {
      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event('change'));
    }
    e.preventDefault();
  }
});

// --- Spammer ---
setInterval(() => {
  if (!spamming) return;

  document.dispatchEvent(new KeyboardEvent('keydown', {
    keyCode: 90, key: 'z', code: 'KeyZ', bubbles: true
  }));

  setTimeout(() => {
    document.dispatchEvent(new KeyboardEvent('keyup', {
      keyCode: 90, key: 'z', code: 'KeyZ', bubbles: true
    }));
  }, 10);
}, 20);
