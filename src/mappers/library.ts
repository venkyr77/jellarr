import type { VirtualFolderConfig } from "../types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
} from "../types/schema/library";
import { withoutUndefined } from "../lib/objects";

export function mapVirtualFolderConfigToSchema(
  config: VirtualFolderConfig,
): Partial<VirtualFolderInfoSchema> {
  const opts: VirtualFolderConfig["libraryOptions"] = config.libraryOptions;

  const LibraryOptions: Partial<LibraryOptionsSchema> = {
    PathInfos: opts.pathInfos.map((pathInfo: { path: string }) => ({
      Path: pathInfo.path,
    })),
    ...(withoutUndefined({
      TypeOptions: opts.typeOptions,
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
      Enabled: opts.enabled,
      EnablePhotos: opts.enablePhotos,
      EnableLUFSScan: opts.enableLUFSScan,
      EnableAutomaticSeriesGrouping: opts.enableAutomaticSeriesGrouping,
      EnableEmbeddedTitles: opts.enableEmbeddedTitles,
      SkipSubtitlesIfEmbeddedSubtitlesPresent:
        opts.skipSubtitlesIfEmbeddedSubtitlesPresent,
      SkipSubtitlesIfAudioTrackMatches: opts.skipSubtitlesIfAudioTrackMatches,
      RequirePerfectSubtitleMatch: opts.requirePerfectSubtitleMatch,
      SaveSubtitlesWithMedia: opts.saveSubtitlesWithMedia,
      SaveLyricsWithMedia: opts.saveLyricsWithMedia,
      PreferNonstandardArtistsTag: opts.preferNonstandardArtistsTag,
      UseCustomTagDelimiters: opts.useCustomTagDelimiters,
      PreferredMetadataLanguage: opts.preferredMetadataLanguage,
      MetadataCountryCode: opts.metadataCountryCode,
      SeasonZeroDisplayName: opts.seasonZeroDisplayName,
      AllowEmbeddedSubtitles: opts.allowEmbeddedSubtitles,
      DisabledLocalMetadataReaders: opts.disabledLocalMetadataReaders,
      LocalMetadataReaderOrder: opts.localMetadataReaderOrder,
      DisabledSubtitleFetchers: opts.disabledSubtitleFetchers,
      SubtitleFetcherOrder: opts.subtitleFetcherOrder,
      DisabledMediaSegmentProviders: opts.disabledMediaSegmentProviders,
      MediaSegmentProviderOrder: opts.mediaSegmentProviderOrder,
      SubtitleDownloadLanguages: opts.subtitleDownloadLanguages,
      DisabledLyricFetchers: opts.disabledLyricFetchers,
      LyricFetcherOrder: opts.lyricFetcherOrder,
      CustomTagDelimiters: opts.customTagDelimiters,
      DelimiterWhitelist: opts.delimiterWhitelist,
    }) as Partial<LibraryOptionsSchema>),
  };

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
