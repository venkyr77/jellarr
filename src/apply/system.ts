import { deepEqual } from "fast-equals";
import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import {
  fromPluginRepositorySchemas,
  mapSystemConfigurationConfigToSchema,
} from "../mappers/system";
import { type SystemConfig } from "../types/config/system";
import {
  type PluginRepositoryConfig,
  type TrickplayOptionsConfig,
} from "../types/config/system";
import {
  type ServerConfigurationSchema,
  type TrickplayOptionsSchema,
} from "../types/schema/system";

function hasEnableMetricsChanged(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): boolean {
  if (desired.enableMetrics === undefined) return false;

  const cur: boolean = Boolean(current.EnableMetrics);
  const next: boolean = desired.enableMetrics;

  return cur !== next;
}

function arePluginRepositoryConfigsEqual(
  a: PluginRepositoryConfig[],
  b: PluginRepositoryConfig[],
): boolean {
  // Order-independent comparison using deepEqual with sorted arrays
  const sortByNameAndUrl: (
    repos: PluginRepositoryConfig[],
  ) => PluginRepositoryConfig[] = (
    repos: PluginRepositoryConfig[],
  ): PluginRepositoryConfig[] =>
    [...repos].sort(
      (a: PluginRepositoryConfig, b: PluginRepositoryConfig) =>
        a.name.localeCompare(b.name) || a.url.localeCompare(b.url),
    );

  return deepEqual(sortByNameAndUrl(a), sortByNameAndUrl(b));
}

function hasPluginRepositoriesChanged(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): boolean {
  if (desired.pluginRepositories === undefined) return false;

  return !arePluginRepositoryConfigsEqual(
    fromPluginRepositorySchemas(current.PluginRepositories),
    desired.pluginRepositories,
  );
}

function hasTrickplayOptionsChanged(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): boolean {
  const cfg: TrickplayOptionsConfig | undefined = desired.trickplayOptions;

  if (!cfg) return false;

  const cur: TrickplayOptionsSchema = current.TrickplayOptions ?? {};

  if ("enableHwAcceleration" in cfg) {
    const before: boolean | null = cur.EnableHwAcceleration ?? null;
    const after: boolean | null = cfg.enableHwAcceleration ?? null;
    if (before !== after) {
      return true;
    }
  }

  if ("enableHwEncoding" in cfg) {
    const before: boolean | null = cur.EnableHwEncoding ?? null;
    const after: boolean | null = cfg.enableHwEncoding ?? null;
    if (before !== after) {
      return true;
    }
  }

  return false;
}

export function calculateSystemDiff(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): ServerConfigurationSchema | undefined {
  const patch: Partial<ServerConfigurationSchema> =
    mapSystemConfigurationConfigToSchema(desired);

  const hasChanges: boolean =
    hasEnableMetricsChanged(current, desired) ||
    hasPluginRepositoriesChanged(current, desired) ||
    hasTrickplayOptionsChanged(current, desired);

  if (!hasChanges) {
    return undefined;
  }

  if (hasEnableMetricsChanged(current, desired)) {
    logger.info(
      `EnableMetrics changed: ${String(current.EnableMetrics)} → ${String(desired.enableMetrics)}`,
    );
  }

  if (hasPluginRepositoriesChanged(current, desired)) {
    logger.info(
      `PluginRepositories changed: ${JSON.stringify(fromPluginRepositorySchemas(current.PluginRepositories))} → ${JSON.stringify(desired.pluginRepositories)}`,
    );
  }

  if (hasTrickplayOptionsChanged(current, desired)) {
    logger.info(
      `TrickplayOptions changed: ${JSON.stringify(current.TrickplayOptions)} → ${JSON.stringify(desired.trickplayOptions)}`,
    );
  }

  const out: ServerConfigurationSchema = { ...current };

  if ("EnableMetrics" in patch) {
    out.EnableMetrics = patch.EnableMetrics;
  }

  if (typeof patch.PluginRepositories !== "undefined") {
    out.PluginRepositories = patch.PluginRepositories;
  }

  if (typeof patch.TrickplayOptions !== "undefined") {
    const cur: TrickplayOptionsSchema = current.TrickplayOptions ?? {};
    out.TrickplayOptions = { ...cur, ...patch.TrickplayOptions };
  }

  return out;
}

export async function applySystem(
  client: JellyfinClient,
  updatedSchema: ServerConfigurationSchema | undefined,
): Promise<void> {
  if (!updatedSchema) {
    return;
  }

  await client.updateSystemConfiguration(updatedSchema);
}
