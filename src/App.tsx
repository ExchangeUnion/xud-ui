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
import DockerNotDetected from "./setup/DockerNotDetected";
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

function App(): ReactElement {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalCss />
      <Provider settingsStore={settingsStore}>
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
