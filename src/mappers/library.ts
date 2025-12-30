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
      TypeOptions: config.libraryOptions.typeOptions,
      AutomaticallyAddToCollection:
        config.libraryOptions.automaticallyAddToCollection,
      EnableChapterImageExtraction:
        config.libraryOptions.enableChapterImageExtraction,
      ExtractChapterImagesDuringLibraryScan:
        config.libraryOptions.extractChapterImagesDuringLibraryScan,
      ExtractTrickplayImagesDuringLibraryScan:
        config.libraryOptions.extractTrickplayImagesDuringLibraryScan,
      EnableEmbeddedEpisodeInfos:
        config.libraryOptions.enableEmbeddedEpisodeInfos,
      EnableEmbeddedExtrasTitles:
        config.libraryOptions.enableEmbeddedExtraTitles,
      EnableTrickplayImageExtraction:
        config.libraryOptions.enableTrickplayImageExtraction,
      SaveTrickplayWithMedia: config.libraryOptions.saveTrickplayWithMedia,
      MetadataSavers: config.libraryOptions.metadataSavers,
      SaveLocalMetadata: config.libraryOptions.saveLocalMetadata,
      AutomaticRefreshIntervalDays:
        config.libraryOptions.automaticRefreshIntervalDays,
      EnableRealtimeMonitor: config.libraryOptions.enableRealtimeMonitor,
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
