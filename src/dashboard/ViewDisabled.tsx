import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React, { ReactElement } from "react";
import { DashboardContentState } from "./DashboardContent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      padding: theme.spacing(3),
    },
  })
);

function ViewDisabled(props: DashboardContentState): ReactElement {
  const classes = useStyles();
  const { xudLocked, xudStatus } = props;
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid
        container
        item
        alignItems="center"
        justify="center"
        spacing={2}
        className={classes.row}
      >
        <Grid item>
          <Grid item container alignItems="center">
            <ReportProblemOutlinedIcon fontSize="large" />
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1">
            {xudLocked ? "XUD is locked" : "XUD is not ready"}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item justify="center" className={classes.row}>
        <Grid item>
          <Typography variant="h6" component="h2">
            {xudLocked
              ? 'Please unlock via "unlock" in xud ctl to view this page.'
              : xudStatus || ""}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ViewDisabled;
