import * as pulumi from "@pulumi/pulumi";
import * as hetzner from "@pulumi/hcloud";
import * as gh from "@pulumi/github";

import { setupOffsite } from "./src";

async function main() {
  const config = new pulumi.Config();

  const hcloud = new hetzner.Provider(`hcloud`, {
    token: process.env.HCLOUD_TOKEN ?? "",
  });

  const github = new gh.Provider(`github`, {
    token: process.env.GITHUB_TOKEN ?? "",
  });

  setupOffsite({
    config: config,
    hetznerProvider: hcloud,
    githubProvider: github,
  });
}

main();
