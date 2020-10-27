const { clipboard, contextBridge, shell } = require("electron");
const log = require("electron-log");
const { ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  copyToClipboard: (value) => {
    clipboard.writeText(value);
  },
  openExternal: (url) => {
    shell.openExternal(url);
  },
  logError: (message) => {
    log.error(message);
  },
  logInfo: (message) => {
    log.info(message);
  },
});
