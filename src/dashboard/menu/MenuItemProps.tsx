import { ComponentClass, ReactElement } from "react";
import { Path } from "../../router/Path";

export type MenuItemProps = {
  path: Path;
  text: string;
  component: ComponentClass<any> | (() => ReactElement);
};
