import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
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

const dockerDownloadStatus$ = (): Observable<number> => {
  return execCommand$(AVAILABLE_COMMANDS.DOWNLOAD_STATUS).pipe(
    map((output) => {
      console.log("output from isDockerDownloaded$", output);
      const downloadSize = output.split(" ").filter((o) => o.includes(","));
      if (downloadSize.length === 1) {
        const sizeString = downloadSize[0];
        const size = parseInt(
          sizeString.split(",").reduce((acc, curr) => acc + curr)
        );
        const downloadPercentage = parseFloat(
          ((size / 426302672) * 100).toFixed(2)
        );
        console.log("downloadPercentage", downloadPercentage);
        return downloadPercentage;
      }
      const EXPECTED_DOCKER_INSTALLER_SIZE = "426,302,672";
      if (output.includes(EXPECTED_DOCKER_INSTALLER_SIZE)) {
        return 100;
      }
      return 0;
    }),
    catchError((e: any) => {
      console.error("Error checking if Docker is downloaded:", e);
      return of(0);
    })
  );
};

export {
  isDockerInstalled$,
  isDockerRunning$,
  downloadDocker$,
  dockerDownloadStatus$,
};
