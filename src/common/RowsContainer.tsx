import { createStyles, makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { ReactElement } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      height: "100vh",
      padding: "10vh 10vw",
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
    >
      {children}
    </Grid>
  );
}
export default RowsContainer;
