import { Button, Grid, Typography } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import React, { ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import { installDocker$ } from "../../common/dockerUtil";
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
              endIcon={<ArrowRightAltIcon />}
              onClick={() => {
                setIsInstalling(true);
                installDocker$().subscribe((installSuccessful) => {
                  if (installSuccessful) {
                    localStorage.setItem("rebootRequired", "true");
                  }
                  history.push(Path.CREATE_ENVIRONMENT);
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
