import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import React, { ReactElement } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Path } from "../router/Path";
import MenuItem, { MenuItemProps } from "./menu/MenuItem";
import Overview from "./overview/Overview";
import Tradehistory from "./tradehistory/Tradehistory";
import Wallets from "./wallet/Wallets";

export const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: drawerWidth,
    },
    header: {
      padding: "16px",
    },
    content: {
      marginLeft: drawerWidth,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

function Dashboard(): ReactElement {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const menuItems: MenuItemProps[] = [
    {
      path: Path.OVERVIEW,
      text: "Overview",
      component: Overview,
      icon: <RemoveRedEyeOutlinedIcon />,
      isFallback: true,
    },
    {
      path: Path.WALLETS,
      text: "Wallets",
      component: Wallets,
      icon: <AccountBalanceWalletOutlinedIcon />,
    },
    {
      path: Path.TRADEHISTORY,
      text: "Tradehistory",
      component: Tradehistory,
      icon: <HistoryIcon />,
    },
  ];

  return (
    <Box>
      <Drawer
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
              icon={item.icon}
              isFallback={item.isFallback}
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
