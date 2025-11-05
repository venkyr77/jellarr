import { logger } from "../lib/logger";
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
  if (a.length !== b.length) return false;

  const key: (r: PluginRepositoryConfig) => string = (
    r: PluginRepositoryConfig,
  ): string => `${r.name}::${r.url}`;

  const am: Map<string, PluginRepositoryConfig> = new Map(
    a.map((r: PluginRepositoryConfig): [string, PluginRepositoryConfig] => [
      key(r),
      r,
    ]),
  );

  for (const r of b) {
    const other: PluginRepositoryConfig | undefined = am.get(key(r));
    if (!other || other.enabled !== r.enabled) return false;
  }

  return true;
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

export function applySystem(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): ServerConfigurationSchema {
  const patch: Partial<ServerConfigurationSchema> =
    mapSystemConfigurationConfigToSchema(desired);

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
