{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  pluginRepositoryConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "Plugin repository name.";
      };
      url = mkOption {
        type = types.str;
        description = "Plugin repository URL.";
      };
      enabled = mkOption {
        type = types.bool;
        description = "Whether the repository is enabled.";
      };
    };
  };

  trickplayOptionsConfigType = types.submodule {
    options = {
      enableHwAcceleration = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable hardware acceleration for trickplay.";
      };
      enableHwEncoding = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable hardware encoding for trickplay.";
      };
      processThreads = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of threads to use for trickplay processing.";
      };
    };
  };

  systemConfigType = types.submodule {
    options = {
      serverName = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Server name shown in clients.";
      };
      enableMetrics = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable Prometheus metrics endpoint.";
      };
      pluginRepositories = mkOption {
        type = nullOr (types.listOf pluginRepositoryConfigType);
        default = null;
        description = "List of plugin repositories.";
      };
      trickplayOptions = mkOption {
        type = nullOr trickplayOptionsConfigType;
        default = null;
        description = "Trickplay generation options.";
      };
    };
  };

  mkTrickplayOptionsConfig = cfg: let
    c =
      if cfg == null
      then {}
      else cfg;
  in
    {}
    // optionalAttrs (c ? enableHwAcceleration && c.enableHwAcceleration != null) {inherit (c) enableHwAcceleration;}
    // optionalAttrs (c ? enableHwEncoding && c.enableHwEncoding != null) {inherit (c) enableHwEncoding;}
    // optionalAttrs (c ? processThreads && c.processThreads != null) {inherit (c) processThreads;};

  mkSystemConfig = cfg: let
    c =
      if cfg == null
      then {}
      else cfg;
  in
    {}
    // optionalAttrs (c ? serverName && c.serverName != null) {inherit (c) serverName;}
    // optionalAttrs (c ? enableMetrics && c.enableMetrics != null) {inherit (c) enableMetrics;}
    // optionalAttrs (c ? pluginRepositories && c.pluginRepositories != null) {
      pluginRepositories = map (repo:
        assert repo.name != "" || throw "Plugin repository name cannot be empty"; {
          inherit (repo) name url enabled;
        })
      c.pluginRepositories;
    }
    // optionalAttrs (c ? trickplayOptions && c.trickplayOptions != null) {
      trickplayOptions = mkTrickplayOptionsConfig c.trickplayOptions;
    };
in {
  inherit systemConfigType mkSystemConfig;
}
