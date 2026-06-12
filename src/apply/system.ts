import { logger } from "../lib/logger";
import { ChangeSetBuilder, AtomicChangeSetBuilder } from "../lib/changeset";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapSystemConfigurationConfigToSchema } from "../mappers/system";
import { type SystemConfig } from "../types/config/system";
import { type ServerConfigurationSchema } from "../types/schema/system";
import {
  diff,
  applyChangeset,
  Operation,
  type IChange,
  type IAtomicChange,
} from "json-diff-ts";
import { deepEqual } from "fast-equals";

/**
 * Whole-array replacement for a primitive array field that bypasses the
 * corrupting json-diff-ts atomize pipeline. Returns `true` when the desired
 * value is present and differs from the server's (and thus was assigned).
 */
function replaceArrayField<T>(
  currentValue: readonly T[] | null | undefined,
  desiredValue: readonly T[] | null | undefined,
  assign: (value: T[]) => void,
): boolean {
  if (
    desiredValue !== undefined &&
    desiredValue !== null &&
    !deepEqual(currentValue, desiredValue)
  ) {
    assign([...desiredValue]);
    return true;
  }
  return false;
}

/**
 * Diff the desired system configuration against the server's current state.
 *
 * ALL scalar/enum/boolean fields (ServerName, EnableMetrics, every
 * ServerConfiguration scalar such as ImageSavingConvention, CachePath,
 * EnableFolderView, LibraryMonitorDelay, UICulture, ... the PluginRepositories
 * object array, and the scalar TrickplayOptions fields) are diffed generically
 * through json-diff-ts - no per-key allowlist - with the `withoutRemoves` chain
 * that preserves fields the partial config omits.
 *
 * Primitive arrays - `TrickplayOptions.WidthResolutions` (a `number[]`) and the
 * top-level string arrays `SortReplaceCharacters`, `SortRemoveCharacters`,
 * `SortRemoveWords`, `CodecsUsed` and `CorsHosts` - are excluded from
 * json-diff-ts (via `keysToSkip`) and handled by direct whole-array
 * assignment. The changeset pipeline's atomize/unatomize splits index-based
 * array REMOVE ops into siblings applied sequentially, which corrupts
 * multi-element removals through index shifting. Replacing the array wholesale
 * is order-exact for grow/shrink/swap/multi-element/add-to-absent: if the user
 * specified the field and it differs from the server's value, the result equals
 * exactly that array; otherwise the server's value is untouched.
 */
export function calculateSystemDiff(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): ServerConfigurationSchema | undefined {
  const next: ServerConfigurationSchema =
    mapSystemConfigurationConfigToSchema(desired);

  type StringArrayKey =
    | "SortReplaceCharacters"
    | "SortRemoveCharacters"
    | "SortRemoveWords"
    | "CodecsUsed"
    | "CorsHosts";
  const stringArrayKeys: readonly StringArrayKey[] = [
    "SortReplaceCharacters",
    "SortRemoveCharacters",
    "SortRemoveWords",
    "CodecsUsed",
    "CorsHosts",
  ];

  const keysToSkip: string[] = [
    "TrickplayOptions.WidthResolutions",
    ...stringArrayKeys,
  ];

  /**
   * Keep only PluginRepositories array-element removes (so a repo dropped from
   * the desired list is deleted); strip every other remove so omitted scalar
   * and nested-object fields are preserved. Matching the array-index path
   * boundary, not a bare prefix, avoids catching a hypothetical sibling field
   * whose name merely starts with "PluginRepositories".
   */
  const keepRemove: (c: IAtomicChange) => boolean = (
    c: IAtomicChange,
  ): boolean =>
    c.type !== Operation.REMOVE ||
    c.path === "$.PluginRepositories" ||
    c.path.startsWith("$.PluginRepositories[");

  const patch: IChange[] = new AtomicChangeSetBuilder(
    new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { PluginRepositories: "Name", ".": "Name" },
        keysToSkip,
        treatTypeChangeAsReplace: false,
      }),
    )
      .withoutRemoves()
      .atomize()
      .toArray()
      .filter(keepRemove),
  )
    .unatomize()
    .toArray();

  const updated: ServerConfigurationSchema =
    patch.length !== 0
      ? (applyChangeset(
          structuredClone(current),
          patch,
        ) as ServerConfigurationSchema)
      : structuredClone(current);

  let anyArrayChanged: boolean = false;

  if (
    replaceArrayField(
      current.TrickplayOptions?.WidthResolutions,
      next.TrickplayOptions?.WidthResolutions,
      (value: number[]): void => {
        updated.TrickplayOptions ??= {};
        updated.TrickplayOptions.WidthResolutions = value;
      },
    )
  ) {
    anyArrayChanged = true;
  }

  for (const key of stringArrayKeys) {
    if (
      replaceArrayField(current[key], next[key], (value: string[]): void => {
        updated[key] = value;
      })
    ) {
      anyArrayChanged = true;
    }
  }

  if (patch.length === 0 && !anyArrayChanged) {
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
