import { describe, it, expect } from "vitest";
import { mapVirtualFolderConfigToSchema } from "../../src/mappers/library";
import type { VirtualFolderConfig } from "../../src/types/config/library";
import type { VirtualFolderInfoSchema } from "../../src/types/schema/library";

describe("mappers/library", () => {
  describe("mapVirtualFolderConfigToSchema", () => {
    it("should map single location correctly", () => {
      // Arrange
      const config: VirtualFolderConfig = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        Name: "Movies",
        CollectionType: "movies",
        LibraryOptions: {
          PathInfos: [{ Path: "/data/movies" }],
        },
      });
    });

    it("should map multiple locations correctly", () => {
      // Arrange
      const config: VirtualFolderConfig = {
        name: "TV Shows",
        collectionType: "tvshows",
        libraryOptions: {
          pathInfos: [
            { path: "/data/path1" },
            { path: "/data/path2" },
            { path: "/data/path3" },
          ],
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result.Name).toBe("TV Shows");
      expect(result.CollectionType).toBe("tvshows");
      expect(result.LibraryOptions?.PathInfos).toHaveLength(3);
      expect(result.LibraryOptions?.PathInfos?.[0]).toEqual({
        Path: "/data/path1",
      });
      expect(result.LibraryOptions?.PathInfos?.[1]).toEqual({
        Path: "/data/path2",
      });
      expect(result.LibraryOptions?.PathInfos?.[2]).toEqual({
        Path: "/data/path3",
      });
    });

    it("should handle different collection types", () => {
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
        // Arrange
        const config: VirtualFolderConfig = {
          name: `Test ${collectionType}`,
          collectionType,
          libraryOptions: {
            pathInfos: [{ path: `/data/${collectionType}` }],
          },
        };

        // Act
        const result: Partial<VirtualFolderInfoSchema> =
          mapVirtualFolderConfigToSchema(config);

        // Assert
        expect(result.Name).toBe(`Test ${collectionType}`);
        expect(result.CollectionType).toBe(collectionType);
        expect(result.LibraryOptions?.PathInfos?.[0]).toEqual({
          Path: `/data/${collectionType}`,
        });
      });
    });

    it("should preserve exact location strings", () => {
      // Arrange
      const locations: string[] = [
        "/data/path with spaces",
        "/data/path-with-dashes",
        "/data/path_with_underscores",
        "/very/deep/nested/path/structure",
        "relative/path",
      ];

      const config: VirtualFolderConfig = {
        name: "Complex Paths",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: locations.map((path: string) => ({ path })),
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result.Name).toBe("Complex Paths");
      expect(result.CollectionType).toBe("movies");
      expect(result.LibraryOptions?.PathInfos).toHaveLength(locations.length);
      locations.forEach((location: string, index: number) => {
        expect(result.LibraryOptions?.PathInfos?.[index]).toEqual({
          Path: location,
        });
      });
    });

    it("should create proper schema structure", () => {
      // Arrange
      const config: VirtualFolderConfig = {
        name: "Test",
        collectionType: "music",
        libraryOptions: {
          pathInfos: [{ path: "/data/music" }],
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result).toHaveProperty("Name");
      expect(result).toHaveProperty("CollectionType");
      expect(result).toHaveProperty("LibraryOptions");
      expect(result.LibraryOptions).toHaveProperty("PathInfos");
      expect(Array.isArray(result.LibraryOptions?.PathInfos)).toBe(true);
    });

    it("should map new boolean fields when provided", () => {
      // Arrange
      const config: VirtualFolderConfig = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
          enabled: true,
          enablePhotos: false,
          enableLUFSScan: true,
          skipSubtitlesIfEmbeddedSubtitlesPresent: false,
          requirePerfectSubtitleMatch: true,
          saveLyricsWithMedia: false,
          preferNonstandardArtistsTag: true,
          useCustomTagDelimiters: false,
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result.LibraryOptions?.Enabled).toBe(true);
      expect(result.LibraryOptions?.EnablePhotos).toBe(false);
      expect(result.LibraryOptions?.EnableLUFSScan).toBe(true);
      expect(
        result.LibraryOptions?.SkipSubtitlesIfEmbeddedSubtitlesPresent,
      ).toBe(false);
      expect(result.LibraryOptions?.RequirePerfectSubtitleMatch).toBe(true);
      expect(result.LibraryOptions?.SaveLyricsWithMedia).toBe(false);
      expect(result.LibraryOptions?.PreferNonstandardArtistsTag).toBe(true);
      expect(result.LibraryOptions?.UseCustomTagDelimiters).toBe(false);
    });

    it("should map allowEmbeddedSubtitles enum field when provided", () => {
      // Arrange
      const config: VirtualFolderConfig = {
        name: "TV Shows",
        collectionType: "tvshows",
        libraryOptions: {
          pathInfos: [{ path: "/data/tv" }],
          allowEmbeddedSubtitles: "AllowText",
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result.LibraryOptions?.AllowEmbeddedSubtitles).toBe("AllowText");
    });

    it("should map new string array fields when provided", () => {
      // Arrange
      const config: VirtualFolderConfig = {
        name: "Music",
        collectionType: "music",
        libraryOptions: {
          pathInfos: [{ path: "/data/music" }],
          subtitleDownloadLanguages: ["eng", "fra"],
          disabledSubtitleFetchers: ["OpenSubtitles"],
          subtitleFetcherOrder: ["OpenSubtitles", "Subscene"],
          disabledMediaSegmentProviders: ["ProviderA"],
          mediaSegmentProviderOrder: ["ProviderB", "ProviderA"],
          disabledLyricFetchers: ["Lrclib"],
          lyricFetcherOrder: ["Lrclib", "Genius"],
          customTagDelimiters: [";", "/"],
          delimiterWhitelist: ["/"],
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert
      expect(result.LibraryOptions?.SubtitleDownloadLanguages).toEqual([
        "eng",
        "fra",
      ]);
      expect(result.LibraryOptions?.DisabledSubtitleFetchers).toEqual([
        "OpenSubtitles",
      ]);
      expect(result.LibraryOptions?.SubtitleFetcherOrder).toEqual([
        "OpenSubtitles",
        "Subscene",
      ]);
      expect(result.LibraryOptions?.DisabledMediaSegmentProviders).toEqual([
        "ProviderA",
      ]);
      expect(result.LibraryOptions?.MediaSegmentProviderOrder).toEqual([
        "ProviderB",
        "ProviderA",
      ]);
      expect(result.LibraryOptions?.DisabledLyricFetchers).toEqual(["Lrclib"]);
      expect(result.LibraryOptions?.LyricFetcherOrder).toEqual([
        "Lrclib",
        "Genius",
      ]);
      expect(result.LibraryOptions?.CustomTagDelimiters).toEqual([";", "/"]);
      expect(result.LibraryOptions?.DelimiterWhitelist).toEqual(["/"]);
    });

    it("should not include new fields on LibraryOptions when only required fields are provided", () => {
      // Arrange: minimum valid config, no optional new fields
      const config: VirtualFolderConfig = {
        name: "Boxsets",
        collectionType: "boxsets",
        libraryOptions: {
          pathInfos: [{ path: "/data/boxsets" }],
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      // Assert: new guarded fields must be absent (not just undefined via key)
      const libraryOptions: object = result.LibraryOptions ?? {};
      expect(libraryOptions).not.toHaveProperty("Enabled");
      expect(libraryOptions).not.toHaveProperty("EnablePhotos");
      expect(libraryOptions).not.toHaveProperty("EnableLUFSScan");
      expect(libraryOptions).not.toHaveProperty(
        "EnableAutomaticSeriesGrouping",
      );
      expect(libraryOptions).not.toHaveProperty("EnableEmbeddedTitles");
      expect(libraryOptions).not.toHaveProperty(
        "SkipSubtitlesIfEmbeddedSubtitlesPresent",
      );
      expect(libraryOptions).not.toHaveProperty(
        "SkipSubtitlesIfAudioTrackMatches",
      );
      expect(libraryOptions).not.toHaveProperty("RequirePerfectSubtitleMatch");
      expect(libraryOptions).not.toHaveProperty("SaveSubtitlesWithMedia");
      expect(libraryOptions).not.toHaveProperty("SaveLyricsWithMedia");
      expect(libraryOptions).not.toHaveProperty("PreferNonstandardArtistsTag");
      expect(libraryOptions).not.toHaveProperty("UseCustomTagDelimiters");
      expect(libraryOptions).not.toHaveProperty("PreferredMetadataLanguage");
      expect(libraryOptions).not.toHaveProperty("MetadataCountryCode");
      expect(libraryOptions).not.toHaveProperty("SeasonZeroDisplayName");
      expect(libraryOptions).not.toHaveProperty("AllowEmbeddedSubtitles");
      expect(libraryOptions).not.toHaveProperty("DisabledLocalMetadataReaders");
      expect(libraryOptions).not.toHaveProperty("LocalMetadataReaderOrder");
      expect(libraryOptions).not.toHaveProperty("DisabledSubtitleFetchers");
      expect(libraryOptions).not.toHaveProperty("SubtitleFetcherOrder");
      expect(libraryOptions).not.toHaveProperty(
        "DisabledMediaSegmentProviders",
      );
      expect(libraryOptions).not.toHaveProperty("MediaSegmentProviderOrder");
      expect(libraryOptions).not.toHaveProperty("SubtitleDownloadLanguages");
      expect(libraryOptions).not.toHaveProperty("DisabledLyricFetchers");
      expect(libraryOptions).not.toHaveProperty("LyricFetcherOrder");
      expect(libraryOptions).not.toHaveProperty("CustomTagDelimiters");
      expect(libraryOptions).not.toHaveProperty("DelimiterWhitelist");
    });

    it("should map all 27 new fields when all are provided", () => {
      // Arrange: every new optional field supplied
      const config: VirtualFolderConfig = {
        name: "All Fields",
        collectionType: "mixed",
        libraryOptions: {
          pathInfos: [{ path: "/data/all" }],
          enabled: true,
          enablePhotos: true,
          enableLUFSScan: true,
          enableAutomaticSeriesGrouping: true,
          enableEmbeddedTitles: true,
          skipSubtitlesIfEmbeddedSubtitlesPresent: true,
          skipSubtitlesIfAudioTrackMatches: true,
          requirePerfectSubtitleMatch: true,
          saveSubtitlesWithMedia: true,
          saveLyricsWithMedia: true,
          preferNonstandardArtistsTag: true,
          useCustomTagDelimiters: true,
          preferredMetadataLanguage: "en",
          metadataCountryCode: "US",
          seasonZeroDisplayName: "Specials",
          allowEmbeddedSubtitles: "AllowAll",
          disabledLocalMetadataReaders: ["NFO"],
          localMetadataReaderOrder: ["NFO", "XML"],
          disabledSubtitleFetchers: ["OpenSubtitles"],
          subtitleFetcherOrder: ["OpenSubtitles"],
          disabledMediaSegmentProviders: ["ProviderX"],
          mediaSegmentProviderOrder: ["ProviderX"],
          subtitleDownloadLanguages: ["eng"],
          disabledLyricFetchers: ["Genius"],
          lyricFetcherOrder: ["Genius"],
          customTagDelimiters: [";"],
          delimiterWhitelist: [";"],
        },
      };

      // Act
      const result: Partial<VirtualFolderInfoSchema> =
        mapVirtualFolderConfigToSchema(config);

      const lo: VirtualFolderInfoSchema["LibraryOptions"] =
        result.LibraryOptions;

      // Assert: all 27 guarded fields are present and correctly mapped
      expect(lo?.Enabled).toBe(true);
      expect(lo?.EnablePhotos).toBe(true);
      expect(lo?.EnableLUFSScan).toBe(true);
      expect(lo?.EnableAutomaticSeriesGrouping).toBe(true);
      expect(lo?.EnableEmbeddedTitles).toBe(true);
      expect(lo?.SkipSubtitlesIfEmbeddedSubtitlesPresent).toBe(true);
      expect(lo?.SkipSubtitlesIfAudioTrackMatches).toBe(true);
      expect(lo?.RequirePerfectSubtitleMatch).toBe(true);
      expect(lo?.SaveSubtitlesWithMedia).toBe(true);
      expect(lo?.SaveLyricsWithMedia).toBe(true);
      expect(lo?.PreferNonstandardArtistsTag).toBe(true);
      expect(lo?.UseCustomTagDelimiters).toBe(true);
      expect(lo?.PreferredMetadataLanguage).toBe("en");
      expect(lo?.MetadataCountryCode).toBe("US");
      expect(lo?.SeasonZeroDisplayName).toBe("Specials");
      expect(lo?.AllowEmbeddedSubtitles).toBe("AllowAll");
      expect(lo?.DisabledLocalMetadataReaders).toEqual(["NFO"]);
      expect(lo?.LocalMetadataReaderOrder).toEqual(["NFO", "XML"]);
      expect(lo?.DisabledSubtitleFetchers).toEqual(["OpenSubtitles"]);
      expect(lo?.SubtitleFetcherOrder).toEqual(["OpenSubtitles"]);
      expect(lo?.DisabledMediaSegmentProviders).toEqual(["ProviderX"]);
      expect(lo?.MediaSegmentProviderOrder).toEqual(["ProviderX"]);
      expect(lo?.SubtitleDownloadLanguages).toEqual(["eng"]);
      expect(lo?.DisabledLyricFetchers).toEqual(["Genius"]);
      expect(lo?.LyricFetcherOrder).toEqual(["Genius"]);
      expect(lo?.CustomTagDelimiters).toEqual([";"]);
      expect(lo?.DelimiterWhitelist).toEqual([";"]);
    });
  });
});
