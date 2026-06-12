import { z } from "zod";

export const PluginRepositoryConfigType: z.ZodObject<{
  name: z.ZodString;
  url: z.ZodURL;
  enabled: z.ZodBoolean;
}> = z.object({
  name: z.string().min(1, "Plugin repository name cannot be empty"),
  url: z.url({ message: "Plugin repository URL must be a valid URL" }),
  enabled: z.boolean(),
});

export type PluginRepositoryConfig = z.infer<typeof PluginRepositoryConfigType>;

export const TrickplayOptionsConfigType: z.ZodObject<{
  enableHwAcceleration: z.ZodOptional<z.ZodBoolean>;
  enableHwEncoding: z.ZodOptional<z.ZodBoolean>;
  processThreads: z.ZodOptional<z.ZodNumber>;
  enableKeyFrameOnlyExtraction: z.ZodOptional<z.ZodBoolean>;
  scanBehavior: z.ZodOptional<
    z.ZodEnum<{
      Blocking: "Blocking";
      NonBlocking: "NonBlocking";
    }>
  >;
  processPriority: z.ZodOptional<
    z.ZodEnum<{
      Normal: "Normal";
      Idle: "Idle";
      High: "High";
      RealTime: "RealTime";
      BelowNormal: "BelowNormal";
      AboveNormal: "AboveNormal";
    }>
  >;
  interval: z.ZodOptional<z.ZodNumber>;
  widthResolutions: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
  tileWidth: z.ZodOptional<z.ZodNumber>;
  tileHeight: z.ZodOptional<z.ZodNumber>;
  qscale: z.ZodOptional<z.ZodNumber>;
  jpegQuality: z.ZodOptional<z.ZodNumber>;
}> = z.object({
  enableHwAcceleration: z.boolean().optional(),
  enableHwEncoding: z.boolean().optional(),
  processThreads: z.number().int().positive().optional(),
  enableKeyFrameOnlyExtraction: z.boolean().optional(),
  scanBehavior: z.enum(["Blocking", "NonBlocking"]).optional(),
  processPriority: z
    .enum(["Normal", "Idle", "High", "RealTime", "BelowNormal", "AboveNormal"])
    .optional(),
  interval: z.number().int().optional(),
  widthResolutions: z.array(z.number().int()).optional(),
  tileWidth: z.number().int().optional(),
  tileHeight: z.number().int().optional(),
  qscale: z.number().int().optional(),
  jpegQuality: z.number().int().optional(),
});

export type TrickplayOptionsConfig = z.infer<typeof TrickplayOptionsConfigType>;

export const SystemConfigType: z.ZodObject<{
  serverName: z.ZodOptional<z.ZodString>;
  enableMetrics: z.ZodOptional<z.ZodBoolean>;
  pluginRepositories: z.ZodOptional<
    z.ZodArray<typeof PluginRepositoryConfigType>
  >;
  trickplayOptions: z.ZodOptional<typeof TrickplayOptionsConfigType>;
  imageSavingConvention: z.ZodOptional<
    z.ZodEnum<{
      Legacy: "Legacy";
      Compatible: "Compatible";
    }>
  >;
  chapterImageResolution: z.ZodOptional<
    z.ZodEnum<{
      MatchSource: "MatchSource";
      P144: "P144";
      P240: "P240";
      P360: "P360";
      P480: "P480";
      P720: "P720";
      P1080: "P1080";
      P1440: "P1440";
      P2160: "P2160";
    }>
  >;
  sortReplaceCharacters: z.ZodOptional<z.ZodArray<z.ZodString>>;
  sortRemoveCharacters: z.ZodOptional<z.ZodArray<z.ZodString>>;
  sortRemoveWords: z.ZodOptional<z.ZodArray<z.ZodString>>;
  codecsUsed: z.ZodOptional<z.ZodArray<z.ZodString>>;
  corsHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
  cachePath: z.ZodOptional<z.ZodString>;
  metadataPath: z.ZodOptional<z.ZodString>;
  preferredMetadataLanguage: z.ZodOptional<z.ZodString>;
  metadataCountryCode: z.ZodOptional<z.ZodString>;
  uiCulture: z.ZodOptional<z.ZodString>;
  logFileRetentionDays: z.ZodOptional<z.ZodNumber>;
  minResumePct: z.ZodOptional<z.ZodNumber>;
  maxResumePct: z.ZodOptional<z.ZodNumber>;
  minResumeDurationSeconds: z.ZodOptional<z.ZodNumber>;
  minAudiobookResume: z.ZodOptional<z.ZodNumber>;
  maxAudiobookResume: z.ZodOptional<z.ZodNumber>;
  inactiveSessionThreshold: z.ZodOptional<z.ZodNumber>;
  libraryMonitorDelay: z.ZodOptional<z.ZodNumber>;
  libraryUpdateDuration: z.ZodOptional<z.ZodNumber>;
  cacheSize: z.ZodOptional<z.ZodNumber>;
  remoteClientBitrateLimit: z.ZodOptional<z.ZodNumber>;
  imageExtractionTimeoutMs: z.ZodOptional<z.ZodNumber>;
  slowResponseThresholdMs: z.ZodOptional<z.ZodNumber>;
  activityLogRetentionDays: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
  libraryScanFanoutConcurrency: z.ZodOptional<z.ZodNumber>;
  libraryMetadataRefreshConcurrency: z.ZodOptional<z.ZodNumber>;
  dummyChapterDuration: z.ZodOptional<z.ZodNumber>;
  parallelImageEncodingLimit: z.ZodOptional<z.ZodNumber>;
  isStartupWizardCompleted: z.ZodOptional<z.ZodBoolean>;
  enableNormalizedItemByNameIds: z.ZodOptional<z.ZodBoolean>;
  isPortAuthorized: z.ZodOptional<z.ZodBoolean>;
  quickConnectAvailable: z.ZodOptional<z.ZodBoolean>;
  enableCaseSensitiveItemIds: z.ZodOptional<z.ZodBoolean>;
  disableLiveTvChannelUserDataName: z.ZodOptional<z.ZodBoolean>;
  skipDeserializationForBasicTypes: z.ZodOptional<z.ZodBoolean>;
  saveMetadataHidden: z.ZodOptional<z.ZodBoolean>;
  enableFolderView: z.ZodOptional<z.ZodBoolean>;
  enableGroupingMoviesIntoCollections: z.ZodOptional<z.ZodBoolean>;
  enableGroupingShowsIntoCollections: z.ZodOptional<z.ZodBoolean>;
  displaySpecialsWithinSeasons: z.ZodOptional<z.ZodBoolean>;
  enableExternalContentInSuggestions: z.ZodOptional<z.ZodBoolean>;
  enableSlowResponseWarning: z.ZodOptional<z.ZodBoolean>;
  allowClientLogUpload: z.ZodOptional<z.ZodBoolean>;
  enableLegacyAuthorization: z.ZodOptional<z.ZodBoolean>;
}> = z
  .object({
    serverName: z.string().min(1).optional(),
    enableMetrics: z.boolean().optional(),
    pluginRepositories: z.array(PluginRepositoryConfigType).optional(),
    trickplayOptions: TrickplayOptionsConfigType.optional(),
    imageSavingConvention: z.enum(["Legacy", "Compatible"]).optional(),
    chapterImageResolution: z
      .enum([
        "MatchSource",
        "P144",
        "P240",
        "P360",
        "P480",
        "P720",
        "P1080",
        "P1440",
        "P2160",
      ])
      .optional(),
    sortReplaceCharacters: z.array(z.string()).optional(),
    sortRemoveCharacters: z.array(z.string()).optional(),
    sortRemoveWords: z.array(z.string()).optional(),
    codecsUsed: z.array(z.string()).optional(),
    corsHosts: z.array(z.string()).optional(),
    cachePath: z.string().optional(),
    metadataPath: z.string().optional(),
    preferredMetadataLanguage: z.string().optional(),
    metadataCountryCode: z.string().optional(),
    uiCulture: z.string().optional(),
    logFileRetentionDays: z.number().int().optional(),
    minResumePct: z.number().int().optional(),
    maxResumePct: z.number().int().optional(),
    minResumeDurationSeconds: z.number().int().optional(),
    minAudiobookResume: z.number().int().optional(),
    maxAudiobookResume: z.number().int().optional(),
    inactiveSessionThreshold: z.number().int().optional(),
    libraryMonitorDelay: z.number().int().optional(),
    libraryUpdateDuration: z.number().int().optional(),
    cacheSize: z.number().int().optional(),
    remoteClientBitrateLimit: z.number().int().optional(),
    imageExtractionTimeoutMs: z.number().int().optional(),
    slowResponseThresholdMs: z.number().int().optional(),
    activityLogRetentionDays: z.number().int().nullable().optional(),
    libraryScanFanoutConcurrency: z.number().int().optional(),
    libraryMetadataRefreshConcurrency: z.number().int().optional(),
    dummyChapterDuration: z.number().int().optional(),
    parallelImageEncodingLimit: z.number().int().optional(),
    isStartupWizardCompleted: z.boolean().optional(),
    enableNormalizedItemByNameIds: z.boolean().optional(),
    isPortAuthorized: z.boolean().optional(),
    quickConnectAvailable: z.boolean().optional(),
    enableCaseSensitiveItemIds: z.boolean().optional(),
    disableLiveTvChannelUserDataName: z.boolean().optional(),
    skipDeserializationForBasicTypes: z.boolean().optional(),
    saveMetadataHidden: z.boolean().optional(),
    enableFolderView: z.boolean().optional(),
    enableGroupingMoviesIntoCollections: z.boolean().optional(),
    enableGroupingShowsIntoCollections: z.boolean().optional(),
    displaySpecialsWithinSeasons: z.boolean().optional(),
    enableExternalContentInSuggestions: z.boolean().optional(),
    enableSlowResponseWarning: z.boolean().optional(),
    allowClientLogUpload: z.boolean().optional(),
    enableLegacyAuthorization: z.boolean().optional(),
  })
  .strict();

export type SystemConfig = z.infer<typeof SystemConfigType>;
