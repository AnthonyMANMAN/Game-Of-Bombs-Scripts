(function(){
  const panel = document.createElement('div');
  panel.style = "position:fixed;top:10px;right:10px;z-index:99999;background:#222;color:#fff;padding:12px;border-radius:8px;font-family:sans-serif;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.5);min-width:220px;";
  panel.innerHTML = `
    <div style="margin-bottom:8px;font-weight:bold;">Leaderboard Finder</div>
    <input id="lb-nick" type="text" placeholder="Nickname" style="width:100%;padding:4px;box-sizing:border-box;margin-bottom:6px;color:#000;">
    <div style="display:flex;gap:6px;margin-bottom:6px;">
      <button id="lb-find" style="flex:1;padding:4px;cursor:pointer;">Find</button>
      <button id="lb-stop" style="flex:1;padding:4px;cursor:pointer;" disabled>Stop</button>
    </div>
    <div id="lb-status" style="font-size:12px;color:#ccc;"></div>
  `;
  document.body.appendChild(panel);

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const getPageText = () => document.querySelector('.pages-count')?.textContent.trim();
  const statusEl = panel.querySelector('#lb-status');
  const findBtn = panel.querySelector('#lb-find');
  const stopBtn = panel.querySelector('#lb-stop');
  const nickInput = panel.querySelector('#lb-nick');

  let stopFlag = false;

  stopBtn.onclick = () => { stopFlag = true; statusEl.textContent = 'Stopping...'; };

  findBtn.onclick = async () => {
    const target = nickInput.value.trim().toLowerCase();
    if(!target){ statusEl.textContent = 'Enter a nickname.'; return; }

    stopFlag = false;
    findBtn.disabled = true;
    stopBtn.disabled = false;
    statusEl.textContent = 'Searching page ' + (getPageText() || '...');

    while(true){
      if(stopFlag){ statusEl.textContent = 'Stopped.'; break; }
      await sleep(600);

      const items = document.querySelectorAll('.rankings-list li');
      let found = false;
      for(const li of items){
        const nameEl = li.querySelector('.rankings-nickname');
        if(!nameEl) continue;
        const name = nameEl.textContent.replace(/\u00A0/g,' ').trim().toLowerCase();
        if(name === target){
          const place = li.querySelector('.rankings-place')?.textContent.trim();
          statusEl.textContent = `Found "${name}" at position ${place} (page ${getPageText()})`;
          found = true;
          break;
        }
      }
      if(found) break;

      if(stopFlag){ statusEl.textContent = 'Stopped.'; break; }

      const btn = document.querySelector('.scroll-next');
      if(!btn || btn.disabled){ statusEl.textContent = 'Not found (end of list).'; break; }

      const before = getPageText();
      btn.click();
      statusEl.textContent = 'Searching page ' + (getPageText() || '...');

      let tries = 0;
      while(getPageText() === before && tries < 20){
        if(stopFlag) break;
        await sleep(150);
        tries++;
      }
    }

    findBtn.disabled = false;
    stopBtn.disabled = true;
  };

  nickInput.addEventListener('keydown', e => { if(e.key === 'Enter') findBtn.click(); });
})();
