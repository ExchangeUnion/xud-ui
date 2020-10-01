import {
  Card,
  createStyles,
  Theme,
  Typography,
  WithStyles,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
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
import { drawerWidth } from "../Dashboard";
import WalletItem from "./WalletItem";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStores &
  WithStyles<typeof styles>;

type StateType = {
  balances: GetbalanceResponse | undefined;
  limits: TradinglimitsResponse | undefined;
};

const styles = (theme: Theme) => {
  const footerPadding = theme.spacing(3);
  return createStyles({
    footer: {
      position: "fixed",
      bottom: "5px",
      left: drawerWidth + footerPadding,
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      width: `calc(100% - ${drawerWidth + footerPadding * 2}px)`,
      padding: "10px",
      textAlign: "center",
      opacity: 0.8,
    },
    itemsContainer: {
      paddingBottom: "45px",
    },
  });
};

@inject(SETTINGS_STORE)
@observer
class Wallets extends Component<PropsType, StateType> {
  private refreshTimer = timer(0, 5000);
  private subs: Subscription = new Subscription();

  constructor(props: PropsType) {
    super(props);
    this.state = { balances: undefined, limits: undefined };
  }

  componentDidMount() {
    this.subs.add(this.updateState(api.getbalance$, "balances"));
    this.subs.add(this.updateState(api.tradinglimits$, "limits"));
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
    this.subs.unsubscribe();
  }

  render(): ReactElement {
    const balances = this.state.balances?.orders;
    const { classes } = this.props;

    return (
      <>
        <Grid container spacing={5} className={classes.itemsContainer}>
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
        <Card className={classes.footer}>
          <Grid container item alignItems="center" justify="center">
            <ReportProblemOutlinedIcon />
            &nbsp;
            <Typography variant="body2" component="span">
              Currently, wallets are in read-only mode. Use XUD Docker CLI to
              deposit and withdraw.
            </Typography>
          </Grid>
        </Card>
      </>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Wallets));
