import { History } from "history";
import { isWindows } from "../common/appUtil";
import { Path } from "../router/Path";

export const handleEvent = (event: MessageEvent, history: History): void => {
  const data: string = event.data;

  if (data.startsWith("disconnect")) {
    const nextPath = isWindows() ? Path.HOME : Path.CONNECT_TO_REMOTE;
    history.push(nextPath);
    return;
  }

  if (data.startsWith("connectionFailed")) {
    history.push(Path.HOME);
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
};
