import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import { Path } from "./router/Path";
import ConnectToRemote from "./setup/ConnectToRemote";
import DockerNotDetected from "./setup/DockerNotDetected";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App(): ReactElement {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;
