import { combineLatest, Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { logInfo } from "../../common/appUtil";
import { DockerSettings } from "../../common/dockerUtil";
import { Path } from "../../router/Path";

const getNextRoute = (
  minimumRuntime: () => Observable<number>,
  isInstalled: () => Observable<boolean>,
  isRunning: () => Observable<boolean>,
  isDownloaded: () => Observable<boolean>,
  rebootRequired: () => Observable<boolean>,
  isWSL2: () => Observable<boolean>,
  dockerSettings: () => Observable<DockerSettings>
): Observable<Path> => {
  return combineLatest([
    minimumRuntime(),
    isInstalled(),
    isRunning(),
    isDownloaded(),
    rebootRequired(),
    isWSL2(),
    dockerSettings(),
  ]).pipe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(
      ([
        _,
        isInstalled,
        isRunning,
        isDownloaded,
        rebootRequired,
        isWSL2,
        dockerSettings,
      ]) => {
        logInfo("isInstalled", isInstalled);
        logInfo("isRunning", isRunning);
        logInfo("isDownloaded", isDownloaded);
        logInfo("rebootRequired", rebootRequired);
        logInfo("isWSL2", isWSL2);
        const { wslEngineEnabled } = dockerSettings as DockerSettings;
        logInfo("wslEngineEnabled", wslEngineEnabled);
        const dockerSettingsExist = wslEngineEnabled !== undefined;
        logInfo("dockerSettingsExist", dockerSettingsExist);
        if (rebootRequired) {
          return Path.RESTART_REQUIRED;
        }
        if (wslEngineEnabled && !isWSL2) {
          return Path.INCOMPATIBLE_WSL_SETTINGS;
        }
        if (isRunning) {
          return Path.STARTING_XUD;
        }
        if (isInstalled && !isRunning) {
          return Path.WAITING_DOCKER_START;
        }
        if (!isInstalled && !isRunning && dockerSettingsExist) {
          return Path.WAITING_DOCKER_START;
        }
        if (!isDownloaded) {
          return Path.DOWNLOAD_DOCKER;
        }
        return Path.INSTALL_DOCKER;
      }
    ),
    take(1)
  );
};

export { getNextRoute };
