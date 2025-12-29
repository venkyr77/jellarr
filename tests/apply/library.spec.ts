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
  let updateLibraryOptionsSpy: Mock;
  let loggerInfoSpy: Mock;
  let loggerWarnSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    addVirtualFolderSpy = vi.fn();
    updateLibraryOptionsSpy = vi.fn();
    loggerInfoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => undefined);
    loggerWarnSpy = vi
      .spyOn(logger, "warn")
      .mockImplementation(() => undefined);

    mockClient = {
      addVirtualFolder: addVirtualFolderSpy,
      updateLibraryOptions: updateLibraryOptionsSpy,
    } as unknown as JellyfinClient;
  });

  describe("calculateLibraryDiff", () => {
    it("should return undefined when no virtual folders specified", () => {
      const result = calculateLibraryDiff([], []);
      expect(result).toBeUndefined();
    });

    it("should return undefined when empty virtual folders array", () => {
      const result = calculateLibraryDiff([], []);
      expect(result).toBeUndefined();
    });

    it("should return config with new virtual folder to create", () => {
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

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result?.toCreate).toEqual([
        {
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
          },
        },
      ]);
      expect(result?.toUpdate).toBeUndefined();
    });

    it("should return undefined for existing virtual folder with matching locations", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "1",
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

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result).toBeUndefined();
    });

    it("should return undefined for existing virtual folder with matching locations regardless of order", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "1",
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

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result).toBeUndefined();
    });

    it("should return update for virtual folder needing option changes", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "1",
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

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result?.toCreate).toBeUndefined();
      expect(result?.toUpdate).toEqual([
        {
          id: "1",
          name: "Movies",
          libraryOptions: { PathInfos: [{ Path: "/path/new" }] },
        },
      ]);
    });

    it("should return update when typeOptions additions are present", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "movies-id",
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
              typeOptions: [
                {
                  type: "Movie",
                  metadataFetchers: [],
                  imageFetchers: [],
                },
              ],
            },
          },
        ],
      };

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result?.toUpdate).toEqual([
        {
          id: "movies-id",
          name: "Movies",
          libraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
            TypeOptions: [
              {
                type: "Movie",
                metadataFetchers: [],
                imageFetchers: [],
              },
            ],
          },
        },
      ]);
      expect(result?.toCreate).toBeUndefined();
    });

    it("should handle mixed create and existing scenarios", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "existing-id",
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

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result?.toCreate).toEqual([
        {
          Name: "Test Shows",
          CollectionType: "tvshows",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/shows" }],
          },
        },
      ]);
      expect(result?.toUpdate).toBeUndefined();
    });
  });

  describe("applyLibrary", () => {
    it("should do nothing when config is undefined", async () => {
      await applyLibrary(mockClient, undefined);

      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
      expect(updateLibraryOptionsSpy).not.toHaveBeenCalled();
    });

    it("should do nothing when no virtual folders in config", async () => {
      await applyLibrary(mockClient, {});

      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
      expect(updateLibraryOptionsSpy).not.toHaveBeenCalled();
    });

    it("should skip entries without Name", async () => {
      const diff = {
        toCreate: [
          {
            CollectionType: "movies",
            LibraryOptions: {
              PathInfos: [{ Path: "/data" }],
            } as LibraryOptionsSchema,
          },
        ] as VirtualFolderInfoSchema[],
      };

      await applyLibrary(mockClient, diff);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        "Skipping virtual folder without a Name",
      );
      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
      expect(updateLibraryOptionsSpy).not.toHaveBeenCalled();
    });

    it("should create new virtual folder", async () => {
      const diff = {
        toCreate: [
          {
            Name: "Movies",
            CollectionType: "movies",
            LibraryOptions: {
              PathInfos: [{ Path: "/data/movies" }],
            } as LibraryOptionsSchema,
          },
        ] as VirtualFolderInfoSchema[],
      };

      addVirtualFolderSpy.mockResolvedValue(undefined);

      await applyLibrary(mockClient, diff);

      expect(addVirtualFolderSpy).toHaveBeenCalledTimes(1);
      expect(addVirtualFolderSpy).toHaveBeenCalledWith("Movies", "movies", {
        LibraryOptions: {
          PathInfos: [{ Path: "/data/movies" }],
        },
      });
      expect(loggerInfoSpy).toHaveBeenCalledWith(
        "Creating virtual folder: Movies",
      );
      expect(loggerInfoSpy).toHaveBeenCalledWith(
        "✓ Created virtual folder: Movies (movies)",
      );
      expect(updateLibraryOptionsSpy).not.toHaveBeenCalled();
    });

    it("should update library options for existing folder", async () => {
      const diff = {
        toUpdate: [
          {
            id: "movies-id",
            name: "Movies",
            libraryOptions: {
              PathInfos: [{ Path: "/data/movies" }],
              TypeOptions: [
                { type: "Movie", metadataFetchers: [], imageFetchers: [] },
              ],
            } as LibraryOptionsSchema,
          },
        ],
      };

      updateLibraryOptionsSpy.mockResolvedValue(undefined);

      await applyLibrary(mockClient, diff);

      expect(updateLibraryOptionsSpy).toHaveBeenCalledWith("movies-id", {
        Id: "movies-id",
        LibraryOptions: {
          PathInfos: [{ Path: "/data/movies" }],
          TypeOptions: [
            { type: "Movie", metadataFetchers: [], imageFetchers: [] },
          ],
        },
      });
      expect(addVirtualFolderSpy).not.toHaveBeenCalled();
    });
  });
});
