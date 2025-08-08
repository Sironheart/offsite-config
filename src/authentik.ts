import * as pulumi from "@pulumi/pulumi";
import * as hetzner from "@pulumi/hcloud";
import { OffsiteSettings } from "./types";

const resourcePrefix = "authentik";

export async function setupAuthentikServer(settings: OffsiteSettings) {
  const hostname = "auth.beisenherz.dev";

  const authentikServer = new hetzner.Server(
    `${resourcePrefix}:server`,
    {
      name: hostname,
      serverType: "cx22",
      image: "docker-ce",

      datacenter: "fsn1-dc14",

      labels: pulumi.output({
        source: "github_sironheart_offsite",
      }),

      publicNets: [
        {
          ipv4Enabled: true,
          ipv6Enabled: true,
        },
      ],

      sshKeys: ["RTL ssh"],
    },
    { provider: settings.hetznerProvider },
  );

  new hetzner.Firewall(
    `${resourcePrefix}:firewall`,
    {
      name: "Default",
      rules: [
        {
          direction: "in",
          protocol: "tcp",
          port: "80",
          sourceIps: ["0.0.0.0/0", "::/0"],
        },
        {
          direction: "in",
          protocol: "tcp",
          port: "443",
          sourceIps: ["0.0.0.0/0", "::/0"],
        },
        {
          direction: "in",
          protocol: "udp",
          port: "443",
          sourceIps: ["0.0.0.0/0", "::/0"],
        },
      ],

      labels: {
        source: "github_sironheart_offsite",
      },
    },
    { provider: settings.hetznerProvider },
  );
}
