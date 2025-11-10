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
