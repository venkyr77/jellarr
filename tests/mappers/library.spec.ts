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
  });
});
