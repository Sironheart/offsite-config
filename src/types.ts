import * as pulumi from "@pulumi/pulumi";
import * as hetzner from "@pulumi/hcloud";

export interface OffsiteSettings {
  config: pulumi.Config;
  upcloudProvider: hetzner.Provider;
}
