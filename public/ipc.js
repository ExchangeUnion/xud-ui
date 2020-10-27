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

const ipcHandler = (mainWindow) => {
  ipcMain.on("execute-command", (event, command) => {
    const ALLOWED_COMMANDS = ["docker version"];
    if (ALLOWED_COMMANDS.includes(command)) {
      execCommand(command).subscribe({
        next: (stdout) => {
          mainWindow.webContents.send("execute-command", {
            output: stdout,
          });
        },
        error: (error) => {
          mainWindow.webContents.send("execute-command", {
            error,
          });
        },
      });
    } else {
      mainWindow.webContents.send("execute-command", {
        error: `${command} is not allowed.`,
      });
    }
  });
};

module.exports = { ipcHandler };
