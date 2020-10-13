import { Grid } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ComponentClass, ReactElement } from "react";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { Path } from "../../router/Path";

export type MenuItemProps = {
  path: Path;
  text: string;
  component: ComponentClass<any> | (() => ReactElement);
  icon: ReactElement;
  isFallback?: boolean;
};

function MenuItem(props: MenuItemProps): ReactElement {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const navigateTo = `${url}${props.path}`;

  const isCurrentLocation = (): boolean => {
    return navigateTo === pathname || (!!props.isFallback && url === pathname);
  };

  return (
    <ListItem
      button
      component={Link}
      to={navigateTo}
      selected={isCurrentLocation()}
    >
      <Grid container alignItems="center" spacing={1}>
        <Grid item>{props.icon}</Grid>
        <Grid item>
          <ListItemText primary={props.text} />
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default MenuItem;
