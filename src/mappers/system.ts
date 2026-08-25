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
  if (cfg.processThreads !== undefined)
    out.ProcessThreads = cfg.processThreads;
  return out;
}

export function mapSystemConfigurationConfigToSchema(
  desired: SystemConfig,
): Partial<ServerConfigurationSchema> {
  const out: Partial<ServerConfigurationSchema> = {};

  if (desired.serverName !== undefined) out.ServerName = desired.serverName;
  if (desired.preferredMetadataLanguage !== undefined)
    out.PreferredMetadataLanguage = desired.preferredMetadataLanguage;
  if (desired.metadataCountryCode !== undefined)
    out.MetadataCountryCode = desired.metadataCountryCode;
  if (desired.uiCulture !== undefined) out.UICulture = desired.uiCulture;
  if (desired.quickConnectAvailable !== undefined)
    out.QuickConnectAvailable = desired.quickConnectAvailable;
  if (desired.enableMetrics !== undefined)
    out.EnableMetrics = desired.enableMetrics;
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
  if (desired.activityLogRetentionDays !== undefined)
    out.ActivityLogRetentionDays = desired.activityLogRetentionDays;
  if (desired.logFileRetentionDays !== undefined)
    out.LogFileRetentionDays = desired.logFileRetentionDays;
  if (desired.libraryMonitorDelay !== undefined)
    out.LibraryMonitorDelay = desired.libraryMonitorDelay;
  if (desired.libraryUpdateDuration !== undefined)
    out.LibraryUpdateDuration = desired.libraryUpdateDuration;
  if (desired.libraryScanFanoutConcurrency !== undefined)
    out.LibraryScanFanoutConcurrency = desired.libraryScanFanoutConcurrency;
  if (desired.libraryMetadataRefreshConcurrency !== undefined)
    out.LibraryMetadataRefreshConcurrency =
      desired.libraryMetadataRefreshConcurrency;
  if (desired.remoteClientBitrateLimit !== undefined)
    out.RemoteClientBitrateLimit = desired.remoteClientBitrateLimit;
  if (desired.minResumePct !== undefined)
    out.MinResumePct = desired.minResumePct;
  if (desired.maxResumePct !== undefined)
    out.MaxResumePct = desired.maxResumePct;
  if (desired.minResumeDurationSeconds !== undefined)
    out.MinResumeDurationSeconds = desired.minResumeDurationSeconds;
  if (desired.sortReplaceCharacters !== undefined)
    out.SortReplaceCharacters = desired.sortReplaceCharacters;
  if (desired.sortRemoveCharacters !== undefined)
    out.SortRemoveCharacters = desired.sortRemoveCharacters;
  if (desired.sortRemoveWords !== undefined)
    out.SortRemoveWords = desired.sortRemoveWords;

  if (desired.pluginRepositories !== undefined) {
    out.PluginRepositories = toPluginRepositorySchemas(
      desired.pluginRepositories,
    );
  }

  if (desired.trickplayOptions !== undefined) {
    out.TrickplayOptions = toTrickplayOptionsSchema(desired.trickplayOptions);
  }

  return out;
}
