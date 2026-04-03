# Scripts — Game of Bombs

A collection of scripts and tools for **Game of Bombs**, plus a full-featured script management dashboard available in both browser and native desktop flavors.

---

## What's in this repo

| Folder / File | Description |
|---|---|
| `В ТГ` | Scripts for Telegram integration |
| `Всякое` | Miscellaneous scripts |
| `Локал` | Local utility scripts |
| `Мод Атласа, Тайлсета` | Atlas & tileset mod scripts |
| `Работа с Канвасом` | Canvas manipulation scripts |
| `Спам В Чат` | Chat spam scripts |
| `Цепь, Спин, Бита, Перки` | Chain, spin, bat & perks scripts |
| `script-dashboard.html` | Browser-based ScriptDash UI (no install needed) |
| `src/index.html` | ScriptDash UI bundled inside the Electron app |

---

## ScriptDash — Script Management Panel

ScriptDash is a visual dashboard for organizing, editing, copying, importing, and exporting your Game of Bombs scripts. It comes in two versions:

### Browser version
Just open `script-dashboard.html` directly in your browser — no installation required.

### Desktop version (Electron)
A native app wrapper around the same UI, with proper OS integrations like native file dialogs and taskbar icons.

---

## Quick Start (Desktop)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer

### Run in development
```bash
npm install
npm start
```

### Build a distributable installer

| Platform | Command | Output |
|---|---|---|
| Windows | `npm run dist:win` | `dist/ScriptDash GOB Setup.exe` |
| macOS | `npm run dist:mac` | `dist/ScriptDash GOB.dmg` |
| Linux | `npm run dist:linux` | `dist/ScriptDash GOB.AppImage` |

---

## Browser vs Desktop

| Feature | Browser | Desktop |
|---|---|---|
| Export | `<a download>` workaround | Native Save dialog |
| Import | `<input type=file>` | Native Open dialog |
| Clipboard | `navigator.clipboard` | Electron clipboard API |
| Window frame | Browser chrome | Native title bar |
| Storage | `localStorage` | `localStorage` (persisted per-app) |
| Icons | Browser tab favicon | OS taskbar / dock icon |

---

## Project Structure (Desktop)
