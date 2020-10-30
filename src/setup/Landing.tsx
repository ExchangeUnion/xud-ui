import { Button, Grid } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { combineLatest, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import {
  dockerDownloadStatus$,
  downloadDocker$,
  isDockerInstalled$,
  isDockerRunning$,
} from "../common/dockerUtil";
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
      // TODO: temporary helper function for debugging - remove later.
      const printStoreState = (msg: string) => {
        console.log(`${msg}:
isInstalled: ${dockerStore!.isInstalled}
isRunning: ${dockerStore!.isRunning}
    `);
      };
      const dockerDownloadedSubscription = combineLatest([
        isDockerInstalled$(),
        isDockerRunning$(),
      ])
        .pipe(
          tap(([isInstalled, isRunning]) => {
            dockerStore!.setIsInstalled(isInstalled);
            dockerStore!.setIsRunning(isRunning);
            printStoreState(
              "After getting isInstalled and isRunning from the operating system"
            );
          }),
          mergeMap(([isInstalled, isRunning]) => {
            if (isInstalled && isRunning) {
              return of("ready to bring up containers");
            }
            if (isInstalled && !isRunning) {
              return of("waiting for docker to start");
            } else {
              // Docker is not installed. Check if docker is downloaded.
              return dockerDownloadStatus$().pipe(
                mergeMap((downloadStatus) => {
                  if (downloadStatus === 100) {
                    return of("docker is downloaded - starting to install");
                  } else {
                    return downloadDocker$().pipe(
                      mergeMap(() => {
                        return of("docker has been downloaded");
                      })
                    );
                  }
                })
              );
            }
          })
        )
        .subscribe((v) => {
          console.log("next from createFlow$", v);
        });

      return () => dockerDownloadedSubscription.unsubscribe();
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
            onClick={() => history.push(selectedItem.path)}
          >
            Next
          </Button>
        </Grid>
      </RowsContainer>
    );
  })
);

export default Landing;
