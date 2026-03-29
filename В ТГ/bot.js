// ─── Movement directions ───────────────────────────────────────────────────────
const DIRECTIONS = ['w', 'a', 's', 'd'];
const DIAGONALS  = [['w','a'], ['w','d'], ['s','a'], ['s','d']];

async function performSmartMove(page, botId) {
  const r = Math.random();

  let chosenKeys;
  if (r < 0.55) {
    // 55% diagonal
    chosenKeys = DIAGONALS[randInt(0, DIAGONALS.length - 1)];
  } else if (r < 0.85) {
    // 30% cardinal
    chosenKeys = [DIRECTIONS[randInt(0, DIRECTIONS.length - 1)]];
  } else {
    // 15% pause/idle
    await sleep(rand(300, 800));
    return;
  }

  const duration = rand(400, 1400);

  // Press keys down
  for (const k of chosenKeys) await page.keyboard.down(k);
  await sleep(duration);
  // Release keys
  for (const k of chosenKeys) { try { await page.keyboard.up(k); } catch {} }

  touchActivity(botId);
  await sleep(rand(80, 250));
}
