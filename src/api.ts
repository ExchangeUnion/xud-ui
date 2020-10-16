import { from, Observable } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { Info } from "./models/Info";
import { Status } from "./models/Status";
import { TradehistoryResponse } from "./models/TradehistoryResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";

const path = "api/v1";
const xudPath = `${path}/xud`;

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

  logs$(serviceName: string, url: string): Observable<string> {
    const requestUrl = `${url}/${path}/logs/${serviceName}`;
    return from(fetch(requestUrl)).pipe(
      mergeMap((resp) => resp.text()),
      catchError((err) => logAndThrow(requestUrl, err))
    );
  },

  getinfo$(url: string): Observable<Info> {
    return fetchJsonResponse(`${url}/${xudPath}/getinfo`);
  },

  getbalance$(url: string): Observable<GetbalanceResponse> {
    return fetchJsonResponse(`${url}/${xudPath}/getbalance`);
  },

  tradinglimits$(url: string): Observable<TradinglimitsResponse> {
    return fetchJsonResponse(`${url}/${xudPath}/tradinglimits`);
  },

  tradehistory$(url: string): Observable<TradehistoryResponse> {
    return fetchJsonResponse(`${url}/${xudPath}/tradehistory`);
  },
};
