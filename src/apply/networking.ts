import { logger } from "../lib/logger";
import { ChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapNetworkingConfigToSchema } from "../mappers/networking";
import type { NetworkingConfig } from "../types/config/networking";
import type { NetworkConfigurationSchema } from "../types/schema/networking";
import { diff, applyChangeset, type IChange } from "json-diff-ts";

export function calculateNetworkingDiff(
  current: NetworkConfigurationSchema,
  desired: NetworkingConfig,
): NetworkConfigurationSchema | undefined {
  const next: Partial<NetworkConfigurationSchema> =
    mapNetworkingConfigToSchema(desired);

  const patch: IChange[] = new ChangeSetBuilder(
    diff(current, next, { treatTypeChangeAsReplace: false }),
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
