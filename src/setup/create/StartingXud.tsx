import { Grid, Grow, LinearProgress, Typography } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { interval, timer } from "rxjs";
import { catchError, mergeMap, take, takeUntil } from "rxjs/operators";
import api from "../../api";
import { startXudDocker$ } from "../../common/dockerUtil";
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
      const apiResponsive$ = interval(1000).pipe(
        mergeMap(() => api.setupStatus$(settingsStore!.xudDockerUrl)),
        catchError((e, caught) => caught),
        take(1)
      );

      startXudDocker$()
        .pipe(
          takeUntil(apiResponsive$),
          catchError((e, caught) => {
            console.error(
              "Failed to start xud-docker. Retrying in 1 second",
              e
            );
            return timer(1000).pipe(mergeMap(() => caught));
          })
        )
        .subscribe({
          next: (output) => console.log("xud-docker has been started", output),
          complete: () => {
            setProgress(100);
            setTimeout(() => setShowContent(false), 500);
            setTimeout(() => history.push(Path.DASHBOARD), 1000);
          },
        });
    }, [settingsStore, history]);

    return (
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
    );
  })
);

export default StartingXud;
