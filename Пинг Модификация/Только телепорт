(function() {
  let frozen = false;
  let queue = [];
  const originalSend = WebSocket.prototype.send;

  function doSend(ws, data) {
    originalSend.call(ws, data);
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
    min-width: 220px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    user-select: none;
  `;

  ui.innerHTML = `
    <div style="color:#888;font-size:11px;letter-spacing:.1em;text-transform:uppercase">WS Outgoing</div>

    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="color:#aaa">Freeze <span style="color:#444;font-size:10px">[Z/м]</span></span>
      <button id="__wsFreezeBtn" style="padding:4px 14px;border-radius:5px;border:1px solid #444;background:#222;color:#e0e0e0;font-family:monospace;font-size:12px;cursor:pointer">OFF</button>
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

  document.getElementById('__wsFreezeBtn').addEventListener('click', toggleFreeze);

  document.getElementById('__wsFlushBtn').addEventListener('click', function() {
    console.log('✓ Flushing ' + queue.length + ' packet(s)');
    queue.forEach(({ ws, data }) => doSend(ws, data));
    queue = [];
    updateUI();
  });

  // Z = freeze
  document.addEventListener('keyup', function(e) {
    if (e.key === 'z' || e.key === 'Z' || e.key === 'м') toggleFreeze();
  });

  console.log('✓ WS UI injected | Z = freeze');
})();
