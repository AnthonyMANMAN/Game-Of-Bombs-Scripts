(function(){
const ui=document.createElement('div');
ui.id='autoUI';
ui.innerHTML=`
<div id="toggleBtn" style="position:fixed;bottom:0;right:0;background:#1a1a1a;color:#fff;padding:8px 12px;border-radius:6px 0 0 0;font:11px monospace;z-index:99999;box-shadow:-2px -2px 8px rgba(0,0,0,0.4);border:1px solid #333;border-right:none;border-bottom:none;cursor:pointer;user-select:none;transition:background 0.15s">◀</div>
<div id="mainPanel" style="position:fixed;bottom:0;right:0;background:#1a1a1a;color:#fff;padding:12px;border-radius:6px 0 0 0;font:11px monospace;z-index:99998;box-shadow:-2px -2px 8px rgba(0,0,0,0.4);min-width:240px;border:1px solid #333;border-right:none;border-bottom:none;transform:translateX(100%);transition:transform 0.2s ease">
  <div style="margin-bottom:6px"><span style="color:#888">Цепь</span> Shift+J/О: <span id="kStat" style="color:#ff6b6b">ВЫКЛ</span></div>
  <div style="margin-bottom:6px"><span style="color:#888">Спин</span> Shift+H/Р: <span id="sStat" style="color:#ff6b6b">ВЫКЛ</span></div>
  <div style="margin-bottom:6px"><span style="color:#888">Перки</span> Shift+G/П: <span id="nStat" style="color:#ff6b6b">ВЫКЛ</span> <button data-n="1" style="background:#4CAF50;border:none;color:#fff;padding:2px 5px;margin:0 1px;border-radius:2px;cursor:pointer;font-size:10px">1</button><button data-n="2" style="background:#333;border:none;color:#ccc;padding:2px 5px;margin:0 1px;border-radius:2px;cursor:pointer;font-size:10px">2</button><button data-n="3" style="background:#333;border:none;color:#ccc;padding:2px 5px;margin:0 1px;border-radius:2px;cursor:pointer;font-size:10px">3</button><button data-n="4" style="background:#333;border:none;color:#ccc;padding:2px 5px;margin:0 1px;border-radius:2px;cursor:pointer;font-size:10px">4</button></div>
  <div><span style="color:#888">Бита</span> Shift+F/А: <span id="fStat" style="color:#ff6b6b">ГОТОВ</span></div>
</div>`;
document.body.appendChild(ui);

const toggleBtn = document.getElementById('toggleBtn');
const mainPanel = document.getElementById('mainPanel');
const kStat=document.getElementById('kStat'),sStat=document.getElementById('sStat'),nStat=document.getElementById('nStat'),fStat=document.getElementById('fStat');
let isExpanded = false;
let kSpam=false,sSpam=false,nSpam=false,fActive=false,activeNums=new Set(['1']),kInt,sInt,nInt;

function togglePanel() {
  isExpanded = !isExpanded;
  if (isExpanded) {
    mainPanel.style.transform = 'translateX(0)';
    toggleBtn.textContent = '▶';
    toggleBtn.style.background = '#333';
  } else {
    mainPanel.style.transform = 'translateX(100%)';
    toggleBtn.textContent = '◀';
    toggleBtn.style.background = '#1a1a1a';
  }
}

toggleBtn.addEventListener('click', togglePanel);

function fire(k){
const el=document.activeElement&&document.activeElement.tagName!=='BODY'?document.activeElement:document.body;
const isNum=k>='1'&&k<='4';
const code=isNum?`Digit${k}`:`Key${k.toUpperCase()}`;
const keyCode=isNum?48+parseInt(k):k.toUpperCase().charCodeAt(0);
const evt1=new KeyboardEvent('keydown',{key:k,code:code,keyCode:keyCode,which:keyCode,bubbles:true,cancelable:true,composed:true});
const evt2=new KeyboardEvent('keyup',{key:k,code:code,keyCode:keyCode,which:keyCode,bubbles:true,cancelable:true,composed:true});
el.focus();
el.dispatchEvent(evt1);
setTimeout(()=>el.dispatchEvent(evt2),15);
if(el.value!==undefined&&el.selectionStart!==undefined){
el.value+=k;
el.dispatchEvent(new Event('input',{bubbles:true}));
}
}
function holdK(){
if(fActive)return;
fActive=true;
fStat.textContent='АКТИВЕН';
fStat.style.color='#4CAF50';
const el=document.activeElement&&document.activeElement.tagName!=='BODY'?document.activeElement:document.body;
const evt1=new KeyboardEvent('keydown',{key:'k',code:'KeyK',keyCode:75,which:75,bubbles:true,cancelable:true,composed:true});
const evt2=new KeyboardEvent('keyup',{key:'k',code:'KeyK',keyCode:75,which:75,bubbles:true,cancelable:true,composed:true});
el.focus();
el.dispatchEvent(evt1);
setTimeout(()=>{
el.dispatchEvent(evt2);
fActive=false;
fStat.textContent='ГОТОВ';
fStat.style.color='#ff6b6b';
},3875);
}
function seqLoop(){
const keys=['w','a','s','d','w','d','s','a'];
let i=0;
let timeout;
let isKeyActive=false;
function next(){
if(sSpam&&!isKeyActive){
isKeyActive=true;
const currentKey=keys[i];

// Fire key
const el=document.activeElement&&document.activeElement.tagName!=='BODY'?document.activeElement:document.body;
const code=`Key${currentKey.toUpperCase()}`;
const keyCode=currentKey.toUpperCase().charCodeAt(0);
const evt1=new KeyboardEvent('keydown',{key:currentKey,code:code,keyCode:keyCode,which:keyCode,bubbles:true,cancelable:true,composed:true});
const evt2=new KeyboardEvent('keyup',{key:currentKey,code:code,keyCode:keyCode,which:keyCode,bubbles:true,cancelable:true,composed:true});
el.focus();
el.dispatchEvent(evt1);

// Release key after short duration
setTimeout(()=>{
el.dispatchEvent(evt2);
isKeyActive=false;
},1);

i=(i+1)%keys.length;
timeout=setTimeout(next,90);
}else if(!sSpam){
sStat.textContent='ВЫКЛ';
if(timeout)clearTimeout(timeout);
isKeyActive=false;
}else if(isKeyActive){
timeout=setTimeout(next,25);
}
}
next();
}
document.addEventListener('keydown',e=>{
if(e.target.closest('#autoUI'))return;
if(e.shiftKey&&e.code==='KeyJ'){
e.preventDefault();e.stopPropagation();
kSpam=!kSpam;kStat.textContent=kSpam?'ВКЛ':'ВЫКЛ';
if(kSpam)kInt=setInterval(()=>fire('k'),16);else clearInterval(kInt);
}else if(e.shiftKey&&e.code==='KeyH'){
e.preventDefault();e.stopPropagation();
sSpam=!sSpam;sStat.textContent=sSpam?'ВКЛ':'ВЫКЛ';
if(sSpam)seqLoop();
}else if(e.shiftKey&&e.code==='KeyG'){
e.preventDefault();e.stopPropagation();
nSpam=!nSpam;nStat.textContent=nSpam?'ВКЛ':'ВЫКЛ';
if(nSpam)nInt=setInterval(()=>{for(let n of activeNums)fire(n)},50);else clearInterval(nInt);
}else if(e.shiftKey&&e.code==='KeyF'){
e.preventDefault();e.stopPropagation();
holdK();
}
},true);
mainPanel.addEventListener('click',e=>{if(e.target.dataset.n){const n=e.target.dataset.n;if(activeNums.has(n)){activeNums.delete(n);e.target.style.background='#333';e.target.style.borderColor='#666'}else{activeNums.add(n);e.target.style.background='#4CAF50';e.target.style.borderColor='#4CAF50'}}});
})();
