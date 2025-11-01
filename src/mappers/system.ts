import type { JFPluginRepo, PluginRepositoryCfg } from "../domain/system/types";

export function fromJFRepos(
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

export function toJFRepos(inRepos: PluginRepositoryCfg[]): JFPluginRepo[] {
  return inRepos.map(
    (r: PluginRepositoryCfg): JFPluginRepo => ({
      Name: r.name,
      Url: r.url,
      Enabled: r.enabled,
    }),
  );
}

export function equalReposUnordered(
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
