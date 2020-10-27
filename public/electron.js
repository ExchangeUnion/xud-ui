const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const { ipcHandler } = require("./ipc");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    backgroundColor: "#303030",
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "./assets/512x512.png"),
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  ipcHandler(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
