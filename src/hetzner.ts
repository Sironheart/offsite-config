import * as pulumi from "@pulumi/pulumi";
import * as hetzner from "@pulumi/hcloud";
import { hcloudProvider } from "./provider";

const resourcePrefix = "hetzner-defaults";

export async function preconfigureDefaultHCloudSettings() {
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
    {
      provider: hcloudProvider,
    },
  );
}
