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
        || throw "Library '${folder.name}' must have at least one path in pathInfos"; {
          inherit (folder) name collectionType;
          libraryOptions =
            {
              pathInfos =
                map (pathInfo: {inherit (pathInfo) path;})
                folder.libraryOptions.pathInfos;
            }
            // optionalAttrs ((folder.libraryOptions.typeOptions or []) != []) {
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
