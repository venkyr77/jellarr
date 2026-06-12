import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculateLibraryDiff,
  applyLibrary,
  type LibraryDiff,
} from "../../src/apply/library";
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

    it("should return update for existing virtual folder when path order changes", () => {
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

      expect(result?.toCreate).toBeUndefined();
      expect(result?.toUpdate).toEqual([
        {
          id: "1",
          name: "Movies",
          libraryOptions: {
            PathInfos: [
              { Path: "/data/path1" },
              { Path: "/data/path2" },
              { Path: "/data/path3" },
            ],
          },
        },
      ]);
    });

    it("should throw when collectionType changes", () => {
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
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/data/movies" }],
            },
          },
        ],
      };

      expect(() =>
        calculateLibraryDiff(
          currentVirtualFolders,
          desired.virtualFolders as VirtualFolderConfig[],
        ),
      ).toThrow(/collectionType change is not supported/i);
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

    it("should return update when additional library options change", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "1",
          Name: "Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/movies" }],
            AutomaticallyAddToCollection: false,
            EnableTrickplayImageExtraction: false,
            MetadataSavers: [],
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
              automaticallyAddToCollection: true,
              enableTrickplayImageExtraction: true,
              metadataSavers: ["Nfo"],
            },
          },
        ],
      };

      const result = calculateLibraryDiff(
        currentVirtualFolders,
        desired.virtualFolders as VirtualFolderConfig[],
      );

      expect(result?.toCreate).toBeUndefined();
      expect(result?.toUpdate?.[0]).toMatchObject({
        id: "1",
        name: "Movies",
        libraryOptions: {
          PathInfos: [{ Path: "/data/movies" }],
          AutomaticallyAddToCollection: true,
          EnableTrickplayImageExtraction: true,
          MetadataSavers: ["Nfo"],
        },
      });
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

    it("should update existing folder whose name contains an apostrophe", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "kids-movies-id",
          Name: "Kids' Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/kids" }],
          } as LibraryOptionsSchema,
        },
      ];
      const desired: VirtualFolderConfig[] = [
        {
          name: "Kids' Movies",
          collectionType: "movies",
          libraryOptions: {
            pathInfos: [{ path: "/data/kids-new" }],
          },
        },
      ];

      const result: LibraryDiff | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      expect(result?.toCreate).toBeUndefined();
      expect(result?.toUpdate).toEqual([
        {
          id: "kids-movies-id",
          name: "Kids' Movies",
          libraryOptions: {
            PathInfos: [{ Path: "/data/kids-new" }],
          },
        },
      ]);
    });

    it("should not misroute a new apostrophe-named folder into an update of a prefix-matching folder", () => {
      const currentVirtualFolders: VirtualFolderInfoSchema[] = [
        {
          ItemId: "kids-id",
          Name: "Kids",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/kids" }],
          } as LibraryOptionsSchema,
        },
      ];
      const desired: VirtualFolderConfig[] = [
        {
          name: "Kids",
          collectionType: "movies",
          libraryOptions: {
            pathInfos: [{ path: "/data/kids" }],
          },
        },
        {
          name: "Kids' Movies",
          collectionType: "movies",
          libraryOptions: {
            pathInfos: [{ path: "/data/kids-movies" }],
          },
        },
      ];

      const result: LibraryDiff | undefined = calculateLibraryDiff(
        currentVirtualFolders,
        desired,
      );

      expect(result?.toCreate).toEqual([
        {
          Name: "Kids' Movies",
          CollectionType: "movies",
          LibraryOptions: {
            PathInfos: [{ Path: "/data/kids-movies" }],
          },
        },
      ]);
      expect(result?.toUpdate).toBeUndefined();
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
