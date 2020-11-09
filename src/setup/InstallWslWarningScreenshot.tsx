import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";
import InstallWslImg from "../assets/install-wsl2-prompt.png";

const useStyles = makeStyles(() =>
  createStyles({
    image: {
      width: 500,
      height: "auto",
      margin: "20px 0 0 0",
    },
  })
);

const InstallWslWarningScreenshot = (): ReactElement => {
  const classes = useStyles();

  return (
    <img
      className={classes.image}
      src={InstallWslImg}
      alt="WSL 2 is required to run Docker. Please install WSL 2."
    />
  );
};

export { InstallWslWarningScreenshot };
