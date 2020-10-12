import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Observable, of, PartialObserver, Subscription, timer } from "rxjs";
import { mergeMap } from "rxjs/operators";
import api from "../api";
import { XUD_NOT_READY } from "../constants";
import { Status } from "../models/Status";
import { Path } from "../router/Path";
import { WithStores } from "../stores/WithStores";

export type RefreshableData<T, S> = {
  queryFn: (url: string, serviceName?: string) => Observable<T>;
  stateProp: keyof S;
  onSuccessCb?: (value: T) => void;
  isStatusQuery?: boolean;
};

export type DashboardContentState = {
  xudLocked?: boolean;
  xudNotReady?: boolean;
  xudStatus?: string;
};

abstract class DashboardContent<
  P extends WithStores & RouteComponentProps<{ param1: string }>,
  S extends DashboardContentState
> extends Component<P, S> {
  protected subs: Subscription = new Subscription();
  protected refreshableData: RefreshableData<any, S>[] = [];
  private dataRefreshTimer = timer(0, 5000);

  componentDidMount(): void {
    this.refreshableData.forEach((data) =>
      this.subs.add(this.updateState(data))
    );
  }

  componentWillUnmount(): void {
    this.subs.unsubscribe();
  }

  updateState<T>(data: RefreshableData<T, S>): Subscription {
    return this.dataRefreshTimer
      .pipe(
        mergeMap(() => this.checkStatus()),
        mergeMap(() =>
          (this.state.xudLocked || this.state.xudNotReady) &&
          !data.isStatusQuery
            ? of(undefined)
            : data.queryFn(this.props.settingsStore!.xudDockerUrl)
        )
      )
      .subscribe(
        this.handleResponse(
          data.stateProp,
          !!data.isStatusQuery,
          data.onSuccessCb
        )
      );
  }

  checkStatus(): Observable<Status> {
    return api
      .statusByService$("xud", this.props.settingsStore!.xudDockerUrl)
      .pipe(
        mergeMap((resp: Status) => {
          this.setState({
            xudLocked: resp.status.startsWith("Wallet locked"),
            xudNotReady: XUD_NOT_READY.some((status) =>
              resp.status.startsWith(status)
            ),
            xudStatus: resp.status,
          });
          return of(resp);
        })
      );
  }

  handleResponse<T>(
    stateProp: keyof S,
    isStatusQuery: boolean,
    onSuccessCb?: (value: T) => void
  ): PartialObserver<T | undefined> {
    return {
      next: (data: T | undefined) => {
        if (
          ((!this.state.xudLocked && !this.state.xudNotReady) ||
            isStatusQuery) &&
          data
        ) {
          this.setState({ [stateProp]: data } as any);
          if (onSuccessCb) {
            onSuccessCb(data);
          }
        }
      },
      error: () =>
        this.props.history.push({
          pathname: Path.HOME,
        }),
    };
  }
}

export default DashboardContent;
