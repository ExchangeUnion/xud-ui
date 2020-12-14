const electron = require("electron");
const { Menu, Tray, Notification } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const { ipcHandler, execCommand } = require("./ipc");
const { combineLatest } = require("rxjs");
const { take } = require("rxjs/operators");
const log = require("electron-log");

let mainWindow, tray;

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

  mainWindow.on("close", (e) => {
    if (!app.isQuiting) {
      handleMainWindowHideActions(e);
    }
  });
}

const handleMoveToTrayNotification = () => {
  const notification = {
    title: "XUD UI is still running",
    body: "Select shutdown here if you want to shutdown your environment"
  }
  new Notification(notification).show();
};

const handleShutdownNotification = () => {
  const notification = {
    title: "Shutdown",
    body: "All docker containers will be stopped"
  }
  new Notification(notification).show();
};

const handleMainWindowHideActions = (e) => {
  e.preventDefault();
  mainWindow.hide();
  tray.setContextMenu(trayMenuWithShow);
  handleMoveToTrayNotification();
};

const handleShutdownActions = () => {
  setTimeout(() => {
    app.isQuiting = true;
    app.quit();
  }, 1000);
};

const handleShowActions = () => {
  mainWindow.show();
  tray.setContextMenu(trayMenuWithHide); 
};

const handleHideActions = () => {
  mainWindow.hide();
  tray.setContextMenu(trayMenuWithShow);
};

const shutdownMenuItem = {
  label: "Shutdown",
  click: () => {
    handleShutdownNotification();
    handleShutdownActions();
  }
};

const trayMenuWithShow = Menu.buildFromTemplate([
  {
    label: "Show",
    click: () => {
      handleShowActions();
    },
  },
  shutdownMenuItem
]);

const trayMenuWithHide = Menu.buildFromTemplate([
  {
    label: "Hide",
    click: () => {
      handleHideActions();
    },
  },
  shutdownMenuItem
]);

app
  .whenReady()
  .then(() => {
    tray = new Tray(path.join(__dirname, "./assets/512x512.png"));
    tray.setContextMenu(trayMenuWithHide);
    tray.on("double-click", () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
        tray.setContextMenu(trayMenuWithShow);
      } else {
        mainWindow.show();
        tray.setContextMenu(trayMenuWithHide); 
      }
    });
  })
  .catch((e) => {
    log.error(e);
  });

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

app.on("will-quit", () => {
  combineLatest([
    execCommand("docker stop mainnet_xud_1"),
    execCommand("docker stop mainnet_connext_1"),
    execCommand("docker stop mainnet_lndbtc_1"),
    execCommand("docker stop mainnet_lndltc_1"),
    execCommand("docker stop mainnet_utils_1"),
    execCommand("docker stop mainnet_proxy_1"),
    execCommand("docker stop mainnet_boltz_1"),
  ])
    .pipe(take(1))
    .subscribe(() => {});
  if (process.platform !== "darwin") {
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

app.on("before-quit", () => {
  app.isQuiting = true;
});