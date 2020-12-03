import { Button, Grid, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import React, { ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import { filter, mergeMap, shareReplay } from "rxjs/operators";
import { installDocker$, modifyDockerSettings$ } from "../../common/dockerUtil";
import { Path } from "../../router/Path";
import { DockerInstallPromptScreenshot } from "../DockerInstallPromptScreenshot";
import LinkToDiscord from "../LinkToDiscord";
import RowsContainer from "../RowsContainer";
import InfoBar from "./InfoBar";

const InstallDocker = (): ReactElement => {
  const history = useHistory();
  const [isInstalling, setIsInstalling] = useState(false);

  return (
    <RowsContainer>
      <Grid item container>
        {isInstalling ? (
          <InfoBar text="Installing Docker" showCircularProgress={true} />
        ) : (
          <InfoBar text="Docker Downloaded" icon={GetAppOutlinedIcon} />
        )}
      </Grid>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        direction="column"
      >
        {isInstalling ? (
          <>
            <Typography variant="h6" component="h2" align="center">
              Docker install in progress. Please wait.
            </Typography>
            <Typography
              variant="overline"
              component="p"
              color="textSecondary"
              align="center"
            >
              This usually takes ~3 minutes.
            </Typography>
          </>
        ) : (
          <>
            <Grid item>
              <DockerInstallPromptScreenshot />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h2" align="center">
                Click on Install now and allow XUD installer to install Docker
                by providing user credentials.
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
      <Grid item container justify="flex-end" direction="column">
        {!isInstalling && (
          <Grid item container justify="flex-end">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                setIsInstalling(true);
                const install$ = installDocker$().pipe(shareReplay(1));
                install$.subscribe((installSuccessful) => {
                  if (!installSuccessful) {
                    history.push(Path.START_ENVIRONMENT);
                  }
                });
                install$
                  .pipe(
                    filter((result) => !!result),
                    mergeMap(() => modifyDockerSettings$())
                  )
                  .subscribe(() => {
                    localStorage.setItem("rebootRequired", "true");
                    history.push(Path.START_ENVIRONMENT);
                  });
              }}
            >
              Install Now
            </Button>
          </Grid>
        )}
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default InstallDocker;
