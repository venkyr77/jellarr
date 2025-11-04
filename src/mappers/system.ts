import { type SystemConfig } from "../types/config/system";
import { type TrickplayOptionsConfig } from "../types/config/trickplay-options";
import { type PluginRepositoryConfig } from "../types/config/plugin-repository";
import {
  type ServerConfigurationSchema,
  type TrickplayOptionsSchema,
  type PluginRepositorySchema,
} from "../types/schema/system";

export function fromPluginRepositorySchemas(
  inRepos: PluginRepositorySchema[] | undefined,
): PluginRepositoryConfig[] {
  if (!inRepos) return [];
  return inRepos.map(
    (r: PluginRepositorySchema): PluginRepositoryConfig => ({
      name: r.Name ?? "",
      url: r.Url ?? "",
      enabled: Boolean(r.Enabled),
    }),
  );
}

export function toPluginRepositorySchemas(
  inRepos: PluginRepositoryConfig[],
): PluginRepositorySchema[] {
  return inRepos.map(
    (r: PluginRepositoryConfig): PluginRepositorySchema => ({
      Name: r.name,
      Url: r.url,
      Enabled: r.enabled,
    }),
  );
}

export function mapSystemConfigurationConfigToSchema(
  desired: SystemConfig,
): Partial<ServerConfigurationSchema> {
  const out: Partial<ServerConfigurationSchema> = {};

  if (typeof desired.enableMetrics !== "undefined") {
    out.EnableMetrics = desired.enableMetrics;
  }

  if (typeof desired.pluginRepositories !== "undefined") {
    out.PluginRepositories = toPluginRepositorySchemas(
      desired.pluginRepositories,
    );
  }

  if (typeof desired.trickplayOptions !== "undefined") {
    const cfg: TrickplayOptionsConfig = desired.trickplayOptions;
    const next: TrickplayOptionsSchema = {};

    if ("enableHwAcceleration" in cfg) {
      next.EnableHwAcceleration = cfg.enableHwAcceleration;
    }

    if ("enableHwEncoding" in cfg) {
      next.EnableHwEncoding = cfg.enableHwEncoding;
    }

    out.TrickplayOptions = next;
  }

  return out;
}
