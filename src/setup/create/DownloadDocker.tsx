import { Button, Grid, Typography } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { mergeMap, share, takeUntil } from "rxjs/operators";
import {
  dockerDownloadStatus$,
  downloadDocker$,
} from "../../common/dockerUtil";
import RowsContainer from "../../common/RowsContainer";
import { Path } from "../../router/Path";
import LinkToDiscord from "../LinkToDiscord";

// TODO: refactor & split into multiple components
// TODO: implement actions
const DownloadDocker = (): ReactElement => {
  const history = useHistory();
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  return (
    <RowsContainer>
      {/* TODO: add background to header */}
      <Grid item container>
        {isDownloading && (
          <Grid item container justify="space-between">
            {/* TODO: add spinner */}
            <Typography variant="body2" component="span">
              Downloading Docker
            </Typography>
            {/* TODO: add percentage value */}
            <Typography variant="body2" component="span">
              {downloadPercentage}%
            </Typography>
          </Grid>
        )}
        {isDownloaded && (
          <Grid item container>
            {/* TODO: add icon */}
            <Typography variant="body2" component="span">
              Docker Downloaded
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid item container justify="center">
        {isDownloaded ? (
          /* TODO: add screenshot */
          <Typography variant="h6" component="h2">
            Click on Install now and allow XUD installer to install Docker by
            providing user credentials.
          </Typography>
        ) : (
          <Typography variant="h6" component="h2">
            Docker not detected. In order to create a new xud environment, you
            need to get Docker.
          </Typography>
        )}
      </Grid>
      <Grid item container justify="flex-end" direction="column">
        {!isDownloading && !isDownloaded && (
          <Grid item container justify="space-between">
            <>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => history.push(Path.HOME)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                endIcon={<ArrowRightAltIcon />}
                onClick={() => {
                  setIsDownloading(true);
                  const dockerDownloaded$ = downloadDocker$().pipe(
                    // Multicast docker downloaded stream so that only 1 download is active at a time
                    share()
                  );
                  interval(1000)
                    // We check the status every 1000ms
                    .pipe(
                      mergeMap(() => dockerDownloadStatus$()),
                      // unsubscribe when docker is downloaded
                      takeUntil(dockerDownloaded$)
                    )
                    .subscribe((downloadPercentage) => {
                      // Update component internal state.
                      setDownloadPercentage(downloadPercentage);
                    });
                  dockerDownloaded$.subscribe((downloadSuccessful) => {
                    if (downloadSuccessful) {
                      setIsDownloaded(true);
                      setDownloadPercentage(100);
                    } else {
                      // TODO: what happens when the download call fails?
                      // Notify user and retry?
                    }
                  });
                }}
              >
                Download Now
              </Button>
            </>
          </Grid>
        )}
        {isDownloaded && (
          <Grid item container justify="flex-end">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              endIcon={<ArrowRightAltIcon />}
              onClick={() => history.push(Path.INSTALL_DOCKER)}
            >
              Install now
            </Button>
          </Grid>
        )}
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default DownloadDocker;
