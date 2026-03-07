import type {
  VirtualFolderConfig,
  LibraryOptionsConfig,
  TypeOptionsConfig,
} from "../types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
  TypeOptionsSchema,
} from "../types/schema/library";

function mapTypeOptionsConfigToSchema(
  typeOpts: TypeOptionsConfig[],
): TypeOptionsSchema[] {
  return typeOpts.map(
    (opt: TypeOptionsConfig): TypeOptionsSchema => ({
      Type: opt.type,
      ...(opt.metadataFetchers !== undefined && {
        MetadataFetchers: opt.metadataFetchers,
      }),
      ...(opt.metadataFetcherOrder !== undefined && {
        MetadataFetcherOrder: opt.metadataFetcherOrder,
      }),
      ...(opt.imageFetchers !== undefined && {
        ImageFetchers: opt.imageFetchers,
      }),
      ...(opt.imageFetcherOrder !== undefined && {
        ImageFetcherOrder: opt.imageFetcherOrder,
      }),
    }),
  );
}

export function mapLibraryOptionsConfigToSchema(
  opts: LibraryOptionsConfig,
): LibraryOptionsSchema {
  const out: LibraryOptionsSchema = {
    PathInfos: opts.pathInfos.map((p: { path: string }) => ({
      Path: p.path,
    })),
    SaveLyricsWithMedia: false,
    SaveTrickplayWithMedia: false,
    PreferNonstandardArtistsTag: false,
    UseCustomTagDelimiters: false,
  };

  if (opts.saveLocalMetadata !== undefined)
    out.SaveLocalMetadata = opts.saveLocalMetadata;
  if (opts.enableRealtimeMonitor !== undefined)
    out.EnableRealtimeMonitor = opts.enableRealtimeMonitor;
  if (opts.enableAutomaticSeriesGrouping !== undefined)
    out.EnableAutomaticSeriesGrouping = opts.enableAutomaticSeriesGrouping;
  if (opts.enableEmbeddedTitles !== undefined)
    out.EnableEmbeddedTitles = opts.enableEmbeddedTitles;
  if (opts.enableEmbeddedExtrasTitles !== undefined)
    out.EnableEmbeddedExtrasTitles = opts.enableEmbeddedExtrasTitles;
  if (opts.enableEmbeddedEpisodeInfos !== undefined)
    out.EnableEmbeddedEpisodeInfos = opts.enableEmbeddedEpisodeInfos;
  if (opts.preferredMetadataLanguage !== undefined)
    out.PreferredMetadataLanguage = opts.preferredMetadataLanguage;
  if (opts.metadataCountryCode !== undefined)
    out.MetadataCountryCode = opts.metadataCountryCode;
  if (opts.enableTrickplayImageExtraction !== undefined)
    out.EnableTrickplayImageExtraction = opts.enableTrickplayImageExtraction;
  if (opts.enableChapterImageExtraction !== undefined)
    out.EnableChapterImageExtraction = opts.enableChapterImageExtraction;
  if (opts.subtitleDownloadLanguages !== undefined)
    out.SubtitleDownloadLanguages = opts.subtitleDownloadLanguages;
  if (opts.skipSubtitlesIfEmbeddedSubtitlesPresent !== undefined)
    out.SkipSubtitlesIfEmbeddedSubtitlesPresent =
      opts.skipSubtitlesIfEmbeddedSubtitlesPresent;
  if (opts.skipSubtitlesIfAudioTrackMatches !== undefined)
    out.SkipSubtitlesIfAudioTrackMatches =
      opts.skipSubtitlesIfAudioTrackMatches;
  if (opts.metadataSavers !== undefined)
    out.MetadataSavers = opts.metadataSavers;
  if (opts.enableCrossLibrarySeriesMerging !== undefined)
    out.AutomaticallyAddToCollection = opts.enableCrossLibrarySeriesMerging;
  if (opts.typeOptions !== undefined)
    out.TypeOptions = mapTypeOptionsConfigToSchema(opts.typeOptions);

  return out;
}

export function mapVirtualFolderConfigToSchema(
  config: VirtualFolderConfig,
): Partial<VirtualFolderInfoSchema> {
  return {
    Name: config.name,
    CollectionType: config.collectionType,
    LibraryOptions: mapLibraryOptionsConfigToSchema(config.libraryOptions),
  };
}

export function mapVirtualFolderInfoSchemaToAddVirtualFolderDtoSchema(
  virtualFolderInfoSchema: VirtualFolderInfoSchema,
): { LibraryOptions: VirtualFolderInfoSchema["LibraryOptions"] } {
  return {
    LibraryOptions: virtualFolderInfoSchema.LibraryOptions,
  };
}
