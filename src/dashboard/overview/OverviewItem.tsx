import {
  Box,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { ReactElement, useState } from "react";
import { XUD_NOT_READY } from "../../constants";
import { Status } from "../../models/Status";
import ServiceDetails from "./ServiceDetails";

export type OverviewItemProps = {
  status: Status;
  xudLocked?: boolean;
  xudNotReady?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoIconContainer: {
      position: "relative",
      display: "inline-block",
      top: theme.spacing(3),
      left: theme.spacing(3),
    },
    cardHeader: {
      paddingBottom: theme.spacing(3),
    },
    cardContent: {
      padding: 0,
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    cardCell: {
      padding: theme.spacing(4),
      textAlign: "center",
    },
    statusDot: {
      height: 10,
      width: 10,
      borderRadius: "50%",
      display: "inline-block",
      marginRight: 10,
    },
    active: {
      backgroundColor: theme.palette.success.light,
    },
    inactive: {
      backgroundColor: theme.palette.error.light,
    },
  })
);

function OverviewItem(props: OverviewItemProps): ReactElement {
  const { status, xudLocked, xudNotReady } = props;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const classes = useStyles();
  const statusDotClass = `${classes.statusDot} ${
    status.status.startsWith("Ready") ||
    (status.service === "xud" &&
      !XUD_NOT_READY.some((str) => status.status.startsWith(str)))
      ? classes.active
      : classes.inactive
  }`;

  const isDetailsIconVisible = (status: Status): boolean => {
    return (
      !xudLocked &&
      !xudNotReady &&
      !status.status.includes("light mode") &&
      status.status !== "Disabled"
    );
  };

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card>
        <Box className={classes.infoIconContainer}>
          {isDetailsIconVisible(status) && (
            <IconButton
              size="small"
              title="details"
              onClick={() => setDetailsOpen(true)}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          className={classes.cardHeader}
        >
          <span className={statusDotClass}></span>
          <Typography component="span" variant="body1">
            {props.status.service} info
          </Typography>
        </Grid>
        <Divider />
        <CardContent className={classes.cardContent}>
          <Grid container item>
            <Grid item xs={4} className={classes.cardCell}>
              Status
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={7} className={classes.cardCell}>
              {props.status.status}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {detailsOpen && (
        <ServiceDetails
          status={status}
          handleClose={() => setDetailsOpen(false)}
        />
      )}
    </Grid>
  );
}

export default OverviewItem;
