import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";
import React, { Component, ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Observable, PartialObserver, Subscription, timer } from "rxjs";
import { mergeMap } from "rxjs/operators";
import api from "../../api";
import { GetbalanceResponse } from "../../models/GetbalanceResponse";
import { TradinglimitsResponse } from "../../models/TradinglimitsResponse";
import { Path } from "../../router/Path";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import WalletItem from "./WalletItem";

type PropsType = RouteComponentProps<{ param1: string }> & WithStores;

type StateType = {
  balances: GetbalanceResponse | undefined;
  limits: TradinglimitsResponse | undefined;
};

@inject(SETTINGS_STORE)
@observer
class Wallets extends Component<PropsType, StateType> {
  refreshTimer = timer(0, 5000);
  private subscriptions: Subscription[] = [];

  constructor(props: PropsType) {
    super(props);
    this.state = { balances: undefined, limits: undefined };
  }

  componentDidMount() {
    this.subscriptions.push(
      this.updateState(api.getbalance$, "balances"),
      this.updateState(api.tradinglimits$, "limits")
    );
  }

  updateState<T>(
    getFn: (url: string) => Observable<T>,
    stateProp: keyof StateType
  ): Subscription {
    return this.refreshTimer
      .pipe(mergeMap(() => getFn(this.props.settingsStore!.xudDockerUrl)))
      .subscribe(this.handleResponse(stateProp));
  }

  handleResponse<T>(stateProp: keyof StateType): PartialObserver<T> {
    return {
      next: (data: T) => this.setState({ [stateProp]: data } as any),
      error: () =>
        this.props.history.push({
          pathname: Path.HOME,
        }),
    };
  }

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  render(): ReactElement {
    const balances = this.state.balances?.orders;

    return (
      <Grid container spacing={5}>
        {balances &&
          Object.keys(balances!).map((currency) => (
            <WalletItem
              key={currency}
              currency={currency}
              balance={balances![currency]}
              limits={this.state.limits?.limits[currency]}
            ></WalletItem>
          ))}
      </Grid>
    );
  }
}

export default withRouter(Wallets);
