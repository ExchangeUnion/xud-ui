import {
  Button,
  ButtonBase,
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import PlayArrowTwoToneIcon from "@material-ui/icons/PlayArrowTwoTone";
import PowerTwoToneIcon from "@material-ui/icons/PowerTwoTone";
import { inject, observer } from "mobx-react";
import React, { ElementType, useState } from "react";
import { useHistory } from "react-router-dom";
import RowsContainer from "./RowsContainer";
import { Path } from "../router/Path";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";
import XudLogo from "./XudLogo";

type Item = {
  icon: ElementType;
  title: string;
  additionalInfo: string;
  path: Path;
};

const createItems = (envExists?: boolean): Item[] => [
  {
    title: envExists ? "Start" : "Create",
    additionalInfo: envExists
      ? "xud environment detected"
      : "Create new xud environment",
    icon: envExists ? PlayArrowTwoToneIcon : AddCircleTwoToneIcon,
    path: Path.START_ENVIRONMENT,
  },
  {
    title: "Connect",
    additionalInfo: "Connect to remote xud environment",
    icon: PowerTwoToneIcon,
    path: Path.CONNECT_TO_REMOTE,
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 300,
      width: "100%",
    },
    selected: {
      color: theme.palette.primary.light,
      border: `3px outset ${theme.palette.primary.light}`,
    },
    cardTitle: {
      fontWeight: 200,
      marginBottom: theme.spacing(2),
    },
    cardIcon: {
      fontSize: 80,
      margin: theme.spacing(3),
    },
    buttonContainer: {
      marginTop: theme.spacing(3),
      minHeight: 36,
    },
  })
);

const Landing = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(() => {
    // TODO: pass in `true` as argument if environment is created
    const items: Item[] = createItems();
    const classes = useStyles();
    const history = useHistory();
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(
      undefined
    );

    const getItemClass = (item: Item): string => {
      return `${classes.card} ${
        selectedItem?.path === item.path ? classes.selected : ""
      }`;
    };

    return (
      <RowsContainer>
        <Grid item container justify="center">
          <XudLogo />
        </Grid>
        <Grid item container justify="center" alignItems="center" spacing={9}>
          {items.map((item) => {
            return (
              <Grid key={item.title} item>
                <ButtonBase
                  onClick={() =>
                    setSelectedItem(items.find((i) => i === item)!)
                  }
                >
                  <Card className={getItemClass(item)}>
                    <CardContent>
                      <item.icon className={classes.cardIcon} />
                      <Typography variant="h5" className={classes.cardTitle}>
                        {item.title}
                      </Typography>
                      <Typography
                        component="p"
                        variant="caption"
                        color="textSecondary"
                      >
                        {item.additionalInfo}
                      </Typography>
                    </CardContent>
                  </Card>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
        <Grid
          item
          container
          justify="flex-end"
          className={classes.buttonContainer}
        >
          {!!selectedItem && (
            <Button
              variant="contained"
              color="primary"
              disableElevation
              endIcon={<ArrowRightAltIcon />}
              onClick={() => {
                history.push(selectedItem!.path);
              }}
            >
              Next
            </Button>
          )}
        </Grid>
      </RowsContainer>
    );
  })
);

export default Landing;
