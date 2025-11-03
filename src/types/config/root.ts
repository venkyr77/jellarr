import { type SystemConfig } from "./system";

export interface RootConfig {
  version: number;
  base_url: string;
  system: SystemConfig;
}
