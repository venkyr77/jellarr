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
