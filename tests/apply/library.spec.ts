import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { calculateLibraryDiff, applyLibrary } from "../../src/apply/library";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type { LibraryConfig } from "../../src/types/config/library";
import type { VirtualFolderInfoSchema } from "../../src/types/schema/library";
import { logger } from "../../src/lib/logger";

describe("apply/library", () => {
  let mockClient: JellyfinClient;
  let addVirtualFolderSpy: Mock;
  let loggerSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    addVirtualFolderSpy = vi.fn();
    loggerSpy = vi.spyOn(logger, "info").mockImplementation(() => {});
    vi.spyOn(logger, "warn").mockImplementation(() => {});

    mockClient = {
      addVirtualFolder: addVirtualFolderSpy,
    } as unknown as JellyfinClient;
  });

  describe("calculateLibraryDiff", () => {
    it("should return undefined when no virtual folders specified", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [];
      const desired: LibraryConfig = {};

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when empty virtual folders array", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [];
      const desired: LibraryConfig = { virtualFolders: [] };

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return config with new virtual folder to create", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [];
      const desired: LibraryConfig = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
            },
          },
        ],
      };

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toEqual({
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
            },
          },
        ],
      });
    });

    it("should return undefined for existing virtual folder with matching locations", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          Locations: ["/data/movies"],
        },
      ];
      const desired: LibraryConfig = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
            },
          },
        ],
      };

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined for existing virtual folder with matching locations regardless of order", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          Locations: ["/data/path2", "/data/path1", "/data/path3"],
        },
      ];
      const desired: LibraryConfig = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [
                { path: "/data/path1" },
                { path: "/data/path2" },
                { path: "/data/path3" },
              ],
            },
          },
        ],
      };

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return empty config and warn for virtual folder needing update", () => {
      // Arrange
      const warnSpy: Mock = vi
        .spyOn(logger, "warn")
        .mockImplementation(() => {});
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          Locations: ["/path/old"],
        },
      ];
      const desired: LibraryConfig = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/path/new" }],
            },
          },
        ],
      };

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toEqual({ virtualFolders: [] });
      expect(warnSpy).toHaveBeenCalledWith(
        "Virtual folder Movies exists but locations differ - updates not yet supported",
      );
      expect(warnSpy).toHaveBeenCalledWith("  Current: [/path/old]");
      expect(warnSpy).toHaveBeenCalledWith("  Desired: [/path/new]");
    });

    it("should handle mixed create and existing scenarios", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Existing Movies",
          CollectionType: "movies",
          Locations: ["/data/existing"],
        },
      ];
      const desired: LibraryConfig = {
        virtualFolders: [
          {
            name: "Existing Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/data/existing" }],
            },
          },
          {
            name: "Test Shows",
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/data/shows" }],
            },
          },
        ],
      };

      // Act
      const result: LibraryConfig | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      // Assert
      expect(result).toEqual({
        virtualFolders: [
          {
            name: "Test Shows",
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/data/shows" }],
            },
          },
        ],
      });
    });
  });

  describe("applyLibrary", () => {
    it("should do nothing when config is undefined", async () => {
      // Act
      await applyLibrary(mockClient, undefined);

      // Assert
      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
    });

    it("should do nothing when no virtual folders in config", async () => {
      // Act
      await applyLibrary(mockClient, {});

      // Assert
      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
    });

    it("should create new virtual folder", async () => {
      // Arrange
      const libraryConfig: LibraryConfig = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
            },
          },
        ],
      };

      addVirtualFolderSpy.mockResolvedValue(undefined);

      // Act
      await applyLibrary(mockClient, libraryConfig);

      // Assert
      expect(addVirtualFolderSpy).toHaveBeenCalledTimes(1);
      expect(addVirtualFolderSpy).toHaveBeenCalledWith("Movies", "movies", {
        LibraryOptions: {
          PathInfos: [{ Path: "/data/movies" }],
        },
      });
      expect(loggerSpy).toHaveBeenCalledWith("Creating virtual folder: Movies");
      expect(loggerSpy).toHaveBeenCalledWith(
        "✓ Created virtual folder: Movies (movies)",
      );
    });

    it("should create multiple new virtual folders", async () => {
      // Arrange
      const libraryConfig: LibraryConfig = {
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

      addVirtualFolderSpy.mockResolvedValue(undefined);

      // Act
      await applyLibrary(mockClient, libraryConfig);

      // Assert
      expect(addVirtualFolderSpy).toHaveBeenCalledTimes(2);
      expect(addVirtualFolderSpy).toHaveBeenNthCalledWith(
        1,
        "Movies",
        "movies",
        expect.any(Object),
      );
      expect(addVirtualFolderSpy).toHaveBeenNthCalledWith(
        2,
        "TV Shows",
        "tvshows",
        expect.any(Object),
      );
    });
  });
});
