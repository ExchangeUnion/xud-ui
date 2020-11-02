import { Grid, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { Path } from "../router/Path";
import LinkToDiscord from "./LinkToDiscord";
import RowsContainer from "./RowsContainer";
import InfoBar from "./create/InfoBar";

const WaitingDockerStart = (): ReactElement => {
  const history = useHistory();

  return (
    <RowsContainer>
      <Grid item container>
        <InfoBar text="Waiting for Docker to start" showCircularProgress={true} />
      </Grid>
      <Grid item container justify="center">
        <Typography variant="h6" component="h2">
          Waiting for Docker to start.
        </Typography>
      </Grid>
      <LinkToDiscord />
    </RowsContainer>
  );
};

export default WaitingDockerStart;