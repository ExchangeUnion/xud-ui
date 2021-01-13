import { History } from "history";
import { isWindows, logError } from "../common/appUtil";
import { Path } from "../router/Path";
import { SettingsStore } from "../stores/settingsStore";

export const handleEvent = (
  event: MessageEvent,
  history: History,
  settingsStore: SettingsStore
): void => {
  const data: string = event.data;

  if (data.startsWith("disconnect")) {
    const nextPath = isWindows() ? Path.HOME : Path.CONNECT_TO_REMOTE;
    history.push(nextPath);
    return;
  }

  if (data.startsWith("connectionFailed")) {
    history.push(Path.CONNECTION_LOST);
    return;
  }

  const valueStartIdx = data.indexOf(":") + 2;
  const value = data.substr(valueStartIdx);

  if (data.startsWith("copyToClipboard")) {
    (window as any).electron.copyToClipboard(value);
    return;
  }

  if (data.startsWith("openLink")) {
    (window as any).electron.openExternal(value);
    return;
  }

  if (data.startsWith("logError")) {
    (window as any).electron.logError(value);
    return;
  }

  if (data.startsWith("chooseDirectory")) {
    (window as any).electron
      .dialog()
      .showOpenDialog(undefined, {
        properties: ["openDirectory"],
      })
      .then((resp: { canceled: boolean; filePaths: string }) => {
        if (!resp.canceled) {
          (event.source as WindowProxy | Window).postMessage(
            `chooseDirectory: ${resp.filePaths[0]}`,
            event.origin
          );
        }
      })
      .catch(logError);
  }

  if (data.startsWith("getConnectionType")) {
    (event.source as WindowProxy | Window).postMessage(
      `connectionType: ${settingsStore.connectionType}`,
      event.origin
    );
  }
};
