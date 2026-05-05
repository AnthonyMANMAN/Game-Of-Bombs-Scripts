(function() {
  let frozen = false;
  let delayMs = 0;
  let duplicate = false;
  let queue = [];
  const originalSend = WebSocket.prototype.send;

  function doSend(ws, data) {
    if (delayMs > 0) {
      setTimeout(() => originalSend.call(ws, data), delayMs);
      if (duplicate) setTimeout(() => originalSend.call(ws, data), delayMs);
    } else {
      originalSend.call(ws, data);
      if (duplicate) originalSend.call(ws, data);
    }
  }

  WebSocket.prototype.send = function(data) {
    if (frozen) {
      queue.push({ ws: this, data });
      updateUI();
      return;
    }
    doSend(this, data);
  };

  // --- UI ---
  const ui = document.createElement('div');
  ui.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 14px 18px;
    font-family: monospace;
    font-size: 13px;
    color: #e0e0e0;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 260px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    user-select: none;
  `;

  ui.innerHTML = `
    <div style="color:#888;font-size:11px;letter-spacing:.1em;text-transform:uppercase">WS Outgoing</div>

    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="color:#aaa">Freeze <span style="color:#444;font-size:10px">[Z/м]</span></span>
      <button id="__wsFreezeBtn" style="padding:4px 14px;border-radius:5px;border:1px solid #444;background:#222;color:#e0e0e0;font-family:monospace;font-size:12px;cursor:pointer">OFF</button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="color:#aaa">Delay <span style="color:#444;font-size:10px">[X/и]</span></span>
      <div style="display:flex;align-items:center;gap:6px">
        <input id="__wsDelayInput" type="number" min="0" max="10000" value="0" style="width:70px;padding:3px 8px;background:#111;border:1px solid #444;border-radius:4px;color:#e0e0e0;font-family:monospace;font-size:12px"/>
        <span style="color:#666;font-size:11px">ms</span>
      </div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="color:#aaa">Duplicate <span style="color:#444;font-size:10px">[C/т]</span></span>
      <button id="__wsDupBtn" style="padding:4px 14px;border-radius:5px;border:1px solid #444;background:#222;color:#e0e0e0;font-family:monospace;font-size:12px;cursor:pointer">OFF</button>
    </div>

    <div id="__wsQueueLabel" style="color:#666;font-size:11px">Queue: 0 packets</div>

    <button id="__wsFlushBtn" style="padding:5px;border-radius:5px;border:1px solid #444;background:#222;color:#888;font-family:monospace;font-size:11px;cursor:pointer">Flush Queue</button>
  `;

  document.body.appendChild(ui);

  function updateUI() {
    document.getElementById('__wsQueueLabel').textContent = 'Queue: ' + queue.length + ' packet(s)';
  }

  function setBtn(btn, active, onColor, onBorder) {
    btn.textContent = active ? 'ON' : 'OFF';
    btn.style.background = active ? onColor : '#222';
    btn.style.color = active ? '#fff' : '#e0e0e0';
    btn.style.borderColor = active ? onBorder : '#444';
  }

  function toggleFreeze() {
    frozen = !frozen;
    setBtn(document.getElementById('__wsFreezeBtn'), frozen, '#3a1a1a', '#f47');
    document.getElementById('__wsFreezeBtn').style.color = frozen ? '#f47' : '#e0e0e0';
    if (!frozen) {
      console.log('✓ Freeze off — flushing ' + queue.length + ' packet(s)');
      queue.forEach(({ ws, data }) => doSend(ws, data));
      queue = [];
      updateUI();
    } else {
      console.log('❄️  Outgoing packets frozen');
    }
  }

  function toggleDuplicate() {
    duplicate = !duplicate;
    setBtn(document.getElementById('__wsDupBtn'), duplicate, '#1a2a3a', '#58a6ff');
    document.getElementById('__wsDupBtn').style.color = duplicate ? '#58a6ff' : '#e0e0e0';
    console.log(duplicate ? '✕✕ Duplicate ON' : '✕ Duplicate OFF');
  }

  document.getElementById('__wsFreezeBtn').addEventListener('click', toggleFreeze);
  document.getElementById('__wsDupBtn').addEventListener('click', toggleDuplicate);

  document.getElementById('__wsDelayInput').addEventListener('input', function() {
    delayMs = Math.max(0, parseInt(this.value) || 0);
    console.log('⏱ Delay set to ' + delayMs + 'ms');
  });

  document.getElementById('__wsFlushBtn').addEventListener('click', function() {
    console.log('✓ Flushing ' + queue.length + ' packet(s)');
    queue.forEach(({ ws, data }) => doSend(ws, data));
    queue = [];
    updateUI();
  });

  // Z = freeze, X = focus delay input, C = duplicate
  document.addEventListener('keyup', function(e) {
    if (document.activeElement === document.getElementById('__wsDelayInput')) return;
    if (e.key === 'z' || e.key === 'Z' || e.key === 'м') toggleFreeze();
    if (e.key === 'x' || e.key === 'X' || e.key === 'и') document.getElementById('__wsDelayInput').focus();
    if (e.key === 'c' || e.key === 'C' || e.key === 'т') toggleDuplicate();
  });

  console.log('✓ WS UI injected | Z = freeze | X = delay | C = duplicate');
})();
