const { clipboard, contextBridge, shell } = require("electron");
const log = require("electron-log");
const { ipcRenderer } = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");

contextBridge.exposeInMainWorld("electron", {
  platform: () => {
    return process.platform;
  },
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
  xudDockerEnvExists: (network) => {
  let pathFromHomedir = "";
  // TODO: implement for macos and linux
  if (process.platform === "win32") {
    pathFromHomedir = "AppData/Local/XudDocker";
  }
  return fs.existsSync(
    path.join(os.homedir(),
    `${pathFromHomedir}/${network}/data/xud/nodekey.dat`)
  );
  },
});
