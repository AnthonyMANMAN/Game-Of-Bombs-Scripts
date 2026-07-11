// ==UserScript==
// @name         Guest Reroll Cycler
// @namespace    guest-reroll
// @version      3.0
// @match        https://gameofbombs.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STORE_KEY = 'guestCycleState';

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || { active: false, count: 0, lastNick: '', found: false };
    } catch {
      return { active: false, count: 0, lastNick: '', found: false };
    }
  }
  function setState(s) {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  }

  function isVisible(el) {
    return !!el && el.isConnected && el.offsetParent !== null;
  }

  // ---- generic waiter: resolves with whichever finder returns something first ----
  function waitForAny(finders, timeout = 20000, label = '') {
    return new Promise((resolve, reject) => {
      let settled = false;

      const tryFind = () => {
        if (settled) return;
        for (const f of finders) {
          let found;
          try { found = f.fn(); } catch { found = null; }
          if (found) {
            settled = true;
            clearInterval(pollId);
            obs.disconnect();
            clearTimeout(timeoutId);
            resolve({ key: f.key, el: found });
            return;
          }
        }
      };

      const pollId = setInterval(tryFind, 250);

      const obs = new MutationObserver(tryFind);
      obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'ng-show', 'ng-hide'],
        characterData: true
      });

      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        clearInterval(pollId);
        obs.disconnect();
        reject(new Error(`Timeout waiting for: ${label || 'element'}`));
      }, timeout);

      tryFind();
    });
  }

  function waitFor(fn, timeout = 20000, label = '') {
    return waitForAny([{ key: 'x', fn }], timeout, label).then(r => r.el);
  }

  // ---- finders ----
  function findGuestLink() {
    return Array.from(document.querySelectorAll('a'))
      .find(a => a.textContent.trim() === 'Play as Guest' && isVisible(a));
  }
  function findNicknameSpan() {
    // primary: exact class
    let el = Array.from(document.querySelectorAll('span.nickname')).find(isVisible);
    if (el) return el;
    // fallback: any element whose text looks like "~guest12345" or "guest12345"
    el = Array.from(document.querySelectorAll('span'))
      .find(s => isVisible(s) && /guest\d{3,}/i.test(s.textContent));
    return el || null;
  }
  function findLogoutLink() {
    return Array.from(document.querySelectorAll('a'))
      .find(a => a.textContent.trim() === 'Logout' && isVisible(a));
  }
  function findOkButton() {
    return Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Ok' && isVisible(b));
  }

  // ---- pattern check ----
  function extractDigits(text) {
    const m = text.match(/guest(\d+)/i);
    return m ? m[1] : null;
  }
  function checkWin(digits) {
    if (!digits) return false;
    if (/^(\d)\1+$/.test(digits) && digits.length >= 4) return true;
    for (let i = 0; i <= digits.length - 4; i++) {
      const chunk = digits.slice(i, i + 4);
      if (/^(\d)\1{3}$/.test(chunk)) return true;
    }
    return false;
  }

  // ---- UI panel ----
  function buildUI() {
    if (document.getElementById('guest-cycler-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'guest-cycler-panel';
    panel.style.cssText = `
      position: fixed; top: 10px; right: 10px; z-index: 999999;
      background: #1e1e1e; color: #fff; font: 13px monospace;
      padding: 10px 12px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,.5);
      min-width: 200px;
    `;
    panel.innerHTML = `
      <div style="font-weight:bold; margin-bottom:6px;">Guest Reroll Cycler</div>
      <div id="gc-status">idle</div>
      <div id="gc-count">attempts: 0</div>
      <div id="gc-last">last: -</div>
      <div style="margin-top:8px; display:flex; gap:6px;">
        <button id="gc-start" style="flex:1;">Start</button>
        <button id="gc-stop" style="flex:1;">Stop</button>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('gc-start').onclick = () => {
      const s = getState();
      s.active = true;
      s.found = false;
      setState(s);
      updateUI();
      runCycle();
    };
    document.getElementById('gc-stop').onclick = () => {
      const s = getState();
      s.active = false;
      setState(s);
      updateUI();
    };
  }

  function updateUI() {
    const s = getState();
    const statusEl = document.getElementById('gc-status');
    const countEl = document.getElementById('gc-count');
    const lastEl = document.getElementById('gc-last');
    if (statusEl) statusEl.textContent = s.active ? 'running...' : (s.found ? 'FOUND!' : 'idle');
    if (countEl) countEl.textContent = `attempts: ${s.count}`;
    if (lastEl) lastEl.textContent = `last: ${s.lastNick || '-'}`;
  }

  // ---- main cycle ----
  async function runCycle() {
    const s = getState();
    if (!s.active) return;

    try {
      // Step 1: figure out what state we're actually in right now.
      // Either the "Play as Guest" link is showing (logged out),
      // or a nickname is already showing (session auto-resumed after reload).
      const first = await waitForAny(
        [
          { key: 'guest', fn: findGuestLink },
          { key: 'nick', fn: findNicknameSpan }
        ],
        20000,
        '"Play as Guest" link OR nickname span'
      );

      let nickText;
      if (first.key === 'guest') {
        first.el.click();
        const nickEl = await waitFor(findNicknameSpan, 20000, 'nickname span (after guest click)');
        nickText = nickEl.textContent.trim();
      } else {
        // already logged in as guest on load
        nickText = first.el.textContent.trim();
      }

      const digits = extractDigits(nickText);
      const st = getState();
      st.count += 1;
      st.lastNick = nickText;
      setState(st);
      updateUI();

      if (checkWin(digits)) {
        st.active = false;
        st.found = true;
        setState(st);
        updateUI();
        console.log(`%cMATCH FOUND: ${nickText}`, 'color: lime; font-weight:bold;');
        return;
      }

      // not a match -> logout, confirm, which triggers reload
      const logoutLink = await waitFor(findLogoutLink, 20000, '"Logout" link');
      logoutLink.click();

      const okBtn = await waitFor(findOkButton, 20000, '"Ok" button');
      okBtn.click();
      // page should reload now; script re-runs on next load via @match
    } catch (err) {
      console.error('Guest cycler error:', err.message);
      console.log('Current URL:', location.href);
      console.log('Visible <a> texts:', Array.from(document.querySelectorAll('a')).filter(isVisible).map(a => a.textContent.trim()));
      console.log('Visible <button> texts:', Array.from(document.querySelectorAll('button')).filter(isVisible).map(b => b.textContent.trim()));
      console.log('Visible <span> texts (first 20):', Array.from(document.querySelectorAll('span')).filter(isVisible).map(s => s.textContent.trim()).filter(Boolean).slice(0, 20));
      setTimeout(() => { if (getState().active) runCycle(); }, 2500);
    }
  }

  // ---- init on every page load ----
  buildUI();
  updateUI();
  const s = getState();
  if (s.active) {
    setTimeout(runCycle, 800);
  }
})();
