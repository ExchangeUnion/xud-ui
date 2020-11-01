import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, Theme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Provider } from "mobx-react";
import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { XUD_DOCKER_LOCAL_MAINNET_URL } from "./constants";
import Dashboard from "./dashboard/Dashboard";
import { Path } from "./router/Path";
import ConnectToRemote from "./setup/ConnectToRemote";
import Create from "./setup/create/Create";
import DownloadDocker from "./setup/create/DownloadDocker";
import InstallDocker from "./setup/create/InstallDocker";
import StartingXud from "./setup/create/StartingXud";
import DockerNotDetected from "./setup/DockerNotDetected";
import Landing from "./setup/Landing";
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
            <Route path={Path.DOWNLOAD_DOCKER}>
              <DownloadDocker />
            </Route>
            <Route path={Path.INSTALL_DOCKER}>
              <InstallDocker />
            </Route>
            <Route path={Path.STARTING_XUD}>
              <StartingXud />
            </Route>
            <Route path={Path.CREATE_ENVIRONMENT}>
              <Create />
            </Route>
            <Route path={Path.HOME}>
              {(window as any).electron.platform() === "win32" ? (
                <Landing />
              ) : (
                <DockerNotDetected />
              )}
            </Route>
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
