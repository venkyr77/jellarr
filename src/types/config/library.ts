import { z } from "zod";

export const VirtualFolderConfigType: z.ZodObject<{
  name: z.ZodString;
  collectionType: z.ZodEnum<{
    movies: "movies";
    tvshows: "tvshows";
    music: "music";
    musicvideos: "musicvideos";
    homevideos: "homevideos";
    boxsets: "boxsets";
    books: "books";
    mixed: "mixed";
  }>;
  libraryOptions: z.ZodObject<{
    pathInfos: z.ZodArray<
      z.ZodObject<{
        path: z.ZodString;
      }>
    >;
    typeOptions: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<{
          type: z.ZodString;
          metadataFetchers: z.ZodArray<z.ZodString>;
          metadataFetcherOrder: z.ZodOptional<z.ZodArray<z.ZodString>>;
          imageFetchers: z.ZodArray<z.ZodString>;
          imageFetcherOrder: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }>
      >
    >;
    automaticallyAddToCollection: z.ZodOptional<z.ZodBoolean>;
    enableChapterImageExtraction: z.ZodOptional<z.ZodBoolean>;
    extractChapterImagesDuringLibraryScan: z.ZodOptional<z.ZodBoolean>;
    extractTrickplayImagesDuringLibraryScan: z.ZodOptional<z.ZodBoolean>;
    enableEmbeddedEpisodeInfos: z.ZodOptional<z.ZodBoolean>;
    enableEmbeddedExtraTitles: z.ZodOptional<z.ZodBoolean>;
    enableTrickplayImageExtraction: z.ZodOptional<z.ZodBoolean>;
    saveTrickplayWithMedia: z.ZodOptional<z.ZodBoolean>;
    metadataSavers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    saveLocalMetadata: z.ZodOptional<z.ZodBoolean>;
    automaticRefreshIntervalDays: z.ZodOptional<z.ZodNumber>;
    enableRealtimeMonitor: z.ZodOptional<z.ZodBoolean>;
  }>;
}> = z
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
    libraryOptions: z
      .object({
        pathInfos: z
          .array(z.object({ path: z.string().min(1) }).strict())
          .min(1),
        typeOptions: z
          .array(
            z
              .object({
                type: z.string().min(1),
                metadataFetchers: z.array(z.string().min(1)),
                metadataFetcherOrder: z
                  .array(z.string().min(1))
                  .nullable()
                  .optional(),
                imageFetchers: z.array(z.string().min(1)),
                imageFetcherOrder: z
                  .array(z.string().min(1))
                  .nullable()
                  .optional(),
              })
              .strict(),
          )
          .optional(),
        automaticallyAddToCollection: z.boolean().optional(),
        enableChapterImageExtraction: z.boolean().optional(),
        extractChapterImagesDuringLibraryScan: z.boolean().optional(),
        extractTrickplayImagesDuringLibraryScan: z.boolean().optional(),
        enableEmbeddedEpisodeInfos: z.boolean().optional(),
        enableEmbeddedExtraTitles: z.boolean().optional(),
        enableTrickplayImageExtraction: z.boolean().optional(),
        saveTrickplayWithMedia: z.boolean().optional(),
        metadataSavers: z.array(z.string().min(1)).optional(),
        saveLocalMetadata: z.boolean().optional(),
        automaticRefreshIntervalDays: z.number().int().nonnegative().optional(),
        enableRealtimeMonitor: z.boolean().optional(),
      })
      .strict(),
  })
  .strict();

export type VirtualFolderConfig = z.infer<typeof VirtualFolderConfigType>;

export const LibraryConfigType: z.ZodObject<{
  virtualFolders: z.ZodOptional<z.ZodArray<typeof VirtualFolderConfigType>>;
}> = z
  .object({
    virtualFolders: z.array(VirtualFolderConfigType).optional(),
  })
  .strict();

export type LibraryConfig = z.infer<typeof LibraryConfigType>;
