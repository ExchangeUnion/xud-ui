import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import { inject, observer } from "mobx-react";
import React, { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import api from "../api";
import RowsContainer from "../common/RowsContainer";
import { Path } from "../router/Path";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import LinkToSetupGuide from "./LinkToSetupGuide";

type DockerNotDetectedProps = WithStores;

const DockerNotDetected = inject(SETTINGS_STORE)(
  observer(({ settingsStore }: DockerNotDetectedProps) => {
    const history = useHistory();
    const [connectionFailed, setConnectionFailed] = useState(false);

    api.getinfo$(settingsStore!.xudDockerUrl).subscribe({
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
  })
);

export default DockerNotDetected;
