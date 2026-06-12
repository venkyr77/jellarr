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

      # Enum options
      imageSavingConvention = mkOption {
        type = nullOr (types.enum ["Legacy" "Compatible"]);
        default = null;
        description = "Convention used when saving images.";
      };
      chapterImageResolution = mkOption {
        type = nullOr (types.enum ["MatchSource" "P144" "P240" "P360" "P480" "P720" "P1080" "P1440" "P2160"]);
        default = null;
        description = "Resolution to use when extracting chapter images.";
      };

      # String array options
      sortReplaceCharacters = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Characters to replace when sorting.";
      };
      sortRemoveCharacters = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Characters to remove when sorting.";
      };
      sortRemoveWords = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Words to remove when sorting.";
      };
      codecsUsed = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of codecs used by the server.";
      };
      corsHosts = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of hosts allowed via CORS.";
      };

      # String options
      cachePath = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to the server cache directory.";
      };
      metadataPath = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to the metadata directory.";
      };
      preferredMetadataLanguage = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Preferred language for metadata fetching.";
      };
      metadataCountryCode = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Country code used for metadata fetching.";
      };
      uiCulture = mkOption {
        type = nullOr types.str;
        default = null;
        description = "UI culture/locale string.";
      };

      # Int options
      logFileRetentionDays = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of days to retain log files.";
      };
      minResumePct = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Minimum percentage played before resume is enabled.";
      };
      maxResumePct = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Maximum percentage played before item is considered complete.";
      };
      minResumeDurationSeconds = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Minimum duration in seconds before resume is enabled.";
      };
      minAudiobookResume = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Minimum percentage played before audiobook resume is enabled.";
      };
      maxAudiobookResume = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Maximum percentage played before audiobook is considered complete.";
      };
      inactiveSessionThreshold = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Minutes of inactivity before a session is considered inactive.";
      };
      libraryMonitorDelay = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Delay in seconds before processing library monitor events.";
      };
      libraryUpdateDuration = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Duration in seconds for library update operations.";
      };
      cacheSize = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Cache size in MB.";
      };
      remoteClientBitrateLimit = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Bitrate limit in bits per second for remote clients.";
      };
      imageExtractionTimeoutMs = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Timeout in milliseconds for image extraction operations.";
      };
      slowResponseThresholdMs = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Threshold in milliseconds above which a response is considered slow.";
      };
      activityLogRetentionDays = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of days to retain activity log entries.";
      };
      libraryScanFanoutConcurrency = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of concurrent tasks during library scan fanout.";
      };
      libraryMetadataRefreshConcurrency = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of concurrent metadata refresh operations.";
      };
      dummyChapterDuration = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Duration in seconds for auto-generated dummy chapters.";
      };
      parallelImageEncodingLimit = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Maximum number of images to encode in parallel.";
      };

      # Bool options
      isStartupWizardCompleted = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Whether the startup wizard has been completed.";
      };
      enableNormalizedItemByNameIds = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable normalized item-by-name identifiers.";
      };
      isPortAuthorized = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Whether the server port is authorized.";
      };
      quickConnectAvailable = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Whether Quick Connect is available.";
      };
      enableCaseSensitiveItemIds = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable case-sensitive item identifiers.";
      };
      disableLiveTvChannelUserDataName = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Disable user data naming for live TV channels.";
      };
      skipDeserializationForBasicTypes = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Skip deserialization for basic primitive types.";
      };
      saveMetadataHidden = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save metadata files as hidden files.";
      };
      enableFolderView = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable folder view in clients.";
      };
      enableGroupingMoviesIntoCollections = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable grouping of movies into collections.";
      };
      enableGroupingShowsIntoCollections = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable grouping of TV shows into collections.";
      };
      displaySpecialsWithinSeasons = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Display special episodes within their associated seasons.";
      };
      enableExternalContentInSuggestions = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Include external content in suggestion results.";
      };
      enableSlowResponseWarning = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Emit a warning when responses exceed the slow response threshold.";
      };
      allowClientLogUpload = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Allow clients to upload log files to the server.";
      };
      enableLegacyAuthorization = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable legacy authorization mechanism.";
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
    }
    // optionalAttrs (c ? imageSavingConvention && c.imageSavingConvention != null) {inherit (c) imageSavingConvention;}
    // optionalAttrs (c ? chapterImageResolution && c.chapterImageResolution != null) {inherit (c) chapterImageResolution;}
    // optionalAttrs (c ? sortReplaceCharacters && c.sortReplaceCharacters != null) {inherit (c) sortReplaceCharacters;}
    // optionalAttrs (c ? sortRemoveCharacters && c.sortRemoveCharacters != null) {inherit (c) sortRemoveCharacters;}
    // optionalAttrs (c ? sortRemoveWords && c.sortRemoveWords != null) {inherit (c) sortRemoveWords;}
    // optionalAttrs (c ? codecsUsed && c.codecsUsed != null) {inherit (c) codecsUsed;}
    // optionalAttrs (c ? corsHosts && c.corsHosts != null) {inherit (c) corsHosts;}
    // optionalAttrs (c ? cachePath && c.cachePath != null) {inherit (c) cachePath;}
    // optionalAttrs (c ? metadataPath && c.metadataPath != null) {inherit (c) metadataPath;}
    // optionalAttrs (c ? preferredMetadataLanguage && c.preferredMetadataLanguage != null) {inherit (c) preferredMetadataLanguage;}
    // optionalAttrs (c ? metadataCountryCode && c.metadataCountryCode != null) {inherit (c) metadataCountryCode;}
    // optionalAttrs (c ? uiCulture && c.uiCulture != null) {inherit (c) uiCulture;}
    // optionalAttrs (c ? logFileRetentionDays && c.logFileRetentionDays != null) {inherit (c) logFileRetentionDays;}
    // optionalAttrs (c ? minResumePct && c.minResumePct != null) {inherit (c) minResumePct;}
    // optionalAttrs (c ? maxResumePct && c.maxResumePct != null) {inherit (c) maxResumePct;}
    // optionalAttrs (c ? minResumeDurationSeconds && c.minResumeDurationSeconds != null) {inherit (c) minResumeDurationSeconds;}
    // optionalAttrs (c ? minAudiobookResume && c.minAudiobookResume != null) {inherit (c) minAudiobookResume;}
    // optionalAttrs (c ? maxAudiobookResume && c.maxAudiobookResume != null) {inherit (c) maxAudiobookResume;}
    // optionalAttrs (c ? inactiveSessionThreshold && c.inactiveSessionThreshold != null) {inherit (c) inactiveSessionThreshold;}
    // optionalAttrs (c ? libraryMonitorDelay && c.libraryMonitorDelay != null) {inherit (c) libraryMonitorDelay;}
    // optionalAttrs (c ? libraryUpdateDuration && c.libraryUpdateDuration != null) {inherit (c) libraryUpdateDuration;}
    // optionalAttrs (c ? cacheSize && c.cacheSize != null) {inherit (c) cacheSize;}
    // optionalAttrs (c ? remoteClientBitrateLimit && c.remoteClientBitrateLimit != null) {inherit (c) remoteClientBitrateLimit;}
    // optionalAttrs (c ? imageExtractionTimeoutMs && c.imageExtractionTimeoutMs != null) {inherit (c) imageExtractionTimeoutMs;}
    // optionalAttrs (c ? slowResponseThresholdMs && c.slowResponseThresholdMs != null) {inherit (c) slowResponseThresholdMs;}
    // optionalAttrs (c ? activityLogRetentionDays && c.activityLogRetentionDays != null) {inherit (c) activityLogRetentionDays;}
    // optionalAttrs (c ? libraryScanFanoutConcurrency && c.libraryScanFanoutConcurrency != null) {inherit (c) libraryScanFanoutConcurrency;}
    // optionalAttrs (c ? libraryMetadataRefreshConcurrency && c.libraryMetadataRefreshConcurrency != null) {inherit (c) libraryMetadataRefreshConcurrency;}
    // optionalAttrs (c ? dummyChapterDuration && c.dummyChapterDuration != null) {inherit (c) dummyChapterDuration;}
    // optionalAttrs (c ? parallelImageEncodingLimit && c.parallelImageEncodingLimit != null) {inherit (c) parallelImageEncodingLimit;}
    // optionalAttrs (c ? isStartupWizardCompleted && c.isStartupWizardCompleted != null) {inherit (c) isStartupWizardCompleted;}
    // optionalAttrs (c ? enableNormalizedItemByNameIds && c.enableNormalizedItemByNameIds != null) {inherit (c) enableNormalizedItemByNameIds;}
    // optionalAttrs (c ? isPortAuthorized && c.isPortAuthorized != null) {inherit (c) isPortAuthorized;}
    // optionalAttrs (c ? quickConnectAvailable && c.quickConnectAvailable != null) {inherit (c) quickConnectAvailable;}
    // optionalAttrs (c ? enableCaseSensitiveItemIds && c.enableCaseSensitiveItemIds != null) {inherit (c) enableCaseSensitiveItemIds;}
    // optionalAttrs (c ? disableLiveTvChannelUserDataName && c.disableLiveTvChannelUserDataName != null) {inherit (c) disableLiveTvChannelUserDataName;}
    // optionalAttrs (c ? skipDeserializationForBasicTypes && c.skipDeserializationForBasicTypes != null) {inherit (c) skipDeserializationForBasicTypes;}
    // optionalAttrs (c ? saveMetadataHidden && c.saveMetadataHidden != null) {inherit (c) saveMetadataHidden;}
    // optionalAttrs (c ? enableFolderView && c.enableFolderView != null) {inherit (c) enableFolderView;}
    // optionalAttrs (c ? enableGroupingMoviesIntoCollections && c.enableGroupingMoviesIntoCollections != null) {inherit (c) enableGroupingMoviesIntoCollections;}
    // optionalAttrs (c ? enableGroupingShowsIntoCollections && c.enableGroupingShowsIntoCollections != null) {inherit (c) enableGroupingShowsIntoCollections;}
    // optionalAttrs (c ? displaySpecialsWithinSeasons && c.displaySpecialsWithinSeasons != null) {inherit (c) displaySpecialsWithinSeasons;}
    // optionalAttrs (c ? enableExternalContentInSuggestions && c.enableExternalContentInSuggestions != null) {inherit (c) enableExternalContentInSuggestions;}
    // optionalAttrs (c ? enableSlowResponseWarning && c.enableSlowResponseWarning != null) {inherit (c) enableSlowResponseWarning;}
    // optionalAttrs (c ? allowClientLogUpload && c.allowClientLogUpload != null) {inherit (c) allowClientLogUpload;}
    // optionalAttrs (c ? enableLegacyAuthorization && c.enableLegacyAuthorization != null) {inherit (c) enableLegacyAuthorization;};
in {
  inherit systemConfigType mkSystemConfig;
}
