const { clipboard, contextBridge, shell } = require("electron");
const log = require("electron-log");

contextBridge.exposeInMainWorld("electron", {
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
