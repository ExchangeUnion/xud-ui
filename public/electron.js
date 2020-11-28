const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const log = require("electron-log");
const { ipcHandler, execCommand, AVAILABLE_COMMANDS } = require("./ipc");
const { take } = require("rxjs/operators");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 680,
    minHeight: 680,
    width: 900,
    minWidth: 900,
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
      ? "https://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  ipcHandler(mainWindow);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      mainWindow.isMinimized() && mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform === "win32") {
    execCommand(AVAILABLE_COMMANDS.stop_xud_docker)
      .pipe(take(1))
      .subscribe({
        next: () => {},
        error: (err) => {
          log.error("failed to stop containers.", err);
          app.quit();
        },
        complete: () => app.quit(),
      });
  } else if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// SSL/TSL: self signed certificate support
app.on(
  "certificate-error",
  (event, _webContents, _url, _error, _certificate, callback) => {
    event.preventDefault();
    callback(true);
  }
);
