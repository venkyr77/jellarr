import type { components } from "../../../generated/schema";

export type PluginInfoSchema = components["schemas"]["PluginInfo"];
export type PackageInfoSchema = components["schemas"]["PackageInfo"];
export type BasePluginConfigurationSchema =
  components["schemas"]["BasePluginConfiguration"];
export interface PluginConfigurationSchema {
  id: string;
  configuration: BasePluginConfigurationSchema;
}
