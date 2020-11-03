import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";
import LogoImg from "../assets/logo-grey.png";

const useStyles = makeStyles(() =>
  createStyles({
    logoWrapper: {
      width: 200,
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
      <img className={classes.logo} src={LogoImg} alt="xud logo" />
    </div>
  );
};

export default XudLogo;
