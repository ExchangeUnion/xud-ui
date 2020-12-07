const { ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { exec } = require("child_process");
const { Observable } = require("rxjs");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Settings not exposed to the end-user.
const DOCKER_BINARY_DOWNLOAD_URL =
  "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe";
const DOCKER_INSTALLER_FILE_NAME = "docker-installer.exe";

const WINDOWS_DOCKER_EXECUTABLE_PATH =
  "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe";

const DOCKER_SETTINGS_PATH = path.join(
  os.homedir(),
  "AppData/Roaming/Docker/settings.json"
);
const LAUNCHER_LOCATION = isDev
  ? "./assets/xud-launcher.exe"
  : "../../xud-launcher.exe";
const LAUNCHER = path.join(__dirname, LAUNCHER_LOCATION);

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
  modify_docker_settings: "settings modify",
  wsl_version: "wsl --set-default-version 2",
  start_docker: `"${WINDOWS_DOCKER_EXECUTABLE_PATH}"`,
  gen_xud_docker: `${LAUNCHER} -n mainnet gen`,
  stop_xud_docker: `${LAUNCHER} down`,
  start_xud_docker: `${LAUNCHER} -n mainnet up -- -d`,
  setup_xud_docker: `${LAUNCHER} setup`
};

const execCommand = (cmd) => {
  const cmd$ = new Observable((subscriber) => {
    const handleResponse = (result, error) => {
      if (!error) {
        subscriber.next(result);
        subscriber.complete();
      } else {
        subscriber.error(error);
      }
    };

    if (cmd === AVAILABLE_COMMANDS.docker_settings) {
      fs.readFile(DOCKER_SETTINGS_PATH, { encoding: "utf-8" }, function (
        err,
        settings
      ) {
        handleResponse(settings, err);
      });
    } else if (cmd === AVAILABLE_COMMANDS.modify_docker_settings) {
      fs.readFile(DOCKER_SETTINGS_PATH, { encoding: "utf-8" }, function (
        err,
        settings
      ) {
        if (err) {
          handleResponse(undefined, err);
        }
        const settingsObject = JSON.parse(settings);
        settingsObject.displayedTutorial = true;
        settingsObject.autoStart = false;
        fs.writeFile(
          DOCKER_SETTINGS_PATH,
          JSON.stringify(settingsObject),
          (err) => handleResponse(undefined, err)
        );
      });
    } else {
      exec(cmd, (error, stdout) => handleResponse(stdout, error));
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

module.exports = {
  ipcHandler,
  execCommand,
  AVAILABLE_COMMANDS,
};
