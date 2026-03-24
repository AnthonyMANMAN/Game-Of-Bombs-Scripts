(() => {
  // ==================== CORE STATE ====================
  const state = {
    spy: {
      paused: false,
      loggedCalls: new Set(),
      hookedContexts: new Set()
    },
    game: {
      timer: '--:--',
      coords: { x: '--', y: '--' },
      lastKnownCoords: { x: null, y: null }
    },
    bot: {
      active: false,
      currentDirection: null,
      movementX: null,
      movementY: null,
      timeouts: { move: null, bomb: null },
      intervals: { check: null },
      lastChangeTime: { x: null, y: null },
      bombKey: { code: 76, key: 'l' }
    }
  };
  
  const STUCK_THRESHOLD = 1000;
  
  // ==================== MOVEMENT KEYS ====================
  const keys = {
    up: { code: 87, key: "w" },
    left: { code: 65, key: "a" },
    down: { code: 83, key: "s" },
    right: { code: 68, key: "d" },
    upLeft: { codes: [87, 65], name: "up-left" },
    upRight: { codes: [87, 68], name: "up-right" },
    downLeft: { codes: [83, 65], name: "down-left" },
    downRight: { codes: [83, 68], name: "down-right" }
  };
  
  // ==================== UI CREATION ====================
  const createUI = () => {
    const ui = document.createElement('div');
    ui.id = 'bot-ui';
    ui.innerHTML = `
      <div style="position:fixed;top:20px;right:20px;background:#2d3748;color:white;padding:12px 16px;border-radius:8px;font:12px monospace;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;min-width:220px;user-select:none">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #4a5568;padding-bottom:8px;margin-bottom:8px">
          <span style="color:#68d391;font-weight:bold">Intelligent Bot</span>
          <button id="close-btn" style="background:#e53e3e;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;font:bold 14px monospace">×</button>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="color:#a0aec0">Canvas Spy:</span>
          <div>
            <span id="spy-status" style="color:#48bb78;font-weight:bold">Running</span>
            <button id="spy-toggle" style="background:#4299e1;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;font:10px monospace;margin-left:8px">Pause</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="color:#a0aec0">Bot (Z):</span>
          <span id="bot-status" style="color:#F44336;font-weight:bold">OFF</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;border-top:1px solid #4a5568;padding-top:8px">
          <span style="color:#a0aec0">Timer:</span>
          <span id="timer-val" style="color:#68d391;font-weight:bold">--:--</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="color:#a0aec0">Position:</span>
          <span id="coords-val" style="color:#63b3ed;font-weight:bold">x:--, y:--</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#a0aec0">Movement:</span>
          <span id="movement-val" style="color:#fbb6ce;font-weight:bold">Idle</span>
        </div>
        <div style="border-top:1px solid #4a5568;padding-top:8px;margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <span style="color:#a0aec0;white-space:nowrap">Bomb Key:</span>
            <input id="bomb-key-input" type="text" maxlength="1" placeholder="l"
              style="background:#1a202c;color:#f6e05e;border:1px solid #4a5568;border-radius:4px;padding:3px 6px;font:12px monospace;width:36px;text-align:center;cursor:text;user-select:text"
            />
            <span id="bomb-key-display" style="color:#f6e05e;font-weight:bold;font-size:11px">code: 76</span>
          </div>
          <div id="bomb-key-hint" style="color:#fc8181;font-size:10px;margin-top:4px;display:none">Press a key inside the box to set it</div>
        </div>
        <button id="clear-cache" style="width:100%;background:#805ad5;color:white;border:none;padding:6px;border-radius:4px;cursor:pointer;font:10px monospace;margin-top:4px">Clear Cache</button>
      </div>
    `;
    
    document.body.appendChild(ui);
    
    const bombKeyInput = ui.querySelector('#bomb-key-input');
    const bombKeyDisplay = ui.querySelector('#bomb-key-display');
    const bombKeyHint = ui.querySelector('#bomb-key-hint');

    bombKeyInput.addEventListener('focus', () => {
      bombKeyHint.style.display = 'block';
      bombKeyInput.value = '';
    });

    bombKeyInput.addEventListener('blur', () => {
      bombKeyHint.style.display = 'none';
      bombKeyInput.value = state.bot.bombKey.key;
    });

    bombKeyInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const key = e.key;
      const code = e.keyCode || e.which;

      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape'].includes(key)) return;

      state.bot.bombKey = { code, key };
      bombKeyInput.value = key;
      bombKeyDisplay.textContent = `code: ${code}`;
      bombKeyHint.style.display = 'none';
      bombKeyInput.blur();
    });

    bombKeyInput.value = state.bot.bombKey.key;

    return {
      spyStatus: ui.querySelector('#spy-status'),
      spyToggle: ui.querySelector('#spy-toggle'),
      botStatus: ui.querySelector('#bot-status'),
      timerVal: ui.querySelector('#timer-val'),
      coordsVal: ui.querySelector('#coords-val'),
      movementVal: ui.querySelector('#movement-val'),
      closeBtn: ui.querySelector('#close-btn'),
      clearCache: ui.querySelector('#clear-cache'),
      bombKeyInput,
      bombKeyDisplay,
      container: ui
    };
  };
  
  const ui = createUI();
  
  // ==================== UI UPDATES ====================
  const updateUI = () => {
    const { spy, bot, game } = state;
    
    ui.spyStatus.textContent = spy.paused ? 'Paused' : 'Running';
    ui.spyStatus.style.color = spy.paused ? '#ed8936' : '#48bb78';
    ui.spyToggle.textContent = spy.paused ? 'Resume' : 'Pause';
    ui.spyToggle.style.background = spy.paused ? '#48bb78' : '#4299e1';
    
    ui.botStatus.textContent = bot.active ? 'ON' : 'OFF';
    ui.botStatus.style.color = bot.active ? '#4CAF50' : '#F44336';
    
    ui.timerVal.textContent = game.timer;
    ui.coordsVal.textContent = `x:${game.coords.x}, y:${game.coords.y}`;
    
    if (!bot.active) {
      ui.movementVal.textContent = 'Idle';
      ui.movementVal.style.color = '#fbb6ce';
    } else if (bot.currentDirection) {
      ui.movementVal.textContent = bot.currentDirection.name || 'Moving';
      ui.movementVal.style.color = '#68d391';
    }
  };
  
  // ==================== DATA PARSING ====================
  const parseCanvasCall = (signature) => {
    const timerMatch = signature.match(/fillText\(([0-9]+:[0-9]+),/);
    if (timerMatch) {
      state.game.timer = timerMatch[1];
    }
    
    const coordMatch = signature.match(/fillText\((\d+),\s*(\d+),\s*\d+,\s*\d+\)/);
    if (coordMatch) {
      const [, x, y] = coordMatch;
      const newX = parseInt(x), newY = parseInt(y);
      
      if (newX < 32 && newY < 32) {
        const now = Date.now();
        const { game, bot } = state;
        
        game.coords.x = newX;
        game.coords.y = newY;
        
        if (game.lastKnownCoords.x !== null) {
          if (newX !== game.lastKnownCoords.x) bot.lastChangeTime.x = now;
          if (newY !== game.lastKnownCoords.y) bot.lastChangeTime.y = now;
        } else {
          bot.lastChangeTime.x = bot.lastChangeTime.y = now;
        }
        
        game.lastKnownCoords.x = newX;
        game.lastKnownCoords.y = newY;
      }
    }
  };
  
  // ==================== MOVEMENT SYSTEM ====================
  const simulateKey = (direction, isDown = true) => {
    const event = isDown ? 'keydown' : 'keyup';
    
    if (direction.codes) {
      direction.codes.forEach(code => {
        document.dispatchEvent(new KeyboardEvent(event, { keyCode: code }));
      });
    } else {
      document.dispatchEvent(new KeyboardEvent(event, { 
        keyCode: direction.code, 
        key: direction.key 
      }));
    }
  };
  
  const getDirection = (xDir, yDir) => {
    if (xDir === -1 && yDir === 1) return keys.upLeft;
    if (xDir === 1 && yDir === 1) return keys.upRight;
    if (xDir === -1 && yDir === -1) return keys.downLeft;
    if (xDir === 1 && yDir === -1) return keys.downRight;
    if (xDir === -1) return keys.left;
    if (xDir === 1) return keys.right;
    if (yDir === 1) return keys.up;
    if (yDir === -1) return keys.down;
    return null;
  };
  
  const getRandomDiagonal = () => {
    const diagonals = [keys.upLeft, keys.upRight, keys.downLeft, keys.downRight];
    return diagonals[Math.floor(Math.random() * 4)];
  };
  
  const placeBomb = () => {
    if (!state.bot.active) return;
    const { code, key } = state.bot.bombKey;
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: code, key }));
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: code, key }));
    }, 100);
  };
  
  const checkStuck = () => {
    if (!state.bot.active) return;
    
    const { bot } = state;
    const now = Date.now();
    
    if (!bot.lastChangeTime.x || !bot.lastChangeTime.y) return;
    
    const xStuck = now - bot.lastChangeTime.x >= STUCK_THRESHOLD && bot.movementX !== null;
    const yStuck = now - bot.lastChangeTime.y >= STUCK_THRESHOLD && bot.movementY !== null;
    
    if (xStuck || yStuck) {
      adjustMovement(xStuck, yStuck);
    }
  };
  
  const adjustMovement = (changeX, changeY) => {
    const { bot } = state;
    
    if (bot.currentDirection) {
      simulateKey(bot.currentDirection, false);
    }
    
    if (changeX) {
      bot.movementX = bot.movementX === 1 ? -1 : 1;
      bot.lastChangeTime.x = Date.now();
    }
    
    if (changeY) {
      bot.movementY = bot.movementY === 1 ? -1 : 1;
      bot.lastChangeTime.y = Date.now();
    }
    
    const newDirection = getDirection(bot.movementX, bot.movementY);
    if (newDirection) {
      bot.currentDirection = newDirection;
      simulateKey(newDirection, true);
    }
  };
  
  const startBombTimer = () => {
    if (!state.bot.active) return;
    
    const delay = Math.random() * 2000 + 1000;
    state.bot.timeouts.bomb = setTimeout(() => {
      if (state.bot.active) {
        placeBomb();
        startBombTimer();
      }
    }, delay);
  };
  
  // ==================== BOT CONTROL ====================
  const startBot = () => {
    const { bot, game } = state;
    const direction = getRandomDiagonal();
    
    bot.currentDirection = direction;
    
    if (direction === keys.upLeft) { bot.movementX = -1; bot.movementY = 1; }
    else if (direction === keys.upRight) { bot.movementX = 1; bot.movementY = 1; }
    else if (direction === keys.downLeft) { bot.movementX = -1; bot.movementY = -1; }
    else { bot.movementX = 1; bot.movementY = -1; }
    
    const now = Date.now();
    bot.lastChangeTime.x = bot.lastChangeTime.y = now;
    
    if (game.coords.x !== '--' && game.coords.y !== '--') {
      game.lastKnownCoords.x = parseInt(game.coords.x);
      game.lastKnownCoords.y = parseInt(game.coords.y);
    }
    
    simulateKey(direction, true);
    startBombTimer();
    bot.intervals.check = setInterval(checkStuck, 500);
  };
  
  const stopBot = () => {
    const { bot } = state;
    
    Object.values(bot.timeouts).forEach(t => t && clearTimeout(t));
    Object.values(bot.intervals).forEach(i => i && clearInterval(i));
    
    bot.timeouts = { move: null, bomb: null };
    bot.intervals = { check: null };
    
    if (bot.currentDirection) {
      simulateKey(bot.currentDirection, false);
      bot.currentDirection = null;
    }
    
    bot.movementX = bot.movementY = null;
    bot.lastChangeTime = { x: null, y: null };
    state.game.lastKnownCoords = { x: null, y: null };
  };
  
  // ==================== CANVAS HOOKING ====================
  const hookContext = (ctx) => {
    if (ctx._hooked) return;
    
    const proto = Object.getPrototypeOf(ctx);
    const methods = Object.getOwnPropertyNames(proto).filter(key => 
      typeof ctx[key] === 'function' && key !== 'constructor'
    );
    
    methods.forEach(method => {
      const original = ctx[method];
      ctx[method] = function(...args) {
        if (!state.spy.paused) {
          const signature = `${method}(${args.map(stringifyArg).join(", ")})`;
          if (!state.spy.loggedCalls.has(signature)) {
            state.spy.loggedCalls.add(signature);
            parseCanvasCall(signature);
            updateUI();
          }
        }
        return original.apply(this, args);
      };
    });
    
    state.spy.hookedContexts.add(ctx);
    ctx._hooked = true;
  };
  
  const stringifyArg = (arg) => {
    if (arg instanceof HTMLImageElement) return '[HTMLImageElement]';
    if (arg instanceof CanvasRenderingContext2D) return '[CanvasRenderingContext2D]';
    if (arg instanceof HTMLCanvasElement) return '[Canvas]';
    if (arg instanceof Path2D) return '[Path2D]';
    if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg);
    return String(arg);
  };
  
  const hookCanvases = () => {
    document.querySelectorAll('canvas').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (ctx && !ctx._hooked) hookContext(ctx);
    });
  };
  
  const clearCache = () => {
    state.spy.loggedCalls.clear();
    
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const src = img.src;
      img.src = '';
      img.src = src + '?_=' + Date.now();
    });
    
    document.querySelectorAll('canvas').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  };
  
  // ==================== EVENT HANDLERS ====================
  const handleKeyDown = (e) => {
    if (e.key.toLowerCase() === 'z' || e.key === 'я') {
      state.bot.active = !state.bot.active;
      
      if (state.bot.active) {
        startBot();
      } else {
        stopBot();
      }
      
      updateUI();
    }
  };
  
  const cleanup = () => {
    if (state.bot.active) stopBot();
    if (ui.container.parentNode) ui.container.parentNode.removeChild(ui.container);
    if (window.botObserver) window.botObserver.disconnect();
    document.removeEventListener('keydown', handleKeyDown);
  };
  
  // ==================== INITIALIZATION ====================
  hookCanvases();
  
  const observer = new MutationObserver(hookCanvases);
  observer.observe(document.body, { childList: true, subtree: true });
  window.botObserver = observer;
  
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('beforeunload', cleanup);
  
  ui.spyToggle.addEventListener('click', () => {
    state.spy.paused = !state.spy.paused;
    updateUI();
  });
  
  ui.closeBtn.addEventListener('click', cleanup);
  ui.clearCache.addEventListener('click', clearCache);
  
  updateUI();
})();
