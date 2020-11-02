import { Button, Grid, Typography } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { installDocker$ } from "../../common/dockerUtil";
import RowsContainer from "../../common/RowsContainer";
import { Path } from "../../router/Path";
import LinkToDiscord from "../LinkToDiscord";

// TODO: refactor & split into multiple components
// TODO: implement actions
const InstallDocker = (): ReactElement => {
  const history = useHistory();
  const [isInstalling, setIsInstalling] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const installDockerSubscription = installDocker$().subscribe(
      (installSuccessful) => {
        setIsInstalling(false);
        if (installSuccessful) {
          setIsInstalled(true);
        } else {
          console.error("Docker install unsuccessful");
          // TODO: retry
        }
      }
    );
    return () => installDockerSubscription.unsubscribe();
  }, []);

  return (
    <RowsContainer>
      {/* TODO: add background to header */}
      <Grid item container>
        {isInstalling && (
          <Grid item container justify="space-between">
            {/* TODO: add spinner */}
            <Typography variant="body2" component="span">
              Installing Docker
            </Typography>
          </Grid>
        )}
        {isInstalled && (
          <Grid item container>
            {/* TODO: add icon */}
            <Typography variant="body2" component="span">
              Docker Installed!
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid item container justify="center">
        {isInstalling && (
          <Typography variant="h6" component="h2">
            Docker install in progress. Please wait.
          </Typography>
        )}
        {isInstalled && (
          <Typography variant="h6" component="h2">
            Reboot required to continue.
          </Typography>
        )}
      </Grid>
      <Grid item container justify="flex-end">
        {isInstalled && (
          <Grid item container justify="flex-end">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              endIcon={<ArrowRightAltIcon />}
              onClick={() => history.push(Path.STARTING_XUD)}
            >
              Reboot now
            </Button>
          </Grid>
        )}
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default InstallDocker;
