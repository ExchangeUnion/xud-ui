const electron = require("electron");
const { Menu, Tray, Notification } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const log = require("electron-log");
const { ipcHandler, execCommand, AVAILABLE_COMMANDS } = require("./ipc");
const { take } = require("rxjs/operators");

let mainWindow, tray, readyToQuit;

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
      enableRemoteModule: true,
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
  mainWindow.on("minimize", () => tray.setContextMenu(trayMenuWithShow));
  mainWindow.on("show", () => tray.setContextMenu(trayMenuWithHide));
}

const handleMoveToTrayNotification = () => {
  const notification = {
    title: "XUD UI is still running",
    body: "Select shutdown here if you want to shutdown your local environment",
  };
  new Notification(notification).show();
};

const handleShutdownNotification = () => {
  const notification = {
    title: "Shutdown",
    body: "All locally running xud-docker containers will be stopped",
  };
  new Notification(notification).show();
};

const handleMainWindowHideActions = (e) => {
  e.preventDefault();
  handleHideActions();
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
  },
};

const trayMenuWithShow = Menu.buildFromTemplate([
  {
    label: "Show",
    click: () => {
      handleShowActions();
    },
  },
  shutdownMenuItem,
]);

const trayMenuWithHide = Menu.buildFromTemplate([
  {
    label: "Hide",
    click: () => {
      handleHideActions();
    },
  },
  shutdownMenuItem,
]);

app
  .whenReady()
  .then(() => {
    tray = new Tray(path.join(__dirname, "./assets/512x512.png"));
    tray.setContextMenu(trayMenuWithHide);
    tray.on("double-click", () => {
      if (mainWindow.isVisible()) {
        handleHideActions();
      } else {
        handleShowActions();
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
      handleShowActions();
    }
  });
}

app.on("ready", createWindow);

app.on("will-quit", (e) => {
  const quitApp = () => {
    readyToQuit = true;
    app.quit();
  };
  if (process.platform === "win32" && !readyToQuit) {
    e.preventDefault();
    execCommand(AVAILABLE_COMMANDS.stop_xud_docker)
      .pipe(take(1))
      .subscribe({
        next: () => {},
        error: (err) => {
          log.error("failed to stop containers.", err);
          quitApp();
        },
        complete: () => quitApp(),
      });
  }
});

app.on("activate", () => {
  mainWindow ? mainWindow.show() : createWindow();
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
