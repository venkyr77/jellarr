{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  pathInfoConfigType = types.submodule {
    options = {
      path = mkOption {
        type = types.str;
        description = "Path to media folder.";
      };
    };
  };

  typeOptionsConfigType = types.submodule {
    options = {
      type = mkOption {
        type = types.str;
        description = "Type name. E.g., 'Movie', 'Series', etc.";
      };
      metadataFetchers = mkOption {
        type = types.listOf types.str;
        description = "List of metadata fetchers to use for this type.";
      };
      metadataFetcherOrder = mkOption {
        type = types.nullOr (types.listOf types.str);
        description = "List defining the order of metadata fetchers for this type. Defaults to metadataFetchers if not set.";
        default = null;
      };
      imageFetchers = mkOption {
        type = types.listOf types.str;
        description = "List of image fetchers to use for this type.";
      };
      imageFetcherOrder = mkOption {
        type = types.nullOr (types.listOf types.str);
        description = "List defining the order of image fetchers for this type. Defaults to imageFetchers if not set.";
        default = null;
      };
    };
  };

  libraryOptionsConfigType = types.submodule {
    options = {
      pathInfos = mkOption {
        type = types.listOf pathInfoConfigType;
        description = "List of paths for this library.";
      };
      automaticallyAddToCollection = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Automatically add content to collections.";
      };
      enableChapterImageExtraction = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable chapter image extraction.";
      };
      extractChapterImagesDuringLibraryScan = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Extract chapter images during library scan.";
      };
      extractTrickplayImagesDuringLibraryScan = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Extract trickplay images during library scan.";
      };
      enableEmbeddedEpisodeInfos = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable embedded episode infos.";
      };
      enableEmbeddedExtraTitles = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable embedded extra titles.";
      };
      enableTrickplayImageExtraction = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable trickplay image extraction.";
      };
      saveTrickplayWithMedia = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save trickplay with media.";
      };
      metadataSavers = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of metadata savers.";
      };
      saveLocalMetadata = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save local metadata.";
      };
      automaticRefreshIntervalDays = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Automatic refresh interval in days.";
      };
      enableRealtimeMonitor = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable realtime monitor.";
      };
      typeOptions = mkOption {
        type = types.listOf typeOptionsConfigType;
        default = [];
        example = [
          {
            type = "Movie";
            metadataFetchers = ["TheMovieDB"];
            imageFetchers = ["TheMovieDB"];
          }
        ];
        description = "typeOptions config for this library.";
      };
    };
  };

  virtualFolderConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "Library name.";
      };
      collectionType = mkOption {
        type = types.enum [
          "movies"
          "tvshows"
          "music"
          "musicvideos"
          "homevideos"
          "boxsets"
          "books"
          "mixed"
        ];
        description = "Type of media in this library.";
      };
      libraryOptions = mkOption {
        type = libraryOptionsConfigType;
        description = "Library options including paths.";
      };
    };
  };

  libraryConfigType = types.submodule {
    options = {
      virtualFolders = mkOption {
        type = nullOr (types.listOf virtualFolderConfigType);
        default = null;
        description = "List of virtual folders (libraries).";
      };
    };
  };

  mkLibraryConfig = cfg:
    {}
    // optionalAttrs (cfg.virtualFolders != null) {
      virtualFolders = map (folder:
        assert (builtins.length folder.libraryOptions.pathInfos)
        >= 1
        || throw "Library '${folder.name}' must have at least one path in pathInfos"; let
          lo = folder.libraryOptions;
        in {
          inherit (folder) name collectionType;
          libraryOptions =
            {
              pathInfos =
                map (pathInfo: {inherit (pathInfo) path;})
                lo.pathInfos;
            }
            // optionalAttrs (lo ? automaticallyAddToCollection && lo.automaticallyAddToCollection != null) {
              inherit (lo) automaticallyAddToCollection;
            }
            // optionalAttrs (lo ? enableChapterImageExtraction && lo.enableChapterImageExtraction != null) {
              inherit (lo) enableChapterImageExtraction;
            }
            // optionalAttrs (lo ? extractChapterImagesDuringLibraryScan && lo.extractChapterImagesDuringLibraryScan != null) {
              inherit (lo) extractChapterImagesDuringLibraryScan;
            }
            // optionalAttrs (lo ? extractTrickplayImagesDuringLibraryScan && lo.extractTrickplayImagesDuringLibraryScan != null) {
              inherit (lo) extractTrickplayImagesDuringLibraryScan;
            }
            // optionalAttrs (lo ? enableEmbeddedEpisodeInfos && lo.enableEmbeddedEpisodeInfos != null) {
              inherit (lo) enableEmbeddedEpisodeInfos;
            }
            // optionalAttrs (lo ? enableEmbeddedExtraTitles && lo.enableEmbeddedExtraTitles != null) {
              inherit (lo) enableEmbeddedExtraTitles;
            }
            // optionalAttrs (lo ? enableTrickplayImageExtraction && lo.enableTrickplayImageExtraction != null) {
              inherit (lo) enableTrickplayImageExtraction;
            }
            // optionalAttrs (lo ? saveTrickplayWithMedia && lo.saveTrickplayWithMedia != null) {
              inherit (lo) saveTrickplayWithMedia;
            }
            // optionalAttrs (lo ? metadataSavers && lo.metadataSavers != null) {
              inherit (lo) metadataSavers;
            }
            // optionalAttrs (lo ? saveLocalMetadata && lo.saveLocalMetadata != null) {
              inherit (lo) saveLocalMetadata;
            }
            // optionalAttrs (lo ? automaticRefreshIntervalDays && lo.automaticRefreshIntervalDays != null) {
              inherit (lo) automaticRefreshIntervalDays;
            }
            // optionalAttrs (lo ? enableRealtimeMonitor && lo.enableRealtimeMonitor != null) {
              inherit (lo) enableRealtimeMonitor;
            }
            // optionalAttrs ((lo.typeOptions or []) != []) {
              typeOptions =
                map (typeOpt: {
                  inherit (typeOpt) type metadataFetchers imageFetchers;
                  metadataFetcherOrder =
                    if (typeOpt.metadataFetcherOrder or null) != null
                    then typeOpt.metadataFetcherOrder
                    else typeOpt.metadataFetchers;
                  imageFetcherOrder =
                    if (typeOpt.imageFetcherOrder or null) != null
                    then typeOpt.imageFetcherOrder
                    else typeOpt.imageFetchers;
                })
                (folder.libraryOptions.typeOptions or []);
            };
        })
      cfg.virtualFolders;
    };
in {
  inherit libraryConfigType mkLibraryConfig;
}
