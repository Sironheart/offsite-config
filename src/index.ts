import { setupAuthentikServer } from "./authentik";
import { OffsiteSettings } from "./types";

export function setupOffsite(settings: OffsiteSettings) {
  setupAuthentikServer(settings.upcloudProvider, settings.config);
}
