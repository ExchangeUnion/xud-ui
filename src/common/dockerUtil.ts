import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";
import { Network } from "../enums";

const execCommand$ = (command: string): Observable<string> => {
  return new Observable((subscriber) => {
    // Generate an unique request ID so that we can identifiy the response for the response below.
    const reqId = uuidv4();
    (window as any).electron.receive(
      "execute-command",
      (response: { error?: string; output: string; reqId: string }) => {
        const { reqId: responseReqId, error, output } = response;
        if (responseReqId === reqId) {
          // We only process responses where request ID matches to the one generated above.
          if (error) {
            subscriber.error(error);
          } else {
            subscriber.next(output);
            subscriber.complete();
          }
        }
      }
    );
    (window as any).electron.send("execute-command", [reqId, command]);
  });
};

const AVAILABLE_COMMANDS = {
  IS_INSTALLED: "docker_version",
  IS_RUNNING: "docker_ps",
  DOWNLOAD: "docker_download",
  DOWNLOAD_STATUS: "docker_download_status",
  INSTALL: "docker_install",
  RESTART: "restart",
  WINDOWS_VERSION: "windows_version",
  SETTINGS: "docker_settings",
  MODIFY_DOCKER_SETTINGS: "modify_docker_settings",
  WSL_VERSION: "wsl_version",
  START_DOCKER: "start_docker",
  GEN_XUD_DOCKER: "gen_xud_docker",
  START_XUD_DOCKER: "start_xud_docker",
  STOP_XUD_DOCKER: "stop_xud_docker",
  SETUP_XUD_DOCKER: "setup_xud_docker",
};

const isDockerInstalled$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.IS_INSTALLED).pipe(
    map((output) => {
      if (output.includes("Docker Engine")) {
        return true;
      }
      return false;
    }),
    catchError((e: any) => {
      if (
        e.message?.includes(
          "'docker' is not recognized as an internal or external command"
        )
      ) {
        return of(false);
      }
      console.error("Error checking Docker installed status:", e);
      return of(false);
    })
  );
};

const isDockerRunning$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.IS_RUNNING).pipe(
    map((output) => {
      if (output.includes("CONTAINER ID")) {
        return true;
      }
      return false;
    }),
    catchError((e: any) => {
      if (
        e.message?.includes(
          "'docker' is not recognized as an internal or external command"
        )
      ) {
        return of(false);
      }
      console.error("Error checking Docker running status:", e);
      return of(false);
    })
  );
};

const downloadDocker$ = (): Observable<boolean> => {
  console.log("starting docker download");
  return execCommand$(AVAILABLE_COMMANDS.DOWNLOAD).pipe(
    map((output) => {
      console.log("output from downloadDocker$", output);
      return true;
    }),
    catchError((e: any) => {
      console.error("Error downloading Docker:", e);
      return of(false);
    })
  );
};

const installDocker$ = (): Observable<boolean> => {
  console.log("starting docker install");
  return execCommand$(AVAILABLE_COMMANDS.INSTALL).pipe(
    map((output) => {
      console.log("output from installDocker$", output);
      return true;
    }),
    catchError((e: any) => {
      console.error("Error installing Docker:", e);
      return of(false);
    }),
    take(1)
  );
};

const startDocker$ = (): Observable<boolean> => {
  console.log("starting docker");
  return execCommand$(AVAILABLE_COMMANDS.START_DOCKER).pipe(
    map((output) => {
      console.log("output from startDocker$", output);
      return true;
    }),
    catchError((e: any) => {
      console.error("Error starting Docker:", e);
      return of(false);
    }),
    take(1)
  );
};

const dockerDownloadStatus$ = (): Observable<number> => {
  return execCommand$(AVAILABLE_COMMANDS.DOWNLOAD_STATUS).pipe(
    map((output) => {
      console.log("output from isDockerDownloaded$", output);
      const isDownloaded = output.includes("docker-installer.exe");
      if (isDownloaded) {
        return 100;
      }
      return 0;
    }),
    catchError((e: any) => {
      if (e.message?.includes("Command failed: dir | findstr /R")) {
        return of(0);
      }
      console.error("Error checking if Docker is downloaded:", e);
      return of(0);
    })
  );
};

const restart$ = (): Observable<string> => {
  return execCommand$(AVAILABLE_COMMANDS.RESTART);
};

const isDockerDownloaded$ = (): Observable<boolean> => {
  return dockerDownloadStatus$().pipe(
    map((downloadPercentage) => {
      if (downloadPercentage === 100) {
        return true;
      }
      return false;
    })
  );
};

const rebootRequired$ = (): Observable<boolean> => {
  return new Observable((subscriber) => {
    if (localStorage.getItem("rebootRequired")) {
      subscriber.next(true);
    } else {
      subscriber.next(false);
    }
    subscriber.complete();
  });
};

const windowsVersion$ = (): Observable<number> => {
  return execCommand$(AVAILABLE_COMMANDS.WINDOWS_VERSION).pipe(
    map((output) => {
      console.log("version output", output);
      // We parse the output of "ver" command and determine if
      // the next-to-last numeric group version 18917 or higher?
      // 1. LOWER => WSL1
      // 2. HIGHER => WSL2
      const splitOutput = output.split(" ");
      const versionString = splitOutput.filter((split) => {
        return split.startsWith("10");
      });
      return parseInt(versionString[0].split(".")[2]);
    }),
    catchError((e: any) => {
      console.error("Error detecting Windows version:", e);
      return of(10);
    })
  );
};

export type DockerSettings = {
  wslEngineEnabled?: boolean;
};

const dockerSettings$ = (): Observable<DockerSettings> => {
  return execCommand$(AVAILABLE_COMMANDS.SETTINGS).pipe(
    map((output) => {
      return (JSON.parse(output) as unknown) as DockerSettings;
    }),
    catchError((e: any) => {
      console.error("Error detecting Docker settings:", e);
      return of({});
    })
  );
};

const modifyDockerSettings$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.MODIFY_DOCKER_SETTINGS).pipe(
    map(() => {
      return true;
    }),
    catchError((e: any) => {
      console.error("Error modifying Docker settings:", e);
      return of(false);
    })
  );
};

const isWSL2$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.WSL_VERSION).pipe(
    map((output) => {
      const cleanedOutput = output.replace(/[^\w\s]/gi, "").trim();
      console.log("output for isWSL2", cleanedOutput);
      return !cleanedOutput.includes("requires an update");
    }),
    catchError((e: any) => {
      console.error("Error detecting WSL version:", e);
      return of(false);
    })
  );
};

const startXudDocker$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.SETUP_XUD_DOCKER).pipe(
    map((output) => {
      console.log("output for start xud-docker", output);
      return true;
    }),
    catchError((e: any) => {
      console.error("Error starting xud-docker:", e);
      return of(false);
    })
  );
};

const isXudDockerEnvCreated = (network: Network): boolean => {
  return (window as any).electron.xudDockerEnvExists(network);
};

export {
  isDockerInstalled$,
  isDockerRunning$,
  downloadDocker$,
  dockerDownloadStatus$,
  isDockerDownloaded$,
  installDocker$,
  rebootRequired$,
  restart$,
  windowsVersion$,
  isWSL2$,
  dockerSettings$,
  modifyDockerSettings$,
  startDocker$,
  startXudDocker$,
  isXudDockerEnvCreated,
};
