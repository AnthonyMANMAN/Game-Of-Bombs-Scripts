
(() => {
  let layer0Ctx = null;
  let showWorldGrid = true;
  let blockPositions = {}; // Plain object instead of Map
  
  const drawWorldGrid = () => {
    if (!layer0Ctx || !showWorldGrid) return;
    
    const transform = layer0Ctx.getTransform();
    
    // Only draw if we have a non-trivial transform (world space)
    if (Math.abs(transform.e) < 10 && Math.abs(transform.f) < 10) {
      return;
    }
    
    layer0Ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
    layer0Ctx.lineWidth = 1;
    
    const tileSize = 32; // Changed back to 32px
    const scale = transform.a;
    
    const worldLeft = -transform.e / scale;
    const worldTop = -transform.f / scale;
    const worldRight = worldLeft + layer0Ctx.canvas.width / scale;
    const worldBottom = worldTop + layer0Ctx.canvas.height / scale;
    
    const startX = Math.floor(worldLeft / tileSize) * tileSize;
    const startY = Math.floor(worldTop / tileSize) * tileSize;
    
    // Draw grid
    for (let x = startX; x <= worldRight + tileSize; x += tileSize) {
      layer0Ctx.beginPath();
      layer0Ctx.moveTo(x, worldTop - tileSize);
      layer0Ctx.lineTo(x, worldBottom + tileSize);
      layer0Ctx.stroke();
    }
    
    for (let y = startY; y <= worldBottom + tileSize; y += tileSize) {
      layer0Ctx.beginPath();
      layer0Ctx.moveTo(worldLeft - tileSize, y);
      layer0Ctx.lineTo(worldRight + tileSize, y);
      layer0Ctx.stroke();
    }
    
    // Draw tile coordinates at the top of each tile (wrapped 0-31)
    layer0Ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
    layer0Ctx.font = 'bold 10px monospace';
    
    for (let x = startX; x <= worldRight; x += tileSize) {
      for (let y = startY; y <= worldBottom; y += tileSize) {
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);
        
        // Wrap coordinates to 0-31 range
        const wrappedX = ((tileX % 32) + 32) % 32;
        const wrappedY = ((tileY % 32) + 32) % 32;
        
        // Draw at the top-left of each tile
        layer0Ctx.fillText(`${wrappedX},${wrappedY}`, x + 2, y + 12);
      }
    }
  };
  
  const hookCanvasContext = (ctx, canvas) => {
    if (canvas.id === 'layer0') {
      layer0Ctx = ctx;
      console.log('✓ World grid hooked - 32px tiles, 32x32 wrapped world');
      
      const proto = Object.getPrototypeOf(ctx);
      const originalRestore = proto.restore;
      const originalSave = proto.save;
      const originalDrawImage = proto.drawImage;
      
      let saveCount = 0;
      
      proto.save = function(...args) {
        saveCount++;
        return originalSave.apply(this, args);
      };
      
      proto.restore = function(...args) {
        if (canvas.id === 'layer0' && saveCount > 0) {
          drawWorldGrid();
        }
        saveCount--;
        return originalRestore.apply(this, args);
      };
      
      // Track drawImage calls to detect blocks
      proto.drawImage = function(image, ...args) {
        if (canvas.id === 'layer0') {
          const transform = this.getTransform();
          
          // Get world position based on number of arguments
          let worldX, worldY, width, height;
          
          if (args.length === 2) {
            worldX = args[0];
            worldY = args[1];
            width = image.width;
            height = image.height;
          } else if (args.length === 4) {
            worldX = args[0];
            worldY = args[1];
            width = args[2];
            height = args[3];
          } else if (args.length === 8) {
            worldX = args[4];
            worldY = args[5];
            width = args[6];
            height = args[7];
          }
          
          // Track tiles (32px tiles)
          if (width >= 16 && width <= 64 && height >= 16 && height <= 64) {
            const tileX = Math.floor(worldX / 32);
            const tileY = Math.floor(worldY / 32);
            
            // Wrap to 0-31
            const wrappedX = ((tileX % 32) + 32) % 32;
            const wrappedY = ((tileY % 32) + 32) % 32;
            const key = `${wrappedX},${wrappedY}`;
            
            blockPositions[key] = {
              x: worldX,
              y: worldY,
              width,
              height,
              tileX: wrappedX,
              tileY: wrappedY,
              image: image.src || 'unknown'
            };
          }
        }
        
        return originalDrawImage.apply(this, [image, ...args]);
      };
    }
  };
  
  const hookAllCanvases = () => {
    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
      const ctx = canvas.getContext('2d');
      if (ctx && !ctx._worldGridHooked) {
        hookCanvasContext(ctx, canvas);
        ctx._worldGridHooked = true;
      }
    }
  };
  
  hookAllCanvases();
  new MutationObserver(hookAllCanvases).observe(document.body, { childList: true, subtree: true });
  
  window.toggleWorldGrid = () => {
    showWorldGrid = !showWorldGrid;
    console.log('World grid:', showWorldGrid ? 'ON' : 'OFF');
  };
  
  window.getBlockAt = (tileX, tileY) => {
    // Wrap input coordinates
    const wrappedX = ((tileX % 32) + 32) % 32;
    const wrappedY = ((tileY % 32) + 32) % 32;
    const key = `${wrappedX},${wrappedY}`;
    return blockPositions[key] || null;
  };
  
  window.getAllBlocks = () => {
    return Object.values(blockPositions);
  };
  
  window.getBlocksInArea = (startX, startY, endX, endY) => {
    const blocks = [];
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const block = window.getBlockAt(x, y);
        if (block) blocks.push(block);
      }
    }
    return blocks;
  };
  
  console.log('World grid with 32px tiles, 32x32 wrapped coordinates active!');
  console.log('Commands:');
  console.log('- getBlockAt(x, y) - get block at tile coordinates (0-31)');
  console.log('- getAllBlocks() - get all detected blocks');
  console.log('- getBlocksInArea(x1, y1, x2, y2) - get blocks in area');
})();


