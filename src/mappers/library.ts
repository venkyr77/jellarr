import type { VirtualFolderConfig } from "../types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
} from "../types/schema/library";

export function mapVirtualFolderConfigToSchema(
  config: VirtualFolderConfig,
): Partial<VirtualFolderInfoSchema> {
  const opts: VirtualFolderConfig["libraryOptions"] = config.libraryOptions;

  const LibraryOptions: Partial<LibraryOptionsSchema> = {
    PathInfos: opts.pathInfos.map((pathInfo: { path: string }) => ({
      Path: pathInfo.path,
    })),
  };

  if (opts.typeOptions !== undefined) {
    LibraryOptions.TypeOptions = opts.typeOptions;
  }
  if (opts.automaticallyAddToCollection !== undefined) {
    LibraryOptions.AutomaticallyAddToCollection =
      opts.automaticallyAddToCollection;
  }
  if (opts.enableChapterImageExtraction !== undefined) {
    LibraryOptions.EnableChapterImageExtraction =
      opts.enableChapterImageExtraction;
  }
  if (opts.extractChapterImagesDuringLibraryScan !== undefined) {
    LibraryOptions.ExtractChapterImagesDuringLibraryScan =
      opts.extractChapterImagesDuringLibraryScan;
  }
  if (opts.extractTrickplayImagesDuringLibraryScan !== undefined) {
    LibraryOptions.ExtractTrickplayImagesDuringLibraryScan =
      opts.extractTrickplayImagesDuringLibraryScan;
  }
  if (opts.enableEmbeddedEpisodeInfos !== undefined) {
    LibraryOptions.EnableEmbeddedEpisodeInfos = opts.enableEmbeddedEpisodeInfos;
  }
  if (opts.enableEmbeddedExtraTitles !== undefined) {
    LibraryOptions.EnableEmbeddedExtrasTitles = opts.enableEmbeddedExtraTitles;
  }
  if (opts.enableTrickplayImageExtraction !== undefined) {
    LibraryOptions.EnableTrickplayImageExtraction =
      opts.enableTrickplayImageExtraction;
  }
  if (opts.saveTrickplayWithMedia !== undefined) {
    LibraryOptions.SaveTrickplayWithMedia = opts.saveTrickplayWithMedia;
  }
  if (opts.metadataSavers !== undefined) {
    LibraryOptions.MetadataSavers = opts.metadataSavers;
  }
  if (opts.saveLocalMetadata !== undefined) {
    LibraryOptions.SaveLocalMetadata = opts.saveLocalMetadata;
  }
  if (opts.automaticRefreshIntervalDays !== undefined) {
    LibraryOptions.AutomaticRefreshIntervalDays =
      opts.automaticRefreshIntervalDays;
  }
  if (opts.enableRealtimeMonitor !== undefined) {
    LibraryOptions.EnableRealtimeMonitor = opts.enableRealtimeMonitor;
  }
  if (opts.enabled !== undefined) {
    LibraryOptions.Enabled = opts.enabled;
  }
  if (opts.enablePhotos !== undefined) {
    LibraryOptions.EnablePhotos = opts.enablePhotos;
  }
  if (opts.enableLUFSScan !== undefined) {
    LibraryOptions.EnableLUFSScan = opts.enableLUFSScan;
  }
  if (opts.enableAutomaticSeriesGrouping !== undefined) {
    LibraryOptions.EnableAutomaticSeriesGrouping =
      opts.enableAutomaticSeriesGrouping;
  }
  if (opts.enableEmbeddedTitles !== undefined) {
    LibraryOptions.EnableEmbeddedTitles = opts.enableEmbeddedTitles;
  }
  if (opts.skipSubtitlesIfEmbeddedSubtitlesPresent !== undefined) {
    LibraryOptions.SkipSubtitlesIfEmbeddedSubtitlesPresent =
      opts.skipSubtitlesIfEmbeddedSubtitlesPresent;
  }
  if (opts.skipSubtitlesIfAudioTrackMatches !== undefined) {
    LibraryOptions.SkipSubtitlesIfAudioTrackMatches =
      opts.skipSubtitlesIfAudioTrackMatches;
  }
  if (opts.requirePerfectSubtitleMatch !== undefined) {
    LibraryOptions.RequirePerfectSubtitleMatch =
      opts.requirePerfectSubtitleMatch;
  }
  if (opts.saveSubtitlesWithMedia !== undefined) {
    LibraryOptions.SaveSubtitlesWithMedia = opts.saveSubtitlesWithMedia;
  }
  if (opts.saveLyricsWithMedia !== undefined) {
    LibraryOptions.SaveLyricsWithMedia = opts.saveLyricsWithMedia;
  }
  if (opts.preferNonstandardArtistsTag !== undefined) {
    LibraryOptions.PreferNonstandardArtistsTag =
      opts.preferNonstandardArtistsTag;
  }
  if (opts.useCustomTagDelimiters !== undefined) {
    LibraryOptions.UseCustomTagDelimiters = opts.useCustomTagDelimiters;
  }
  if (opts.preferredMetadataLanguage !== undefined) {
    LibraryOptions.PreferredMetadataLanguage = opts.preferredMetadataLanguage;
  }
  if (opts.metadataCountryCode !== undefined) {
    LibraryOptions.MetadataCountryCode = opts.metadataCountryCode;
  }
  if (opts.seasonZeroDisplayName !== undefined) {
    LibraryOptions.SeasonZeroDisplayName = opts.seasonZeroDisplayName;
  }
  if (opts.allowEmbeddedSubtitles !== undefined) {
    LibraryOptions.AllowEmbeddedSubtitles = opts.allowEmbeddedSubtitles;
  }
  if (opts.disabledLocalMetadataReaders !== undefined) {
    LibraryOptions.DisabledLocalMetadataReaders =
      opts.disabledLocalMetadataReaders;
  }
  if (opts.localMetadataReaderOrder !== undefined) {
    LibraryOptions.LocalMetadataReaderOrder = opts.localMetadataReaderOrder;
  }
  if (opts.disabledSubtitleFetchers !== undefined) {
    LibraryOptions.DisabledSubtitleFetchers = opts.disabledSubtitleFetchers;
  }
  if (opts.subtitleFetcherOrder !== undefined) {
    LibraryOptions.SubtitleFetcherOrder = opts.subtitleFetcherOrder;
  }
  if (opts.disabledMediaSegmentProviders !== undefined) {
    LibraryOptions.DisabledMediaSegmentProviders =
      opts.disabledMediaSegmentProviders;
  }
  if (opts.mediaSegmentProviderOrder !== undefined) {
    LibraryOptions.MediaSegmentProviderOrder = opts.mediaSegmentProviderOrder;
  }
  if (opts.subtitleDownloadLanguages !== undefined) {
    LibraryOptions.SubtitleDownloadLanguages = opts.subtitleDownloadLanguages;
  }
  if (opts.disabledLyricFetchers !== undefined) {
    LibraryOptions.DisabledLyricFetchers = opts.disabledLyricFetchers;
  }
  if (opts.lyricFetcherOrder !== undefined) {
    LibraryOptions.LyricFetcherOrder = opts.lyricFetcherOrder;
  }
  if (opts.customTagDelimiters !== undefined) {
    LibraryOptions.CustomTagDelimiters = opts.customTagDelimiters;
  }
  if (opts.delimiterWhitelist !== undefined) {
    LibraryOptions.DelimiterWhitelist = opts.delimiterWhitelist;
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
