import { PluginRepositoryConfig } from "../types/config/system";
import { PluginRepositorySchema } from "../types/schema/system";

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

export function arePluginRepositoryConfigsEqual(
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
