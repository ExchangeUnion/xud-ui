import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import api from "../api";
import RowsContainer from "../common/RowsContainer";
import { Path } from "../router/Path";
import LinkToSetupGuide from "./LinkToSetupGuide";

function DockerNotDetected(): ReactElement {
  const history = useHistory();
  const [connectionFailed, setConnectionFailed] = useState(false);

  api.getinfo$().subscribe({
    next: () => history.push(Path.DASHBOARD),
    error: () => setConnectionFailed(true),
  });

  return (
    <RowsContainer>
      <Grid container item alignItems="center" justify="center">
        <ReportProblemOutlinedIcon fontSize="large" />
        &nbsp;
        <Typography variant="h4" component="h1">
          {connectionFailed
            ? "XUD Docker not detected"
            : "Connecting to XUD Docker"}
        </Typography>
      </Grid>
      <Grid container item alignItems="center" justify="center">
        <Button
          component={RouterLink}
          to={Path.CONNECT_TO_REMOTE}
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
        >
          Connect remote XUD Docker
        </Button>
      </Grid>
      <Grid container item alignItems="center">
        <LinkToSetupGuide />
      </Grid>
    </RowsContainer>
  );
}

export default DockerNotDetected;
