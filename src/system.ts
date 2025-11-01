import { logger } from "./logger";
import type { components } from "../generated/schema";

type ServerConfiguration = components["schemas"]["ServerConfiguration"];
type JFPluginRepo = NonNullable<
  ServerConfiguration["PluginRepositories"]
>[number];
type JFTrickplay = NonNullable<ServerConfiguration["TrickplayOptions"]>;

export interface PluginRepositoryCfg {
  name: string;
  url: string;
  enabled: boolean;
}

export interface TrickplayOptionsCfg {
  enableHwAcceleration?: boolean | null;
  enableHwEncoding?: boolean | null;
}

export interface SystemCfg {
  enableMetrics?: boolean;
  pluginRepositories?: PluginRepositoryCfg[];
  trickplayOptions?: TrickplayOptionsCfg;
}

function fromJFRepos(
  inRepos: JFPluginRepo[] | undefined,
): PluginRepositoryCfg[] {
  if (!inRepos) return [];
  return inRepos.map(
    (r: JFPluginRepo): PluginRepositoryCfg => ({
      name: r.Name ?? "",
      url: r.Url ?? "",
      enabled: Boolean(r.Enabled),
    }),
  );
}

function toJFRepos(inRepos: PluginRepositoryCfg[]): JFPluginRepo[] {
  return inRepos.map(
    (r: PluginRepositoryCfg): JFPluginRepo => ({
      Name: r.name,
      Url: r.url,
      Enabled: r.enabled,
    }),
  );
}

function equalReposUnordered(
  a: PluginRepositoryCfg[],
  b: PluginRepositoryCfg[],
): boolean {
  if (a.length !== b.length) return false;

  const key: (r: PluginRepositoryCfg) => string = (
    r: PluginRepositoryCfg,
  ): string => `${r.name}::${r.url}`;

  const am: Map<string, PluginRepositoryCfg> = new Map(
    a.map((r: PluginRepositoryCfg): [string, PluginRepositoryCfg] => [
      key(r),
      r,
    ]),
  );

  for (const r of b) {
    const other: PluginRepositoryCfg | undefined = am.get(key(r));
    if (!other || other.enabled !== r.enabled) return false;
  }
  return true;
}

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
      next.EnableHwAcceleration = cfg.enableHwAcceleration ?? null;
    }
    if ("enableHwEncoding" in cfg) {
      next.EnableHwEncoding = cfg.enableHwEncoding ?? null;
    }

    out.TrickplayOptions = next;
  }

  return out;
}
