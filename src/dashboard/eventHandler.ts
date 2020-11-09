import { History } from "history";
import { Path } from "../router/Path";

export const handleEvent = (event: MessageEvent, history: History): void => {
  const data: string = event.data;

  if (data.startsWith("disconnect")) {
    history.push(Path.CONNECT_TO_REMOTE);
    return;
  }

  const valueStartIdx = data.indexOf(":") + 2;
  const value = data.substr(valueStartIdx);

  if (data.startsWith("copyToClipboard")) {
    (window as any).electron.copyToClipboard(value);
    return;
  }

  if (data.startsWith("logError")) {
    (window as any).electron.logError(value);
    return;
  }
};
