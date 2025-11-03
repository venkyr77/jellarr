import type { ServerConfigurationSchema } from "../types/schema/system";

export interface JF {
  getSystem(): Promise<ServerConfigurationSchema>;
  updateSystem(body: Partial<ServerConfigurationSchema>): Promise<void>;
}
