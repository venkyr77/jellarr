{lib}: let
  inherit (lib) types mkOption optionalAttrs;
  inherit (types) nullOr;

  subTypes = {
    brandingOptions = import ./branding-options.nix {inherit lib;};
    encodingOptions = import ./encoding-options.nix {inherit lib;};
    library = import ./library.nix {inherit lib;};
    plugins = import ./plugins.nix {inherit lib;};
    startup = import ./startup.nix {inherit lib;};
    system = import ./system.nix {inherit lib;};
    users = import ./users.nix {inherit lib;};
  };

  rootConfigType = types.submodule {
    options = {
      version = mkOption {
        type = types.int;
        description = "Configuration version (must be positive).";
      };
      base_url = mkOption {
        type = types.str;
        description = "Jellyfin server base URL.";
      };
      system = mkOption {
        type = nullOr subTypes.system.systemConfigType;
        default = null;
        description = "System configuration.";
      };
      encoding = mkOption {
        type = nullOr subTypes.encodingOptions.encodingOptionsConfigType;
        default = null;
        description = "Encoding options configuration.";
      };
      library = mkOption {
        type = nullOr subTypes.library.libraryConfigType;
        default = null;
        description = "Library configuration.";
      };
      branding = mkOption {
        type = nullOr subTypes.brandingOptions.brandingOptionsConfigType;
        default = null;
        description = "Branding options configuration.";
      };
      users = mkOption {
        type = nullOr subTypes.users.usersConfigType;
        default = null;
        description = "Users configuration.";
      };
      plugins = mkOption {
        type = nullOr subTypes.plugins.pluginsConfigType;
        default = null;
        description = "Plugins configuration.";
      };
      startup = mkOption {
        type = nullOr subTypes.startup.startupConfigType;
        default = null;
        description = "Startup configuration.";
      };
    };
  };

  mkConfig = cfg:
    assert cfg.version >= 1 || throw "Version must be a positive integer";
    assert cfg.base_url != "" || throw "base_url must not be empty";
      {
        inherit (cfg) version base_url;
      }
      // optionalAttrs (cfg.system != null) {
        system = subTypes.system.mkSystemConfig cfg.system;
      }
      // optionalAttrs (cfg.encoding != null) {
        encoding = subTypes.encodingOptions.mkEncodingOptionsConfig cfg.encoding;
      }
      // optionalAttrs (cfg.library != null) {
        library = subTypes.library.mkLibraryConfig cfg.library;
      }
      // optionalAttrs (cfg.branding != null) {
        branding = subTypes.brandingOptions.mkBrandingOptionsConfig cfg.branding;
      }
      // optionalAttrs (cfg.users != null) {
        users = subTypes.users.mkUsersConfig cfg.users;
      }
      // optionalAttrs (cfg.plugins != null) {
        plugins = subTypes.plugins.mkPluginsConfig cfg.plugins;
      }
      // optionalAttrs (cfg.startup != null) {
        startup = subTypes.startup.mkStartupConfig cfg.startup;
      };
in {
  inherit rootConfigType mkConfig;
}
