import type { components } from "../../../generated/schema";

export type ServerConfigurationSchema =
  components["schemas"]["ServerConfiguration"];

export type PluginRepositorySchema = NonNullable<
  ServerConfigurationSchema["PluginRepositories"]
>[number];

export type TrickplayOptionsSchema = NonNullable<
  ServerConfigurationSchema["TrickplayOptions"]
>;
