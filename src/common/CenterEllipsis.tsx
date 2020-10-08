import { createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";

type PropsType = {
  text: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    left: {
      flex: "0 1 auto",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "pre",
    },
    right: {
      flex: "1 0 auto",
      overflow: "hidden",
      whiteSpace: "pre",
      maxWidth: "40px",
    },
  })
);

function CenterEllipsis(props: PropsType): ReactElement {
  const { text } = props;
  const splitIndex =
    text.length > 4 ? text.length - 4 : Math.round(text.length * 0.75);
  const classes = useStyles();

  const shrinkableText = text.slice(0, splitIndex);
  const endText = text.slice(splitIndex);

  return (
    <>
      <span className={classes.left}>{shrinkableText}</span>
      <span className={classes.right}>{endText}</span>
    </>
  );
}

export default CenterEllipsis;
