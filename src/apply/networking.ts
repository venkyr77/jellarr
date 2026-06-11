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

  const arrayChangeset: ChangeSetBuilder = new ChangeSetBuilder(
    diff(current, next, { embeddedObjKeys, treatTypeChangeAsReplace: false }),
  ).withoutRemoves();
  const arrayPatch: IChange[] = ARRAY_KEYS.flatMap(
    (key: keyof NetworkConfigurationSchema) =>
      arrayChangeset.withKey(key as string).toArray(),
  );

  const patch: IChange[] = [
    ...new ChangeSetBuilder(
      diff(current, next, {
        keysToSkip: ARRAY_KEYS as string[],
        treatTypeChangeAsReplace: false,
      }),
    )
      .withoutRemoves()
      .toArray(),

    ...arrayPatch,
  ];

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
