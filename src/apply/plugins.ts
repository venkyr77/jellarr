import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import type {
  PluginConfig,
  PluginConfigList,
  PluginConfigurationConfig,
} from "../types/config/plugins";
import type {
  PluginInfoSchema,
  BasePluginConfigurationSchema,
  PluginConfigurationSchema,
} from "../types/schema/plugins";
import { ChangeSetBuilder } from "../lib/changeset";
import { applyChangeset, diff, type IChange } from "json-diff-ts";

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

export async function getPluginConfigurationSchemaByName(
  client: JellyfinClient,
  current: PluginInfoSchema[],
): Promise<Map<string, PluginConfigurationSchema>> {
  const pluginConfigurationSchemaByName: Map<
    string,
    PluginConfigurationSchema
  > = new Map();

  for (const pluginInfo of current) {
    if (pluginInfo.Id && pluginInfo.Name) {
      pluginConfigurationSchemaByName.set(pluginInfo.Name, {
        id: pluginInfo.Id,
        configuration: await client.getPluginConfiguration(pluginInfo.Id),
      });
    }
  }

  return pluginConfigurationSchemaByName;
}

export function calculatePluginConfigurationDiff(
  current: BasePluginConfigurationSchema,
  desired: PluginConfigurationConfig,
): BasePluginConfigurationSchema | undefined {
  const patch: IChange[] = new ChangeSetBuilder(
    diff(current, desired as BasePluginConfigurationSchema),
  )
    .atomize()
    .withoutRemoves()
    .unatomize()
    .toArray();

  if (patch.length > 0) {
    return applyChangeset(current, patch) as BasePluginConfigurationSchema;
  }

  return undefined;
}

export function calculatePluginConfigurationsDiff(
  currentPluginConfigurationsByName: Map<string, PluginConfigurationSchema>,
  desired: PluginConfigList,
): Map<string, BasePluginConfigurationSchema> | undefined {
  if (desired.length === 0) return undefined;

  const pluginConfigurationsToUpdate: Map<
    string,
    BasePluginConfigurationSchema
  > = new Map();

  desired.forEach((desiredPluginConfiguration: PluginConfig) => {
    if (desiredPluginConfiguration.configuration) {
      const currentPluginConfiguration: PluginConfigurationSchema | undefined =
        currentPluginConfigurationsByName.get(desiredPluginConfiguration.name);

      if (currentPluginConfiguration) {
        const configurationDiff: BasePluginConfigurationSchema | undefined =
          calculatePluginConfigurationDiff(
            currentPluginConfiguration.configuration,
            desiredPluginConfiguration.configuration,
          );

        if (configurationDiff) {
          logger.info(
            `Updating plugin configuration: ${desiredPluginConfiguration.name}`,
          );
          pluginConfigurationsToUpdate.set(
            currentPluginConfiguration.id,
            configurationDiff,
          );
        }
      }
    }
  });

  return pluginConfigurationsToUpdate.size > 0
    ? pluginConfigurationsToUpdate
    : undefined;
}

export async function applyPluginConfigurations(
  client: JellyfinClient,
  configurations: Map<string, BasePluginConfigurationSchema> | undefined,
): Promise<void> {
  if (!configurations) return;

  for (const [pluginId, config] of configurations) {
    await client.updatePluginConfiguration(pluginId, config);
  }
}
