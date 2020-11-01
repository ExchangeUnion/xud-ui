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

// Settings not exposed to the end-user.
const DOCKER_BINARY_DOWNLOAD_URL =
  "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe";
const DOCKER_INSTALLER_FILE_NAME = "docker-installer.exe";

const ipcHandler = (mainWindow) => {
  ipcMain.on("execute-command", (_event, [reqId, clientCommand]) => {
    // List of commands we're allowing the client to execute.
    const AVAILABLE_COMMANDS = {
      docker_version: "docker version",
      docker_ps: "docker ps",
      docker_download: `curl ${DOCKER_BINARY_DOWNLOAD_URL} > ${DOCKER_INSTALLER_FILE_NAME}`,
      docker_download_status: `dir | findstr /R "${DOCKER_INSTALLER_FILE_NAME}"`,
      docker_install: `${DOCKER_INSTALLER_FILE_NAME} install --quiet`,
    };
    const command = AVAILABLE_COMMANDS[clientCommand];
    if (command) {
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
      // Deny executing unknown commands.
      mainWindow.webContents.send("execute-command", {
        reqId,
        error: `${JSON.stringify(clientCommand)} is not allowed.`,
      });
    }
  });
};

module.exports = { ipcHandler };
