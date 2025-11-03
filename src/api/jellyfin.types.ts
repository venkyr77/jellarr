import type { ServerConfigurationSchema } from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding";

export interface JellyfinClient {
  getSystemConfiguration(): Promise<ServerConfigurationSchema>;
  updateSystemConfiguration(
    body: Partial<ServerConfigurationSchema>,
  ): Promise<void>;
  getEncodingConfiguration(): Promise<EncodingOptionsSchema>;
  updateEncodingConfiguration(
    body: Partial<EncodingOptionsSchema>,
  ): Promise<void>;
}
