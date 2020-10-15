import { from, Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { Info } from "./models/Info";
import { Status } from "./models/Status";
import { TradehistoryResponse } from "./models/TradehistoryResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";

const path = "api/v1";
const xudPath = `${path}/xud`;

const fetchJsonResponse = <T>(url: string): Observable<T> => {
  return from(fetch(`${url}`)).pipe(mergeMap((resp: Response) => resp.json()));
};

export default {
  status$(url: string): Observable<Status[]> {
    return fetchJsonResponse(`${url}/${path}/status`);
  },

  statusByService$(serviceName: string, url: string): Observable<Status> {
    return fetchJsonResponse(`${url}/${path}/status/${serviceName}`);
  },

  logs$(serviceName: string, url: string): Observable<string> {
    return from(fetch(`${url}/${path}/logs/${serviceName}`)).pipe(
      mergeMap((resp) => resp.text())
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
