const { ipcMain } = require("electron");
const { exec } = require("child_process");
const { Observable } = require("rxjs");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Settings not exposed to the end-user.
const DOCKER_BINARY_DOWNLOAD_URL =
  "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe";
const DOCKER_INSTALLER_FILE_NAME = "docker-installer.exe";

// List of commands we're allowing the client to execute.
const AVAILABLE_COMMANDS = {
  docker_version: "docker version",
  docker_ps: "docker ps",
  docker_download: `curl ${DOCKER_BINARY_DOWNLOAD_URL} > ${DOCKER_INSTALLER_FILE_NAME}`,
  docker_download_status: `dir | findstr /R "${DOCKER_INSTALLER_FILE_NAME}"`,
  docker_install: `${DOCKER_INSTALLER_FILE_NAME} install --quiet`,
  restart: "shutdown /r",
  windows_version: "ver",
  docker_settings: "settings",
  wsl_version: "wsl --set-default-version 2",
  pull_exp: "docker pull exchangeunion/exp",
  start_xud_docker:
    "docker run --rm -e PASSWORD=12345678 -e BACKUPDIR=/tmp -e HOSTFS=/ -e HOSTPWD=/root -e HOSTHOME=/root -e DOCKER_SOCK=//var/run/docker.sock -e NETWORK=mainnet -v //var/run/docker.sock:/var/run/docker.sock exchangeunion/exp --proxy.disabled false",
};

const execCommand = (cmd) => {
  const cmd$ = new Observable((subscriber) => {
    if (cmd === AVAILABLE_COMMANDS["docker_settings"]) {
      const dockerSettingsPath = path.join(
        os.homedir(),
        "AppData/Roaming/Docker/settings.json"
      );
      fs.readFile(dockerSettingsPath, { encoding: "utf-8" }, function (
        err,
        settings
      ) {
        if (!err) {
          subscriber.next(settings);
          subscriber.complete();
        } else {
          subscriber.error(err);
        }
      });
    } else {
      exec(cmd, (error, stdout) => {
        if (error) {
          subscriber.error(error);
          return;
        }
        subscriber.next(stdout);
        subscriber.complete();
      });
    }
  });
  return cmd$;
};

const ipcHandler = (mainWindow) => {
  ipcMain.on("execute-command", (_event, [reqId, clientCommand]) => {
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

module.exports = { ipcHandler, execCommand };
