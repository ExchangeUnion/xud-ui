import { observable } from "mobx";

export type DockerInfo = {
  isInstalled: boolean;
};

export type DockerStore = ReturnType<typeof useDockerStore>;

export const DOCKER_STORE = "dockerStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDockerStore = (defaultDockerInfo: DockerInfo) => {
  const store = observable({
    docker: defaultDockerInfo,
    get isInstalled(): boolean {
      return store.docker.isInstalled;
    },
    setIsInstalled(isInstalled: boolean): void {
      store.docker.isInstalled = isInstalled;
    },
  });

  return store;
};
