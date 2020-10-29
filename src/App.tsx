import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, Theme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Provider } from "mobx-react";
import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { combineLatest } from "rxjs";
import { mergeMap } from "rxjs/operators";
import {
  downloadDocker$,
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

combineLatest([isDockerInstalled$(), isDockerRunning$()]).subscribe(
  ([isInstalled, isRunning]) => {
    dockerStore!.setIsInstalled(isInstalled);
    dockerStore!.setIsRunning(isRunning);
    printStoreState(
      "After getting isInstalled and isRunning from the operating system"
    );
  }
);

/*
TODO: Here's how to download docker.
downloadDocker$().subscribe((success) => {
  console.log("Docker download successful?", success);
});
*/

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
