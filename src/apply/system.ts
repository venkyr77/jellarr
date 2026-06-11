import { logger } from "../lib/logger";
import { ChangeSetBuilder, AtomicChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapSystemConfigurationConfigToSchema } from "../mappers/system";
import { type SystemConfig } from "../types/config/system";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { diff, applyChangeset, type IChange } from "json-diff-ts";
import { deepEqual } from "fast-equals";

/**
 * Diff the desired system configuration against the server's current state.
 *
 * Scalar/enum/boolean fields (ServerName, EnableMetrics, PluginRepositories and
 * the scalar TrickplayOptions fields) are diffed through json-diff-ts with the
 * `withoutRemoves` chain that preserves fields the partial config omits.
 *
 * `TrickplayOptions.WidthResolutions` (a `number[]`) is excluded from
 * json-diff-ts (via `keysToSkip`) and handled by direct whole-array
 * assignment. The changeset pipeline's atomize/unatomize splits index-based
 * array REMOVE ops into siblings applied sequentially, which corrupts
 * multi-element removals through index shifting. Replacing the array wholesale
 * is order-exact for grow/shrink/swap/multi-element/add-to-absent: if the user
 * specified `widthResolutions` and it differs from the server's value, the
 * result equals exactly that array; otherwise the server's value is untouched.
 */
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
      .withKey("ServerName")
      .withoutRemoves()
      .atomize()
      .toArray(),

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
      diff(current, next, {
        keysToSkip: ["TrickplayOptions.WidthResolutions"],
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("TrickplayOptions")
      .withoutRemoves()
      .atomize()
      .withoutRemoves()
      .toArray(),
  ])
    .unatomize()
    .toArray();

  const updated: ServerConfigurationSchema =
    patch.length !== 0
      ? (applyChangeset(
          structuredClone(current),
          patch,
        ) as ServerConfigurationSchema)
      : structuredClone(current);

  let wrChanged: boolean = false;
  const desiredWR: number[] | undefined =
    next.TrickplayOptions?.WidthResolutions;
  if (
    desiredWR !== undefined &&
    !deepEqual(current.TrickplayOptions?.WidthResolutions, desiredWR)
  ) {
    updated.TrickplayOptions ??= {};
    updated.TrickplayOptions.WidthResolutions = [...desiredWR];
    wrChanged = true;
  }

  if (patch.length === 0 && !wrChanged) {
    return undefined;
  }

  if (patch.length !== 0) {
    logger.info(JSON.stringify(patch));
  }
  return updated;
}

export async function applySystem(
  client: JellyfinClient,
  updatedSchema: ServerConfigurationSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;

  await client.updateSystemConfiguration(updatedSchema);
}
