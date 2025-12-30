{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.library) mkLibraryConfig;

  nullConfig = {virtualFolders = null;};
in [
  (assertEq "empty config" (mkLibraryConfig nullConfig) {})

  (assertEq "valid virtual folder" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";}];
          };
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";}];
          };
        }
      ];
    })

  (assertEq "multiple paths" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";} {path = "/data/movies2";}];
          };
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";} {path = "/data/movies2";}];
          };
        }
      ];
    })

  (assertEq "multiple virtual folders" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {pathInfos = [{path = "/data/movies";}];};
        }
        {
          name = "TV Shows";
          collectionType = "tvshows";
          libraryOptions = {pathInfos = [{path = "/data/shows";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {pathInfos = [{path = "/data/movies";}];};
        }
        {
          name = "TV Shows";
          collectionType = "tvshows";
          libraryOptions = {pathInfos = [{path = "/data/shows";}];};
        }
      ];
    })

  (assertEq "collectionType movies" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "movies";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "movies";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType tvshows" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "tvshows";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "tvshows";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType music" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "music";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "music";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType musicvideos" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "musicvideos";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "musicvideos";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType homevideos" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "homevideos";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "homevideos";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType boxsets" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "boxsets";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "boxsets";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType books" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "books";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "books";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "collectionType mixed" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "mixed";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Test";
          collectionType = "mixed";
          libraryOptions = {pathInfos = [{path = "/test";}];};
        }
      ];
    })

  (assertEq "typeOptions are mapped when provided" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";}];
            typeOptions = [
              {
                type = "Movie";
                metadataFetchers = ["TheMovieDB"];
                imageFetchers = ["TheMovieDB"];
              }
            ];
            automaticallyAddToCollection = true;
            enableChapterImageExtraction = true;
            extractChapterImagesDuringLibraryScan = true;
            extractTrickplayImagesDuringLibraryScan = true;
            enableEmbeddedEpisodeInfos = true;
            enableEmbeddedExtraTitles = true;
            enableTrickplayImageExtraction = true;
            saveTrickplayWithMedia = true;
            metadataSavers = ["Nfo"];
            saveLocalMetadata = true;
            automaticRefreshIntervalDays = 14;
            enableRealtimeMonitor = true;
          };
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";}];
            typeOptions = [
              {
                type = "Movie";
                metadataFetchers = ["TheMovieDB"];
                metadataFetcherOrder = ["TheMovieDB"];
                imageFetchers = ["TheMovieDB"];
                imageFetcherOrder = ["TheMovieDB"];
              }
            ];
            automaticallyAddToCollection = true;
            enableChapterImageExtraction = true;
            extractChapterImagesDuringLibraryScan = true;
            extractTrickplayImagesDuringLibraryScan = true;
            enableEmbeddedEpisodeInfos = true;
            enableEmbeddedExtraTitles = true;
            enableTrickplayImageExtraction = true;
            saveTrickplayWithMedia = true;
            metadataSavers = ["Nfo"];
            saveLocalMetadata = true;
            automaticRefreshIntervalDays = 14;
            enableRealtimeMonitor = true;
          };
        }
      ];
    })

  (assertEq "typeOptions orders fallback when null" (mkLibraryConfig {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";}];
            typeOptions = [
              {
                type = "Movie";
                metadataFetchers = ["TheMovieDB"];
                metadataFetcherOrder = null;
                imageFetchers = ["TheMovieDB"];
                imageFetcherOrder = null;
              }
            ];
          };
        }
      ];
    }) {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {
            pathInfos = [{path = "/data/movies";}];
            typeOptions = [
              {
                type = "Movie";
                metadataFetchers = ["TheMovieDB"];
                metadataFetcherOrder = ["TheMovieDB"];
                imageFetchers = ["TheMovieDB"];
                imageFetcherOrder = ["TheMovieDB"];
              }
            ];
          };
        }
      ];
    })

  (assertEq "empty virtualFolders array" (mkLibraryConfig {virtualFolders = [];}) {virtualFolders = [];})

  (assertThrows "reject empty pathInfos" (mkLibraryConfig {
    virtualFolders = [
      {
        name = "Test";
        collectionType = "movies";
        libraryOptions = {pathInfos = [];};
      }
    ];
  }))
]
