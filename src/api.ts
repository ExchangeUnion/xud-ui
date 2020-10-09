import axios from "axios";
import { from, Observable, of } from "rxjs";
import { mergeMapTo, pluck } from "rxjs/operators";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { Info } from "./models/Info";
import { Status } from "./models/Status";
import { TradehistoryResponse } from "./models/TradehistoryResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";

const path = "api/v1";
const xudPath = `${path}/xud`;

export default {
  status$(url: string): Observable<Status[]> {
    return from(axios.get(`${url}/${path}/status`)).pipe(pluck("data"));
  },

  statusByService$(serviceName: string, url: string): Observable<Status> {
    return from(axios.get(`${url}/${path}/status/${serviceName}`)).pipe(
      pluck("data")
    );
  },

  /**
   * Returns the url for downloading the log file if the request is successful
   */
  logs$(serviceName: string, url: string): Observable<string> {
    const requestUrl = `${url}/${path}/logs/${serviceName}`;
    return from(axios.get(requestUrl)).pipe(mergeMapTo(of(requestUrl)));
  },

  getinfo$(url: string): Observable<Info> {
    return from(axios.get(`${url}/${xudPath}/getinfo`)).pipe(pluck("data"));
  },

  getbalance$(url: string): Observable<GetbalanceResponse> {
    return from(axios.get(`${url}/${xudPath}/getbalance`)).pipe(pluck("data"));
  },

  tradinglimits$(url: string): Observable<TradinglimitsResponse> {
    return from(axios.get(`${url}/${xudPath}/tradinglimits`)).pipe(
      pluck("data")
    );
  },

  tradehistory$(url: string): Observable<TradehistoryResponse> {
    return from(axios.get(`${url}/${xudPath}/tradehistory`)).pipe(
      pluck("data")
    );
  },
};
