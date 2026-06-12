import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapNetworkingConfigToSchema } from "../mappers/networking";
import { type NetworkingConfig } from "../types/config/networking";
import { type NetworkConfigurationSchema } from "../types/schema/networking";
import { applyChangeset, diff, type IChange } from "json-diff-ts";
import { ChangeSetBuilder } from "../lib/changeset";

const ARRAY_KEYS: Array<keyof NetworkConfigurationSchema> = [
  "LocalNetworkSubnets",
  "LocalNetworkAddresses",
  "KnownProxies",
  "VirtualInterfaceNames",
  "PublishedServerUriBySubnet",
  "RemoteIPFilter",
];

export function calculateNetworkingDiff(
  current: NetworkConfigurationSchema,
  desired: NetworkingConfig,
): NetworkConfigurationSchema | undefined {
  const next: Partial<NetworkConfigurationSchema> =
    mapNetworkingConfigToSchema(desired);

  const embeddedObjKeys: Record<string, string> = {};
  for (const key of ARRAY_KEYS) {
    embeddedObjKeys[key] = "$value";
  }

  const patch: IChange[] = new ChangeSetBuilder(
    diff(current, next, { embeddedObjKeys, treatTypeChangeAsReplace: false }),
  )
    .withoutRemoves()
    .toArray();

  if (patch.length !== 0) {
    logger.info(JSON.stringify(patch));
    return applyChangeset(current, patch) as NetworkConfigurationSchema;
  }

  return undefined;
}

export async function applyNetworking(
  client: JellyfinClient,
  updatedSchema: NetworkConfigurationSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;

  await client.updateNetworkingConfiguration(updatedSchema);
}
