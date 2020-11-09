import { from, Observable } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { Status } from "./models/Status";

const path = "api/v1";

const logAndThrow = (url: string, err: string) => {
  (window as any).electron.logError(`requestUrl: ${url}; error: ${err}`);
  throw err;
};

const fetchJsonResponse = <T>(url: string): Observable<T> => {
  return from(fetch(`${url}`)).pipe(
    mergeMap((resp: Response) => resp.json()),
    catchError((err) => logAndThrow(url, err))
  );
};

export default {
  status$(url: string): Observable<Status[]> {
    return fetchJsonResponse(`${url}/${path}/status`);
  },

  statusByService$(serviceName: string, url: string): Observable<Status> {
    return fetchJsonResponse(`${url}/${path}/status/${serviceName}`);
  },
};
