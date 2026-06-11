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
      enableKeyFrameOnlyExtraction = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Extract only key frames during trickplay generation.";
      };
      scanBehavior = mkOption {
        type = nullOr (types.enum ["Blocking" "NonBlocking"]);
        default = null;
        description = "Whether trickplay scanning blocks media access or runs in the background.";
      };
      processPriority = mkOption {
        type = nullOr (types.enum ["Normal" "Idle" "High" "RealTime" "BelowNormal" "AboveNormal"]);
        default = null;
        description = "OS process priority for trickplay generation tasks.";
      };
      interval = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Interval in milliseconds between trickplay image captures.";
      };
      widthResolutions = mkOption {
        type = nullOr (types.listOf types.int);
        default = null;
        description = "List of image widths (in pixels) to generate for trickplay.";
      };
      tileWidth = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of images per row in a trickplay tile sheet.";
      };
      tileHeight = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of images per column in a trickplay tile sheet.";
      };
      qscale = mkOption {
        type = nullOr types.int;
        default = null;
        description = "FFmpeg qscale value for trickplay image quality.";
      };
      jpegQuality = mkOption {
        type = nullOr types.int;
        default = null;
        description = "JPEG quality (1–100) for trickplay images.";
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
    // optionalAttrs (c ? processThreads && c.processThreads != null) {inherit (c) processThreads;}
    // optionalAttrs (c ? enableKeyFrameOnlyExtraction && c.enableKeyFrameOnlyExtraction != null) {inherit (c) enableKeyFrameOnlyExtraction;}
    // optionalAttrs (c ? scanBehavior && c.scanBehavior != null) {inherit (c) scanBehavior;}
    // optionalAttrs (c ? processPriority && c.processPriority != null) {inherit (c) processPriority;}
    // optionalAttrs (c ? interval && c.interval != null) {inherit (c) interval;}
    // optionalAttrs (c ? widthResolutions && c.widthResolutions != null) {inherit (c) widthResolutions;}
    // optionalAttrs (c ? tileWidth && c.tileWidth != null) {inherit (c) tileWidth;}
    // optionalAttrs (c ? tileHeight && c.tileHeight != null) {inherit (c) tileHeight;}
    // optionalAttrs (c ? qscale && c.qscale != null) {inherit (c) qscale;}
    // optionalAttrs (c ? jpegQuality && c.jpegQuality != null) {inherit (c) jpegQuality;};

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
