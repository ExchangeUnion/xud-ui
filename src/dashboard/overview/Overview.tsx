import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
import PageCircularProgress from "../../common/PageCircularProgress";
import { Status } from "../../models/Status";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import DashboardContent, { DashboardContentState } from "../DashboardContent";
import OverviewItem from "./OverviewItem";

type PropsType = RouteComponentProps<{ param1: string }> & WithStores;

type StateType = DashboardContentState & {
  statuses?: Status[];
};

@inject(SETTINGS_STORE)
@observer
class Overview extends DashboardContent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { statuses: undefined };
    this.refreshableData.push({
      queryFn: api.status$,
      stateProp: "statuses",
      isStatusQuery: true,
    });
  }

  sortingOrderByService = (service: string): number => {
    if (service === "xud") {
      return 0;
    }
    if (["lndbtc", "lndltc", "connext"].includes(service)) {
      return 1;
    }
    if (["bitcoind", "litecoind", "geth"].includes(service)) {
      return 2;
    }
    return 3;
  };

  statusFilter = (status: Status): boolean => {
    return status.status !== "Disabled";
  };

  render(): ReactElement {
    return (
      <Grid container spacing={5}>
        {this.state.initialLoadCompleted ? (
          this.state.statuses &&
          this.state.statuses
            .filter(this.statusFilter)
            .sort(
              (a, b) =>
                this.sortingOrderByService(a.service) -
                this.sortingOrderByService(b.service)
            )
            .map((status) => (
              <OverviewItem
                status={status}
                key={status.service}
                xudLocked={this.state.xudLocked}
                xudNotReady={this.state.xudNotReady}
              ></OverviewItem>
            ))
        ) : (
          <PageCircularProgress />
        )}
      </Grid>
    );
  }
}

export default withRouter(Overview);
