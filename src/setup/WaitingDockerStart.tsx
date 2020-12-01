import { Grid, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Path } from "../router/Path";
import LinkToDiscord from "./LinkToDiscord";
import RowsContainer from "./RowsContainer";
import InfoBar from "./create/InfoBar";
import { interval } from "rxjs";
import { filter, mergeMap, take } from "rxjs/operators";
import { isDockerRunning$, startDocker$ } from "../common/dockerUtil";

const WaitingDockerStart = (): ReactElement => {
  const history = useHistory();
  useEffect(() => {
    startDocker$().subscribe(() => {});
    interval(1000)
      .pipe(
        mergeMap(() => isDockerRunning$()),
        filter((isRunning) => isRunning),
        take(1)
      )
      .subscribe(() => {
        history.push(Path.START_ENVIRONMENT);
      });
  });
  return (
    <RowsContainer>
      <Grid item container>
        <InfoBar text="Starting Docker..." showCircularProgress={true} />
      </Grid>
      <Grid item container justify="center">
        <Typography variant="h6" component="h2">
          Starting Docker - this could take a minute. Please wait.
        </Typography>
      </Grid>
      <LinkToDiscord />
    </RowsContainer>
  );
};

export default WaitingDockerStart;
