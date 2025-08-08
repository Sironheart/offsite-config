import * as pulumi from "@pulumi/pulumi";
import * as hetzner from "@pulumi/hcloud";

import { setupOffsite } from "./src";
async function main() {
  const config = new pulumi.Config();

  const hcloud = new hetzner.Provider(`hcloud`, {
    token: process.env.HCLOUD_TOKEN ?? "",
  });

  setupOffsite({
    config: config,
    upcloudProvider: hcloud,
  });
}

main();
