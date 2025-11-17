import type { ServerConfigurationSchema } from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding-options";
import type {
  VirtualFolderInfoSchema,
  AddVirtualFolderDtoSchema,
  CollectionTypeSchema,
} from "../types/schema/library";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";

export interface JellyfinClient {
  getSystemConfiguration(): Promise<ServerConfigurationSchema>;
  updateSystemConfiguration(
    body: Partial<ServerConfigurationSchema>,
  ): Promise<void>;
  getEncodingConfiguration(): Promise<EncodingOptionsSchema>;
  updateEncodingConfiguration(
    body: Partial<EncodingOptionsSchema>,
  ): Promise<void>;
  getVirtualFolders(): Promise<VirtualFolderInfoSchema[]>;
  addVirtualFolder(
    name: string,
    collectionType: CollectionTypeSchema | undefined,
    body: AddVirtualFolderDtoSchema,
  ): Promise<void>;
  getBrandingConfiguration(): Promise<BrandingOptionsDtoSchema>;
  updateBrandingConfiguration(
    body: Partial<BrandingOptionsDtoSchema>,
  ): Promise<void>;
}
