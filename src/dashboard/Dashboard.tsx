import { createStyles, makeStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import { handleEvent } from "./eventHandler";

type DashboardProps = WithStores;

const useStyles = makeStyles(() =>
  createStyles({
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
    },
  })
);

const Dashboard = inject(SETTINGS_STORE)(
  observer(
    (props: DashboardProps): ReactElement => {
      const history = useHistory();
      const classes = useStyles();
      const { settingsStore } = props;

      useEffect(() => {
        const messageListenerHandler = (event: MessageEvent) => {
          if (event.origin === settingsStore!.xudDockerUrl) {
            handleEvent(event, history);
          }
        };
        window.addEventListener("message", messageListenerHandler);
        return () =>
          window.removeEventListener("message", messageListenerHandler);
      }, [history, settingsStore]);

      return (
        <iframe
          className={classes.iframe}
          src={settingsStore!.xudDockerUrl}
          title="XUD Explorer Dashboard"
        />
      );
    }
  )
);

export default Dashboard;
