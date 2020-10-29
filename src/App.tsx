import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, Theme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Provider } from "mobx-react";
import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { combineLatest, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import {
  dockerDownloadStatus$,
  downloadDocker$,
  isDockerDownloaded$,
  isDockerInstalled$,
  isDockerRunning$,
} from "./common/dockerUtil";
import { XUD_DOCKER_LOCAL_MAINNET_URL } from "./constants";
import Dashboard from "./dashboard/Dashboard";
import { Path } from "./router/Path";
import ConnectToRemote from "./setup/ConnectToRemote";
import DockerNotDetected from "./setup/DockerNotDetected";
import { useDockerStore } from "./stores/dockerStore";
import { useSettingsStore } from "./stores/settingsStore";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const GlobalCss = withStyles((theme: Theme) => {
  return {
    "@global": {
      "::-webkit-scrollbar": {
        width: 8,
      },
      "::-webkit-scrollbar-track": {
        background: theme.palette.background.default,
      },
      "::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        background: theme.palette.background.paper,
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: theme.palette.grey[700],
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: "transparent",
      },
    },
  };
})(() => null);

const settingsStore = useSettingsStore({
  xudDockerUrl: XUD_DOCKER_LOCAL_MAINNET_URL,
});

const dockerStore = useDockerStore({
  isInstalled: false,
  isRunning: false,
});

// TODO: temporary helper function for debugging - remove later.
const printStoreState = (msg: string) => {
  console.log(`${msg}:
isInstalled: ${dockerStore!.isInstalled}
isRunning: ${dockerStore!.isRunning}
    `);
};

/* readyToInstallDocker$
combineLatest([isDockerInstalled$(), isDockerRunning$()])
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
*/

dockerDownloadStatus$().subscribe((downloadStatus) => {
  console.log("Docker download status", downloadStatus);
});

printStoreState("Initial state from the docker store");

function App(): ReactElement {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalCss />
      <Provider settingsStore={settingsStore} dockerStore={dockerStore}>
        <Router>
          <Switch>
            <Route path={Path.CONNECT_TO_REMOTE}>
              <ConnectToRemote />
            </Route>
            <Route path={Path.DASHBOARD}>
              <Dashboard />
            </Route>
            <Route path={Path.HOME}>
              <DockerNotDetected />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
