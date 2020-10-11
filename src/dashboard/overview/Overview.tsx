import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";
import React, { ReactElement } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import api from "../../api";
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

  render(): ReactElement {
    return (
      <Grid container spacing={5}>
        {this.state.statuses &&
          this.state.statuses.map((status) => (
            <OverviewItem
              status={status}
              key={status.service}
              xudLocked={this.state.xudLocked}
              xudNotReady={this.state.xudNotReady}
            ></OverviewItem>
          ))}
      </Grid>
    );
  }
}

export default withRouter(Overview);
