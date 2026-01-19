(() => {
  const bombPositions = {};
  const shadowPositions = {}; // Track shadows separately
  let layer1Ctx = null;
  let animationFrameId = null;
  
  const drawBoxes = () => {
    if (!layer1Ctx) return;
    
    const now = Date.now();
    layer1Ctx.save();
    layer1Ctx.strokeStyle = 'red';
    layer1Ctx.lineWidth = 3;
    layer1Ctx.font = 'bold 12px Arial';
    layer1Ctx.textAlign = 'center';
    layer1Ctx.textBaseline = 'middle';
    
    for (const key in bombPositions) {
      const bomb = bombPositions[key];
      
      // Calculate speed
      const speed = Math.sqrt(bomb.vx * bomb.vx + bomb.vy * bomb.vy);
      
      // Track if bomb has been thrown (velocity hit 150+)
      if (speed >= 150 && !bomb.hasBeenThrown) {
        bomb.hasBeenThrown = true;
        bomb.throwTime = now; // Record when bomb was thrown
      }
      
      // Track when bomb becomes stationary after being thrown
      if (bomb.hasBeenThrown && speed < 1) {
        if (!bomb.stationaryStartTime) {
          bomb.stationaryStartTime = now;
        } else if (now - bomb.stationaryStartTime >= 300) {
          // Bomb has been stationary for 300ms - landed
          bomb.hasBeenThrown = false;
          bomb.stationaryStartTime = null;
          // Add the time the bomb was in air to pause offset
          if (bomb.throwTime) {
            const airTime = (now - bomb.throwTime) / 1000;
            bomb.pauseOffset = (bomb.pauseOffset || 0) + airTime;
            // Add 0.5 second penalty for landing
            bomb.pauseOffset -= 0.5;
          }
          bomb.throwTime = null;
        }
      } else if (bomb.hasBeenThrown && speed >= 1) {
        // Reset stationary timer if moving again
        bomb.stationaryStartTime = null;
      }
      
      // Calculate elapsed time from when bomb was first placed
      const totalElapsed = (now - bomb.placedTime) / 1000;
      
      // Subtract pause offset (time spent in air)
      const adjustedElapsed = totalElapsed - (bomb.pauseOffset || 0);
      
      // If currently thrown, also subtract current air time
      let currentAirTime = 0;
      if (bomb.hasBeenThrown && bomb.throwTime) {
        currentAirTime = (now - bomb.throwTime) / 1000;
      }
      
      // Timer counts down (paused during flight)
      const remaining = Math.max(0, 4.3 - (adjustedElapsed - currentAirTime));
      
      // Remove if expired or not seen
      if (remaining === 0) {
        delete bombPositions[key];
        continue;
      }
      
      if (now - bomb.lastSeen > 200) {
        delete bombPositions[key];
        continue;
      }
      
      // Skip drawing if bomb has been thrown (still in air)
      if (bomb.hasBeenThrown) {
        continue;
      }
      
      // Calculate bomb center
      const bombCenterX = bomb.x + bomb.w / 2;
      const bombCenterY = bomb.y + bomb.h / 2;
      
      // Draw red box (32x32 pixels centered on bomb center)
      const boxSize = 32;
      layer1Ctx.strokeRect(bombCenterX - boxSize / 2, bombCenterY - boxSize / 2, boxSize, boxSize);
      
      // Draw timer at fixed position (top-right of box)
      const timerX = bombCenterX + boxSize / 2 - 10;
      const timerY = bombCenterY - boxSize / 2 + 10;
      
      // Timer background
      layer1Ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      layer1Ctx.beginPath();
      layer1Ctx.arc(timerX, timerY, 10, 0, Math.PI * 2);
      layer1Ctx.fill();
      
      // Timer text - show remaining time (pauses during flight)
      const displayTime = remaining;
      layer1Ctx.fillStyle = displayTime > 1 ? '#0f0' : '#f00';
      layer1Ctx.fillText(displayTime.toFixed(1), timerX, timerY);
      
      // Draw velocity (above box)
      if (bomb.vx !== undefined && bomb.vy !== undefined) {
        const velocityX = bombCenterX;
        const velocityY = bombCenterY - boxSize / 2 - 10;
        
        // Velocity background
        layer1Ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const text = `${speed.toFixed(1)} px/s`;
        const metrics = layer1Ctx.measureText(text);
        const padding = 4;
        layer1Ctx.fillRect(
          velocityX - metrics.width / 2 - padding,
          velocityY - 6 - padding,
          metrics.width + padding * 2,
          12 + padding * 2
        );
        
        // Velocity text
        layer1Ctx.fillStyle = '#fff';
        layer1Ctx.fillText(text, velocityX, velocityY);
        
        // Calculate predicted explosion position if bomb is moving
        if (speed > 5) {
          // Time until explosion (remaining time)
          const timeToExplode = remaining;
          
          // Distance = speed * time
          const distanceX = bomb.vx * timeToExplode;
          const distanceY = bomb.vy * timeToExplode;
          
          // Predicted position
          const explodeX = bombCenterX + distanceX;
          const explodeY = bombCenterY + distanceY;
          
          // Draw line to predicted explosion point
          layer1Ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
          layer1Ctx.lineWidth = 2;
          layer1Ctx.setLineDash([5, 5]);
          layer1Ctx.beginPath();
          layer1Ctx.moveTo(bombCenterX, bombCenterY);
          layer1Ctx.lineTo(explodeX, explodeY);
          layer1Ctx.stroke();
          layer1Ctx.setLineDash([]);
          
          // Draw X at predicted explosion point
          layer1Ctx.strokeStyle = 'red';
          layer1Ctx.lineWidth = 3;
          const crossSize = 10;
          layer1Ctx.beginPath();
          layer1Ctx.moveTo(explodeX - crossSize, explodeY - crossSize);
          layer1Ctx.lineTo(explodeX + crossSize, explodeY + crossSize);
          layer1Ctx.moveTo(explodeX + crossSize, explodeY - crossSize);
          layer1Ctx.lineTo(explodeX - crossSize, explodeY + crossSize);
          layer1Ctx.stroke();
        }
      }
    }
    
    layer1Ctx.restore();
  };
  
  const hookCanvasContext = (ctx, canvas) => {
    if (canvas.id === 'layer1') {
      layer1Ctx = ctx;
    }
    
    const proto = Object.getPrototypeOf(ctx);
    const originalDrawImage = proto.drawImage;
    const originalFillRect = proto.fillRect;
    const originalSetGlobalAlpha = Object.getOwnPropertyDescriptor(proto, 'globalAlpha')?.set || function() {};
    
    // Track if grey fill was just used (for shadow detection)
    let lastFillWasGrey = false;
    let lastGlobalAlpha = 1.0;
    
    // Override globalAlpha setter to track alpha changes
    Object.defineProperty(ctx, 'globalAlpha', {
      get() {
        return lastGlobalAlpha;
      },
      set(value) {
        lastGlobalAlpha = value;
        originalSetGlobalAlpha.call(this, value);
      },
      configurable: true
    });
    
    proto.fillRect = function (...args) {
      const fillStyle = this.fillStyle;
      // Detect grey fills (shadows are drawn with grey/dark colors)
      if (typeof fillStyle === 'string') {
        const lower = fillStyle.toLowerCase();
        lastFillWasGrey = lower.includes('grey') || lower.includes('gray') || 
                          lower.match(/#[0-9a-f]{6}/) && parseInt(lower.slice(1, 3), 16) === parseInt(lower.slice(3, 5), 16) &&
                          parseInt(lower.slice(3, 5), 16) === parseInt(lower.slice(5, 7), 16);
      }
      return originalFillRect.apply(this, args);
    };
    
    proto.drawImage = function (...args) {
      const result = originalDrawImage.apply(this, args);
      
      // Detect bomb sprite: drawImage(img, 0, 0, 64, 64, x, y, w, h)
      if (canvas.id === 'layer1' && args.length === 9 && 
          args[1] === 0 && args[2] === 0 && 
          args[3] === 64 && args[4] === 64) {
        
        const x = args[5];
        const y = args[6];
        const w = args[7];
        const h = args[8];
        const currentTime = Date.now();
        
        // Calculate center to use for tracking
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        
        // Detect if this is a shadow: grey fill before drawImage AND consistent size (doesn't scale)
        // Shadows maintain a constant size while the bomb scales during flight
        const isShadow = lastFillWasGrey && w >= 50 && w <= 70 && h >= 50 && h <= 70;
        
        // Detect if this is a grey outline (throw preview): any grey fill OR low alpha
        const isGreyOutline = (lastFillWasGrey && !isShadow) || lastGlobalAlpha < 0.8;
        
        // Reset flags after checking
        if (lastFillWasGrey) {
          lastFillWasGrey = false;
        }
        lastGlobalAlpha = 1.0;
        
        if (isShadow) {
          // Track shadow position - this is where the bomb will land
          const shadowKey = `shadow_${Math.round(centerX / 8)}_${Math.round(centerY / 8)}`;
          shadowPositions[shadowKey] = {
            x: centerX,
            y: centerY,
            lastSeen: currentTime
          };
          
          // Clean up old shadows
          for (const key in shadowPositions) {
            if (currentTime - shadowPositions[key].lastSeen > 200) {
              delete shadowPositions[key];
            }
          }
          
          // Don't process shadows as bombs - skip drawing
        } else if (isGreyOutline) {
          // Don't process grey outlines/previews as bombs - skip drawing
        } else {
          // Normal bomb handling
          
          // Find if this bomb already exists - check by proximity
          let existingKey = null;
          let minDist = Infinity;
          
          for (const key in bombPositions) {
            const bomb = bombPositions[key];
            const bombCenterX = bomb.x + bomb.w / 2;
            const bombCenterY = bomb.y + bomb.h / 2;
            const dist = Math.sqrt(
              Math.pow(centerX - bombCenterX, 2) + 
              Math.pow(centerY - bombCenterY, 2)
            );
            
            // Use tighter radius for matching (30px) to avoid cross-talk between bombs
            // Only expand search if bomb is in flight
            const searchRadius = bomb.inFlight ? 100 : 30;
            if (dist < searchRadius) {
              if (dist < minDist) {
                minDist = dist;
                existingKey = key;
              }
            }
          }
          
          if (existingKey) {
            // Update existing bomb
            const bomb = bombPositions[existingKey];
            const dt = (currentTime - bomb.lastUpdateTime) / 1000;
            
            if (dt > 0 && dt < 1.0) { // Ignore large time gaps (increased tolerance)
              // Calculate centers to ignore size changes
              const lastCenterX = bomb.lastX + bomb.lastW / 2;
              const lastCenterY = bomb.lastY + bomb.lastH / 2;
              
              const dx = centerX - lastCenterX;
              const dy = centerY - lastCenterY;
              bomb.vx = dx / dt;
              bomb.vy = dy / dt;
              
              const speed = Math.sqrt(bomb.vx * bomb.vx + bomb.vy * bomb.vy);
              
              // Track speed history
              if (!bomb.speedHistory) {
                bomb.speedHistory = [];
              }
              bomb.speedHistory.push(speed);
              if (bomb.speedHistory.length > 10) {
                bomb.speedHistory.shift();
              }
              
              // Detect motion patterns
              if (bomb.speedHistory.length >= 5) {
                const avgSpeed = bomb.speedHistory.reduce((a, b) => a + b) / bomb.speedHistory.length;
                const variance = bomb.speedHistory.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / bomb.speedHistory.length;
                const stdDev = Math.sqrt(variance);
                
                // No air logic - all bombs count down normally
                // Timer always counts based on ground time only
              }
              
              bomb.lastX = x;
              bomb.lastY = y;
              bomb.lastW = w;
              bomb.lastH = h;
              bomb.lastUpdateTime = currentTime;
            }
            
            // Update current position
            bomb.x = x;
            bomb.y = y;
            bomb.w = w;
            bomb.h = h;
            bomb.lastSeen = currentTime;
            
            // Update key based on unique position (finer grid for better separation)
            const newKey = `bomb_${Math.round(centerX / 8)}_${Math.round(centerY / 8)}`;
            if (newKey !== existingKey) {
              bombPositions[newKey] = bomb;
              delete bombPositions[existingKey];
            }
          } else {
            // New bomb - create unique key based on position
            const posKey = `bomb_${Math.round(centerX / 8)}_${Math.round(centerY / 8)}`;
            bombPositions[posKey] = { 
              x, y, w, h,
              placedTime: currentTime,
              hasBeenThrown: false,
              throwTime: null,
              stationaryStartTime: null,
              pauseOffset: 0, // Total time to subtract from elapsed time
              speedHistory: [],
              lastSeen: currentTime,
              lastX: x,
              lastY: y,
              lastW: w,
              lastH: h,
              lastUpdateTime: currentTime,
              vx: 0,
              vy: 0
            };
          }
        }
        
        drawBoxes();
      }
      
      return result;
    };
  };
  
  const hookAllCanvases = () => {
    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
      const ctx = canvas.getContext('2d');
      if (ctx && !ctx._bombBoxAttached) {
        hookCanvasContext(ctx, canvas);
        ctx._bombBoxAttached = true;
      }
    }
  };
  
  hookAllCanvases();
  
  const observer = new MutationObserver(hookAllCanvases);
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Draw at 20 FPS
  setInterval(drawBoxes, 50);
})();
