import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactElement } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Path } from "../router/Path";
import MenuItem, { MenuItemProps } from "./menu/MenuItem";
import Overview from "./Overview";
import Trades from "./Trades";
import Wallets from "./wallet/Wallets";

const drawerWidth = 150;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    header: {
      padding: "16px",
    },
    content: {
      flexWrap: "wrap",
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

function Dashboard(): ReactElement {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const menuItems: MenuItemProps[] = [
    { path: Path.OVERVIEW, text: "Overview", component: Overview },
    { path: Path.WALLETS, text: "Wallets", component: Wallets },
    { path: Path.TRADES, text: "Trades", component: Trades },
  ];

  return (
    <Box display="flex">
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Typography
          className={classes.header}
          variant="overline"
          component="p"
          color="textSecondary"
        >
          XUD Explorer
        </Typography>
        <List>
          {menuItems.map((item) => (
            <MenuItem
              path={item.path}
              text={item.text}
              component={item.component}
              key={item.text}
            />
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <Switch>
          {menuItems.map((item) => (
            <Route path={`${path}${item.path}`} key={item.text}>
              {item.component}
            </Route>
          ))}
          <Route path={path}>
            <Overview />
          </Route>
        </Switch>
      </main>
    </Box>
  );
}

export default Dashboard;
