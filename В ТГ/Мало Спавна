// ============================================================
//  GoB Bots — Puppeteer multi-account server-cycling bot
//  Usage:
//    npm install puppeteer
//    node gob_bots.js
// ============================================================

const puppeteer = require('puppeteer');

// ── CONFIG ───────────────────────────────────────────────────
const accounts = [
    { email: 'testbot1', pwd: '123123' },
    { email: 'testbot2', pwd: '123123' },
    { email: 'testbot3', pwd: '123123' },
    { email: 'testbot4', pwd: '123123' },
];

const TARGET_SERVERS   = ['US', 'EU', 'RU', 'BR', 'AU', 'JP'];
const GAME_URL         = 'https://gameofbombs.com';
const SERVER_DWELL_MS  = 30_000;   // ms to stay on each server
const BOMB_INTERVAL_MS = 2_000;    // ms between bomb presses
const HEADLESS         = true;     // set false to watch
// ─────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand  = (lo, hi) => lo + Math.random() * (hi - lo);

// ── Logging ──────────────────────────────────────────────────
function log(botId, level, msg) {
    const ts  = new Date().toTimeString().slice(0, 8);
    const tag = level === 'ERR' ? '\x1b[31m[ERR]\x1b[0m'
              : level === 'OK'  ? '\x1b[32m[OK ]\x1b[0m'
              : level === 'DBG' ? '\x1b[90m[DBG]\x1b[0m'
              :                   '\x1b[36m[INF]\x1b[0m';
    console.log(`${ts} Bot-${botId} ${tag} ${msg}`);
}

// ── Page helpers ─────────────────────────────────────────────

async function safeClick(page, botId, selector, desc, delayMs = 0) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout: 15_000 });
        await page.click(selector);
        log(botId, 'OK', desc);
        if (delayMs) await sleep(rand(delayMs * 0.7, delayMs * 1.3));
        return true;
    } catch (e) {
        log(botId, 'ERR', `${desc}: ${e.message.split('\n')[0]}`);
        return false;
    }
}

async function safeFill(page, botId, selector, text, desc) {
    try {
        await page.waitForSelector(selector, { visible: true, timeout: 15_000 });
        await page.$eval(selector, (el, val) => {
            const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            nativeSetter.call(el, val);
            el.dispatchEvent(new Event('input',  { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, text);
        log(botId, 'OK', desc);
        return true;
    } catch (e) {
        log(botId, 'ERR', `${desc}: ${e.message.split('\n')[0]}`);
        return false;
    }
}

// ── Server helpers (from gob-monitor) ────────────────────────

async function getAvailableServers(page) {
    try {
        return await page.evaluate(() => {
            const seen = new Set();
            return [
                ...document.querySelectorAll('#server-select .server-list li:not(.down) h2'),
                ...document.querySelectorAll('.server-list li:not(.down) h2'),
            ].map(el => el.textContent.trim()).filter(n => {
                if (!n || n === 'DEV' || seen.has(n)) return false;
                seen.add(n); return true;
            });
        });
    } catch (_) { return []; }
}

async function getCurrentServer(page) {
    try {
        return await page.evaluate(() => {
            const s1 = document.querySelector('#server-select .server-list li.selected h2');
            if (s1) return s1.textContent.trim().toUpperCase();
            const s2 = document.querySelector('.server-list .selected h2');
            if (s2) return s2.textContent.trim().toUpperCase();
            const s3 = document.querySelector('.butt_left_menu.ng-binding .colorRed');
            if (s3) return s3.textContent.trim().toUpperCase();
            return 'UNKNOWN';
        });
    } catch (_) { return 'UNKNOWN'; }
}

async function jsClickServer(page, serverName) {
    try {
        return await page.evaluate((name) => {
            for (const sel of ['#server-select .server-list li:not(.down)', '.server-list li:not(.down)']) {
                for (const li of document.querySelectorAll(sel)) {
                    const h2 = li.querySelector('h2');
                    if (h2 && h2.textContent.trim() === name) {
                        if (li.classList.contains('selected')) return 'already';
                        li.click(); return 'clicked';
                    }
                }
            }
            return 'not-found';
        }, serverName);
    } catch (_) { return 'error'; }
}

async function isRespawnVisible(page) {
    try {
        const btn = await page.$(
            'div.but_game div.board-panel[ng-show*="respawn"] ' +
            'button.button_style.buy_border.ng-binding:not(.ng-hide)'
        );
        if (!btn) return false;
        return await btn.evaluate(el => el.offsetParent !== null);
    } catch (_) { return false; }
}

async function isAlive(page) {
    return !(await isRespawnVisible(page));
}

// ── Login ─────────────────────────────────────────────────────

async function loginSequence(page, botId, creds) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            await page.goto(GAME_URL, { waitUntil: 'networkidle2', timeout: 30_000 });
            await sleep(1000);

            // Open login tab
            if (!await safeClick(page, botId, '.signin', 'open login tab', 800)) continue;

            // Fill credentials
            if (!await safeFill(page, botId, 'form.login input[name="email"]', creds.email, 'fill email')) continue;
            if (!await safeFill(page, botId, 'form.login input[name="pwd"]',   creds.pwd,   'fill password')) continue;

            // Submit
            if (!await safeClick(page, botId, 'form.login button.reg', 'click login', 1500)) continue;

            // Wait for server dropdown to appear (confirms logged in)
            await page.waitForSelector('div.butt_left_menu.ng-binding[dropdown-toggle]',
                { visible: true, timeout: 12_000 });

            log(botId, 'OK', `Logged in as ${creds.email}`);
            return true;
        } catch (e) {
            log(botId, 'ERR', `Login attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
            await sleep(2000);
        }
    }
    return false;
}

// ── Switch server & enter game ────────────────────────────────

async function switchToServer(page, botId, serverName) {
    log(botId, 'INF', `Switching to server: ${serverName}`);

    // Try clicking server directly (works if dropdown already open)
    let result = await jsClickServer(page, serverName);

    if (result === 'not-found') {
        // Open the server dropdown first
        if (!await safeClick(page, botId,
            'div.butt_left_menu.ng-binding[dropdown-toggle]',
            'open server dropdown', 800)) return false;
        await sleep(600);
        result = await jsClickServer(page, serverName);
    }

    if (result === 'not-found') {
        log(botId, 'ERR', `Server ${serverName} not in list`);
        return false;
    }

    if (result === 'clicked') await sleep(1200);

    // Select Mixed room
    try {
        await page.waitForSelector('ul.room-list li.mixed', { visible: true, timeout: 10_000 });
        await page.click('ul.room-list li.mixed');
        log(botId, 'OK', `Clicked Mixed room on ${serverName}`);
    } catch (e) {
        log(botId, 'ERR', `Mixed room not found on ${serverName}: ${e.message.split('\n')[0]}`);
        return false;
    }

    // Wait until we're in a game (play button or canvas visible)
    try {
        await page.waitForSelector('.button_style.red_evil_border.ng-binding', { visible: true, timeout: 15_000 });
        log(botId, 'OK', `In game on ${serverName}`);
        return true;
    } catch (e) {
        log(botId, 'ERR', `Game didn't load on ${serverName}`);
        return false;
    }
}

// ── Respawn ───────────────────────────────────────────────────

async function tryRespawn(page, botId) {
    try {
        await page.click(
            'div.but_game div.board-panel[ng-show*="respawn"] ' +
            'button.button_style.buy_border.ng-binding:not(.ng-hide)'
        );
        log(botId, 'OK', 'Respawned');
        await sleep(rand(600, 1200));
        return true;
    } catch (e) {
        log(botId, 'ERR', `Respawn failed: ${e.message.split('\n')[0]}`);
        return false;
    }
}

// ── Game loop: bomb on one server for SERVER_DWELL_MS ─────────

async function gameLoopOnServer(page, botId, serverName) {
    log(botId, 'INF', `Playing on ${serverName} for ${SERVER_DWELL_MS / 1000}s`);

    const deadline        = Date.now() + SERVER_DWELL_MS;
    let   lastBomb        = Date.now() - BOMB_INTERVAL_MS;
    let   lastAliveCheck  = Date.now();
    const ALIVE_CHECK_MS  = 6_000;

    while (Date.now() < deadline) {
        try {
            const now = Date.now();

            // Alive check / respawn
            if (now - lastAliveCheck >= ALIVE_CHECK_MS) {
                lastAliveCheck = now;
                if (await isRespawnVisible(page)) {
                    log(botId, 'INF', 'Died — respawning');
                    await tryRespawn(page, botId);
                    // Place a bomb right after spawn
                    await sleep(rand(200, 500));
                    await page.keyboard.press('k');
                    lastBomb = Date.now();
                }
            }

            // Place bomb
            if (await isAlive(page)) {
                if (Date.now() - lastBomb >= BOMB_INTERVAL_MS) {
                    await page.keyboard.press('k');
                    lastBomb = Date.now();
                    log(botId, 'DBG', `Bomb placed on ${serverName}`);
                    await sleep(rand(50, 220));
                }
            }

            await sleep(500 + rand(0, 100));
        } catch (e) {
            log(botId, 'ERR', `Loop error: ${e.message.split('\n')[0]}`);
            return;
        }
    }

    log(botId, 'INF', `Dwell time up on ${serverName}`);
}

// ── Bot worker ────────────────────────────────────────────────

async function botWorker(botId, creds) {
    log(botId, 'INF', `===== START (${creds.email}) =====`);

    let serverIdx = botId % TARGET_SERVERS.length;   // stagger start server

    while (true) {
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: HEADLESS,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
            });
            const page = await browser.newPage();
            await page.setViewport({ width: 860, height: 600 });
            page.setDefaultTimeout(20_000);

            // Login
            if (!await loginSequence(page, botId, creds)) {
                throw new Error('Login failed after 3 attempts');
            }

            // Server-cycling loop
            while (true) {
                const available = await getAvailableServers(page);
                const targets   = TARGET_SERVERS.filter(s => available.includes(s));
                const pool      = targets.length > 0 ? targets : TARGET_SERVERS;

                const server = pool[serverIdx % pool.length];
                serverIdx++;

                log(botId, 'INF', `Next: ${server} (available: [${available.join(', ')}])`);

                const entered = await switchToServer(page, botId, server);
                if (entered) {
                    await gameLoopOnServer(page, botId, server);
                } else {
                    log(botId, 'ERR', `Skipping ${server}`);
                    await sleep(3000);
                }

                await sleep(rand(1500, 3000));
            }

        } catch (e) {
            log(botId, 'ERR', `Critical: ${e.message}`);
        } finally {
            if (browser) {
                try { await browser.close(); } catch (_) {}
            }
        }

        log(botId, 'INF', 'Restarting in 10s…');
        await sleep(10_000);
    }
}

// ── Supervisor ────────────────────────────────────────────────

const stats = {};   // botId → { server, bombs, deaths }

function initStats(botId) {
    stats[botId] = { server: 'init', deaths: 0 };
}

function supervisor() {
    setInterval(() => {
        console.log('\n==== Bot Status ====');
        for (const [id, s] of Object.entries(stats)) {
            console.log(`  Bot-${id}: ${s.server} | Deaths: ${s.deaths}`);
        }
        console.log('====================\n');
    }, 30_000);
}

// ── Main ──────────────────────────────────────────────────────

(async () => {
    console.log(`=== GoB Bots starting — ${accounts.length} accounts | Servers: ${TARGET_SERVERS.join(', ')} | Dwell: ${SERVER_DWELL_MS / 1000}s ===`);

    supervisor();

    // Stagger bot launches so they don't hammer the site simultaneously
    for (let i = 0; i < accounts.length; i++) {
        const botId = i + 1;
        initStats(botId);
        botWorker(botId, accounts[i]);   // fire-and-forget (each manages its own loop)
        await sleep(rand(1000, 3000));
    }

    // Keep process alive
    await new Promise(() => {});
})();
