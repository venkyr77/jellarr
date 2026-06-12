import {
  type SystemConfig,
  type TrickplayOptionsConfig,
  type PluginRepositoryConfig,
} from "../types/config/system";
import {
  type ServerConfigurationSchema,
  type TrickplayOptionsSchema,
  type PluginRepositorySchema,
} from "../types/schema/system";

export function toPluginRepositorySchemas(
  inRepos: PluginRepositoryConfig[],
): PluginRepositorySchema[] {
  return inRepos.map(
    (r: PluginRepositoryConfig): PluginRepositorySchema => ({
      Name: r.name,
      Url: r.url,
      Enabled: r.enabled,
    }),
  );
}

export function toTrickplayOptionsSchema(
  cfg: TrickplayOptionsConfig,
): TrickplayOptionsSchema {
  const out: TrickplayOptionsSchema = {};
  if (cfg.enableHwAcceleration !== undefined)
    out.EnableHwAcceleration = cfg.enableHwAcceleration;
  if (cfg.enableHwEncoding !== undefined)
    out.EnableHwEncoding = cfg.enableHwEncoding;
  if (cfg.processThreads !== undefined) out.ProcessThreads = cfg.processThreads;
  if (cfg.enableKeyFrameOnlyExtraction !== undefined)
    out.EnableKeyFrameOnlyExtraction = cfg.enableKeyFrameOnlyExtraction;
  if (cfg.scanBehavior !== undefined) out.ScanBehavior = cfg.scanBehavior;
  if (cfg.processPriority !== undefined)
    out.ProcessPriority = cfg.processPriority;
  if (cfg.interval !== undefined) out.Interval = cfg.interval;
  if (cfg.widthResolutions !== undefined)
    out.WidthResolutions = cfg.widthResolutions;
  if (cfg.tileWidth !== undefined) out.TileWidth = cfg.tileWidth;
  if (cfg.tileHeight !== undefined) out.TileHeight = cfg.tileHeight;
  if (cfg.qscale !== undefined) out.Qscale = cfg.qscale;
  if (cfg.jpegQuality !== undefined) out.JpegQuality = cfg.jpegQuality;
  return out;
}

export function mapSystemConfigurationConfigToSchema(
  desired: SystemConfig,
): Partial<ServerConfigurationSchema> {
  const out: Partial<ServerConfigurationSchema> = {};

  if (desired.serverName !== undefined) {
    out.ServerName = desired.serverName;
  }

  if (desired.enableMetrics !== undefined) {
    out.EnableMetrics = desired.enableMetrics;
  }

  if (desired.pluginRepositories !== undefined) {
    out.PluginRepositories = toPluginRepositorySchemas(
      desired.pluginRepositories,
    );
  }

  if (desired.trickplayOptions !== undefined) {
    out.TrickplayOptions = toTrickplayOptionsSchema(desired.trickplayOptions);
  }

  if (desired.imageSavingConvention !== undefined)
    out.ImageSavingConvention = desired.imageSavingConvention;
  if (desired.chapterImageResolution !== undefined)
    out.ChapterImageResolution = desired.chapterImageResolution;
  if (desired.sortReplaceCharacters !== undefined)
    out.SortReplaceCharacters = desired.sortReplaceCharacters;
  if (desired.sortRemoveCharacters !== undefined)
    out.SortRemoveCharacters = desired.sortRemoveCharacters;
  if (desired.sortRemoveWords !== undefined)
    out.SortRemoveWords = desired.sortRemoveWords;
  if (desired.codecsUsed !== undefined) out.CodecsUsed = desired.codecsUsed;
  if (desired.corsHosts !== undefined) out.CorsHosts = desired.corsHosts;
  if (desired.cachePath !== undefined) out.CachePath = desired.cachePath;
  if (desired.metadataPath !== undefined)
    out.MetadataPath = desired.metadataPath;
  if (desired.preferredMetadataLanguage !== undefined)
    out.PreferredMetadataLanguage = desired.preferredMetadataLanguage;
  if (desired.metadataCountryCode !== undefined)
    out.MetadataCountryCode = desired.metadataCountryCode;
  if (desired.uiCulture !== undefined) out.UICulture = desired.uiCulture;
  if (desired.logFileRetentionDays !== undefined)
    out.LogFileRetentionDays = desired.logFileRetentionDays;
  if (desired.minResumePct !== undefined)
    out.MinResumePct = desired.minResumePct;
  if (desired.maxResumePct !== undefined)
    out.MaxResumePct = desired.maxResumePct;
  if (desired.minResumeDurationSeconds !== undefined)
    out.MinResumeDurationSeconds = desired.minResumeDurationSeconds;
  if (desired.minAudiobookResume !== undefined)
    out.MinAudiobookResume = desired.minAudiobookResume;
  if (desired.maxAudiobookResume !== undefined)
    out.MaxAudiobookResume = desired.maxAudiobookResume;
  if (desired.inactiveSessionThreshold !== undefined)
    out.InactiveSessionThreshold = desired.inactiveSessionThreshold;
  if (desired.libraryMonitorDelay !== undefined)
    out.LibraryMonitorDelay = desired.libraryMonitorDelay;
  if (desired.libraryUpdateDuration !== undefined)
    out.LibraryUpdateDuration = desired.libraryUpdateDuration;
  if (desired.cacheSize !== undefined) out.CacheSize = desired.cacheSize;
  if (desired.remoteClientBitrateLimit !== undefined)
    out.RemoteClientBitrateLimit = desired.remoteClientBitrateLimit;
  if (desired.imageExtractionTimeoutMs !== undefined)
    out.ImageExtractionTimeoutMs = desired.imageExtractionTimeoutMs;
  if (desired.slowResponseThresholdMs !== undefined)
    out.SlowResponseThresholdMs = desired.slowResponseThresholdMs;
  if (desired.activityLogRetentionDays !== undefined)
    out.ActivityLogRetentionDays = desired.activityLogRetentionDays;
  if (desired.libraryScanFanoutConcurrency !== undefined)
    out.LibraryScanFanoutConcurrency = desired.libraryScanFanoutConcurrency;
  if (desired.libraryMetadataRefreshConcurrency !== undefined)
    out.LibraryMetadataRefreshConcurrency =
      desired.libraryMetadataRefreshConcurrency;
  if (desired.dummyChapterDuration !== undefined)
    out.DummyChapterDuration = desired.dummyChapterDuration;
  if (desired.parallelImageEncodingLimit !== undefined)
    out.ParallelImageEncodingLimit = desired.parallelImageEncodingLimit;
  if (desired.isStartupWizardCompleted !== undefined)
    out.IsStartupWizardCompleted = desired.isStartupWizardCompleted;
  if (desired.enableNormalizedItemByNameIds !== undefined)
    out.EnableNormalizedItemByNameIds = desired.enableNormalizedItemByNameIds;
  if (desired.isPortAuthorized !== undefined)
    out.IsPortAuthorized = desired.isPortAuthorized;
  if (desired.quickConnectAvailable !== undefined)
    out.QuickConnectAvailable = desired.quickConnectAvailable;
  if (desired.enableCaseSensitiveItemIds !== undefined)
    out.EnableCaseSensitiveItemIds = desired.enableCaseSensitiveItemIds;
  if (desired.disableLiveTvChannelUserDataName !== undefined)
    out.DisableLiveTvChannelUserDataName =
      desired.disableLiveTvChannelUserDataName;
  if (desired.skipDeserializationForBasicTypes !== undefined)
    out.SkipDeserializationForBasicTypes =
      desired.skipDeserializationForBasicTypes;
  if (desired.saveMetadataHidden !== undefined)
    out.SaveMetadataHidden = desired.saveMetadataHidden;
  if (desired.enableFolderView !== undefined)
    out.EnableFolderView = desired.enableFolderView;
  if (desired.enableGroupingMoviesIntoCollections !== undefined)
    out.EnableGroupingMoviesIntoCollections =
      desired.enableGroupingMoviesIntoCollections;
  if (desired.enableGroupingShowsIntoCollections !== undefined)
    out.EnableGroupingShowsIntoCollections =
      desired.enableGroupingShowsIntoCollections;
  if (desired.displaySpecialsWithinSeasons !== undefined)
    out.DisplaySpecialsWithinSeasons = desired.displaySpecialsWithinSeasons;
  if (desired.enableExternalContentInSuggestions !== undefined)
    out.EnableExternalContentInSuggestions =
      desired.enableExternalContentInSuggestions;
  if (desired.enableSlowResponseWarning !== undefined)
    out.EnableSlowResponseWarning = desired.enableSlowResponseWarning;
  if (desired.allowClientLogUpload !== undefined)
    out.AllowClientLogUpload = desired.allowClientLogUpload;
  if (desired.enableLegacyAuthorization !== undefined)
    out.EnableLegacyAuthorization = desired.enableLegacyAuthorization;

  return out;
}
