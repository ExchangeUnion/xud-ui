import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    logoWrapper: {
      width: 250,
    },
    logo: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
  })
);

const XudLogo = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.logoWrapper}>
      <img
        className={classes.logo}
        src={require("../assets/logo-grey.png")}
        alt="xud logo"
      />
    </div>
  );
};

export default XudLogo;
