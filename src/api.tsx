import axios from "axios";
import { from, Observable } from "rxjs";
import { pluck } from "rxjs/operators";

const path = "api/v1/xud";

export default {
  getinfo$(url: string): Observable<any> {
    return from(axios.get(`${url}/${path}/getinfo`)).pipe(pluck("data"));
  },
};
