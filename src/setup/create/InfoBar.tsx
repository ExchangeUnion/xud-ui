import {
  Card,
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ElementType, ReactElement } from "react";
import { SIDE_PADDING, SIDE_PADDING_UNIT } from "../RowsContainer";

type InfoBarProps = {
  text: string;
  showCircularProgress?: boolean;
  icon?: ElementType;
  progress?: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      position: "fixed",
      width: `calc(100% - ${SIDE_PADDING * 2}${SIDE_PADDING_UNIT})`,
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(2),
    },
    itemContainer: {
      display: "flex",
      alignItems: "center",
    },
  })
);

const InfoBar = (props: InfoBarProps): ReactElement => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Grid item container justify="space-between" wrap="nowrap">
        <Grid item container spacing={1} wrap="nowrap">
          {props.showCircularProgress && (
            <Grid item className={classes.itemContainer}>
              <CircularProgress color="inherit" size={15} />
            </Grid>
          )}
          {!!props.icon && (
            <Grid item className={classes.itemContainer}>
              <props.icon />
            </Grid>
          )}
          <Grid item className={classes.itemContainer}>
            <Typography variant="body2" component="span">
              {props.text}
            </Typography>
          </Grid>
        </Grid>
        {(!!props.progress || props.progress === 0) && (
          <Grid item container justify="flex-end">
            <Typography variant="body2" component="span">
              {props.progress}%
            </Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default InfoBar;
