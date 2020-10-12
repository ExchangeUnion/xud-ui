import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { History } from "history";
import { inject, observer } from "mobx-react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import RowsContainer from "../common/RowsContainer";
import { Path } from "../router/Path";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";

type ConnectToRemoteProps = WithStores;

const ConnectToRemote = inject(SETTINGS_STORE)(
  observer(({ settingsStore }: ConnectToRemoteProps) => {
    const history = useHistory();
    const [ipAndPort, setIpAndPort] = useState("");
    const [connectionFailed, setConnectionFailed] = useState(false);
    const [connecting, setConnecting] = useState(false);

    return (
      <RowsContainer>
        <Grid container item alignItems="center" justify="center">
          <Typography variant="h4" component="h4">
            Connect to a remote XUD environment
          </Typography>
        </Grid>
        <form noValidate autoComplete="off">
          <Grid
            container
            item
            alignItems="center"
            direction="column"
            spacing={4}
          >
            <Grid item container justify="center">
              <TextField
                id="ip-port"
                label="IP:Port"
                variant="outlined"
                value={ipAndPort}
                onChange={(e) => setIpAndPort(e.target.value)}
              />
            </Grid>
            {connectionFailed && (
              <Grid item container justify="center">
                <Typography variant="body2" component="p" color="secondary">
                  Error: Connection failed
                </Typography>
              </Grid>
            )}
            <Grid item container justify="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={connecting}
                onClick={() =>
                  handleConnectClick(
                    setConnectionFailed,
                    setConnecting,
                    history,
                    ipAndPort,
                    settingsStore!.setXudDockerUrl
                  )
                }
              >
                {connectionFailed ? "Retry" : "Connect"}
                {connecting && (
                  <>
                    &nbsp;
                    <CircularProgress color="inherit" size="15px" />
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </RowsContainer>
    );
  })
);

const handleConnectClick = (
  setConnectionFailed: (value: boolean) => void,
  setConnecting: (value: boolean) => void,
  history: History,
  xudDockerUrl: string,
  setXudDockerUrl: (ip: string) => void
): void => {
  const address = xudDockerUrl.startsWith("http")
    ? xudDockerUrl
    : `http://${xudDockerUrl}`;
  setConnectionFailed(false);
  setConnecting(true);
  api.statusByService$("xud", address).subscribe({
    next: () => {
      setConnecting(false);
      setXudDockerUrl(address);
      history.push(Path.DASHBOARD);
    },
    error: () => {
      setConnectionFailed(true);
      setConnecting(false);
    },
  });
};

export default ConnectToRemote;
