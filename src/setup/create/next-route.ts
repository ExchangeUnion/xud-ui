import { combineLatest, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Path } from "../../router/Path";

const getNextRoute = (
  minimumRuntime: () => Observable<number>,
  isInstalled: () => Observable<boolean>,
  isRunning: () => Observable<boolean>,
  isDownloaded: () => Observable<boolean>,
  rebootRequired: () => Observable<boolean>
): Observable<Path> => {
  return combineLatest([
    minimumRuntime(),
    isInstalled(),
    isRunning(),
    isDownloaded(),
    rebootRequired(),
  ]).pipe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, isInstalled, isRunning, isDownloaded, rebootRequired]) => {
      console.log("isInstalled", isInstalled);
      console.log("isRunning", isRunning);
      console.log("isDownloaded", isDownloaded);
      console.log("rebootRequired", rebootRequired);
      if (rebootRequired) {
        return Path.RESTART_REQUIRED;
      }
      if (isRunning) {
        return Path.STARTING_XUD;
      }
      if (isInstalled && !isRunning) {
        return Path.WAITING_DOCKER_START;
      }
      if (!isDownloaded) {
        return Path.DOWNLOAD_DOCKER;
      }
      return Path.INSTALL_DOCKER;
    }),
    take(1)
  );
};

export { getNextRoute };
