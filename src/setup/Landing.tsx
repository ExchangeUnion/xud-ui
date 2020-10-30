import { Button, Grid } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { combineLatest, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { dockerDownloadStatus$, downloadDocker$ } from "../common/dockerUtil";
import RowsContainer from "../common/RowsContainer";
import { Path } from "../router/Path";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";

type LandingProps = WithStores;

type Item = {
  icon?: ReactElement;
  title: string;
  additionalInfo: string;
  path: Path;
};

const createItems = (): Item[] => [
  {
    title: "Create",
    additionalInfo: "Create new xud environment",
    path: Path.DOWNLOAD_DOCKER,
  },
  {
    title: "Connect",
    additionalInfo: "Connect to remote xud environment",
    path: Path.CONNECT_TO_REMOTE,
  },
];

const Landing = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(({ settingsStore, dockerStore }: LandingProps) => {
    const items: Item[] = createItems();

    const history = useHistory();
    const [selectedItem, setSelectedItem] = useState(items[0]);

    useEffect(() => {
      // TODO: move to better place
      // Get docker download percentage
      dockerDownloadStatus$().subscribe((dockerDownloadPercentage) => {
        console.log("docker download percentage is", dockerDownloadPercentage);
      });
      // Download docker binary
      /*
      downloadDocker$().subscribe((downloadSuccessful) => {
        downloadSuccessful
          ? console.log("docker download successful")
          : console.log("docker download failed");
      });
      */
      return () => {};
    }, [history, settingsStore, dockerStore]);

    return (
      <RowsContainer>
        {/* TODO: add xud logo */}
        <Grid item container>
          XUD logo here
        </Grid>
        <Grid item container justify="space-between">
          {/* TODO: add icon and additional info */}
          {items.map((item) => {
            return (
              <Button
                key={item.title}
                onClick={() => setSelectedItem(items.find((i) => i === item)!)}
              >
                {item.title}
              </Button>
            );
          })}
        </Grid>
        <Grid item container justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            endIcon={<ArrowRightAltIcon />}
            onClick={() => {
              // TODO: move this logic inside a CreateEnvironment component that will show a
              // spinner until we have all the necesessary information fetched.
              // Afterwards it will decide which route to push the user.
              dockerDownloadStatus$().subscribe((downloadStatus) => {
                if (downloadStatus === 100) {
                  // If docker is 100% downloaded, we'll move straight to install route.
                  history.push(Path.INSTALL_DOCKER);
                } else {
                  // Otherwise we'll start by attempting to download docker again.
                  history.push(selectedItem.path);
                }
              });
            }}
          >
            Next
          </Button>
        </Grid>
      </RowsContainer>
    );
  })
);

export default Landing;
