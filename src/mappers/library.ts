import type { VirtualFolderConfig } from "../types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
} from "../types/schema/library";

export function mapVirtualFolderConfigToSchema(
  config: VirtualFolderConfig,
): Partial<VirtualFolderInfoSchema> {
  /**
   * Only PathInfos is required. Optional fields are added when defined so that
   * omitted config keys do not become explicit `undefined` properties, which
   * would otherwise produce spurious diffs against the current server state.
   */
  const LibraryOptions: Partial<LibraryOptionsSchema> = {
    PathInfos: config.libraryOptions.pathInfos.map(
      (pathInfo: { path: string }) => ({
        Path: pathInfo.path,
      }),
    ),
  };

  if (config.libraryOptions.typeOptions !== undefined) {
    LibraryOptions.TypeOptions = config.libraryOptions
      .typeOptions as LibraryOptionsSchema["TypeOptions"];
  }
  if (config.libraryOptions.automaticallyAddToCollection !== undefined) {
    LibraryOptions.AutomaticallyAddToCollection =
      config.libraryOptions.automaticallyAddToCollection;
  }
  if (config.libraryOptions.enableChapterImageExtraction !== undefined) {
    LibraryOptions.EnableChapterImageExtraction =
      config.libraryOptions.enableChapterImageExtraction;
  }
  if (
    config.libraryOptions.extractChapterImagesDuringLibraryScan !== undefined
  ) {
    LibraryOptions.ExtractChapterImagesDuringLibraryScan =
      config.libraryOptions.extractChapterImagesDuringLibraryScan;
  }
  if (
    config.libraryOptions.extractTrickplayImagesDuringLibraryScan !== undefined
  ) {
    LibraryOptions.ExtractTrickplayImagesDuringLibraryScan =
      config.libraryOptions.extractTrickplayImagesDuringLibraryScan;
  }
  if (config.libraryOptions.enableEmbeddedEpisodeInfos !== undefined) {
    LibraryOptions.EnableEmbeddedEpisodeInfos =
      config.libraryOptions.enableEmbeddedEpisodeInfos;
  }
  if (config.libraryOptions.enableEmbeddedExtraTitles !== undefined) {
    LibraryOptions.EnableEmbeddedExtrasTitles =
      config.libraryOptions.enableEmbeddedExtraTitles;
  }
  if (config.libraryOptions.enableTrickplayImageExtraction !== undefined) {
    LibraryOptions.EnableTrickplayImageExtraction =
      config.libraryOptions.enableTrickplayImageExtraction;
  }
  if (config.libraryOptions.saveTrickplayWithMedia !== undefined) {
    LibraryOptions.SaveTrickplayWithMedia =
      config.libraryOptions.saveTrickplayWithMedia;
  }
  if (config.libraryOptions.metadataSavers !== undefined) {
    LibraryOptions.MetadataSavers = config.libraryOptions.metadataSavers;
  }
  if (config.libraryOptions.saveLocalMetadata !== undefined) {
    LibraryOptions.SaveLocalMetadata = config.libraryOptions.saveLocalMetadata;
  }
  if (config.libraryOptions.automaticRefreshIntervalDays !== undefined) {
    LibraryOptions.AutomaticRefreshIntervalDays =
      config.libraryOptions.automaticRefreshIntervalDays;
  }
  if (config.libraryOptions.enableRealtimeMonitor !== undefined) {
    LibraryOptions.EnableRealtimeMonitor =
      config.libraryOptions.enableRealtimeMonitor;
  }

  return {
    Name: config.name,
    CollectionType: config.collectionType,
    LibraryOptions: LibraryOptions as LibraryOptionsSchema,
  };
}

export function mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema(
  virtualFolderInfoSchema: VirtualFolderInfoSchema,
): { LibraryOptions: VirtualFolderInfoSchema["LibraryOptions"] } {
  return {
    LibraryOptions: virtualFolderInfoSchema.LibraryOptions,
  };
}
