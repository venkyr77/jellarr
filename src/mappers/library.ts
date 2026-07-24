import type { VirtualFolderConfig } from "../types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
} from "../types/schema/library";

/**
 * Drop keys whose value is `undefined`. The library diff runs against the live
 * server config, so an omitted option must be absent rather than an explicit
 * `undefined`, which json-diff-ts would otherwise report as a spurious change.
 */
function withoutUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]: [string, unknown]) => value !== undefined,
    ),
  ) as Partial<T>;
}

export function mapVirtualFolderConfigToSchema(
  config: VirtualFolderConfig,
): Partial<VirtualFolderInfoSchema> {
  const opts: VirtualFolderConfig["libraryOptions"] = config.libraryOptions;

  const libraryOptions: Partial<LibraryOptionsSchema> = withoutUndefined({
    PathInfos: opts.pathInfos.map((pathInfo: { path: string }) => ({
      Path: pathInfo.path,
    })),
    TypeOptions: opts.typeOptions as LibraryOptionsSchema["TypeOptions"],
    AutomaticallyAddToCollection: opts.automaticallyAddToCollection,
    EnableChapterImageExtraction: opts.enableChapterImageExtraction,
    ExtractChapterImagesDuringLibraryScan:
      opts.extractChapterImagesDuringLibraryScan,
    ExtractTrickplayImagesDuringLibraryScan:
      opts.extractTrickplayImagesDuringLibraryScan,
    EnableEmbeddedEpisodeInfos: opts.enableEmbeddedEpisodeInfos,
    EnableEmbeddedExtrasTitles: opts.enableEmbeddedExtraTitles,
    EnableTrickplayImageExtraction: opts.enableTrickplayImageExtraction,
    SaveTrickplayWithMedia: opts.saveTrickplayWithMedia,
    MetadataSavers: opts.metadataSavers,
    SaveLocalMetadata: opts.saveLocalMetadata,
    AutomaticRefreshIntervalDays: opts.automaticRefreshIntervalDays,
    EnableRealtimeMonitor: opts.enableRealtimeMonitor,
  });

  return {
    Name: config.name,
    CollectionType: config.collectionType,
    LibraryOptions: libraryOptions as LibraryOptionsSchema,
  };
}

export function mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema(
  virtualFolderInfoSchema: VirtualFolderInfoSchema,
): { LibraryOptions: VirtualFolderInfoSchema["LibraryOptions"] } {
  return {
    LibraryOptions: virtualFolderInfoSchema.LibraryOptions,
  };
}
