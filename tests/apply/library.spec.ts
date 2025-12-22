import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { calculateLibraryDiff, applyLibrary } from "../../src/apply/library";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type {
  LibraryConfig,
  VirtualFolderConfig,
} from "../../src/types/config/library";
import type {
  LibraryOptionsSchema,
  VirtualFolderInfoSchema,
} from "../../src/types/schema/library";
import { logger } from "../../src/lib/logger";

describe("apply/library", () => {
  let mockClient: JellyfinClient;
  let addVirtualFolderSpy: Mock;
  let loggerSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    addVirtualFolderSpy = vi.fn();
    loggerSpy = vi.spyOn(logger, "info").mockImplementation(() => undefined);
    vi.spyOn(logger, "warn").mockImplementation(() => undefined);

    mockClient = {
      addVirtualFolder: addVirtualFolderSpy,
    } as unknown as JellyfinClient;
  });

  describe("calculateLibraryDiff", () => {
    it("should return undefined when no virtual folders specified", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [];
      const desired: VirtualFolderConfig[] = [];

      // Act
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(currentVirtualFolders, desired);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when empty virtual folders array", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [];
      const desired: LibraryConfig = { virtualFolders: [] };

      // Act
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
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
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
        );

      // Assert
      expect(result).toEqual([
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
          },
        },
      ]);
    });

    it("should return undefined for existing virtual folder with matching locations", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
          } as LibraryOptionsSchema,
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
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
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
          LibraryOptions: {
            PathInfos: [
              { Path: "/data/path2" },
              { Path: "/data/path1" },
              { Path: "/data/path3" },
            ],
          } as LibraryOptionsSchema,
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
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
        );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return empty config for virtual folder needing update", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/path/old" }],
          } as LibraryOptionsSchema,
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
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
        );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when existing folder has different collectionType", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
          } as LibraryOptionsSchema,
        },
      ];
      const desired: LibraryConfig = {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
            },
          },
        ],
      };

      // Act
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
        );

      // Assert - withoutUpdates() filters the CollectionType change
      expect(result).toBeUndefined();
    });

    it("should handle mixed create and existing scenarios", () => {
      // Arrange
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          Name: "Existing Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/existing" }],
          } as LibraryOptionsSchema,
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
      const result: VirtualFolderInfoSchema[] | undefined =
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
        );

      // Assert
      expect(result).toEqual([
        {
          Name: "Test Shows",
          CollectionType: "tvshows",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/shows" }],
          },
        },
      ]);
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
      await applyLibrary(mockClient, []);

      // Assert
      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
    });

    it("should create new virtual folder", async () => {
      // Arrange
      const virtualFoldersToAdd: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
          } as LibraryOptionsSchema,
        },
      ];

      addVirtualFolderSpy.mockResolvedValue(undefined);

      // Act
      await applyLibrary(mockClient, virtualFoldersToAdd);

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
      const virtualFoldersToAdd: VirtualFolderInfoSchema[] = [
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
          } as LibraryOptionsSchema,
        },
        {
          Name: "TV Shows",
          CollectionType: "tvshows",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/shows" }],
          } as LibraryOptionsSchema,
        },
      ];

      addVirtualFolderSpy.mockResolvedValue(undefined);

      // Act
      await applyLibrary(mockClient, virtualFoldersToAdd);

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
