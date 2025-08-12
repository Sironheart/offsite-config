import { preconfigureDefaultHCloudSettings } from "./hetzner";
import { setupGithub } from "./github/";

export function setupOffsite() {
  preconfigureDefaultHCloudSettings();

  setupGithub();
}
