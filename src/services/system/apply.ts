import { logger } from "../../lib/logger";
import type {
  JFTrickplay,
  PluginRepositoryCfg,
  ServerConfiguration,
  SystemCfg,
  TrickplayOptionsCfg,
} from "../../domain/system/types";
import {
  equalReposUnordered,
  fromJFRepos,
  toJFRepos,
} from "../../mappers/system";

function hasEnableMetricsChanged(
  current: ServerConfiguration,
  desired: SystemCfg,
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
  current: ServerConfiguration,
  desired: SystemCfg,
): boolean {
  if (desired.pluginRepositories === undefined) return false;
  const cur: PluginRepositoryCfg[] = fromJFRepos(current.PluginRepositories);
  if (!equalReposUnordered(cur, desired.pluginRepositories)) {
    logger.info("PluginRepositories changed");
    return true;
  }
  return false;
}

function hasTrickplayOptionsChanged(
  current: ServerConfiguration,
  desired: SystemCfg,
): boolean {
  const cfg: TrickplayOptionsCfg | undefined = desired.trickplayOptions;
  if (!cfg) return false;

  const cur: JFTrickplay = current.TrickplayOptions ?? {};

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

export function apply(
  current: ServerConfiguration,
  desired: SystemCfg,
): ServerConfiguration {
  const out: ServerConfiguration = { ...current };

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
    out.PluginRepositories = toJFRepos(desired.pluginRepositories);
  }

  if (
    desired.trickplayOptions !== undefined &&
    hasTrickplayOptionsChanged(current, desired)
  ) {
    const cur: JFTrickplay = current.TrickplayOptions ?? {};
    const cfg: TrickplayOptionsCfg = desired.trickplayOptions;
    const next: JFTrickplay = { ...cur };

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
