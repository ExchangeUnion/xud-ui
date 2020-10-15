import {
  Box,
  CircularProgress,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import React, { ReactElement } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);
const PageCircularProgress = (): ReactElement => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default PageCircularProgress;
