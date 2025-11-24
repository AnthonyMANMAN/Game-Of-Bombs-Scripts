let spamming = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'j') {
    spamming = !spamming;
    console.log(spamming ? 'K spam ON' : 'K spam OFF');
  }
  
  if (spamming && e.key === 'k') {
    e.stopImmediatePropagation();
  }
});

document.addEventListener('keyup', (e) => {
  if (spamming && e.key === 'k') {
    e.stopImmediatePropagation();
  }
});

// Lightweight event injection on next frame
function spamK() {
  if (spamming) {
    const down = new KeyboardEvent('keydown', {
      key: 'k',
      code: 'KeyK',
      keyCode: 75,
      bubbles: true
    });
    document.activeElement.dispatchEvent(down);
  }
  requestAnimationFrame(spamK);
}

requestAnimationFrame(spamK);
console.log('Lightweight K spammer loaded! Press J to toggle.');
