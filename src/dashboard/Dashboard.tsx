import { Button, Grid, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import CachedIcon from "@material-ui/icons/Cached";
import HistoryIcon from "@material-ui/icons/History";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import React, { ReactElement } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
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
      justifyContent: "space-between",
    },
    menuContainer: {
      width: "100%",
    },
    header: {
      padding: "16px",
    },
    drawerButton: {
      margin: theme.spacing(2),
    },
    content: {
      marginLeft: drawerWidth,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

const Dashboard = (): ReactElement => {
  const history = useHistory();
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

  const disconnect = (): void => {
    const nextPath =
      (window as any).electron.platform() === "win32"
        ? Path.HOME
        : Path.CONNECT_TO_REMOTE;
    history.push(nextPath);
  };

  return (
    <Box>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Grid container item>
          <Typography
            className={classes.header}
            variant="overline"
            component="p"
            color="textSecondary"
          >
            XUD Explorer
          </Typography>
          <List className={classes.menuContainer}>
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
        </Grid>
        <Button
          size="small"
          startIcon={<CachedIcon />}
          variant="outlined"
          title="Disconnect from xud-docker"
          className={classes.drawerButton}
          onClick={disconnect}
        >
          Disconnect
        </Button>
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
};

export default Dashboard;
