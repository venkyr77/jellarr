{lib}: let
  inherit (lib) types mkOption optionalAttrs;
  inherit (types) nullOr;

  subTypes = {
    apiKeys = import ./api-keys.nix {inherit lib;};
    brandingOptions = import ./branding-options.nix {inherit lib;};
    encodingOptions = import ./encoding-options.nix {inherit lib;};
    library = import ./library.nix {inherit lib;};
    networking = import ./networking.nix {inherit lib;};
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
      networking = mkOption {
        type = nullOr subTypes.networking.networkingConfigType;
        default = null;
        description = "Networking configuration.";
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
      api_keys = mkOption {
        type = nullOr subTypes.apiKeys.apiKeysConfigType;
        default = null;
        description = "API keys to create.";
      };
    };
  };

  mkConfig = cfg:
    assert cfg.version >= 1 || throw "Version must be a positive integer";
    assert cfg.base_url != "" || throw "base_url must not be empty";
      {
        inherit (cfg) version base_url;
      }
      // optionalAttrs (cfg ? system && cfg.system != null) {
        system = subTypes.system.mkSystemConfig cfg.system;
      }
      // optionalAttrs (cfg ? encoding && cfg.encoding != null) {
        encoding = subTypes.encodingOptions.mkEncodingOptionsConfig cfg.encoding;
      }
      // optionalAttrs (cfg ? networking && cfg.networking != null) {
        networking = subTypes.networking.mkNetworkingConfig cfg.networking;
      }
      // optionalAttrs (cfg ? library && cfg.library != null) {
        library = subTypes.library.mkLibraryConfig cfg.library;
      }
      // optionalAttrs (cfg ? branding && cfg.branding != null) {
        branding = subTypes.brandingOptions.mkBrandingOptionsConfig cfg.branding;
      }
      // optionalAttrs (cfg ? users && cfg.users != null) {
        users = subTypes.users.mkUsersConfig cfg.users;
      }
      // optionalAttrs (cfg ? plugins && cfg.plugins != null) {
        plugins = subTypes.plugins.mkPluginsConfig cfg.plugins;
      }
      // optionalAttrs (cfg ? startup && cfg.startup != null) {
        startup = subTypes.startup.mkStartupConfig cfg.startup;
      }
      // optionalAttrs (cfg ? api_keys && cfg.api_keys != null) {
        api_keys = subTypes.apiKeys.mkApiKeysConfig cfg.api_keys;
      };
in {
  inherit rootConfigType mkConfig;
}
