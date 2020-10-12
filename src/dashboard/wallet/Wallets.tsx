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
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import { GetbalanceResponse } from "../../models/GetbalanceResponse";
import { TradinglimitsResponse } from "../../models/TradinglimitsResponse";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import { drawerWidth } from "../Dashboard";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import ViewDisabled from "../ViewDisabled";
import WalletItem from "./WalletItem";

type PropsType = RouteComponentProps<{ param1: string }> &
  WithStores &
  WithStyles<typeof styles>;

type StateType = DashboardContentState & {
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
class Wallets extends DashboardContent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { balances: undefined, limits: undefined };
    this.refreshableData.push(
      {
        queryFn: api.getbalance$,
        stateProp: "balances",
      },
      {
        queryFn: api.tradinglimits$,
        stateProp: "limits",
      }
    );
  }

  render(): ReactElement {
    const balances = this.state.balances?.orders;
    const { classes } = this.props;

    return (
      <>
        {this.state.xudLocked || this.state.xudNotReady ? (
          <ViewDisabled
            xudLocked={this.state.xudLocked}
            xudStatus={this.state.xudStatus}
          />
        ) : (
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
        )}
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
