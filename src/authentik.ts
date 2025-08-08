import * as hetzner from "@pulumi/hcloud";
import * as pulumi from "@pulumi/pulumi";

const resourcePrefix = "authentik";

export async function setupAuthentikServer(
  provider: hetzner.Provider,
  config: pulumi.Config,
) {
  const hostname = "auth.beisenherz.dev";

  new hetzner.Server(
    `${resourcePrefix}:server`,
    {
      name: hostname,
      serverType: "cx22",
      image: "docker-ce",

      datacenter: "fsn1-dc14",

      labels: {
        source: "github/sironheart/offsite",
      },

      publicNets: [
        {
          ipv4Enabled: true,
          ipv6Enabled: true,
        },
      ],
    },
    { provider },
  );

  // new upcloud.Server(
  //   `${resourcePrefix}:server`,
  //   {
  //     hostname: hostname,
  //     zone: "nl-ams1",
  //     plan: "1xCPU-1GB",
  //     firewall: true,
  //
  //     labels: {
  //       source: "github/sironheart/offsite",
  //     },
  //
  //     metadata: true,
  //     timezone: "Europe/Berlin",
  //
  //     template: {
  //       storage: "Debian GNU/Linux 12 (Bookworm)",
  //       size: 25,
  //
  //       backupRule: {
  //         interval: "daily",
  //         time: "0500",
  //         retention: 3,
  //       },
  //     },
  //
  //     networkInterfaces: [
  //       {
  //         type: "public",
  //       },
  //     ],
  //
  //     login: {
  //       user: config.require("default-ssh-user"),
  //       keys: [
  //         "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGXksy6MukTkczCaGgSwF9DK/7qRdHB93LynQ5DNihoU",
  //       ],
  //     },
  //   },
  //   { provider: provider },
  // );
}
