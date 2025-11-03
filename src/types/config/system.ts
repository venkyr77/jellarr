export interface PluginRepositoryConfig {
  name: string;
  url: string;
  enabled: boolean;
}

export interface TrickplayOptionsConfig {
  enableHwAcceleration?: boolean | null;
  enableHwEncoding?: boolean | null;
}

export interface SystemConfig {
  enableMetrics?: boolean;
  pluginRepositories?: PluginRepositoryConfig[];
  trickplayOptions?: TrickplayOptionsConfig;
}
