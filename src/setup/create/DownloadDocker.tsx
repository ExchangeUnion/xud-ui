import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import React, { ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import { interval } from "rxjs";
import { mergeMap, share, takeUntil } from "rxjs/operators";
import {
  dockerDownloadStatus$,
  downloadDocker$,
} from "../../common/dockerUtil";
import { Path } from "../../router/Path";
import LinkToDiscord from "../LinkToDiscord";
import RowsContainer from "../RowsContainer";
import InfoBar from "./InfoBar";

const useStyles = makeStyles(() =>
  createStyles({
    buttonsContainer: {
      minHeight: 90,
    },
  })
);

const DownloadDocker = (): ReactElement => {
  const history = useHistory();
  const classes = useStyles();
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <RowsContainer>
      <Grid item container>
        {isDownloading && (
          <InfoBar
            text="Downloading Docker"
            showCircularProgress={true}
          />
        )}
      </Grid>
      <Grid item container justify="center">
        <Typography variant="h6" component="h2">
          Docker not detected. In order to create a new xud environment, you
          need to get Docker.
        </Typography>
      </Grid>
      <Grid
        item
        container
        justify="flex-end"
        direction="column"
        className={classes.buttonsContainer}
      >
        {!isDownloading && (
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
                  downloadDocker$().subscribe(() =>
                    history.push(Path.CREATE_ENVIRONMENT)
                  );
                }}
              >
                Download Now
              </Button>
            </>
          </Grid>
        )}
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default DownloadDocker;
