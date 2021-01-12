import {
  CircularProgress,
  createStyles,
  Fade,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { History } from "history";
import { inject, observer } from "mobx-react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import { Path } from "../router/Path";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import RowsContainer from "./RowsContainer";

type ConnectToRemoteProps = WithStores;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowGroup: {
      padding: theme.spacing(5),
    },
    buttonWrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    adornmentMargin: {
      marginRight: 0,
    },
  })
);

const ConnectToRemote = inject(SETTINGS_STORE)(
  observer(({ settingsStore }: ConnectToRemoteProps) => {
    const history = useHistory();
    const classes = useStyles();
    const [ipAndPort, setIpAndPort] = useState(settingsStore!.xudDockerUrl);
    const [connectionFailed, setConnectionFailed] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const ipAndPortWithoutHttp = ipAndPort.startsWith("http://")
      ? ipAndPort.substring(7)
      : ipAndPort.startsWith("https://")
      ? ipAndPort.substring(8)
      : ipAndPort;

    return (
      <RowsContainer>
        <Grid item container direction="column" justify="center">
          <Grid
            container
            item
            alignItems="center"
            justify="center"
            className={classes.rowGroup}
          >
            <Typography variant="h4" component="h4">
              Connect to a remote XUD environment
            </Typography>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            justify="center"
            className={classes.rowGroup}
          >
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
                    value={ipAndPortWithoutHttp}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.adornmentMargin}
                          position="start"
                        >
                          https://
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      setConnectionFailed(false);
                      setIpAndPort(`https://${e.target.value}`);
                    }}
                  />
                </Grid>
                <Grid>
                  <Fade
                    in={connectionFailed && !connecting}
                    style={{
                      transitionDelay: "300ms",
                    }}
                  >
                    <Grid item container justify="center">
                      <Typography
                        variant="body2"
                        component="p"
                        color="secondary"
                      >
                        Error: Connection failed
                      </Typography>
                    </Grid>
                  </Fade>
                </Grid>
                <Grid item container justify="center">
                  <div className={classes.buttonWrapper}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={connecting}
                      disableElevation
                      onClick={(e) => {
                        e.preventDefault();
                        handleConnectClick(
                          setConnectionFailed,
                          setConnecting,
                          history,
                          ipAndPort,
                          settingsStore!.setXudDockerUrl
                        );
                      }}
                    >
                      {connectionFailed ? "Retry" : "Connect"}
                    </Button>
                    {connecting && (
                      <CircularProgress
                        color="inherit"
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <Grid item container>
          <Button
            variant="outlined"
            disableElevation
            onClick={() => history.push(Path.HOME)}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Grid>
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
  setConnecting(true);
  api.statusByService$("xud", xudDockerUrl).subscribe({
    next: () => {
      setConnectionFailed(false);
      setConnecting(false);
      setXudDockerUrl(xudDockerUrl);
      history.push(Path.DASHBOARD);
    },
    error: () => {
      setConnectionFailed(true);
      setConnecting(false);
    },
  });
};

export default ConnectToRemote;
