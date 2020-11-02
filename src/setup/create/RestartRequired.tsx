import { Button, Grid, Typography } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import CheckIcon from "@material-ui/icons/Check";
import React, { ReactElement } from "react";
import { restart$ } from "../../common/dockerUtil";
import LinkToDiscord from "../LinkToDiscord";
import RowsContainer from "../RowsContainer";
import InfoBar from "./InfoBar";

const RestartRequired = (): ReactElement => {
  return (
    <RowsContainer>
      <Grid item container>
        <InfoBar text="Docker Installed!" icon={CheckIcon} />
      </Grid>
      <Grid item container justify="center">
        <Typography variant="h6" component="h2">
          Reboot required to continue.
        </Typography>
      </Grid>
      <Grid item container justify="flex-end">
        <Grid item container justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            endIcon={<ArrowRightAltIcon />}
            onClick={() => {
              restart$().subscribe(() => {
                window.close();
              });
            }}
          >
            Reboot Now
          </Button>
        </Grid>
        <LinkToDiscord />
      </Grid>
    </RowsContainer>
  );
};

export default RestartRequired;
