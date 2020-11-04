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
      alt="Docker is currently configured to run on WSL2 backend, but WSL2 is not installed. Please install WSL2 or changed the Docker backend setting to WSL1."
    />
  );
};

export { InstallWslWarningScreenshot };
