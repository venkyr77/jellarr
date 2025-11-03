export interface PluginRepositoryConfig {
  name: string;
  url: string;
  enabled: boolean;
}

export interface TrickplayOptionsConfig {
  enableHwAcceleration?: boolean;
  enableHwEncoding?: boolean;
}

export interface SystemConfig {
  enableMetrics?: boolean;
  pluginRepositories?: PluginRepositoryConfig[];
  trickplayOptions?: TrickplayOptionsConfig;
}
