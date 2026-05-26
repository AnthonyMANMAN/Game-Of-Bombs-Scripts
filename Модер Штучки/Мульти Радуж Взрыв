javascript:(function(){
  let running=false,timer=null,speed=2000;

  function getPlayers(){
    const out=[];
    document.querySelectorAll('#list-players li').forEach(li=>{
      if(li.classList.contains('empty')||li.style.display==='none') return;
      // The nickname span is the last .ng-binding inside .nickname
      const nickSpan=li.querySelector('.nickname .ng-binding');
      const nick=nickSpan?.childNodes[0]?.textContent?.trim(); // first text node, skips <i> child
      if(nick) out.push(nick);
    });
    return out;
  }

  function buildPlayerList(){
    const players=getPlayers();
    const box=document.getElementById('rb-playerlist');
    box.innerHTML='';
    players.forEach(p=>{
      const row=document.createElement('label');
      row.style.cssText='display:flex;align-items:center;gap:6px;padding:2px 0;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      const cb=document.createElement('input');
      cb.type='checkbox'; cb.value=p; cb.style.accentColor='#818cf8';
      const sp=document.createElement('span');
      sp.textContent=p; sp.style.cssText='font-size:11px;color:#ccc;overflow:hidden;text-overflow:ellipsis';
      row.appendChild(cb); row.appendChild(sp);
      box.appendChild(row);
    });
    if(!players.length) box.innerHTML='<span style="color:#555;font-size:11px">No players found</span>';
  }

  function getTargets(){
    return [...document.querySelectorAll('#rb-playerlist input:checked')].map(cb=>cb.value);
  }

  function getSizes(){
    return document.getElementById('rb-sizes').value
      .split(',').map(s=>s.trim()).filter(Boolean);
  }

  function getCmd(player,size){
    return `/rainboom @${player} ${size||'_'}`;
  }

  function updatePreview(){
    const targets=getTargets();
    const sizes=getSizes();
    if(!targets.length){document.getElementById('rb-preview').textContent='(select a player)';return;}
    const lines=targets.map((p,i)=>getCmd(p, sizes[i%sizes.length]||'_'));
    document.getElementById('rb-preview').textContent=lines.join(' → ');
  }

  function setRunning(r){
    running=r;
    document.getElementById('rb-dot').style.background=r?'#4ade80':'#ef4444';
    document.getElementById('rb-status').textContent=r?'running':'stopped';
  }

  function log(msg){document.getElementById('rb-log').textContent=msg;}

  function sendCmd(cmd){
    const input=document.getElementById('msgText');
    if(!input){log('⚠ msgText not found');return;}
    input.value=cmd;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    setTimeout(()=>{
      input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
      input.value='';
      log('→ '+cmd);
    },100);
  }

  function tick(){
    const targets=getTargets();
    const sizes=getSizes();
    if(!targets.length){log('⚠ No targets selected');return;}
    targets.forEach((p,i)=>{
      const size=sizes[i%sizes.length]||'_';
      setTimeout(()=>sendCmd(getCmd(p,size)), i*220);
    });
    if(running) timer=setTimeout(tick, speed);
  }

  const existing=document.getElementById('sb-panel');
  if(existing){existing.remove();}

  const ui=document.createElement('div');
  ui.innerHTML=`
<div id="sb-panel" style="position:fixed;bottom:16px;right:16px;z-index:99999;width:310px;font-family:sans-serif;font-size:13px;background:#1a1a1a;color:#eee;border-radius:10px;border:1px solid #333;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.5)">
  <div style="padding:8px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2a2a2a;background:#111">
    <span id="rb-dot" style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block"></span>
    <b>Rainboom Bot</b>
    <span id="rb-status" style="color:#777;font-size:11px;flex:1">stopped</span>
    <button id="rb-refresh" style="padding:2px 7px;background:#222;color:#aaa;border:1px solid #333;border-radius:5px;cursor:pointer;font-size:11px">↺ Refresh</button>
  </div>
  <div style="padding:8px 10px;border-bottom:1px solid #2a2a2a">
    <div style="font-size:11px;color:#777;margin-bottom:5px">Players <span style="color:#555">(from scoreboard)</span></div>
    <div id="rb-playerlist" style="max-height:130px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;padding-right:4px"></div>
    <div style="display:flex;gap:5px;margin-top:6px">
      <button id="rb-selall" style="flex:1;padding:3px;background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:5px;cursor:pointer;font-size:11px">All</button>
      <button id="rb-selnone" style="flex:1;padding:3px;background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:5px;cursor:pointer;font-size:11px">None</button>
    </div>
  </div>
  <div style="padding:8px 10px;border-bottom:1px solid #2a2a2a">
    <div style="font-size:11px;color:#777;margin-bottom:4px">Sizes <span style="color:#555">(comma-separated, cycles per target)</span></div>
    <input id="rb-sizes" placeholder="e.g. 1, 2, 0.5" style="width:100%;box-sizing:border-box;padding:5px 8px;background:#111;border:1px solid #333;border-radius:6px;color:#eee;font-size:12px;outline:none">
    <div id="rb-preview" style="margin-top:5px;font-size:10px;color:#555;font-family:monospace;word-break:break-all"></div>
  </div>
  <div style="padding:6px 10px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;gap:8px">
    <span style="color:#777;font-size:11px;white-space:nowrap">Interval</span>
    <input type="range" id="rb-speed" min="500" max="10000" step="100" value="2000" style="flex:1;accent-color:#818cf8">
    <span id="rb-speed-val" style="color:#777;font-size:11px;min-width:52px;text-align:right">2000ms</span>
  </div>
  <div style="padding:6px 10px 10px;display:flex;gap:6px">
    <button id="rb-start" style="flex:1;padding:6px;background:#14532d;color:#4ade80;border:1px solid #166534;border-radius:6px;cursor:pointer;font-size:12px">▶ Start</button>
    <button id="rb-stop"  style="flex:1;padding:6px;background:#450a0a;color:#f87171;border:1px solid #7f1d1d;border-radius:6px;cursor:pointer;font-size:12px">■ Stop</button>
    <button id="rb-once"  style="flex:1;padding:6px;background:#1e293b;color:#38bdf8;border:1px solid #0369a1;border-radius:6px;cursor:pointer;font-size:12px">↩ Once</button>
    <button id="rb-close" style="padding:6px 10px;background:#222;color:#888;border:1px solid #333;border-radius:6px;cursor:pointer;font-size:12px">✕</button>
  </div>
  <div id="rb-log" style="padding:2px 10px 7px;font-size:10px;color:#555;font-family:monospace;min-height:14px"></div>
</div>`;
  document.body.appendChild(ui);

  buildPlayerList();
  updatePreview();

  document.getElementById('rb-refresh').onclick=()=>{buildPlayerList();updatePreview();log('Refreshed');};
  document.getElementById('rb-playerlist').addEventListener('change',updatePreview);
  document.getElementById('rb-sizes').oninput=updatePreview;
  document.getElementById('rb-selall').onclick=()=>{document.querySelectorAll('#rb-playerlist input').forEach(cb=>cb.checked=true);updatePreview();};
  document.getElementById('rb-selnone').onclick=()=>{document.querySelectorAll('#rb-playerlist input').forEach(cb=>cb.checked=false);updatePreview();};
  document.getElementById('rb-speed').oninput=function(){speed=+this.value;document.getElementById('rb-speed-val').textContent=speed+'ms';};
  document.getElementById('rb-start').onclick=()=>{if(running)return;setRunning(true);tick();};
  document.getElementById('rb-stop').onclick=()=>{running=false;clearTimeout(timer);setRunning(false);};
  document.getElementById('rb-once').onclick=()=>{const t=getTargets(),sz=getSizes();if(!t.length){log('⚠ No targets');return;}t.forEach((p,i)=>setTimeout(()=>sendCmd(getCmd(p,sz[i%sz.length]||'_')),i*220));};
  document.getElementById('rb-close').onclick=()=>ui.remove();
})();
