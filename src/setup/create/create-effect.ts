// TODO: move this logic inside a CreateEnvironment component that will show a
// spinner until we have all the necesessary information fetched.
// Afterwards it will decide which route to push the user.

import { History } from "history";
import { Observable, of } from "rxjs";

/*
dockerDownloadStatus$().subscribe((downloadStatus) => {
  if (downloadStatus === 100) {
    // If docker is 100% downloaded, we'll move straight to install route.
    history.push(Path.INSTALL_DOCKER);
  } else {
    // Otherwise we'll start by attempting to download docker again.
    history.push(selectedItem.path);
  }
});
*/

// const dockerStatus$ = combineLatest([isDockerInstalled$(), isDockerRunning$()]);

// Get the state of docker when launching the application
/*
dockerStatus$.subscribe(([isInstalled, isRunning]) => {
  console.log("isInstalled", isInstalled);
  dockerStore.setIsInstalled(isInstalled);
  console.log("isRunning", isRunning);
  dockerStore.setIsRunning(isRunning);
});
*/
const getNextRoute = (): Observable<boolean> => {
  return of(true);
};

const redirectToNextRoute = (history: History<unknown>) => {
  return () => {
    // getNextRoute.subscribe();
    // cleanup getNextRoute
    // return () => {};
  };
};

export { getNextRoute, redirectToNextRoute };
