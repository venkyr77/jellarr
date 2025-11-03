import type { ServerConfigurationSchema } from "../types/schema/system";
import type { EncodingConfigurationSchema } from "../types/schema/encoding";

export interface JellyfinClient {
  getSystemConfiguration(): Promise<ServerConfigurationSchema>;
  updateSystemConfiguration(
    body: Partial<ServerConfigurationSchema>,
  ): Promise<void>;
  getEncodingConfiguration(): Promise<EncodingConfigurationSchema>;
  updateEncodingConfiguration(
    body: Partial<EncodingConfigurationSchema>,
  ): Promise<void>;
}
