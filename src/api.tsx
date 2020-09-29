import axios from "axios";
import { from, Observable } from "rxjs";
import { pluck } from "rxjs/operators";

const url = "http://localhost:8080/api/v1/xud";

export default {
  getinfo$(): Observable<any> {
    return from(axios.get(`${url}/getinfo`)).pipe(pluck("data"));
  },
};
