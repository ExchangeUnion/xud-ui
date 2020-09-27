import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ReactElement } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { MenuItemProps } from "./MenuItemProps";

function MenuItem(props: MenuItemProps): ReactElement {
  const { url } = useRouteMatch();
  return (
    <ListItem button component={Link} to={`${url}${props.path}`}>
      <ListItemText primary={props.text} />
    </ListItem>
  );
}

export default MenuItem;
