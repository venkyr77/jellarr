import type { VirtualFolderConfig } from "../types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
} from "../types/schema/library";

export function mapVirtualFolderConfigToSchema(
  config: VirtualFolderConfig,
): Partial<VirtualFolderInfoSchema> {
  return {
    Name: config.name,
    CollectionType: config.collectionType,
    LibraryOptions: {
      PathInfos: config.libraryOptions.pathInfos.map(
        (pathInfo: { path: string }) => ({
          Path: pathInfo.path,
        }),
      ),
    } as LibraryOptionsSchema,
  };
}

export function mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema(
  virtualFolderInfoSchema: VirtualFolderInfoSchema,
): { LibraryOptions: VirtualFolderInfoSchema["LibraryOptions"] } {
  return {
    LibraryOptions: virtualFolderInfoSchema.LibraryOptions,
  };
}
