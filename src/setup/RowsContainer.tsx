import { createStyles, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";

export const SIDE_PADDING = 10;
export const SIDE_PADDING_UNIT = "vh";

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      height: "100vh",
      padding: `10vh ${SIDE_PADDING}${SIDE_PADDING_UNIT}`,
    },
  })
);

function RowsContainer(props: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const { children } = props;
  const classes = useStyles();

  return (
    <Grid
      className={classes.gridContainer}
      container
      justify="space-between"
      direction="column"
      wrap="nowrap"
    >
      {children}
    </Grid>
  );
}
export default RowsContainer;
