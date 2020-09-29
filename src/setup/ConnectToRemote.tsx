import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { History } from "history";
import React, { ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import RowsContainer from "../common/RowsContainer";
import { Path } from "../router/Path";

function ConnectToRemote(): ReactElement {
  const history = useHistory();
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
        <Grid container item alignItems="center" direction="column" spacing={4}>
          <Grid item container justify="center">
            <TextField id="ip-port" label="IP:Port" variant="outlined" />
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
              variant="contained"
              color="primary"
              disabled={connecting}
              onClick={() =>
                handleConnectClick(setConnectionFailed, setConnecting, history)
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
}

const handleConnectClick = (
  setConnectionFailed: (value: boolean) => void,
  setConnecting: (value: boolean) => void,
  history: History
): void => {
  setConnectionFailed(false);
  setConnecting(true);
  api.getinfo$().subscribe({
    next: () => {
      setConnecting(false);
      history.push(Path.DASHBOARD);
    },
    error: () => {
      setConnectionFailed(true);
      setConnecting(false);
    },
  });
};

export default ConnectToRemote;
