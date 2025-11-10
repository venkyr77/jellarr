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

      types.forEach((collectionType) => {
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

    it("should infer correct TypeScript types", () => {
      const parsed: VirtualFolderConfig = {
        name: "Movies",
        collectionType: "movies",
        libraryOptions: {
          pathInfos: [{ path: "/data/movies" }],
        },
      };

      // Type assertions to verify correct inference
      expect(typeof parsed.name).toBe("string");
      expect(parsed.collectionType).toMatch(
        /^(movies|tvshows|music|musicvideos|homevideos|boxsets|books|mixed)$/,
      );
      expect(Array.isArray(parsed.libraryOptions.pathInfos)).toBe(true);
      expect(typeof parsed.libraryOptions.pathInfos[0].path).toBe("string");
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
            name: "", // Invalid - empty name
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
            // Missing required fields
            name: "Test",
            // Missing collectionType and libraryOptions
          },
        ],
      };

      // Act & Assert
      expect(() => LibraryConfigType.parse(config)).toThrow(/Invalid input/);
    });

    it("should properly type virtualFolders as optional", () => {
      // Type test - should compile without errors
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

      // Runtime assertions
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
