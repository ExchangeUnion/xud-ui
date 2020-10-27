import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const execCommand$ = (command: string): Observable<string> => {
  return new Observable((subscriber) => {
    (window as any).electron.receive(
      "execute-command",
      (response: { error?: string; output: string }) => {
        // TODO: check that response.reqId equals to the one generated from frontend
        const { error, output } = response;
        if (error) {
          subscriber.error(error);
        } else {
          subscriber.next(output);
          subscriber.complete();
        }
      }
    );
    // TODO: generate a request ID in order to process the correct command when receiving a new 'execute-command' event
    (window as any).electron.send("execute-command", command);
  });
};

const AVAILABLE_COMMANDS = {
  DOCKER_VERSION: "docker version",
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

export { isDockerInstalled$ };
