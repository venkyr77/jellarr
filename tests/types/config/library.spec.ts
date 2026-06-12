import { describe, it, expect } from "vitest";
import {
  VirtualFolderConfigType,
  type VirtualFolderConfig,
  LibraryConfigType,
  type LibraryConfig,
} from "../../../src/types/config/library";
import type { z } from "zod";

describe("types/config/library", () => {
  describe("VirtualFolderConfigType validation", () => {
    it("should accept valid virtual folder config", () => {
      // Arrange
      const validConfig: z.input<typeof VirtualFolderConfigType> = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }, { path: "/data/movies2" }],
        },
      };

      // Act & Assert
      expect(() => VirtualFolderConfigType.parse(validConfig)).not.toThrow();

      const parsed: VirtualFolderConfig =
        VirtualFolderConfigType.parse(validConfig);
      expect(parsed.name).toBe("Movies");
      expect(parsed.collectionType).toBe("movies");
      expect(parsed.libraryOptions.pathInfos).toHaveLength(2);
      expect(parsed.libraryOptions.pathInfos[0].path).toBe("/data/movies");
    });

    it("should accept valid typeOptions definitions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
          typeOptions: [
            {
              type: "Movie",
              metadataFetchers: ["TheMovieDB"],
              imageFetchers: ["TheMovieDB"],
            },
          ],
          automaticallyAddToCollection: true,
          enableChapterImageExtraction: true,
          extractChapterImagesDuringLibraryScan: true,
          extractTrickplayImagesDuringLibraryScan: true,
          enableEmbeddedEpisodeInfos: true,
          enableEmbeddedExtraTitles: true,
          enableTrickplayImageExtraction: true,
          saveTrickplayWithMedia: true,
          metadataSavers: ["Nfo"],
          saveLocalMetadata: true,
          automaticRefreshIntervalDays: 14,
          enableRealtimeMonitor: true,
        },
      };

      const parsed: VirtualFolderConfig = VirtualFolderConfigType.parse(config);
      expect(parsed.libraryOptions.typeOptions).toHaveLength(1);
      expect(parsed.libraryOptions.typeOptions?.[0].type).toBe("Movie");
      expect(parsed.libraryOptions.typeOptions?.[0].metadataFetchers).toEqual([
        "TheMovieDB",
      ]);
      expect(parsed.libraryOptions.typeOptions?.[0].imageFetchers).toEqual([
        "TheMovieDB",
      ]);
      expect(parsed.libraryOptions.automaticallyAddToCollection).toBe(true);
      expect(parsed.libraryOptions.enableChapterImageExtraction).toBe(true);
      expect(parsed.libraryOptions.extractChapterImagesDuringLibraryScan).toBe(
        true,
      );
      expect(
        parsed.libraryOptions.extractTrickplayImagesDuringLibraryScan,
      ).toBe(true);
      expect(parsed.libraryOptions.enableEmbeddedEpisodeInfos).toBe(true);
      expect(parsed.libraryOptions.enableEmbeddedExtraTitles).toBe(true);
      expect(parsed.libraryOptions.enableTrickplayImageExtraction).toBe(true);
      expect(parsed.libraryOptions.saveTrickplayWithMedia).toBe(true);
      expect(parsed.libraryOptions.metadataSavers).toEqual(["Nfo"]);
      expect(parsed.libraryOptions.saveLocalMetadata).toBe(true);
      expect(parsed.libraryOptions.automaticRefreshIntervalDays).toBe(14);
      expect(parsed.libraryOptions.enableRealtimeMonitor).toBe(true);
    });

    it("should allow empty fetcher arrays in typeOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
          typeOptions: [
            {
              type: "Movie",
              metadataFetchers: [],
              imageFetchers: [],
            },
          ],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).not.toThrow();
      const parsed: VirtualFolderConfig = VirtualFolderConfigType.parse(config);
      expect(parsed.libraryOptions.typeOptions?.[0].metadataFetchers).toEqual(
        [],
      );
      expect(parsed.libraryOptions.typeOptions?.[0].imageFetchers).toEqual([]);
    });

    it("should accept null fetcher order arrays in typeOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
          typeOptions: [
            {
              type: "Movie",
              metadataFetchers: ["TheMovieDB"],
              metadataFetcherOrder: null,
              imageFetchers: ["TheMovieDB"],
              imageFetcherOrder: null,
            },
          ],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).not.toThrow();
    });

    it("should accept all valid collection types", () => {
      const types: readonly [
        "movies",
        "tvshows",
        "music",
        "musicvideos",
        "homevideos",
        "boxsets",
        "books",
        "mixed",
      ] = [
        "movies",
        "tvshows",
        "music",
        "musicvideos",
        "homevideos",
        "boxsets",
        "books",
        "mixed",
      ] as const;

      types.forEach((collectionType: VirtualFolderConfig["collectionType"]) => {
        const config: z.input<typeof VirtualFolderConfigType> = {
          name: `Test ${collectionType}`,
          collectionType,
          libraryOptions: {
            pathInfos: [{ path: "/test" }],
          },
        };

        expect(() => VirtualFolderConfigType.parse(config)).not.toThrow();
      });
    });

    it("should reject empty name", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/test" }],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(/too_small/);
    });

    it("should reject invalid collection type", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        // @ts-expect-error intentional bad type for test
        collectionType: "invalid",
        libraryOptions: {
          pathInfos: [{ path: "/test" }],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(
        /Invalid option/,
      );
    });

    it("should reject empty pathInfos array", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(/too_small/);
    });

    it("should reject empty path string", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "" }],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(/too_small/);
    });

    it("should accept empty typeOptions array", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/test" }],
          typeOptions: [],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).not.toThrow();
    });

    it("should reject invalid typeOptions entries", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/test" }],
          typeOptions: [
            // @ts-expect-error metadataFetchers missing for test
            { type: "Movie", imageFetchers: ["TheMovieDB"] },
          ],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(
        /Invalid input/,
      );
    });

    it("should reject missing required fields", () => {
      expect(() => VirtualFolderConfigType.parse({})).toThrow(/Invalid input/);
      expect(() => VirtualFolderConfigType.parse({ name: "Test" })).toThrow(
        /Invalid input/,
      );
      expect(() =>
        VirtualFolderConfigType.parse({
          name: "Test",
          collectionType: "movies",
        }),
      ).toThrow(/Invalid input/);
    });

    it("should reject additional properties", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/test" }],
        },
        // @ts-expect-error intentional extra field for test
        extraField: "not allowed",
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(
        /unrecognized_keys/,
      );
    });

    it("should reject additional properties in libraryOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Test",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/test" }],
          // @ts-expect-error intentional extra field for test
          extraField: "not allowed",
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).toThrow(
        /unrecognized_keys/,
      );
    });

    it("should accept new bool fields in libraryOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Music",
        collectionType: "music",
        libraryOptions: {
          pathInfos: [{ path: "/data/music" }],
          enabled: true,
          enablePhotos: false,
          enableLUFSScan: true,
          enableAutomaticSeriesGrouping: false,
          enableEmbeddedTitles: true,
          skipSubtitlesIfEmbeddedSubtitlesPresent: false,
          skipSubtitlesIfAudioTrackMatches: true,
          requirePerfectSubtitleMatch: false,
          saveSubtitlesWithMedia: true,
          saveLyricsWithMedia: false,
          preferNonstandardArtistsTag: true,
          useCustomTagDelimiters: false,
        },
      };

      const parsed: VirtualFolderConfig = VirtualFolderConfigType.parse(config);
      expect(parsed.libraryOptions.enabled).toBe(true);
      expect(parsed.libraryOptions.enablePhotos).toBe(false);
      expect(parsed.libraryOptions.enableLUFSScan).toBe(true);
      expect(parsed.libraryOptions.enableAutomaticSeriesGrouping).toBe(false);
      expect(parsed.libraryOptions.enableEmbeddedTitles).toBe(true);
      expect(
        parsed.libraryOptions.skipSubtitlesIfEmbeddedSubtitlesPresent,
      ).toBe(false);
      expect(parsed.libraryOptions.skipSubtitlesIfAudioTrackMatches).toBe(true);
      expect(parsed.libraryOptions.requirePerfectSubtitleMatch).toBe(false);
      expect(parsed.libraryOptions.saveSubtitlesWithMedia).toBe(true);
      expect(parsed.libraryOptions.saveLyricsWithMedia).toBe(false);
      expect(parsed.libraryOptions.preferNonstandardArtistsTag).toBe(true);
      expect(parsed.libraryOptions.useCustomTagDelimiters).toBe(false);
    });

    it("should accept new string fields in libraryOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
          preferredMetadataLanguage: "en",
          metadataCountryCode: "US",
          seasonZeroDisplayName: "Specials",
        },
      };

      const parsed: VirtualFolderConfig = VirtualFolderConfigType.parse(config);
      expect(parsed.libraryOptions.preferredMetadataLanguage).toBe("en");
      expect(parsed.libraryOptions.metadataCountryCode).toBe("US");
      expect(parsed.libraryOptions.seasonZeroDisplayName).toBe("Specials");
    });

    it("should accept each valid allowEmbeddedSubtitles value", () => {
      const values: readonly [
        "AllowAll",
        "AllowText",
        "AllowImage",
        "AllowNone",
      ] = ["AllowAll", "AllowText", "AllowImage", "AllowNone"] as const;

      for (const value of values) {
        const config: z.input<typeof VirtualFolderConfigType> = {
          name: "TV Shows",
          collectionType: "tvshows",
          libraryOptions: {
            pathInfos: [{ path: "/data/shows" }],
            allowEmbeddedSubtitles: value,
          },
        };

        const parsed: VirtualFolderConfig =
          VirtualFolderConfigType.parse(config);
        expect(parsed.libraryOptions.allowEmbeddedSubtitles).toBe(value);
      }
    });

    it("should reject an invalid allowEmbeddedSubtitles value", () => {
      const result: z.ZodSafeParseResult<VirtualFolderConfig> =
        VirtualFolderConfigType.safeParse({
          name: "TV Shows",
          collectionType: "tvshows",
          libraryOptions: {
            pathInfos: [{ path: "/data/shows" }],
            allowEmbeddedSubtitles: "AllowSome",
          },
        });

      expect(result.success).toBe(false);
    });

    it("should accept new string array fields in libraryOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "TV Shows",
        collectionType: "tvshows",
        libraryOptions: {
          pathInfos: [{ path: "/data/shows" }],
          disabledLocalMetadataReaders: ["Nfo"],
          localMetadataReaderOrder: ["Nfo", "TheMovieDB"],
          disabledSubtitleFetchers: ["OpenSubtitles"],
          subtitleFetcherOrder: ["OpenSubtitles", "SubDL"],
          disabledMediaSegmentProviders: ["Emby"],
          mediaSegmentProviderOrder: ["Emby", "Jellyfin"],
          subtitleDownloadLanguages: ["en", "fr"],
          disabledLyricFetchers: ["LrcLib"],
          lyricFetcherOrder: ["LrcLib", "Musixmatch"],
          customTagDelimiters: ["/", ";"],
          delimiterWhitelist: ["/"],
        },
      };

      const parsed: VirtualFolderConfig = VirtualFolderConfigType.parse(config);
      expect(parsed.libraryOptions.disabledLocalMetadataReaders).toEqual([
        "Nfo",
      ]);
      expect(parsed.libraryOptions.localMetadataReaderOrder).toEqual([
        "Nfo",
        "TheMovieDB",
      ]);
      expect(parsed.libraryOptions.disabledSubtitleFetchers).toEqual([
        "OpenSubtitles",
      ]);
      expect(parsed.libraryOptions.subtitleFetcherOrder).toEqual([
        "OpenSubtitles",
        "SubDL",
      ]);
      expect(parsed.libraryOptions.disabledMediaSegmentProviders).toEqual([
        "Emby",
      ]);
      expect(parsed.libraryOptions.mediaSegmentProviderOrder).toEqual([
        "Emby",
        "Jellyfin",
      ]);
      expect(parsed.libraryOptions.subtitleDownloadLanguages).toEqual([
        "en",
        "fr",
      ]);
      expect(parsed.libraryOptions.disabledLyricFetchers).toEqual(["LrcLib"]);
      expect(parsed.libraryOptions.lyricFetcherOrder).toEqual([
        "LrcLib",
        "Musixmatch",
      ]);
      expect(parsed.libraryOptions.customTagDelimiters).toEqual(["/", ";"]);
      expect(parsed.libraryOptions.delimiterWhitelist).toEqual(["/"]);
    });

    it("should accept all 27 new fields together in libraryOptions", () => {
      const config: z.input<typeof VirtualFolderConfigType> = {
        name: "Music",
        collectionType: "music",
        libraryOptions: {
          pathInfos: [{ path: "/data/music" }],
          enabled: true,
          enablePhotos: true,
          enableLUFSScan: true,
          enableAutomaticSeriesGrouping: false,
          enableEmbeddedTitles: true,
          skipSubtitlesIfEmbeddedSubtitlesPresent: false,
          skipSubtitlesIfAudioTrackMatches: false,
          requirePerfectSubtitleMatch: true,
          saveSubtitlesWithMedia: true,
          saveLyricsWithMedia: true,
          preferNonstandardArtistsTag: false,
          useCustomTagDelimiters: true,
          preferredMetadataLanguage: "en",
          metadataCountryCode: "US",
          seasonZeroDisplayName: "Extras",
          allowEmbeddedSubtitles: "AllowText",
          disabledLocalMetadataReaders: ["Nfo"],
          localMetadataReaderOrder: ["Nfo"],
          disabledSubtitleFetchers: ["OpenSubtitles"],
          subtitleFetcherOrder: ["OpenSubtitles"],
          disabledMediaSegmentProviders: ["Emby"],
          mediaSegmentProviderOrder: ["Emby"],
          subtitleDownloadLanguages: ["en"],
          disabledLyricFetchers: ["LrcLib"],
          lyricFetcherOrder: ["LrcLib"],
          customTagDelimiters: [";"],
          delimiterWhitelist: [";"],
        },
      };

      expect(() => VirtualFolderConfigType.parse(config)).not.toThrow();
      const parsed: VirtualFolderConfig = VirtualFolderConfigType.parse(config);
      expect(parsed.libraryOptions.enabled).toBe(true);
      expect(parsed.libraryOptions.allowEmbeddedSubtitles).toBe("AllowText");
      expect(parsed.libraryOptions.preferredMetadataLanguage).toBe("en");
      expect(parsed.libraryOptions.customTagDelimiters).toEqual([";"]);
    });

    it("should still reject unknown keys in libraryOptions (.strict())", () => {
      const result: z.ZodSafeParseResult<VirtualFolderConfig> =
        VirtualFolderConfigType.safeParse({
          name: "Movies",
          collectionType: "movies",
          libraryOptions: {
            pathInfos: [{ path: "/test" }],
            unknownNewField: "not allowed",
          },
        });

      expect(result.success).toBe(false);
    });

    it("should infer correct TypeScript types", () => {
      const parsed: VirtualFolderConfig = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
          typeOptions: [
            {
              type: "Movie",
              metadataFetchers: ["TheMovieDB"],
              imageFetchers: ["TheMovieDB"],
            },
          ],
          automaticallyAddToCollection: true,
          enableChapterImageExtraction: true,
          extractChapterImagesDuringLibraryScan: true,
          extractTrickplayImagesDuringLibraryScan: true,
          enableEmbeddedEpisodeInfos: true,
          enableTrickplayImageExtraction: true,
          saveTrickplayWithMedia: true,
          metadataSavers: ["Nfo"],
          saveLocalMetadata: true,
          automaticRefreshIntervalDays: 14,
          enableRealtimeMonitor: true,
        },
      };

      expect(typeof parsed.name).toBe("string");
      expect(parsed.collectionType).toMatch(
        /^(movies|tvshows|music|musicvideos|homevideos|boxsets|books|mixed)$/,
      );
      expect(Array.isArray(parsed.libraryOptions.pathInfos)).toBe(true);
      expect(typeof parsed.libraryOptions.pathInfos[0].path).toBe("string");
      expect(parsed.libraryOptions.typeOptions?.[0].type).toBe("Movie");
      expect(parsed.libraryOptions.typeOptions?.[0].metadataFetchers[0]).toBe(
        "TheMovieDB",
      );
      expect(parsed.libraryOptions.typeOptions?.[0].imageFetchers[0]).toBe(
        "TheMovieDB",
      );
      expect(parsed.libraryOptions.automaticallyAddToCollection).toBe(true);
      expect(parsed.libraryOptions.enableChapterImageExtraction).toBe(true);
      expect(parsed.libraryOptions.extractChapterImagesDuringLibraryScan).toBe(
        true,
      );
      expect(
        parsed.libraryOptions.extractTrickplayImagesDuringLibraryScan,
      ).toBe(true);
      expect(parsed.libraryOptions.enableEmbeddedEpisodeInfos).toBe(true);
      expect(parsed.libraryOptions.enableTrickplayImageExtraction).toBe(true);
      expect(parsed.libraryOptions.saveTrickplayWithMedia).toBe(true);
      expect(parsed.libraryOptions.metadataSavers?.[0]).toBe("Nfo");
      expect(parsed.libraryOptions.saveLocalMetadata).toBe(true);
      expect(parsed.libraryOptions.automaticRefreshIntervalDays).toBe(14);
      expect(parsed.libraryOptions.enableRealtimeMonitor).toBe(true);
    });
  });

  describe("LibraryConfigType validation", () => {
    it("should accept valid library config with virtual folders", () => {
      // Arrange
      const validConfig: z.input<typeof LibraryConfigType> = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
              typeOptions: [
                {
                  type: "Movie",
                  metadataFetchers: ["TheMovieDB"],
                  imageFetchers: ["TheMovieDB"],
                },
              ],
            },
          },
          {
            name: "TV Shows",
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/data/shows" }],
            },
          },
        ],
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(validConfig)).not.toThrow();

      const parsed: LibraryConfig = LibraryConfigType.parse(validConfig);
      expect(parsed.virtualFolders).toHaveLength(2);
      expect(parsed.virtualFolders?.[0].name).toBe("Movies");
      expect(parsed.virtualFolders?.[1].name).toBe("TV Shows");
    });

    it("should accept empty library config (virtualFolders is optional)", () => {
      // Arrange
      const emptyConfig: z.input<typeof LibraryConfigType> = {};

      // Act & Assert
      expect(() => LibraryConfigType.parse(emptyConfig)).not.toThrow();

      const parsed: LibraryConfig = LibraryConfigType.parse(emptyConfig);
      expect(parsed.virtualFolders).toBeUndefined();
    });

    it("should accept library config with empty virtualFolders array", () => {
      // Arrange
      const configWithEmptyArray: z.input<typeof LibraryConfigType> = {
        virtualFolders: [],
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(configWithEmptyArray)).not.toThrow();

      const parsed: LibraryConfig =
        LibraryConfigType.parse(configWithEmptyArray);
      expect(parsed.virtualFolders).toEqual([]);
      expect(parsed.virtualFolders).toHaveLength(0);
    });

    it("should validate each virtual folder in the array", () => {
      // Arrange - one valid, one invalid
      const config: z.input<typeof LibraryConfigType> = {
        virtualFolders: [
          {
            name: "Valid",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/valid" }],
            },
          },
          {
            name: "",
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/test" }],
            },
          },
        ],
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(config)).toThrow(/too_small/);
    });

    it("should reject invalid virtualFolders type", () => {
      // Arrange
      const config: z.input<typeof LibraryConfigType> = {
        // @ts-expect-error intentional bad type for test
        virtualFolders: "not an array",
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(config)).toThrow(/expected array/);
    });

    it("should reject additional properties at library level", () => {
      // Arrange
      const config: z.input<typeof LibraryConfigType> = {
        virtualFolders: [],
        // @ts-expect-error intentional extra field for test
        extraField: "not allowed",
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(config)).toThrow(
        /unrecognized_keys/,
      );
    });

    it("should reject invalid virtual folder objects in array", () => {
      // Arrange
      const config: z.input<typeof LibraryConfigType> = {
        virtualFolders: [
          // @ts-expect-error intentional invalid object for test
          {
            name: "Test",
          },
        ],
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(config)).toThrow(/Invalid input/);
    });

    it("should properly type virtualFolders as optional", () => {
      const config1: LibraryConfig = {};
      const config2: LibraryConfig = { virtualFolders: undefined };
      const config3: LibraryConfig = { virtualFolders: [] };
      const config4: LibraryConfig = {
        virtualFolders: [
          {
            name: "Test",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/test" }],
            },
          },
        ],
      };

      expect(config1.virtualFolders).toBeUndefined();
      expect(config2.virtualFolders).toBeUndefined();
      expect(config3.virtualFolders).toEqual([]);
      expect(config4.virtualFolders).toHaveLength(1);
    });

    it("should handle null virtualFolders", () => {
      // Arrange
      const config: z.input<typeof LibraryConfigType> = {
        // @ts-expect-error null is not the same as undefined
        virtualFolders: null,
      };

      // Act & Assert - null is not valid, must be undefined or array
      expect(() => LibraryConfigType.parse(config)).toThrow(/expected array/);
    });
  });
});
