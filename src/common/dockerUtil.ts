import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";

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

const restart$ = (): Observable<number> => {
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

export {
  isDockerInstalled$,
  isDockerRunning$,
  downloadDocker$,
  dockerDownloadStatus$,
  isDockerDownloaded$,
  installDocker$,
  rebootRequired$,
  restart$,
};
