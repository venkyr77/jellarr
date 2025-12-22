import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import type { PluginConfig, PluginConfigList } from "../types/config/plugins";
import type { PluginInfoSchema } from "../types/schema/plugins";

export function calculatePluginsToInstall(
  installedPlugins: PluginInfoSchema[],
  desired: PluginConfigList,
): PluginConfig[] | undefined {
  if (desired.length === 0) return undefined;

  const pluginsToInstall: PluginConfig[] = desired.filter(
    (desiredPlugin: PluginConfig) =>
      !installedPlugins.find(
        (plugin: PluginInfoSchema) => plugin.Name === desiredPlugin.name,
      ),
  );

  pluginsToInstall.forEach((plugin: PluginConfig) => {
    logger.info(`Installing plugin: ${plugin.name}`);
  });

  return pluginsToInstall.length > 0 ? pluginsToInstall : undefined;
}

export async function installPlugins(
  client: JellyfinClient,
  plugins: PluginConfig[] | undefined,
): Promise<void> {
  if (!plugins) return;

  for (const plugin of plugins) {
    await client.installPackage(plugin.name);
  }
}
