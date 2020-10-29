import Typography from "@material-ui/core/Typography";
import { inject, observer } from "mobx-react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import RowsContainer from "../common/RowsContainer";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";
import { WithStores } from "../stores/WithStores";
import {
  dockerDownloadStatus$,
  downloadDocker$,
  isDockerInstalled$,
  isDockerRunning$,
} from "../common/dockerUtil";
import { combineLatest, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";

type LandingProps = WithStores;

const DockerNotDetected = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(({ settingsStore, dockerStore }: LandingProps) => {
    const history = useHistory();

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
        <Typography variant="h4" component="h1">
          Landing Screens Start Here!
        </Typography>
      </RowsContainer>
    );
  })
);

export default DockerNotDetected;
