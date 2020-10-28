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
  DOCKER_VERSION: "docker version",
  DOCKER_PS: "docker ps",
};

const isDockerInstalled$ = (): Observable<boolean> => {
  return execCommand$(AVAILABLE_COMMANDS.DOCKER_VERSION).pipe(
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
  return execCommand$(AVAILABLE_COMMANDS.DOCKER_PS).pipe(
    map((output) => {
      if (output.includes("CONTAINER ID")) {
        return true;
      }
      return false;
    }),
    catchError(() => of(false))
  );
};

export { isDockerInstalled$, isDockerRunning$ };
