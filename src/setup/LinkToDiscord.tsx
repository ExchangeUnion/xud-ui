import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import React, { ReactElement } from "react";
import { XUD_DISCORD_URL } from "../constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
    },
    itemContainer: {
      display: "flex",
      alignItems: "center",
    },
  })
);

function LinkToDiscord(): ReactElement {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      spacing={1}
      wrap="nowrap"
      className={classes.container}
    >
      <Grid item className={classes.itemContainer}>
        <FontAwesomeIcon icon={faDiscord} size="lg" />
      </Grid>
      <Grid item className={classes.itemContainer}>
        <Link
          component="button"
          color="textSecondary"
          onClick={() => (window as any).electron.openExternal(XUD_DISCORD_URL)}
        >
          Issues? Hit us up on Discord
        </Link>
      </Grid>
      <Grid item className={classes.itemContainer}>
        <Grid item container alignItems="center">
          <OpenInNewIcon fontSize="inherit" color="disabled" />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LinkToDiscord;
