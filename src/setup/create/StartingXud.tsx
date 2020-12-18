import {
  Button,
  Grid,
  Grow,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { catchError, mergeMap, take, takeUntil } from "rxjs/operators";
import api from "../../api";
import { logError, logInfo } from "../../common/appUtil";
import { startXudDocker$ } from "../../common/dockerUtil";
import { XUD_DOCKER_LOCAL_MAINNET_URL } from "../../constants";
import { Path } from "../../router/Path";
import { SETTINGS_STORE } from "../../stores/settingsStore";
import { WithStores } from "../../stores/WithStores";
import LinkToDiscord from "../LinkToDiscord";
import RowsContainer from "../RowsContainer";
import XudLogo from "../XudLogo";

type StartingXudProps = WithStores;

const StartingXud = inject(SETTINGS_STORE)(
  observer(({ settingsStore }: StartingXudProps) => {
    const [progress, setProgress] = useState(0);
    const [showContent, setShowContent] = useState(true);
    const [error, setError] = useState("");
    const history = useHistory();

    useEffect(() => {
      const fakeLoading$ = interval(1000);
      const fakeLoadingSub = fakeLoading$.subscribe(() => {
        setProgress((oldProgress) => Math.min(100, oldProgress + 1));
      });

      return () => {
        fakeLoadingSub.unsubscribe();
      };
    }, []);

    useEffect(() => {
      settingsStore!.setXudDockerUrl(XUD_DOCKER_LOCAL_MAINNET_URL);
      const apiResponsive$ = interval(1000).pipe(
        mergeMap(() => api.setupStatus$(settingsStore!.xudDockerUrl)),
        catchError((e, caught) => caught),
        take(1)
      );

      startXudDocker$()
        .pipe(takeUntil(apiResponsive$))
        .subscribe({
          next: () => logInfo("xud-docker has been started"),
          error: (err) => {
            logError(`Error starting xud-docker: ${err}`);
            let errorMsg;
            if (typeof err === "string") {
              const indexOfError = err.indexOf("ERROR");
              errorMsg =
                indexOfError > -1 ? err.substring(indexOfError) : undefined;
            }
            setError(
              errorMsg || "Please check the application logs for error details"
            );
          },
          complete: () => {
            setProgress(100);
            setTimeout(() => setShowContent(false), 500);
            setTimeout(() => history.push(Path.DASHBOARD), 1000);
          },
        });
    }, [settingsStore, history]);

    return !error ? (
      <Grow
        in={showContent}
        timeout={{
          exit: 500,
        }}
      >
        <RowsContainer>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <XudLogo />
            <Typography variant="h6" component="h2" align="center">
              Powering OpenDEX
            </Typography>
          </Grid>
          <Grid>
            <LinearProgress variant="determinate" value={progress} />
          </Grid>
          <LinkToDiscord />
        </RowsContainer>
      </Grow>
    ) : (
      <RowsContainer>
        <Grid
          item
          container
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Typography variant="body1" color="error">
            Error starting xud-docker
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {error}
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <Button
            color="primary"
            variant="contained"
            disableElevation
            onClick={() => history.push(Path.START_ENVIRONMENT)}
          >
            Retry
          </Button>
          <LinkToDiscord />
        </Grid>
      </RowsContainer>
    );
  })
);

export default StartingXud;
