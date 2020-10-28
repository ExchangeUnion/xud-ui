const { ipcMain } = require("electron");
const { exec } = require("child_process");
const { Observable } = require("rxjs");

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

// TODO: test code for debugging - remove later.
execCommand("cd").subscribe((output) => console.log("output from cd", output));

const ipcHandler = (mainWindow) => {
  ipcMain.on("execute-command", (_event, [reqId, command]) => {
    const ALLOWED_COMMANDS = [
      "docker version",
      "docker ps",
      "curl https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe > docker-installer.exe",
    ];
    if (ALLOWED_COMMANDS.includes(command)) {
      execCommand(command).subscribe({
        next: (stdout) => {
          mainWindow.webContents.send("execute-command", {
            reqId,
            output: stdout,
          });
        },
        error: (error) => {
          mainWindow.webContents.send("execute-command", {
            reqId,
            error,
          });
        },
      });
    } else {
      mainWindow.webContents.send("execute-command", {
        reqId,
        error: `${command} is not allowed.`,
      });
    }
  });
};

module.exports = { ipcHandler };
