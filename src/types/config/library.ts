import { z } from "zod";

export const TypeOptionsConfigType = z
  .object({
    type: z.string().min(1),
    metadataFetchers: z.array(z.string()).optional(),
    metadataFetcherOrder: z.array(z.string()).optional(),
    imageFetchers: z.array(z.string()).optional(),
    imageFetcherOrder: z.array(z.string()).optional(),
  })
  .strict();

export type TypeOptionsConfig = z.infer<typeof TypeOptionsConfigType>;

export const LibraryOptionsConfigType = z
  .object({
    pathInfos: z
      .array(z.object({ path: z.string().min(1) }).strict())
      .min(1),
    saveLocalMetadata: z.boolean().optional(),
    enableRealtimeMonitor: z.boolean().optional(),
    enableAutomaticSeriesGrouping: z.boolean().optional(),
    enableEmbeddedTitles: z.boolean().optional(),
    enableEmbeddedExtrasTitles: z.boolean().optional(),
    enableEmbeddedEpisodeInfos: z.boolean().optional(),
    preferredMetadataLanguage: z.string().optional(),
    metadataCountryCode: z.string().optional(),
    enableTrickplayImageExtraction: z.boolean().optional(),
    enableChapterImageExtraction: z.boolean().optional(),
    subtitleDownloadLanguages: z.array(z.string()).optional(),
    skipSubtitlesIfEmbeddedSubtitlesPresent: z.boolean().optional(),
    skipSubtitlesIfAudioTrackMatches: z.boolean().optional(),
    metadataSavers: z.array(z.string()).optional(),
    enableCrossLibrarySeriesMerging: z.boolean().optional(),
    typeOptions: z.array(TypeOptionsConfigType).optional(),
  })
  .strict();

export type LibraryOptionsConfig = z.infer<typeof LibraryOptionsConfigType>;

export const VirtualFolderConfigType = z
  .object({
    name: z.string().min(1),
    collectionType: z.enum([
      "movies",
      "tvshows",
      "music",
      "musicvideos",
      "homevideos",
      "boxsets",
      "books",
      "mixed",
    ]),
    libraryOptions: LibraryOptionsConfigType,
  })
  .strict();

export type VirtualFolderConfig = z.infer<typeof VirtualFolderConfigType>;

export const LibraryConfigType = z
  .object({
    purgeExistingLibraries: z.boolean().optional(),
    virtualFolders: z.array(VirtualFolderConfigType).optional(),
  })
  .strict();

export type LibraryConfig = z.infer<typeof LibraryConfigType>;
