(() => {
  let layer0Ctx = null;
  let layer1Ctx = null;
  let showWorldGrid = true;
  let showChunks = true;
  let blockPositions = {};
  
  // Colors are no longer needed for fills, but keeping for reference if needed elsewhere
  const chunkColors = [
    'rgba(255, 0, 0, 0.3)',    // Red
    'rgba(0, 255, 0, 0.3)',    // Green
    'rgba(0, 0, 255, 0.3)',    // Blue
    'rgba(255, 255, 0, 0.3)',  // Yellow
    'rgba(255, 0, 255, 0.3)',  // Magenta
    'rgba(0, 255, 255, 0.3)',  // Cyan
    'rgba(255, 128, 0, 0.3)',  // Orange
    'rgba(128, 0, 255, 0.3)',  // Purple
    'rgba(255, 192, 203, 0.3)', // Pink
    'rgba(0, 128, 128, 0.3)',  // Teal
    'rgba(128, 128, 0, 0.3)',  // Olive
    'rgba(192, 192, 192, 0.3)', // Silver
    'rgba(128, 0, 0, 0.3)',    // Maroon
    'rgba(0, 128, 0, 0.3)',    // Dark Green
    'rgba(0, 0, 128, 0.3)',    // Navy
    'rgba(255, 215, 0, 0.3)',  // Gold
  ];
  
  const drawWorldGrid = () => {
    if (!layer0Ctx || !showWorldGrid) return;
    
    const transform = layer0Ctx.getTransform();
    
    // Only draw if we have a non-trivial transform (world space)
    if (Math.abs(transform.e) < 10 && Math.abs(transform.f) < 10) {
      return;
    }
    
    layer0Ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
    layer0Ctx.lineWidth = 1;
    
    const tileSize = 32;
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
    
    // Draw tile coordinates
    layer0Ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    layer0Ctx.font = 'bold 10px monospace';
    layer0Ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    layer0Ctx.lineWidth = 3;
    
    for (let x = startX; x <= worldRight; x += tileSize) {
      for (let y = startY; y <= worldBottom; y += tileSize) {
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);
        
        const wrappedX = ((tileX % 32) + 32) % 32;
        const wrappedY = ((tileY % 32) + 32) % 32;
        
        const text = `${wrappedX},${wrappedY}`;
        layer0Ctx.strokeText(text, x + 2, y + 12);
        layer0Ctx.fillText(text, x + 2, y + 12);
      }
    }
  };
  
  const drawChunkOverlay = () => {
    if (!layer1Ctx || !showChunks) return;
    
    const transform = layer1Ctx.getTransform();
    
    if (Math.abs(transform.e) < 10 && Math.abs(transform.f) < 10) {
      return;
    }
    
    const chunkSize = 256; // 8x8 tiles * 32px = 256px
    const scale = transform.a;
    
    const worldLeft = -transform.e / scale;
    const worldTop = -transform.f / scale;
    const worldRight = worldLeft + layer1Ctx.canvas.width / scale;
    const worldBottom = worldTop + layer1Ctx.canvas.height / scale;
    
    const startX = Math.floor(worldLeft / chunkSize) * chunkSize;
    const startY = Math.floor(worldTop / chunkSize) * chunkSize;
    
    // Use a Set to track drawn chunks to prevent duplicates
    const drawnChunks = new Set();
    
    // Draw chunk boundaries and labels
    for (let x = startX; x <= worldRight; x += chunkSize) {
      for (let y = startY; y <= worldBottom; y += chunkSize) {
        const chunkX = Math.floor(x / chunkSize);
        const chunkY = Math.floor(y / chunkSize);
        
        // Create a unique key for this chunk
        const chunkKey = `${chunkX},${chunkY}`;
        
        // Skip if we've already drawn this chunk
        if (drawnChunks.has(chunkKey)) {
          continue;
        }
        drawnChunks.add(chunkKey);
        
        // Wrap to 0-3 (4x4 chunks in a 32x32 tile world)
        const wrappedChunkX = ((chunkX % 4) + 4) % 4;
        const wrappedChunkY = ((chunkY % 4) + 4) % 4;
        
        // Draw chunk border only (no fill)
        layer1Ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        layer1Ctx.lineWidth = 3;
        layer1Ctx.strokeRect(x, y, chunkSize, chunkSize);
        
        // Draw chunk coordinates
        layer1Ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        layer1Ctx.font = 'bold 24px monospace';
        layer1Ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        layer1Ctx.lineWidth = 5;
        const chunkText = `C[${wrappedChunkX},${wrappedChunkY}]`;
        layer1Ctx.strokeText(chunkText, x + 10, y + 35);
        layer1Ctx.fillText(chunkText, x + 10, y + 35);
      }
    }
  };
  
  const hookCanvasContext = (ctx, canvas) => {
    const proto = Object.getPrototypeOf(ctx);
    const originalRestore = proto.restore;
    const originalSave = proto.save;
    const originalDrawImage = proto.drawImage;
    
    // Hook layer0 for tile grid
    if (canvas.id === 'layer0') {
      layer0Ctx = ctx;
      console.log('✓ Hooked layer0 for tile grid');
      
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
    }
    
    // Hook layer1 for chunk overlay
    if (canvas.id === 'layer1') {
      layer1Ctx = ctx;
      console.log('✓ Hooked layer1 for chunk overlay');
      
      let saveCount = 0;
      
      proto.save = function(...args) {
        saveCount++;
        return originalSave.apply(this, args);
      };
      
      proto.restore = function(...args) {
        if (canvas.id === 'layer1' && saveCount > 0) {
          drawChunkOverlay();
        }
        saveCount--;
        return originalRestore.apply(this, args);
      };
    }
    
    // Track drawImage on both layers
    if (canvas.id === 'layer0' || canvas.id === 'layer1') {
      proto.drawImage = function(image, ...args) {
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
        
        // Track tiles
        if (width >= 16 && width <= 64 && height >= 16 && height <= 64) {
          const tileX = Math.floor(worldX / 32);
          const tileY = Math.floor(worldY / 32);
          
          const wrappedX = ((tileX % 32) + 32) % 32;
          const wrappedY = ((tileY % 32) + 32) % 32;
          
          const chunkX = Math.floor(tileX / 8);
          const chunkY = Math.floor(tileY / 8);
          const wrappedChunkX = ((chunkX % 4) + 4) % 4;
          const wrappedChunkY = ((chunkY % 4) + 4) % 4;
          
          const key = `${wrappedX},${wrappedY}`;
          
          blockPositions[key] = {
            x: worldX,
            y: worldY,
            width,
            height,
            tileX: wrappedX,
            tileY: wrappedY,
            chunkX: wrappedChunkX,
            chunkY: wrappedChunkY,
            image: image.src || 'unknown',
            layer: canvas.id
          };
        }
        
        return originalDrawImage.apply(this, [image, ...args]);
      };
    }
  };
  
  const hookAllCanvases = () => {
    const canvases = document.querySelectorAll('canvas');
    console.log(`Found ${canvases.length} canvases`);
    
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
    console.log('Tile grid:', showWorldGrid ? 'ON' : 'OFF');
  };
  
  window.toggleChunks = () => {
    showChunks = !showChunks;
    console.log('Chunk overlay:', showChunks ? 'ON' : 'OFF');
  };
  
  window.getBlockAt = (tileX, tileY) => {
    const wrappedX = ((tileX % 32) + 32) % 32;
    const wrappedY = ((tileY % 32) + 32) % 32;
    const key = `${wrappedX},${wrappedY}`;
    return blockPositions[key] || null;
  };
  
  window.getChunkAt = (chunkX, chunkY) => {
    const wrappedChunkX = ((chunkX % 4) + 4) % 4;
    const wrappedChunkY = ((chunkY % 4) + 4) % 4;
    return { chunkX: wrappedChunkX, chunkY: wrappedChunkY };
  };
  
  window.getAllBlocks = () => {
    return Object.values(blockPositions);
  };
  
  window.getBlocksInChunk = (chunkX, chunkY) => {
    const blocks = [];
    const startTileX = chunkX * 8;
    const startTileY = chunkY * 8;
    
    for (let x = startTileX; x < startTileX + 8; x++) {
      for (let y = startTileY; y < startTileY + 8; y++) {
        const block = window.getBlockAt(x, y);
        if (block) blocks.push(block);
      }
    }
    return blocks;
  };
  
  console.log('Grid system active!');
  console.log('- World: 32x32 tiles (4x4 chunks)');
  console.log('- Chunks: 0-3 for both X and Y (16 total chunks)');
  console.log('- Each chunk: 8x8 tiles (256x256 pixels)');
  console.log('Commands:');
  console.log('- toggleWorldGrid() - toggle tile grid');
  console.log('- toggleChunks() - toggle chunk overlay');
  console.log('- getBlockAt(x, y) - get block at tile coordinates');
  console.log('- getBlocksInChunk(chunkX, chunkY) - get all blocks in a chunk');
})();
