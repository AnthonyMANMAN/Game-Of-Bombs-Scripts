const puppeteer = require('puppeteer');

// ─── Accounts ────────────────────────────────────────────────────────────────
const accounts = [
  { email: 'bodikgop@gmail.com',  pwd: '1234567890qwertyuiop' },
  { email: 'newbie73752',  pwd: '456123rur' },
  { email: 'testbot15',  pwd: '123123' },
  { email: 'testbot14',  pwd: '123123' },
  { email: 'Pns',        pwd: '123123' },
  { email: 'pmt',        pwd: '45645'  },
  { email: 'prn',        pwd: '45645'  },
  { email: 'r2d',        pwd: '123123' },
{ email: 'testbot16',        pwd: '123123' },
{ email: 'testbot17',        pwd: '123123' },
{ email: 'testbot12',        pwd: '123123' },
{ email: 'testbot13',        pwd: '123123' },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const PLACE_BOMBS   = true;
const MOVEMENT      = false;
const BOMB_INTERVAL = 2000;
const GAME_URL      = 'https://gameofbombs.com';

const Selectors = {
  RESPAWN_BUTTON: 'div.but_game button.button_style.buy_border',
};

// ─── Shared state ─────────────────────────────────────────────────────────────
const state = {
  deathCounts:    {},
  status:         {},
  lastActionTime: {},
};

// ─── Utilities ────────────────────────────────────────────────────────────────
const sleep   = ms => new Promise(r => setTimeout(r, ms));
const rand    = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

function log(level, botId, msg) {
  const ts     = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const prefix = botId != null ? `Bot-${String(botId).padStart(2, '0')}` : 'SUPERVISOR';
  console.log(`[${ts}] [${level.toUpperCase().padEnd(5)}] ${prefix}: ${msg}`);
}

function touchActivity(botId) {
  state.lastActionTime[botId] = new Date().toISOString();
}

// ─── Page helpers ─────────────────────────────────────────────────────────────
async function isVisible(page, selector, timeout = 300) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return true;
  } catch { return false; }
}

async function safeClick(page, selector, desc, botId, { timeout = 15000, delaySec = 0 } = {}) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    await page.click(selector);
    log('info', botId, `[OK] ${desc}`);
    if (delaySec) await sleep(rand(delaySec * 0.7, delaySec * 1.3) * 1000);
    return true;
  } catch (e) {
    log('error', botId, `[Fail] ${desc}: ${e.message}`);
    return false;
  }
}

async function isAliveQuick(page, botId) {
  try {
    return !(await isVisible(page, Selectors.RESPAWN_BUTTON, 300));
  } catch {
    log('debug', botId, 'alive check failed (assuming alive)');
    return true;
  }
}

const humanLikeDelay = (minMs = 80, maxMs = 250) => sleep(rand(minMs, maxMs));

// ─── Angular-safe fill ────────────────────────────────────────────────────────
async function angularFill(page, selector, value, desc, botId) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 15000 });
    await page.evaluate((sel, val) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error('element not found');
      const nativeDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      nativeDesc.set.call(el, val);
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur',   { bubbles: true }));
    }, selector, value);
    log('info', botId, `[OK] ${desc}`);
    return true;
  } catch (e) {
    log('error', botId, `[Fail] ${desc}: ${e.message}`);
    return false;
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
async function loginSequence(page, botId, creds) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let navOk = false;
      for (let nav = 0; nav < 3; nav++) {
        try {
          await page.goto(GAME_URL, { timeout: 30000, waitUntil: 'networkidle2' });
          navOk = true; break;
        } catch (navErr) {
          log('warn', botId, `Navigation attempt ${nav + 1} failed: ${navErr.message}`);
          await sleep(rand(2000, 4000));
        }
      }
      if (!navOk) { log('error', botId, 'All navigation attempts failed'); continue; }
      await sleep(rand(1000, 2000));

      const formVisible = await isVisible(page, 'form[name="lform"]', 2000);
      if (!formVisible) {
        await page.evaluate(() => {
          const el = document.querySelector('.signin') || document.querySelector('[ng-click*="signin"]');
          if (el) el.click();
        });
        await sleep(800);
      }

      if (!await angularFill(page, 'form[name="lform"] input[name="email"]', creds.email, 'email input', botId)) continue;
      if (!await angularFill(page, 'form[name="lform"] input[name="pwd"]',   creds.pwd,   'pwd input',   botId)) continue;

      await sleep(rand(300, 600));

      const loginBtn = await page.$('form[name="lform"] button.reg');
      if (!loginBtn) { log('warn', botId, 'Login button not found'); continue; }
      await loginBtn.click();
      log('info', botId, '[OK] click Login');

      if (await isVisible(page, '.butt_left_menu.to-play', 12000) ||
          await isVisible(page, 'div.butt_left_menu.ng-binding[dropdown-toggle]', 12000)) {
        log('info', botId, 'Login successful');
        return true;
      }
      log('warn', botId, 'Logged-in indicator not visible after login');
    } catch (e) {
      log('error', botId, `Login attempt ${attempt + 1} failed: ${e.message}`);
    }
    await sleep(3000);
  }
  return false;
}

// ─── Enter game ───────────────────────────────────────────────────────────────
async function enterGame(page, botId) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // ── 1. Open server dropdown ────────────────────────────────────────────
      const dropdownOpened = await page.evaluate(() => {
        const el = [...document.querySelectorAll('div.butt_left_menu[dropdown-toggle]')]
          .find(e => e.textContent.includes('Server'));
        if (el) {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          return true;
        }
        return false;
      });

      if (!dropdownOpened) {
        log('warn', botId, 'Server dropdown element not found');
        await sleep(1000);
        continue;
      }
      log('info', botId, '[OK] open server dropdown');
      await sleep(rand(800, 1200));

      // ── 2. Wait for server list visible ───────────────────────────────────
      let listVisible = false;
      for (let check = 0; check < 6; check++) {
        listVisible = await page.evaluate(() => {
          const list = document.querySelector('ul.server-list');
          if (!list) return false;
          const s = window.getComputedStyle(list);
          return s.display !== 'none' && s.visibility !== 'hidden';
        });
        if (listVisible) break;
        if (check === 2) {
          await page.evaluate(() => {
            const el = [...document.querySelectorAll('div.butt_left_menu[dropdown-toggle]')]
              .find(e => e.textContent.includes('Server'));
            if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          });
        }
        await sleep(500);
      }

      if (!listVisible) {
        log('warn', botId, 'Server list did not appear');
        continue;
      }

      // ── 3. Select server + optionally select room from server.rooms ────────
      const serverNavPromise = page.waitForNavigation({
        waitUntil: 'networkidle2', timeout: 15000,
      }).catch(() => null);

      const serverResult = await page.evaluate(() => {
        let el = document.querySelector('ul.server-list');
        let scope = null;
        while (el) {
          try {
            const s = angular.element(el).scope();
            if (s?.sortedServers) { scope = s; break; }
          } catch {}
          el = el.parentElement;
        }
        if (!scope) return { error: 'NO_SCOPE' };

        const available = (scope.sortedServers || []).filter(s => !s.down && !s.status?.full);
        const eu        = available.find(s => s.id === 'EU') || available[0];
        if (!eu) return { error: 'NO_SERVER' };

        scope.$apply(() => scope.selectServer(eu));

        // Rooms may already be on the server object
        const rooms = eu.rooms || [];
        return {
          serverId:  eu.id,
          roomCount: rooms.length,
          roomNames: rooms.map(r => r.name || r.id || r.type),
        };
      });

      log('info', botId, `Server select: ${JSON.stringify(serverResult)}`);
      if (serverResult.error) {
        log('warn', botId, `Server select failed: ${serverResult.error}`);
        await sleep(1000);
        continue;
      }

      await serverNavPromise;
      await sleep(rand(800, 1500));

      // ── 4. Select room — OPTIONAL, only if rooms are available ────────────
      if (serverResult.roomCount > 0) {
        const roomNavPromise = page.waitForNavigation({
          waitUntil: 'networkidle2', timeout: 15000,
        }).catch(() => null);

        const roomPicked = await page.evaluate(() => {
          // Find scope with sortedServers to get the selected server's rooms
          let el = document.querySelector('ul.server-list');
          let scope = null;
          while (el) {
            try {
              const s = angular.element(el).scope();
              if (s?.sortedServers) { scope = s; break; }
            } catch {}
            el = el.parentElement;
          }
          if (!scope) return 'NO_SCOPE';

          const available = (scope.sortedServers || []).filter(s => !s.down && !s.status?.full);
          const eu        = available.find(s => s.id === 'EU') || available[0];
          if (!eu) return 'NO_SERVER';

          const rooms  = eu.rooms || [];
          if (!rooms.length) return 'NO_ROOMS';

          const mixed  = rooms.find(r => (r.name || r.type || '').toLowerCase().includes('mixed'));
          const target = mixed || rooms[0];

          // selectRoom may be on the same scope or a parent
          let sel = document.querySelector('ul.server-list');
          while (sel) {
            try {
              const s = angular.element(sel).scope();
              if (s?.selectRoom) {
                s.$apply(() => s.selectRoom(target));
                return target.name || target.id || target.type || 'unknown';
              }
            } catch {}
            sel = sel.parentElement;
          }
          return 'NO_SELECT_ROOM_FN';
        });

        log('info', botId, `Room select: ${roomPicked}`);

        // Only warn — don't bail if room selection fails, some bots enter without it
        if (!roomPicked || roomPicked.startsWith('NO_')) {
          log('warn', botId, `Room select failed (${roomPicked}) — continuing anyway`);
        }

        await roomNavPromise;
        await sleep(rand(800, 1500));
      } else {
        log('info', botId, 'No rooms on server object — skipping room select');
      }

      // ── 5. Confirm in-game ────────────────────────────────────────────────
      let confirmed = false;
      const deadline = Date.now() + 25000;
      while (Date.now() < deadline && !confirmed) {
        confirmed = await page.evaluate(() => {
          if (document.querySelector('#listChat'))     return true;
          if (document.querySelector('div.but_game'))  return true;
          if (document.querySelector('#viewport'))     return true;
          if (document.querySelector('canvas#layer0')) return true;
          const spans = [...document.querySelectorAll('.out_modal_light span')];
          if (spans.some(s =>
            s.textContent.includes('Entering game') &&
            !s.classList.contains('ng-hide')
          )) return true;
          return false;
        });
        if (!confirmed) await sleep(600);
      }

      if (confirmed) {
        log('info', botId, 'Successfully entered game');
        await sleep(rand(2000, 3500));
        return true;
      }
      log('warn', botId, 'Game not confirmed after room selection');

    } catch (e) {
      log('error', botId, `Game entry attempt ${attempt + 1} failed: ${e.message}`);
    }
    await sleep(2000);
  }
  return false;
}

// ─── Movement ─────────────────────────────────────────────────────────────────
async function pressKeysFor(page, keys, durationMs) {
  try {
    for (const k of keys) await page.keyboard.down(k);
    await sleep(durationMs);
  } finally {
    for (const k of keys) { try { await page.keyboard.up(k); } catch {} }
  }
}

async function performMovementSequence(page, botId, baseDurationRange = [1000, 3000]) {
  touchActivity(botId);
  const wasd     = ['w', 'a', 's', 'd'];
  const seqCount = randInt(1, 3);

  for (let i = 0; i < seqCount; i++) {
    const r          = Math.random();
    const actionType = r < 0.6 ? 'move' : r < 0.75 ? 'diagonal' : r < 0.9 ? 'burst' : 'pause';
    const duration   = rand(...baseDurationRange);

    if (actionType === 'move') {
      await pressKeysFor(page, [wasd[randInt(0, 3)]], duration);
    } else if (actionType === 'diagonal') {
      const shuffled = [...wasd].sort(() => 0.5 - Math.random());
      await pressKeysFor(page, shuffled.slice(0, 2), duration * rand(0.6, 0.95));
    } else if (actionType === 'burst') {
      for (let b = 0; b < randInt(2, 4); b++) {
        await pressKeysFor(page, [wasd[randInt(0, 3)]], rand(120, 250));
        await sleep(rand(60, 140));
      }
    } else {
      await sleep(duration);
    }

    if (PLACE_BOMBS && Math.random() > 0.85) {
      await page.keyboard.press('k');
      await humanLikeDelay(50, 200);
    }

    touchActivity(botId);
    await sleep(rand(80, 200));
  }
}

// ─── Spawn actions ────────────────────────────────────────────────────────────
async function performSpawnActions(page, botId) {
  await sleep(rand(200, 800));
  if (PLACE_BOMBS) {
    const count = randInt(1, 2);
    for (let i = 0; i < count; i++) {
      if (!await isAliveQuick(page, botId)) return false;
      await page.keyboard.press('k');
      await humanLikeDelay(50, 180);
    }
  }
  if (MOVEMENT) await performMovementSequence(page, botId, [2000, 4000]);
  return true;
}

// ─── Game loop ────────────────────────────────────────────────────────────────
async function gameFlow(page, botId) {
  let lastBomb       = Date.now() - BOMB_INTERVAL;
  let lastAliveCheck = Date.now();
  const ALIVE_INT    = 8000;
  const LOOP_SLEEP   = 4000;
  const STALL_MS     = 60000; // increased from 40s — give bots more time

  // !! FIX: reset activity timer the moment we enter game flow
  touchActivity(botId);

  while (true) {
    try {
      const now = Date.now();

      // ── Alive / respawn check ──────────────────────────────────────────────
      if (now - lastAliveCheck >= ALIVE_INT) {
        lastAliveCheck = now;
        if (await isVisible(page, Selectors.RESPAWN_BUTTON, 500)) {
          state.deathCounts[botId] = (state.deathCounts[botId] || 0) + 1;
          log('info', botId, `Died #${state.deathCounts[botId]}`);

          if (!await safeClick(page, Selectors.RESPAWN_BUTTON, 'respawn', botId, { delaySec: 0.8 })) {
            log('warn', botId, 'Respawn failed — reinitializing');
            return false;
          }

          touchActivity(botId); // !! reset after respawn click

          if (!await performSpawnActions(page, botId)) {
            log('info', botId, 'Died during spawn actions');
            continue;
          }

          log('info', botId, 'Spawn actions complete');
          state.status[botId] = 'alive';
          touchActivity(botId);
          await sleep(rand(800, 1500));
          lastBomb = Date.now() - BOMB_INTERVAL;
        }
      }

      // ── Bomb placement ─────────────────────────────────────────────────────
      const alive = await isAliveQuick(page, botId);
      if (alive && PLACE_BOMBS && Date.now() - lastBomb >= BOMB_INTERVAL) {
        await page.keyboard.press('k');
        lastBomb = Date.now();
        touchActivity(botId); // !! reset on every bomb
        await sleep(rand(50, 220));
        log('debug', botId, 'Placed bomb');
      }

      // ── Optional movement ──────────────────────────────────────────────────
      if (MOVEMENT && alive && Math.random() > 0.85) {
        await performMovementSequence(page, botId);
      }

      // ── Stall detection ────────────────────────────────────────────────────
      const lastAct = new Date(state.lastActionTime[botId] || new Date());
      if (Date.now() - lastAct.getTime() > STALL_MS) {
        log('warn', botId, `No activity for ${STALL_MS / 1000}s — restarting`);
        return false;
      }

      await sleep(LOOP_SLEEP + rand(0, 120));

    } catch (e) {
      log('error', botId, `Game flow error: ${e.message}`);
      return false;
    }
  }
}

// ─── Bot worker ───────────────────────────────────────────────────────────────
async function botWorker(botId, creds) {
  log('info', botId, '========== START ==========');
  state.status[botId]         = 'starting';
  touchActivity(botId);

  while (true) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
        ],
        timeout: 30000,
        protocolTimeout: 60000,
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 860, height: 600 });
      page.setDefaultTimeout(20000);

      state.deathCounts[botId] = 0;
      state.status[botId]      = 'logging_in';

      if (!await loginSequence(page, botId, creds)) throw new Error('Login failed after 3 attempts');

      state.status[botId] = 'entering_game';
      if (!await enterGame(page, botId))            throw new Error('Game entry failed after 3 attempts');

      state.status[botId] = 'in_game';
      log('info', botId, 'In game — starting main loop');
      touchActivity(botId); // !! reset before entering game loop

      while (true) {
        if (!await gameFlow(page, botId)) {
          log('warn', botId, 'Restarting game flow');
          // Try to re-enter game without full browser restart
          touchActivity(botId);
          if (await enterGame(page, botId)) {
            log('info', botId, 'Re-entered game successfully');
            touchActivity(botId);
            continue;
          }
          break; // fall through to browser restart
        }
      }

    } catch (e) {
      log('error', botId, `Critical error: ${e.message}`);
      state.status[botId] = `error: ${e.message}`;
    } finally {
      if (browser) { try { await browser.close(); } catch {} }
    }

    await sleep(rand(1500, 4500));
  }
}

// ─── Supervisor ───────────────────────────────────────────────────────────────
function startSupervisor() {
  setInterval(() => {
    try {
      const lines = ['', '==== Bot Status Report ===='];
      for (const botId of Object.keys(state.status).sort((a, b) => +a - +b)) {
        const last   = (state.lastActionTime[botId] || 'never').split('.')[0];
        const deaths = state.deathCounts[botId] || 0;
        const status = state.status[botId]      || 'unknown';
        lines.push(`  Bot-${String(botId).padStart(2, '0')}: ${status.padEnd(14)} | Deaths: ${deaths} | Last: ${last}`);
      }
      lines.push('');
      console.log(lines.join('\n'));
    } catch (e) {
      log('error', null, `Supervisor error: ${e.message}`);
    }
  }, 30000);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`=== Starting ${accounts.length} bots ===`);
  startSupervisor();

  for (let i = 0; i < accounts.length; i++) {
    const botId = i + 1;
    botWorker(botId, accounts[i]).catch(e =>
      log('error', botId, `Unhandled error: ${e.message}`)
    );
    await sleep(rand(3000, 6000));
  }

  await new Promise(() => {});
}

main();
