import {
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { timer } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/operators";
import api from "../api";
import { Path } from "../router/Path";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import LinkToSetupGuide from "./LinkToSetupGuide";
import RowsContainer from "./RowsContainer";

type DockerNotDetectedProps = WithStores;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinnerContainer: {
      padding: theme.spacing(8),
    },
  })
);

const DockerNotDetected = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(({ settingsStore, dockerStore }: DockerNotDetectedProps) => {
    const history = useHistory();
    const classes = useStyles();
    const [connectionFailed, setConnectionFailed] = useState(false);

    useEffect(() => {
      const subscription = timer(0, 5000)
        .pipe(
          mergeMap(() =>
            api.statusByService$("xud", settingsStore!.xudDockerUrl)
          ),
          retryWhen((errors) => errors.pipe(delay(5000)))
        )
        .subscribe({
          next: () => history.push(Path.DASHBOARD),
          error: () => setConnectionFailed(true),
        });
      return () => subscription.unsubscribe();
    }, [history, connectionFailed, settingsStore, dockerStore]);

    return (
      <RowsContainer>
        <Grid container item direction="column">
          <Grid
            container
            item
            alignItems="center"
            justify="center"
            wrap="nowrap"
            spacing={2}
          >
            <Grid item>
              <ReportProblemOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item>
              <Typography variant="h4" component="h1">
                {connectionFailed
                  ? "Unable to connect to XUD Docker"
                  : "Waiting for XUD Docker"}
              </Typography>
            </Grid>
          </Grid>
          {!connectionFailed && (
            <Grid
              container
              item
              justify="center"
              className={classes.spinnerContainer}
            >
              <CircularProgress color="inherit" />
            </Grid>
          )}
          <Grid container item alignItems="center" justify="center">
            <Button
              component={RouterLink}
              to={Path.CONNECT_TO_REMOTE}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
            >
              Connect remote XUD Docker
            </Button>
          </Grid>
        </Grid>
        <Grid container item alignItems="center">
          <LinkToSetupGuide />
        </Grid>
      </RowsContainer>
    );
  })
);

export default DockerNotDetected;
