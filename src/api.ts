import axios from "axios";
import { from, Observable } from "rxjs";
import { pluck } from "rxjs/operators";
import { GetbalanceResponse } from "./models/GetbalanceResponse";
import { TradinglimitsResponse } from "./models/TradinglimitsResponse";

const path = "api/v1/xud";

export default {
  getinfo$(url: string): Observable<any> {
    return from(axios.get(`${url}/${path}/getinfo`)).pipe(pluck("data"));
  },

  getbalance$(url: string): Observable<GetbalanceResponse> {
    return from(axios.get(`${url}/${path}/getbalance`)).pipe(pluck("data"));
  },

  tradinglimits$(url: string): Observable<TradinglimitsResponse> {
    return from(axios.get(`${url}/${path}/tradinglimits`)).pipe(pluck("data"));
  },
};
