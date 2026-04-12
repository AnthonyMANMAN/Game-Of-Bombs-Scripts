(function(){
const loops={
  horse:["!pAsRW6gEAwDfmbzL5u8cB","!pAsRW6gEAwDfGr_Po0eYE","!pAsRW6gEAwDdGD924bwUH","!pAsRW6gEAwDfG7a5A74UB","!pAsRW6gEAwDcm6rawdCwE","!pAsRW6gEAwDemRY9J8tYE","!pAsRW6gEAwDdmMtdK2p4H","!pAsRW6gEAwDdmhvuLon8D","!pAsRW6gEAwDdGJPpDox8G","!pAsRW6gEAwDdmzfn7M30H","!pAsRW6gEAwDfmP6v7pdED","!pAsRW6gEAwDfmTzL6pykG"],
  hamster:["!hAglBGgIAgD8A8AOADgAY","!hAglBGgIAgL9b8MPAfwMp","!hAglBGgIAgOofoP6A$gMC","!hAglBGgIAAMYfAPwG8BMz","!hAglBGgIAAMDfDfw_8P8L","!hAglBGgIAAADgDwg_IPwI","!hAglBGgIAADPgLwO_DPwo","!hAglBGgIAgD9g$APmD9AX"],
  bears:["!bIMgAAQAA_gDADwA_AFg=","!bIMgAAQAA_s3Avw6_CeA=","!bIMgAAQAA_nLAnh97fng=","!bIMgAAQAARP8AZEuQLTU=","!bIMgAAQAABP_7peuXruc=","!bIMgAAQAAAIQ_EOhAoK8=","!bIMgAAQAAqoC_CugqoNM=","!bIMgAAQAA_gC3Hsh_UKM="],
  sword:["!BQQUGAAAwIBT$AGA=","!BQQUGAAAwIBT$DXw=","!BQQUGAAAwIBT2H$g=","!BQQUGAAAwIBQ2H1g=","!BQQUGAAAwIBQGH1s=","!BQQUGAAAwIBQG5O8=","!BQQUGAAAwIBS$4Fs=","!BQQUGAAAwIBT$IKo="],
  outfit:["!BQQU2_AA0IBQGAEg=","!BQQU23MA_IBQGAAg=","!BQQU2AH8_IBQGACg=","!BQQU2AL8yIBQGAMQ=","!BQQU2qD8wIBQGAGg=","!BQQU2_CgwIBQGAMQ=","!BQQU2_AAwIBQGABw="],
  pumpkin:["!BIQBoAAAAAAAAQAAAdAD4AeAHQAQ=","!BIQBoAAAAAAAAQAAA_g34L$Bf4Ac=","!BIQBoAAAAAAAAQAAA_h_4d$D_AAY=","!BIQBoAAAAAAAAQAAAgB8AfiD5YAU=","!BIQBoAAAAAAAAQAAAgL8H_jz4XAc=","!BIQBoAAAAAAAAQAAAQuCfgD8C3wc=","!BIQBoAAAAAAAAQAAAfuDfgf8HWQQ="]
};

const loopColors={
  horse:  {bg:'#1a2f1a', text:'#4ade80', border:'#166534', active:'#14532d'},
  hamster:{bg:'#2a1f0e', text:'#fb923c', border:'#92400e', active:'#78350f'},
  bears:  {bg:'#1a1a2e', text:'#818cf8', border:'#3730a3', active:'#312e81'},
  sword:  {bg:'#2a1a1a', text:'#f87171', border:'#991b1b', active:'#7f1d1d'},
  outfit: {bg:'#1a2535', text:'#38bdf8', border:'#0369a1', active:'#0c4a6e'},
  pumpkin:{bg:'#2a1800', text:'#fb8c00', border:'#e65100', active:'#bf360c'}
};

const loopEmoji={horse:'🐴',hamster:'🐹',bears:'🐻',sword:'⚔️',outfit:'👘',pumpkin:'🎃'};

let activeLoop='horse';
let skins=[...loops.horse];
let idx=0,speed=2000,running=false,timer=null,filtered=[...skins];

const ui=document.createElement('div');
ui.id='__skinbot__';
ui.innerHTML=`
<div id="sb-panel" style="position:fixed;bottom:16px;right:16px;z-index:99999;width:310px;font-family:sans-serif;font-size:13px;background:#1a1a1a;color:#eee;border-radius:10px;border:1px solid #333;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.5)">
  <div id="sb-header" style="padding:8px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border-bottom:1px solid #2a2a2a;user-select:none">
    <div style="display:flex;align-items:center;gap:8px">
      <span id="sb-dot" style="width:8px;height:8px;border-radius:50%;background:#555;display:inline-block"></span>
      <b>Skin Bot</b>
      <span id="sb-status" style="color:#777;font-size:11px">stopped</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <span id="sb-count" style="color:#555;font-size:11px">0/12</span>
      <span id="sb-chevron" style="color:#555;font-size:10px">▲</span>
    </div>
  </div>
  <div id="sb-body">
    <div style="padding:8px 10px;border-bottom:1px solid #2a2a2a;display:flex;gap:5px;flex-wrap:wrap">
      <button id="sb-loop-horse"   style="flex:1;min-width:50px;padding:5px 3px;background:#14532d;color:#4ade80;border:2px solid #4ade80;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold">🐴 Horse</button>
      <button id="sb-loop-hamster" style="flex:1;min-width:50px;padding:5px 3px;background:#2a1f0e;color:#fb923c;border:1px solid #92400e;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold">🐹 Hamster</button>
      <button id="sb-loop-bears"   style="flex:1;min-width:50px;padding:5px 3px;background:#1a1a2e;color:#818cf8;border:1px solid #3730a3;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold">🐻 Bears</button>
      <button id="sb-loop-sword"   style="flex:1;min-width:50px;padding:5px 3px;background:#2a1a1a;color:#f87171;border:1px solid #991b1b;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold">⚔️ Sword</button>
      <button id="sb-loop-outfit"  style="flex:1;min-width:50px;padding:5px 3px;background:#1a2535;color:#38bdf8;border:1px solid #0369a1;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold">👘 Outfit</button>
      <button id="sb-loop-pumpkin" style="flex:1;min-width:50px;padding:5px 3px;background:#2a1800;color:#fb8c00;border:1px solid #e65100;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold">🎃 Pumpkin</button>
    </div>
    <div style="padding:8px 10px;border-bottom:1px solid #2a2a2a">
      <input id="sb-search" placeholder="Search skins..." style="width:100%;padding:5px 8px;background:#111;border:1px solid #333;border-radius:6px;color:#eee;font-size:12px;outline:none;box-sizing:border-box">
    </div>
    <div id="sb-list" style="max-height:180px;overflow-y:auto;padding:4px"></div>
    <div style="padding:8px 10px;border-top:1px solid #2a2a2a;display:flex;align-items:center;gap:8px">
      <span style="color:#777;font-size:11px;white-space:nowrap">Speed</span>
      <input type="range" id="sb-speed" min="50" max="5000" step="50" value="2000" style="flex:1;accent-color:#4ade80">
      <span id="sb-speed-val" style="color:#777;font-size:11px;min-width:42px;text-align:right">2000ms</span>
    </div>
    <div style="padding:6px 10px 10px;display:flex;gap:6px">
      <button id="sb-start" style="flex:1;padding:6px;background:#14532d;color:#4ade80;border:1px solid #166534;border-radius:6px;cursor:pointer;font-size:12px">▶ Start</button>
      <button id="sb-stop"  style="flex:1;padding:6px;background:#450a0a;color:#f87171;border:1px solid #7f1d1d;border-radius:6px;cursor:pointer;font-size:12px">■ Stop</button>
      <button id="sb-close" style="padding:6px 10px;background:#222;color:#888;border:1px solid #333;border-radius:6px;cursor:pointer;font-size:12px">✕</button>
    </div>
  </div>
</div>`;
document.body.appendChild(ui);

const $=id=>document.getElementById(id);
let collapsed=false;

function switchLoop(name){
  const wasRunning=running;
  running=false;
  clearTimeout(timer);
  activeLoop=name;
  skins=[...loops[name]];
  idx=0;
  filtered=[...skins];
  Object.keys(loops).forEach(n=>{
    const btn=$('sb-loop-'+n);
    const c=loopColors[n];
    if(n===name){
      btn.style.border='2px solid '+c.text;
      btn.style.background=c.active;
    } else {
      btn.style.border='1px solid '+c.border;
      btn.style.background=c.bg;
    }
  });
  $('sb-search').value='';
  renderList();
  updateCount();
  updateDot();
  if(wasRunning){running=true;updateDot();sendSkin();}
}

function renderList(){
  const q=$('sb-search').value.toLowerCase();
  filtered=skins.filter(s=>s.toLowerCase().includes(q));
  $('sb-list').innerHTML=filtered.map(s=>`<div class="sb-item" data-skin="${s}" style="padding:4px 8px;border-radius:5px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;${s===skins[idx]?'background:#1e3a2f;color:#4ade80':''}">${s}<span style="font-size:10px;color:#555">${skins.indexOf(s)+1}</span></div>`).join('');
  $('sb-list').querySelectorAll('.sb-item').forEach(el=>{
    el.onmouseenter=()=>{if(el.style.background!=='rgb(30, 58, 47)')el.style.background='#222'};
    el.onmouseleave=()=>{if(el.dataset.skin!==skins[idx])el.style.background=''};
    el.onclick=()=>{idx=skins.indexOf(el.dataset.skin);sendSkin();updateCount()};
  });
}

function updateCount(){$('sb-count').textContent=`${idx+1}/${skins.length}`}
function updateDot(){$('sb-dot').style.background=running?'#4ade80':'#ef4444';$('sb-status').textContent=running?'running':'stopped'}

function sendSkin(){
  const input=document.getElementById('msgText');
  if(!input)return;
  const cmd=`/skin me ${skins[idx]}`;
  input.value=cmd;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  setTimeout(()=>{
    input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
    input.value='';
    updateCount();
    renderList();
    if(running){idx=(idx+1)%skins.length;timer=setTimeout(sendSkin,speed)}
  },100);
}

$('sb-header').onclick=()=>{
  collapsed=!collapsed;
  $('sb-body').style.display=collapsed?'none':'block';
  $('sb-chevron').textContent=collapsed?'▼':'▲';
};
$('sb-search').onclick=e=>e.stopPropagation();
$('sb-search').oninput=()=>renderList();
$('sb-speed').oninput=function(){speed=+this.value;$('sb-speed-val').textContent=speed+'ms'};
$('sb-start').onclick=()=>{if(running)return;running=true;updateDot();sendSkin()};
$('sb-stop').onclick=()=>{running=false;clearTimeout(timer);updateDot()};
$('sb-close').onclick=()=>ui.remove();
Object.keys(loops).forEach(n=>{
  $('sb-loop-'+n).onclick=e=>{e.stopPropagation();switchLoop(n)};
});

renderList();
updateCount();
console.log('%cSkin Bot UI injected!','color:#4ade80;font-size:14px;font-weight:bold');
})();
