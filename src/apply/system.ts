import { logger } from "../lib/logger";
import { ChangeSetBuilder, AtomicChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapSystemConfigurationConfigToSchema } from "../mappers/system";
import { type SystemConfig } from "../types/config/system";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { diff, applyChangeset, type IChange } from "json-diff-ts";

export function calculateSystemDiff(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): ServerConfigurationSchema | undefined {
  const next: ServerConfigurationSchema =
    mapSystemConfigurationConfigToSchema(desired);

  const patch: IChange[] = new AtomicChangeSetBuilder([
    ...new ChangeSetBuilder(
      diff(current, next, { treatTypeChangeAsReplace: false }),
    )
      .withKey("EnableMetrics")
      .withoutRemoves()
      .atomize()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { ".": "Name" },
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("PluginRepositories")
      .withoutRemoves()
      .atomize()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, { treatTypeChangeAsReplace: false }),
    )
      .withKey("TrickplayOptions")
      .withoutRemoves()
      .atomize()
      .withoutRemoves()
      .toArray(),
  ])
    .unatomize()
    .toArray();

  if (patch.length != 0) {
    logger.info(JSON.stringify(patch));
    return applyChangeset(current, patch) as ServerConfigurationSchema;
  }

  return undefined;
}

export async function applySystem(
  client: JellyfinClient,
  updatedSchema: ServerConfigurationSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;

  await client.updateSystemConfiguration(updatedSchema);
}
