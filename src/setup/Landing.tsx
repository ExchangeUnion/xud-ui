import { Button, Grid } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { inject, observer } from "mobx-react";
import React, { ReactElement, useState } from "react";
import { useHistory } from "react-router-dom";
import RowsContainer from "../common/RowsContainer";
import { Path } from "../router/Path";
import { DOCKER_STORE } from "../stores/dockerStore";
import { SETTINGS_STORE } from "../stores/settingsStore";

type Item = {
  icon?: ReactElement;
  title: string;
  additionalInfo: string;
  path: Path;
};

const createItems = (): Item[] => [
  {
    title: "Create",
    additionalInfo: "Create new xud environment",
    path: Path.CREATE_ENVIRONMENT,
  },
  {
    title: "Connect",
    additionalInfo: "Connect to remote xud environment",
    path: Path.CONNECT_TO_REMOTE,
  },
];

const Landing = inject(
  SETTINGS_STORE,
  DOCKER_STORE
)(
  observer(() => {
    const items: Item[] = createItems();

    const history = useHistory();
    const [selectedItem, setSelectedItem] = useState(items[0]);

    return (
      <RowsContainer>
        {/* TODO: add xud logo */}
        <Grid item container>
          XUD logo here
        </Grid>
        <Grid item container justify="space-between">
          {/* TODO: add icon and additional info */}
          {items.map((item) => {
            return (
              <Button
                key={item.title}
                onClick={() => setSelectedItem(items.find((i) => i === item)!)}
              >
                {item.title}
              </Button>
            );
          })}
        </Grid>
        <Grid item container justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            endIcon={<ArrowRightAltIcon />}
            onClick={() => {
              history.push(selectedItem.path);
            }}
          >
            Next
          </Button>
        </Grid>
      </RowsContainer>
    );
  })
);

export default Landing;
