import { z } from "zod";

export const PluginRepositoryConfigType = z.object({
  name: z.string().min(1, "Plugin repository name cannot be empty"),
  url: z.url({ message: "Plugin repository URL must be a valid URL" }),
  enabled: z.boolean(),
});

export type PluginRepositoryConfig = z.infer<typeof PluginRepositoryConfigType>;

export const TrickplayOptionsConfigType = z.object({
  enableHwAcceleration: z.boolean().optional(),
  enableHwEncoding: z.boolean().optional(),
  enableKeyFrameOnlyExtraction: z.boolean().optional(),
  scanBehavior: z
    .enum([
      "Blocking",
      "NonBlocking",
    ])
    .optional(),
  processPriority: z
    .enum([
      "Normal",
      "Idle",
      "High",
      "RealTime",
      "BelowNormal",
      "AboveNormal",
    ])
    .optional(),
  interval: z.number().int().optional(),
  widthResolutions: z.array(z.number().int()).optional(),
  tileWidth: z.number().int().optional(),
  tileHeight: z.number().int().optional(),
  qscale: z.number().int().optional(),
  jpegQuality: z.number().int().optional(),
  processThreads: z.number().int().optional(),
});

export type TrickplayOptionsConfig = z.infer<typeof TrickplayOptionsConfigType>;

export const SystemConfigType = z
  .object({
    serverName: z.string().optional(),
    preferredMetadataLanguage: z.string().optional(),
    metadataCountryCode: z.string().optional(),
    uiCulture: z.string().optional(),
    quickConnectAvailable: z.boolean().optional(),
    enableMetrics: z.boolean().optional(),
    enableFolderView: z.boolean().optional(),
    enableGroupingMoviesIntoCollections: z.boolean().optional(),
    enableGroupingShowsIntoCollections: z.boolean().optional(),
    displaySpecialsWithinSeasons: z.boolean().optional(),
    enableExternalContentInSuggestions: z.boolean().optional(),
    activityLogRetentionDays: z.number().int().optional(),
    logFileRetentionDays: z.number().int().optional(),
    libraryMonitorDelay: z.number().int().optional(),
    libraryUpdateDuration: z.number().int().optional(),
    libraryScanFanoutConcurrency: z.number().int().optional(),
    libraryMetadataRefreshConcurrency: z.number().int().optional(),
    remoteClientBitrateLimit: z.number().int().optional(),
    minResumePct: z.number().int().optional(),
    maxResumePct: z.number().int().optional(),
    minResumeDurationSeconds: z.number().int().optional(),
    sortReplaceCharacters: z.array(z.string()).optional(),
    sortRemoveCharacters: z.array(z.string()).optional(),
    sortRemoveWords: z.array(z.string()).optional(),
    pluginRepositories: z.array(PluginRepositoryConfigType).optional(),
    trickplayOptions: TrickplayOptionsConfigType.optional(),
  })
  .strict();

export type SystemConfig = z.infer<typeof SystemConfigType>;
