import * as pulumi from "@pulumi/pulumi";

const componentPrefix = "backup-location";

export class BackupLocation extends pulumi.ComponentResource {
  constructor(
    name: string,
    inputs: BackupLocationSettings,
    opts: pulumi.ComponentResourceOptions,
  ) {
    super(componentPrefix, name, inputs, opts);

    // This is all preparation for when the Hcloud provider finally provides Storage Box support via terraform.
  }
}

export interface BackupLocationSettings {}
