const { ipcMain } = require("electron");
const { exec } = require("child_process");
const { Observable, of } = require("rxjs");
const { map, catchError } = require("rxjs/operators");

const execCommand = (cmd) => {
  const cmd$ = new Observable((subscriber) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        subscriber.error(error);
        return;
      }
      subscriber.next(stdout);
      subscriber.complete();
    });
  });
  return cmd$;
};

const isDockerInstalled$ = () => {
  return execCommand("docker version").pipe(
    map((output) => {
      if (output.includes("Docker Engine")) {
        return true;
      }
      return false;
    }),
    catchError(() => of(false))
  );
};

const setupDockerHelper = (mainWindow) => {
  ipcMain.on("is-docker-installed", (event, args) => {
    isDockerInstalled$().subscribe((isDockerInstalled) => {
      mainWindow.webContents.send("is-docker-installed", isDockerInstalled);
    });
  });
};

module.exports = { setupDockerHelper };
