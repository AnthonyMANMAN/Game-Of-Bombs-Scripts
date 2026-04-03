# ScriptDash GOB — Desktop Edition

Script management panel for **Game of Bombs**, packaged as a native desktop app with Electron.

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer

### Run in development
```bash
npm install
npm start
```

### Build an installer

| Platform | Command | Output |
|----------|---------|--------|
| Windows  | `npm run dist:win`   | `dist/ScriptDash GOB Setup.exe` |
| macOS    | `npm run dist:mac`   | `dist/ScriptDash GOB.dmg` |
| Linux    | `npm run dist:linux` | `dist/ScriptDash GOB.AppImage` |

---

## Project Structure

```
scriptdash-desktop/
├── main.js          ← Electron main process (window, dialogs, clipboard)
├── preload.js       ← Secure IPC bridge (contextBridge)
├── package.json     ← Dependencies + electron-builder config
├── src/
│   └── index.html   ← Full UI (renderer process)
└── assets/
    ├── icon.png     ← 256×256 app icon (add your own)
    ├── icon.ico     ← Windows icon  (add your own)
    └── icon.icns    ← macOS icon    (add your own)
```

---

## What changed vs the browser version

| Feature | Browser version | Desktop version |
|---------|----------------|-----------------|
| Export  | `<a download>` hack | Native Save dialog |
| Import  | `<input type=file>` | Native Open dialog |
| Copy to clipboard | `navigator.clipboard` | Electron clipboard API |
| Window frame | browser chrome | native title bar |
| Storage | `localStorage` | `localStorage` (Electron persists it per-app) |
| Icons | browser tab | OS taskbar / dock icon |

---

## Adding an Icon

Place your icon files in the `assets/` folder:

- `icon.png`  — 256×256 PNG (Linux + fallback)
- `icon.ico`  — Windows multi-size ICO
- `icon.icns` — macOS ICNS bundle

Free converter: https://www.icoconverter.com/

---

## Scripts are saved locally

All scripts (including built-ins) are stored in Electron's `localStorage`,
which lives in the app's user-data directory:

| OS | Path |
|----|------|
| Windows | `%APPDATA%\scriptdash-gob\` |
| macOS | `~/Library/Application Support/scriptdash-gob/` |
| Linux | `~/.config/scriptdash-gob/` |

Use **ЭКСПОРТ / ИМПОРТ** to back up or share your script collection.
