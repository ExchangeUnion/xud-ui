import { Grid, LinearProgress, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import RowsContainer from "../../common/RowsContainer";
import LinkToDiscord from "../LinkToDiscord";

// TODO: implement actions
const StartingXud = (): ReactElement => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <RowsContainer>
      <Grid item container justify="center">
        {/* TODO: add logo */}
        <Typography variant="h6" component="h2">
          Powering OpenDEX
        </Typography>
      </Grid>
      <Grid>
        <LinearProgress variant="determinate" value={progress} />
      </Grid>
      <LinkToDiscord />
    </RowsContainer>
  );
};

export default StartingXud;
