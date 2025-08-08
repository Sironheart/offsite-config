import * as pulumi from "@pulumi/pulumi";
import * as hetzner from "@pulumi/hcloud";
import * as github from "@pulumi/github";

export interface OffsiteSettings {
  config: pulumi.Config;
  hetznerProvider: hetzner.Provider;
  githubProvider: github.Provider;
}
