javascript:(function(){
const loops={
  horse:["!pAsRW6gEAwDfmbzL5u8cB","!pAsRW6gEAwDfGr_Po0eYE","!pAsRW6gEAwDdGD924bwUH","!pAsRW6gEAwDfG7a5A74UB","!pAsRW6gEAwDcm6rawdCwE","!pAsRW6gEAwDemRY9J8tYE","!pAsRW6gEAwDdmMtdK2p4H","!pAsRW6gEAwDdmhvuLon8D","!pAsRW6gEAwDdGJPpDox8G","!pAsRW6gEAwDdmzfn7M30H","!pAsRW6gEAwDfmP6v7pdED","!pAsRW6gEAwDfmTzL6pykG"],
};

let running=false,timer=null,speed=2000;

const ui=document.createElement('div');
ui.innerHTML=`
<div id="sb-panel" style="position:fixed;bottom:16px;right:16px;z-index:99999;width:300px;font-family:sans-serif;font-size:13px;background:#1a1a1a;color:#eee;border-radius:10px;border:1px solid #333;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.5)">
  <div style="padding:8px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #2a2a2a;background:#111">
    <span id="rb-dot" style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block"></span>
    <b>Rainboom Bot</b>
    <span id="rb-status" style="color:#777;font-size:11px">stopped</span>
  </div>
  <div style="padding:12px 10px;border-bottom:1px solid #2a2a2a;display:flex;flex-direction:column;gap:8px">
    <div style="display:flex;align-items:center;gap:8px">
      <label style="color:#aaa;font-size:12px;width:48px">Player</label>
      <input id="rb-player" placeholder="username" style="flex:1;padding:5px 8px;background:#111;border:1px solid #333;border-radius:6px;color:#eee;font-size:12px;outline:none">
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <label style="color:#aaa;font-size:12px;width:48px">Size</label>
      <input id="rb-size" placeholder="e.g. 1.5" style="flex:1;padding:5px 8px;background:#111;border:1px solid #333;border-radius:6px;color:#eee;font-size:12px;outline:none">
    </div>
    <div id="rb-preview" style="font-size:11px;color:#555;font-family:monospace">/rainboom _ _</div>
  </div>
  <div style="padding:8px 10px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;gap:8px">
    <span style="color:#777;font-size:11px;white-space:nowrap">Interval</span>
    <input type="range" id="rb-speed" min="50" max="5000" step="50" value="2000" style="flex:1;accent-color:#818cf8">
    <span id="rb-speed-val" style="color:#777;font-size:11px;min-width:48px;text-align:right">2000ms</span>
  </div>
  <div style="padding:6px 10px 10px;display:flex;gap:6px">
    <button id="rb-start" style="flex:1;padding:6px;background:#14532d;color:#4ade80;border:1px solid #166534;border-radius:6px;cursor:pointer;font-size:12px">▶ Start</button>
    <button id="rb-stop"  style="flex:1;padding:6px;background:#450a0a;color:#f87171;border:1px solid #7f1d1d;border-radius:6px;cursor:pointer;font-size:12px">■ Stop</button>
    <button id="rb-once"  style="flex:1;padding:6px;background:#1e293b;color:#38bdf8;border:1px solid #0369a1;border-radius:6px;cursor:pointer;font-size:12px">↩ Once</button>
    <button id="rb-close" style="padding:6px 10px;background:#222;color:#888;border:1px solid #333;border-radius:6px;cursor:pointer;font-size:12px">✕</button>
  </div>
  <div id="rb-log" style="padding:4px 10px 8px;font-size:10px;color:#555;font-family:monospace;min-height:16px"></div>
</div>`;
document.body.appendChild(ui);

const $=id=>document.getElementById(id);

function getCmd(){
  const p=$('rb-player').value.trim()||'_';
  const s=$('rb-size').value.trim()||'_';
  return `/rainboom ${p} ${s}`;
}
function updatePreview(){$('rb-preview').textContent=getCmd();}
function setRunning(r){running=r;$('rb-dot').style.background=r?'#4ade80':'#ef4444';$('rb-status').textContent=r?'running':'stopped';}
function log(msg){$('rb-log').textContent=msg;}

function sendCmd(){
  const cmd=getCmd();
  const input=document.getElementById('msgText');
  if(!input){log('⚠ msgText not found');return;}
  input.value=cmd;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  setTimeout(()=>{
    input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
    input.value='';
    log('Sent: '+cmd);
  },100);
}

function tick(){sendCmd();if(running)timer=setTimeout(tick,speed);}

$('rb-player').oninput=updatePreview;
$('rb-size').oninput=updatePreview;
$('rb-speed').oninput=function(){speed=+this.value;$('rb-speed-val').textContent=speed+'ms';};
$('rb-start').onclick=()=>{if(running)return;setRunning(true);tick();};
$('rb-stop').onclick=()=>{running=false;clearTimeout(timer);setRunning(false);};
$('rb-once').onclick=()=>sendCmd();
$('rb-close').onclick=()=>ui.remove();

updatePreview();
})();
