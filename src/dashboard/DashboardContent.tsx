import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Observable, PartialObserver, Subscription, timer } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Path } from "../router/Path";
import { WithStores } from "../stores/WithStores";

export type RefreshableData<T, S> = {
  queryFn: (url: string, serviceName?: string) => Observable<T>;
  stateProp: keyof S;
  onSuccessCb?: (value: T) => void;
};

abstract class DashboardContent<
  P extends WithStores & RouteComponentProps<{ param1: string }>,
  S
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
        mergeMap(() => data.queryFn(this.props.settingsStore!.xudDockerUrl))
      )
      .subscribe(this.handleResponse(data.stateProp, data.onSuccessCb));
  }

  handleResponse<T>(
    stateProp: keyof S,
    onSuccessCb?: (value: T) => void
  ): PartialObserver<T> {
    return {
      next: (data: T) => {
        this.setState({ [stateProp]: data } as any);
        if (onSuccessCb) {
          onSuccessCb(data);
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
