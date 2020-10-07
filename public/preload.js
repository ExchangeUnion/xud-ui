const { clipboard, contextBridge, shell } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  copyToClipboard: (value) => {
    clipboard.writeText(value);
  },
  openExternal: (url) => {
    shell.openExternal(url);
  },
});
