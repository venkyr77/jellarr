import type { components } from "../../../generated/schema";

export type ServerConfiguration = components["schemas"]["ServerConfiguration"];

export type JFPluginRepo = NonNullable<
  ServerConfiguration["PluginRepositories"]
>[number];

export type JFTrickplay = NonNullable<ServerConfiguration["TrickplayOptions"]>;

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

export interface RootConfig {
  version: number;
  base_url: string;
  system: SystemCfg;
}
