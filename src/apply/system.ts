import { logger } from "../lib/logger";
import {
  arePluginRepositoryConfigsEqual,
  fromPluginRepositorySchemas,
  toPluginRepositorySchemas,
} from "../mappers/system";
import {
  type PluginRepositoryConfig,
  type SystemConfig,
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
  if (cur !== next) {
    logger.info(`EnableMetrics changed: ${String(cur)} → ${String(next)}`);
    return true;
  }
  return false;
}

function hasPluginRepositoriesChanged(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): boolean {
  if (desired.pluginRepositories === undefined) return false;
  const cur: PluginRepositoryConfig[] = fromPluginRepositorySchemas(
    current.PluginRepositories,
  );
  if (!arePluginRepositoryConfigsEqual(cur, desired.pluginRepositories)) {
    logger.info("PluginRepositories changed");
    return true;
  }
  return false;
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
      logger.info(
        `Trickplay.EnableHwAcceleration changed: ${String(before)} → ${String(after)}`,
      );
      return true;
    }
  }

  if ("enableHwEncoding" in cfg) {
    const before: boolean | null = cur.EnableHwEncoding ?? null;
    const after: boolean | null = cfg.enableHwEncoding ?? null;
    if (before !== after) {
      logger.info(
        `Trickplay.EnableHwEncoding changed: ${String(before)} → ${String(after)}`,
      );
      return true;
    }
  }

  return false;
}

export function applySystem(
  current: ServerConfigurationSchema,
  desired: SystemConfig,
): ServerConfigurationSchema {
  const out: ServerConfigurationSchema = { ...current };

  if (
    desired.enableMetrics !== undefined &&
    hasEnableMetricsChanged(current, desired)
  ) {
    out.EnableMetrics = desired.enableMetrics;
  }

  if (
    desired.pluginRepositories !== undefined &&
    hasPluginRepositoriesChanged(current, desired)
  ) {
    out.PluginRepositories = toPluginRepositorySchemas(
      desired.pluginRepositories,
    );
  }

  if (
    desired.trickplayOptions !== undefined &&
    hasTrickplayOptionsChanged(current, desired)
  ) {
    const cur: TrickplayOptionsSchema = current.TrickplayOptions ?? {};
    const cfg: TrickplayOptionsConfig = desired.trickplayOptions;
    const next: TrickplayOptionsSchema = { ...cur };

    if ("enableHwAcceleration" in cfg) {
      const v: boolean | null | undefined = cfg.enableHwAcceleration;
      const vOut: boolean | undefined = v === null ? undefined : v;
      next.EnableHwAcceleration = vOut;
    }
    if ("enableHwEncoding" in cfg) {
      const v: boolean | null | undefined = cfg.enableHwEncoding;
      const vOut: boolean | undefined = v === null ? undefined : v;
      next.EnableHwEncoding = vOut;
    }

    out.TrickplayOptions = next;
  }

  return out;
}
