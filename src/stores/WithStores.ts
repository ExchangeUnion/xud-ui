import { DockerStore } from "./dockerStore";
import { SettingsStore } from "./settingsStore";

export interface WithStores {
  settingsStore?: SettingsStore;
  dockerStore?: DockerStore;
}
