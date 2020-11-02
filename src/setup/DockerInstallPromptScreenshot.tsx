import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    image: {
      width: 300,
      height: "auto",
      margin: "80px 0 40px 0",
    },
  })
);

const DockerInstallPromptScreenshot = (): ReactElement => {
  const classes = useStyles();

  return (
    <img
      className={classes.image}
      src={require("../assets/install-docker-prompt.png")}
      alt="Click yes when prompted to install Docker"
    />
  );
};

export { DockerInstallPromptScreenshot };
