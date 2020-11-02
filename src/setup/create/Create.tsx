import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { timer } from "rxjs";
import { take } from "rxjs/operators";
import {
  isDockerDownloaded$,
  isDockerInstalled$,
  isDockerRunning$,
  rebootRequired$,
} from "../../common/dockerUtil";
import PageCircularProgress from "../../common/PageCircularProgress";
import { getNextRoute } from "./next-route";

const Create = (): ReactElement => {
  const history = useHistory();
  useEffect(() => {
    // Here we can adjust the minimum amount of time the screen should be visible.
    // This is to prevent sudden "flash" loading screens.
    const MINIMUM_NEXT_ROUTE_DETECTION_TIME = 1000;
    const minimumRuntime = () => timer(MINIMUM_NEXT_ROUTE_DETECTION_TIME);
    getNextRoute(
      minimumRuntime,
      isDockerInstalled$,
      isDockerRunning$,
      isDockerDownloaded$,
      rebootRequired$
    )
      .pipe(take(1))
      .subscribe((nextRoute) => history.push(nextRoute));
  });
  return <PageCircularProgress />;
};

export default Create;
