import type { VirtualFolderConfig } from "../types/config/library";
import type {
  AddVirtualFolderDtoSchema,
  LibraryOptionsSchema,
  MediaPathInfoSchema,
} from "../types/schema/library";

export function mapVirtualFolderConfigToAddVirtualFolderDto(
  desired: VirtualFolderConfig,
): AddVirtualFolderDtoSchema {
  const libraryOptions: LibraryOptionsSchema = {
    PathInfos: desired.libraryOptions.pathInfos.map(
      (pathInfo): MediaPathInfoSchema => ({
        Path: pathInfo.path,
      }),
    ),
  } as LibraryOptionsSchema;

  return {
    LibraryOptions: libraryOptions,
  };
}
