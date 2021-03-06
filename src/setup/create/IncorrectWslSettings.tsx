import { Button, Grid, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { combineLatest, interval } from "rxjs";
import { filter, map, mergeMap, take } from "rxjs/operators";
import {
  DockerSettings,
  dockerSettings$,
  isWSL2$,
} from "../../common/dockerUtil";
import { Path } from "../../router/Path";
import { InstallWslWarningScreenshot } from "../InstallWslWarningScreenshot";
import LinkToDiscord from "../LinkToDiscord";
import RowsContainer from "../RowsContainer";
import InfoBar from "./InfoBar";

const WSL2_INSTALL_URL = "https://aka.ms/wsl2kernel";

const IncorrectWslSettings = (): ReactElement => {
  const history = useHistory();
  useEffect(() => {
    interval(1000)
      .pipe(
        mergeMap(() => {
          return combineLatest([dockerSettings$(), isWSL2$()]).pipe(
            map(([dockerSettings, isWSL2]) => {
              const { wslEngineEnabled } = dockerSettings as DockerSettings;
              return { wslEngineEnabled, isWSL2 };
            }),
            filter(({ wslEngineEnabled, isWSL2 }) => {
              const correctSettings = isWSL2 || !wslEngineEnabled;
              return correctSettings;
            })
          );
        }),
        take(1)
      )
      .subscribe(() => {
        history.push(Path.START_ENVIRONMENT);
      });
  }, [history]);
  return (
    <RowsContainer>
      <Grid item container>
        <InfoBar
          text="Incompatible Docker Settings"
          icon={ReportProblemOutlinedIcon}
        />
      </Grid>
      <Grid item container direction="column">
        <Grid item container justify="center" direction="column">
          <Typography variant="h6" component="h2" align="center">
            Incorrect WSL settings.
          </Typography>
          <Typography
            variant="overline"
            component="p"
            color="textSecondary"
            align="center"
          >
            WSL 2 is required to run Docker. Please install WSL 2.
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <InstallWslWarningScreenshot />
        </Grid>
      </Grid>
      <Grid item container justify="flex-end">
        <Grid item container justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              (window as any).electron.openExternal(WSL2_INSTALL_URL);
            }}
          >
            Install WSL 2
          </Button>
        </Grid>
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default IncorrectWslSettings;
