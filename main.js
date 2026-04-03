const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: 'Script Dashboard — Game of Bombs',
    backgroundColor: '#080c10',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── IPC: Export (save file dialog) ───────────────────────────────────────────
ipcMain.handle('export-scripts', async (_event, jsonString) => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: 'Экспорт скриптов',
    defaultPath: 'scriptdash-gob.json',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (canceled || !filePath) return { ok: false };
  fs.writeFileSync(filePath, jsonString, 'utf8');
  return { ok: true, filePath };
});

// ── IPC: Import (open file dialog) ───────────────────────────────────────────
ipcMain.handle('import-scripts', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Импорт скриптов',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (canceled || !filePaths.length) return { ok: false };
  const content = fs.readFileSync(filePaths[0], 'utf8');
  return { ok: true, content };
});

// ── IPC: Copy to clipboard ────────────────────────────────────────────────────
ipcMain.handle('write-clipboard', async (_event, text) => {
  const { clipboard } = require('electron');
  clipboard.writeText(text);
  return true;
});
