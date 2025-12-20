import {
  type SystemConfig,
  type TrickplayOptionsConfig,
  type PluginRepositoryConfig,
} from "../types/config/system";
import {
  type ServerConfigurationSchema,
  type TrickplayOptionsSchema,
  type PluginRepositorySchema,
} from "../types/schema/system";

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

export function toTrickplayOptionsSchema(
  cfg: TrickplayOptionsConfig,
): TrickplayOptionsSchema {
  const out: TrickplayOptionsSchema = {};
  out.EnableHwAcceleration = cfg.enableHwAcceleration;
  out.EnableHwEncoding = cfg.enableHwEncoding;
  return out;
}

export function mapSystemConfigurationConfigToSchema(
  desired: SystemConfig,
): Partial<ServerConfigurationSchema> {
  const out: Partial<ServerConfigurationSchema> = {};

  if (desired.enableMetrics !== undefined) {
    out.EnableMetrics = desired.enableMetrics;
  }

  if (desired.pluginRepositories !== undefined) {
    out.PluginRepositories = toPluginRepositorySchemas(
      desired.pluginRepositories,
    );
  }

  if (desired.trickplayOptions !== undefined) {
    out.TrickplayOptions = toTrickplayOptionsSchema(desired.trickplayOptions);
  }

  return out;
}
