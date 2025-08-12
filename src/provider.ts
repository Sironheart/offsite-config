import * as github from "@pulumi/github";
import * as hcloud from "@pulumi/hcloud";

export const githubProvider = new github.Provider(`github`, {
  token: process.env.GITHUB_TOKEN ?? "",
});

export const hcloudProvider = new hcloud.Provider(`hcloud`, {
  token: process.env.HCLOUD_TOKEN ?? "",
});
