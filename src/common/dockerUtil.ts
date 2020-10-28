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
  IS_INSTALLED: "docker version",
  IS_RUNNING: "docker ps",
  DOWNLOAD:
    "curl https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe > docker-installer.exe",
};

const isDockerInstalled$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.IS_INSTALLED).pipe(
    map((output) => {
      if (output.includes("Docker Engine")) {
        return true;
      }
      return false;
    }),
    catchError(() => of(false))
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
    catchError(() => of(false))
  );
};

const downloadDocker$ = (): Observable<boolean> => {
  console.log("starting docker download");
  return execCommand$(AVAILABLE_COMMANDS.DOWNLOAD).pipe(
    map((output) => {
      console.log("output from downloadDocker$", output);
      return true;
    }),
    catchError((e) => {
      console.log("error is", e);
      of(false);
    })
  );
};

export { isDockerInstalled$, isDockerRunning$, downloadDocker$ };
