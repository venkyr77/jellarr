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

  libraryOptionsConfigType = types.submodule {
    options = {
      pathInfos = mkOption {
        type = types.listOf pathInfoConfigType;
        description = "List of paths for this library.";
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
          libraryOptions = {
            pathInfos =
              map (pathInfo: {inherit (pathInfo) path;})
              folder.libraryOptions.pathInfos;
          };
        })
      cfg.virtualFolders;
    };
in {
  inherit libraryConfigType mkLibraryConfig;
}
