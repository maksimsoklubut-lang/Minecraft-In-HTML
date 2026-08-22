(function() {
  // App State
  let width = 16;
  let height = 16;
  let pixelData = []; // Store pixel RGBA array or hex strings. Null/undefined = transparent
  let history = [];
  let historyStep = -1;
  const MAX_HISTORY = 30;

  // Tools: 'brush', 'eraser', 'fill', 'picker'
  let currentTool = 'brush';
  let currentColor = '#000000';
  let showGrid = true;
  let currentTheme = 'dark'; // 'dark' or 'light'

  // Default Palette
  const defaultPalette = [
    '#000000', '#ffffff', '#7f7f7f', '#c3c3c3',
    '#880015', '#b5e61d', '#ed1c24', '#ff7f27',
    '#fff200', '#22b14c', '#00a2e8', '#3f48cc',
    '#a349a4', '#ffaec9', '#ffc90e', '#99d9ea'
  ];

  // DOM Elements
  const pixelCanvas = document.getElementById('pixel-canvas');
  const gridCanvas = document.getElementById('grid-canvas');
  const pCtx = pixelCanvas.getContext('2d', { willReadFrequently: true });
  const gCtx = gridCanvas.getContext('2d');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const viewport = document.getElementById('viewport');

  // Zoom and Pan
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let isDrawing = false;
  let lastDrawCoord = null;

  // Touch Pinch Zoom State
  let initialPinchDistance = null;
  let initialScale = 1;
  let initialPan = { x: 0, y: 0 };
  let initialCenter = { x: 0, y: 0 };

  // Init Application
  function init() {
    createPaletteUI();
    setupEventListeners();
    setTheme('dark');
    initCanvas(16, 16);
    centerCanvas();
  }

  // Canvas Initialization
  function initCanvas(w, h, initialPixels = null) {
    width = w;
    height = h;
    pixelData = initialPixels ? [...initialPixels] : new Array(width * height).fill(null);
    history = [];
    historyStep = -1;

    pixelCanvas.width = width;
    pixelCanvas.height = height;
    gridCanvas.width = width * 10; // High resolution grid
    gridCanvas.height = height * 10;

    canvasWrapper.style.width = width + 'px';
    canvasWrapper.style.height = height + 'px';

    saveState();
    renderPixelCanvas();
    renderGridCanvas();
  }

  // Center canvas in viewport (Ensure cell size is comfortable, e.g. at least 8-16px per pixel)
  function centerCanvas() {
    const vpRect = viewport.getBoundingClientRect();
    const minDim = Math.min(vpRect.width || 360, vpRect.height || 640) * 0.75;
    // Aim for 1 cell size to be around 12-20px on screen, minimum 8px
    let targetScale = Math.floor(minDim / Math.max(width, height));
    if (targetScale < 8) targetScale = 8;
    if (targetScale > 40) targetScale = 40;

    scale = targetScale;
    panX = (vpRect.width - width * scale) / 2;
    panY = (vpRect.height - height * scale) / 2;

    updateTransform();
  }

  function updateTransform() {
    canvasWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    document.getElementById('zoom-level').textContent = `${Math.round(scale * 100 / 16)}%`;
  }

  // Render Pixel Canvas
  function renderPixelCanvas() {
    pCtx.clearRect(0, 0, width, height);
    const imgData = pCtx.createImageData(width, height);
    for (let i = 0; i < pixelData.length; i++) {
      const color = pixelData[i];
      const idx = i * 4;
      if (color) {
        const rgb = hexToRgb(color);
        imgData.data[idx] = rgb.r;
        imgData.data[idx + 1] = rgb.g;
        imgData.data[idx + 2] = rgb.b;
        imgData.data[idx + 3] = 255;
      } else {
        imgData.data[idx + 3] = 0; // Transparent
      }
    }
    pCtx.putImageData(imgData, 0, 0);
  }

  // Render Grid Overlay
  function renderGridCanvas() {
    gCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    if (!showGrid) return;

    gCtx.strokeStyle = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
    gCtx.lineWidth = 0.5;

    const cellW = gridCanvas.width / width;
    const cellH = gridCanvas.height / height;

    gCtx.beginPath();
    for (let x = 0; x <= width; x++) {
      gCtx.moveTo(x * cellW, 0);
      gCtx.lineTo(x * cellW, gridCanvas.height);
    }
    for (let y = 0; y <= height; y++) {
      gCtx.moveTo(0, y * cellH);
      gCtx.lineTo(gridCanvas.width, y * cellH);
    }
    gCtx.stroke();
  }

  // Color Helper Functions
  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // History State
  function saveState() {
    if (historyStep < history.length - 1) {
      history = history.slice(0, historyStep + 1);
    }
    history.push([...pixelData]);
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      historyStep++;
    }
    updateUndoRedoButtons();
  }

  function undo() {
    if (historyStep > 0) {
      historyStep--;
      pixelData = [...history[historyStep]];
      renderPixelCanvas();
      updateUndoRedoButtons();
    }
  }

  function redo() {
    if (historyStep < history.length - 1) {
      historyStep++;
      pixelData = [...history[historyStep]];
      renderPixelCanvas();
      updateUndoRedoButtons();
    }
  }

  function updateUndoRedoButtons() {
    document.getElementById('btn-undo').disabled = historyStep <= 0;
    document.getElementById('btn-redo').disabled = historyStep >= history.length - 1;
    document.getElementById('btn-undo').style.opacity = historyStep <= 0 ? '0.4' : '1';
    document.getElementById('btn-redo').style.opacity = historyStep >= history.length - 1 ? '0.4' : '1';
  }

  // Tools Actions
  function setPixel(x, y, color) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    pixelData[idx] = color;
  }

  function getPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return null;
    return pixelData[y * width + x];
  }

  function drawLine(x0, y0, x1, y1, color) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      setPixel(x0, y0, color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  function floodFill(startX, startY, targetColor, replacementColor) {
    if (targetColor === replacementColor) return;
    const queue = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const idx = y * width + x;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (visited[idx]) continue;
      visited[idx] = 1;

      if (pixelData[idx] === targetColor) {
        pixelData[idx] = replacementColor;
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
  }

  function handlePointerStart(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    if (currentTool === 'picker') {
      const color = getPixel(x, y);
      if (color) {
        currentColor = color;
        document.getElementById('color-picker').value = color;
        document.getElementById('color-preview').style.backgroundColor = color;
      }
      selectTool('brush');
      return;
    }

    isDrawing = true;
    lastDrawCoord = { x, y };

    if (currentTool === 'brush') {
      setPixel(x, y, currentColor);
      renderPixelCanvas();
    } else if (currentTool === 'eraser') {
      setPixel(x, y, null);
      renderPixelCanvas();
    } else if (currentTool === 'fill') {
      const targetColor = getPixel(x, y);
      floodFill(x, y, targetColor, currentColor);
      renderPixelCanvas();
      saveState();
      isDrawing = false;
    }
  }

  function handlePointerMove(x, y) {
    if (!isDrawing) return;
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const fillCol = currentTool === 'eraser' ? null : currentColor;

    if (lastDrawCoord) {
      drawLine(lastDrawCoord.x, lastDrawCoord.y, x, y, fillCol);
    } else {
      setPixel(x, y, fillCol);
    }

    lastDrawCoord = { x, y };
    renderPixelCanvas();
  }

  function handlePointerEnd() {
    if (isDrawing) {
      isDrawing = false;
      lastDrawCoord = null;
      saveState();
    }
  }

  // Convert client coordinates (screen) to canvas pixel coordinates
  function screenToCanvas(clientX, clientY) {
    const rect = canvasWrapper.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / (rect.width / width));
    const y = Math.floor((clientY - rect.top) / (rect.height / height));
    return { x, y };
  }

  // Import File Handler
  function handleFileImport(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        // Cap max imported image dimensions for pixel art canvas (max 128x128)
        let imgW = img.width;
        let imgH = img.height;
        if (imgW > 128 || imgH > 128) {
          const maxDim = Math.max(imgW, imgH);
          imgW = Math.round((imgW / maxDim) * 64);
          imgH = Math.round((imgH / maxDim) * 64);
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgW;
        tempCanvas.height = imgH;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, imgW, imgH);

        const imgData = tempCtx.getImageData(0, 0, imgW, imgH);
        const importedPixels = new Array(imgW * imgH);

        for (let i = 0; i < imgW * imgH; i++) {
          const r = imgData.data[i * 4];
          const g = imgData.data[i * 4 + 1];
          const b = imgData.data[i * 4 + 2];
          const a = imgData.data[i * 4 + 3];

          if (a < 128) {
            importedPixels[i] = null; // Transparent
          } else {
            importedPixels[i] = rgbToHex(r, g, b);
          }
        }

        initCanvas(imgW, imgH, importedPixels);
        centerCanvas();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Create Palette Swatches
  function createPaletteUI() {
    const grid = document.getElementById('palette-grid');
    grid.innerHTML = '';
    defaultPalette.forEach((hex, index) => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-swatch';
      swatch.style.backgroundColor = hex;
      if (index === 0) swatch.classList.add('active');

      swatch.addEventListener('click', () => {
        document.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        currentColor = hex;
        document.getElementById('color-picker').value = hex;
        document.getElementById('color-preview').style.backgroundColor = hex;
      });

      grid.appendChild(swatch);
    });
  }

  function selectTool(toolName) {
    currentTool = toolName;
    document.querySelectorAll('.tool-btn').forEach(btn => {
      if (btn.id.startsWith('tool-')) {
        btn.classList.toggle('active', btn.id === `tool-${toolName}`);
      }
    });
  }

  function setTheme(theme) {
    currentTheme = theme;
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.remove('theme-dark');
      html.classList.add('theme-light');
    } else {
      html.classList.remove('theme-light');
      html.classList.add('theme-dark');
    }
    renderGridCanvas();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Toolbar buttons
    document.getElementById('tool-brush').addEventListener('click', () => selectTool('brush'));
    document.getElementById('tool-eraser').addEventListener('click', () => selectTool('eraser'));
    document.getElementById('tool-fill').addEventListener('click', () => selectTool('fill'));
    document.getElementById('tool-picker').addEventListener('click', () => selectTool('picker'));

    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);

    document.getElementById('btn-toggle-grid').addEventListener('click', (e) => {
      showGrid = !showGrid;
      e.currentTarget.classList.toggle('active', showGrid);
      renderGridCanvas();
    });

    // File Import Button & Input
    const fileInput = document.getElementById('file-input');
    document.getElementById('btn-import-file').addEventListener('click', () => fileInput.click());
    const importProjBtn = document.getElementById('modal-projects-import');
    if (importProjBtn) {
      importProjBtn.addEventListener('click', () => {
        document.getElementById('modal-projects').classList.add('hidden');
        fileInput.click();
      });
    }

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileImport(e.target.files[0]);
        fileInput.value = ''; // Reset
      }
    });

    // Color picker
    const picker = document.getElementById('color-picker');
    picker.addEventListener('input', (e) => {
      currentColor = e.target.value;
      document.getElementById('color-preview').style.backgroundColor = currentColor;
    });

    // Zoom buttons
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      scale = Math.min(scale * 1.25, 50);
      updateTransform();
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      scale = Math.max(scale / 1.25, 0.5);
      updateTransform();
    });
    document.getElementById('btn-zoom-reset').addEventListener('click', centerCanvas);

    // Mouse / Touch Event handling on Viewport & Canvas
    viewport.addEventListener('mousedown', (e) => {
      if (e.button === 1 || e.spaceKey || e.altKey) {
        // Pan
        isPanning = true;
        panStartX = e.clientX - panX;
        panStartY = e.clientY - panY;
        return;
      }

      if (e.button === 0) {
        const coord = screenToCanvas(e.clientX, e.clientY);
        handlePointerStart(coord.x, coord.y);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isPanning) {
        panX = e.clientX - panStartX;
        panY = e.clientY - panStartY;
        updateTransform();
        return;
      }
      if (isDrawing) {
        const coord = screenToCanvas(e.clientX, e.clientY);
        handlePointerMove(coord.x, coord.y);
      }
    });

    window.addEventListener('mouseup', () => {
      isPanning = false;
      handlePointerEnd();
    });

    // Touch events handling (Pinch zoom & Drawing)
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const coord = screenToCanvas(touch.clientX, touch.clientY);
        if (coord.x >= 0 && coord.x < width && coord.y >= 0 && coord.y < height) {
          handlePointerStart(coord.x, coord.y);
        } else {
          // Pan when touch outside canvas
          isPanning = true;
          panStartX = touch.clientX - panX;
          panStartY = touch.clientY - panY;
        }
      } else if (e.touches.length === 2) {
        // Pinch zoom start
        isDrawing = false;
        isPanning = false;

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialScale = scale;
        initialPan = { x: panX, y: panY };
        initialCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (isDrawing) {
          e.preventDefault();
          const coord = screenToCanvas(touch.clientX, touch.clientY);
          handlePointerMove(coord.x, coord.y);
        } else if (isPanning) {
          e.preventDefault();
          panX = touch.clientX - panStartX;
          panY = touch.clientY - panStartY;
          updateTransform();
        }
      } else if (e.touches.length === 2 && initialPinchDistance) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const center = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };

        const zoomRatio = dist / initialPinchDistance;
        let newScale = initialScale * zoomRatio;
        if (newScale < 0.5) newScale = 0.5;
        if (newScale > 50) newScale = 50;

        // Zoom centered on pinch center
        panX = center.x - (initialCenter.x - initialPan.x) * (newScale / initialScale) + (center.x - initialCenter.x);
        panY = center.y - (initialCenter.y - initialPan.y) * (newScale / initialScale) + (center.y - initialCenter.y);
        scale = newScale;

        updateTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialPinchDistance = null;
      }
      if (e.touches.length === 0) {
        isPanning = false;
        handlePointerEnd();
      }
    });

    // Mouse wheel zoom
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const newScale = Math.min(Math.max(scale * zoomFactor, 0.5), 50);

      panX = mouseX - (mouseX - panX) * (newScale / scale);
      panY = mouseY - (mouseY - panY) * (newScale / scale);
      scale = newScale;

      updateTransform();
    }, { passive: false });

    // Modals Handling
    // New Canvas Modal
    const modalNew = document.getElementById('modal-new');
    document.getElementById('btn-new').addEventListener('click', () => modalNew.classList.remove('hidden'));
    document.getElementById('modal-new-cancel').addEventListener('click', () => modalNew.classList.add('hidden'));

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('canvas-width').value = btn.dataset.w;
        document.getElementById('canvas-height').value = btn.dataset.h;
      });
    });

    document.getElementById('modal-new-confirm').addEventListener('click', () => {
      const w = parseInt(document.getElementById('canvas-width').value) || 16;
      const h = parseInt(document.getElementById('canvas-height').value) || 16;
      initCanvas(Math.min(Math.max(w, 1), 128), Math.min(Math.max(h, 1), 128));
      centerCanvas();
      modalNew.classList.add('hidden');
    });

    // Export Modal
    const modalExport = document.getElementById('modal-export');
    const exportPreviewImg = document.getElementById('export-preview-img');

    document.getElementById('btn-export').addEventListener('click', () => {
      updateExportPreview();
      modalExport.classList.remove('hidden');
    });

    document.getElementById('modal-export-cancel').addEventListener('click', () => modalExport.classList.add('hidden'));

    document.getElementById('export-scale').addEventListener('change', updateExportPreview);

    function updateExportPreview() {
      const scaleMultiplier = parseInt(document.getElementById('export-scale').value) || 1;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width * scaleMultiplier;
      tempCanvas.height = height * scaleMultiplier;
      const ctx = tempCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pixelCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
      exportPreviewImg.src = tempCanvas.toDataURL('image/png');
    }

    document.getElementById('modal-export-download').addEventListener('click', () => {
      const scaleMultiplier = parseInt(document.getElementById('export-scale').value) || 1;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width * scaleMultiplier;
      tempCanvas.height = height * scaleMultiplier;
      const ctx = tempCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pixelCanvas, 0, 0, tempCanvas.width, tempCanvas.height);

      const link = document.createElement('a');
      link.download = `pixel_art_${width}x${height}_${Date.now()}.png`;
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
      modalExport.classList.add('hidden');
    });

    // Projects Save & Load Modal
    const modalProjects = document.getElementById('modal-projects');
    document.getElementById('btn-save-project').addEventListener('click', () => {
      saveProjectToLocalStorage();
    });

    document.getElementById('btn-load-project').addEventListener('click', () => {
      renderProjectsList();
      modalProjects.classList.remove('hidden');
    });

    document.getElementById('modal-projects-close').addEventListener('click', () => modalProjects.classList.add('hidden'));

    // Settings Modal
    const modalSettings = document.getElementById('modal-settings');
    document.getElementById('btn-settings').addEventListener('click', () => modalSettings.classList.remove('hidden'));
    document.getElementById('modal-settings-close').addEventListener('click', () => modalSettings.classList.add('hidden'));

    document.querySelectorAll('input[name="theme-option"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        setTheme(e.target.value);
      });
    });
  }

  // LocalStorage Projects Manager
  function saveProjectToLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('pixel_projects') || '[]');
    const name = prompt('Введите название проекта:', `Проект ${projects.length + 1}`);
    if (!name) return;

    const project = {
      id: Date.now(),
      name,
      width,
      height,
      pixelData,
      date: new Date().toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      preview: pixelCanvas.toDataURL('image/png')
    };

    projects.unshift(project);
    localStorage.setItem('pixel_projects', JSON.stringify(projects));
    alert('Проект успешно сохранен!');
  }

  function renderProjectsList() {
    const list = document.getElementById('projects-list');
    const projects = JSON.parse(localStorage.getItem('pixel_projects') || '[]');

    if (projects.length === 0) {
      list.innerHTML = '<p class="empty-msg">Нет сохраненных проектов</p>';
      return;
    }

    list.innerHTML = '';
    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-info">
          <img src="${p.preview}" class="project-preview-thumb">
          <div>
            <div class="project-name">${p.name}</div>
            <div class="project-date">${p.width}x${p.height} • ${p.date}</div>
          </div>
        </div>
        <div class="project-card-actions">
          <button class="btn-load">Загрузить</button>
          <button class="btn-delete">Удалить</button>
        </div>
      `;

      card.querySelector('.btn-load').addEventListener('click', () => {
        width = p.width;
        height = p.height;
        pixelData = [...p.pixelData];
        pixelCanvas.width = width;
        pixelCanvas.height = height;
        gridCanvas.width = width * 10;
        gridCanvas.height = height * 10;
        canvasWrapper.style.width = width + 'px';
        canvasWrapper.style.height = height + 'px';
        history = [];
        historyStep = -1;
        saveState();
        renderPixelCanvas();
        renderGridCanvas();
        centerCanvas();
        modalProjects.classList.add('hidden');
      });

      card.querySelector('.btn-delete').addEventListener('click', () => {
        const updated = projects.filter(item => item.id !== p.id);
        localStorage.setItem('pixel_projects', JSON.stringify(updated));
        renderProjectsList();
      });

      list.appendChild(card);
    });
  }

  // Run app
  window.addEventListener('DOMContentLoaded', init);
})();
