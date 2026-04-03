const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exportScripts:  (json)  => ipcRenderer.invoke('export-scripts', json),
  importScripts:  ()      => ipcRenderer.invoke('import-scripts'),
  writeClipboard: (text)  => ipcRenderer.invoke('write-clipboard', text),
  platform: process.platform,
});
