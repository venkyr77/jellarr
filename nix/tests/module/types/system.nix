{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.system) mkSystemConfig;

  nullConfig = {
    serverName = null;
    enableMetrics = null;
    pluginRepositories = null;
    trickplayOptions = null;
    imageSavingConvention = null;
    chapterImageResolution = null;
    sortReplaceCharacters = null;
    sortRemoveCharacters = null;
    sortRemoveWords = null;
    codecsUsed = null;
    corsHosts = null;
    cachePath = null;
    metadataPath = null;
    preferredMetadataLanguage = null;
    metadataCountryCode = null;
    uiCulture = null;
    logFileRetentionDays = null;
    minResumePct = null;
    maxResumePct = null;
    minResumeDurationSeconds = null;
    minAudiobookResume = null;
    maxAudiobookResume = null;
    inactiveSessionThreshold = null;
    libraryMonitorDelay = null;
    libraryUpdateDuration = null;
    cacheSize = null;
    remoteClientBitrateLimit = null;
    imageExtractionTimeoutMs = null;
    slowResponseThresholdMs = null;
    activityLogRetentionDays = null;
    libraryScanFanoutConcurrency = null;
    libraryMetadataRefreshConcurrency = null;
    dummyChapterDuration = null;
    parallelImageEncodingLimit = null;
    isStartupWizardCompleted = null;
    enableNormalizedItemByNameIds = null;
    isPortAuthorized = null;
    quickConnectAvailable = null;
    enableCaseSensitiveItemIds = null;
    disableLiveTvChannelUserDataName = null;
    skipDeserializationForBasicTypes = null;
    saveMetadataHidden = null;
    enableFolderView = null;
    enableGroupingMoviesIntoCollections = null;
    enableGroupingShowsIntoCollections = null;
    displaySpecialsWithinSeasons = null;
    enableExternalContentInSuggestions = null;
    enableSlowResponseWarning = null;
    allowClientLogUpload = null;
    enableLegacyAuthorization = null;
  };

  nullTrickplayConfig = {
    enableHwAcceleration = null;
    enableHwEncoding = null;
    processThreads = null;
    enableKeyFrameOnlyExtraction = null;
    scanBehavior = null;
    processPriority = null;
    interval = null;
    widthResolutions = null;
    tileWidth = null;
    tileHeight = null;
    qscale = null;
    jpegQuality = null;
  };
in [
  (assertEq "empty config" (mkSystemConfig nullConfig) {})

  (assertEq "serverName only" (mkSystemConfig (nullConfig // {serverName = "MyServer";})) {
    serverName = "MyServer";
  })

  (assertEq "enableMetrics true" (mkSystemConfig (nullConfig // {enableMetrics = true;})) {
    enableMetrics = true;
  })

  (assertEq "enableMetrics false" (mkSystemConfig (nullConfig // {enableMetrics = false;})) {
    enableMetrics = false;
  })

  (assertEq "full config" (mkSystemConfig {
      enableMetrics = true;
      pluginRepositories = [
        {
          name = "Jellyfin Official";
          url = "https://repo.jellyfin.org/releases/plugin/manifest.json";
          enabled = true;
        }
      ];
      trickplayOptions =
        nullTrickplayConfig
        // {
          enableHwAcceleration = true;
          enableHwEncoding = false;
          processThreads = 2;
          enableKeyFrameOnlyExtraction = false;
          scanBehavior = "NonBlocking";
          processPriority = "Normal";
          interval = 10000;
          widthResolutions = [320 480 720];
          tileWidth = 10;
          tileHeight = 10;
          qscale = 4;
          jpegQuality = 90;
        };
    }) {
      enableMetrics = true;
      pluginRepositories = [
        {
          name = "Jellyfin Official";
          url = "https://repo.jellyfin.org/releases/plugin/manifest.json";
          enabled = true;
        }
      ];
      trickplayOptions = {
        enableHwAcceleration = true;
        enableHwEncoding = false;
        processThreads = 2;
        enableKeyFrameOnlyExtraction = false;
        scanBehavior = "NonBlocking";
        processPriority = "Normal";
        interval = 10000;
        widthResolutions = [320 480 720];
        tileWidth = 10;
        tileHeight = 10;
        qscale = 4;
        jpegQuality = 90;
      };
    })

  (assertEq "valid plugin repository" (mkSystemConfig (nullConfig
    // {
      pluginRepositories = [
        {
          name = "Test Repository";
          url = "https://example.com/manifest.json";
          enabled = true;
        }
      ];
    })) {
    pluginRepositories = [
      {
        name = "Test Repository";
        url = "https://example.com/manifest.json";
        enabled = true;
      }
    ];
  })

  (assertEq "multiple plugin repositories" (mkSystemConfig (nullConfig
    // {
      pluginRepositories = [
        {
          name = "Repo1";
          url = "https://example1.com";
          enabled = true;
        }
        {
          name = "Repo2";
          url = "https://example2.com";
          enabled = false;
        }
      ];
    })) {
    pluginRepositories = [
      {
        name = "Repo1";
        url = "https://example1.com";
        enabled = true;
      }
      {
        name = "Repo2";
        url = "https://example2.com";
        enabled = false;
      }
    ];
  })

  (assertThrows "reject empty repo name" (mkSystemConfig (nullConfig
    // {
      pluginRepositories = [
        {
          name = "";
          url = "https://example.com";
          enabled = true;
        }
      ];
    })))

  (assertEq "empty trickplay options" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig;
    })) {
    trickplayOptions = {};
  })

  (assertEq "trickplay enableHwAcceleration only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = true;
        enableHwEncoding = null;
      };
    })) {
    trickplayOptions = {enableHwAcceleration = true;};
  })

  (assertEq "trickplay enableHwEncoding only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = null;
        enableHwEncoding = false;
      };
    })) {
    trickplayOptions = {enableHwEncoding = false;};
  })

  (assertEq "trickplay both options" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = false;
        enableHwEncoding = true;
      };
    })) {
    trickplayOptions = {
      enableHwAcceleration = false;
      enableHwEncoding = true;
    };
  })

  (assertEq "trickplay processThreads only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = null;
        enableHwEncoding = null;
        processThreads = 3;
      };
    })) {
    trickplayOptions = {processThreads = 3;};
  })

  (assertEq "trickplay enableKeyFrameOnlyExtraction only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {enableKeyFrameOnlyExtraction = true;};
    })) {
    trickplayOptions = {enableKeyFrameOnlyExtraction = true;};
  })

  (assertEq "trickplay scanBehavior Blocking" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {scanBehavior = "Blocking";};
    })) {
    trickplayOptions = {scanBehavior = "Blocking";};
  })

  (assertEq "trickplay processPriority High" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {processPriority = "High";};
    })) {
    trickplayOptions = {processPriority = "High";};
  })

  (assertEq "trickplay tileWidth only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {tileWidth = 320;};
    })) {
    trickplayOptions = {tileWidth = 320;};
  })

  (assertEq "trickplay widthResolutions list" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {widthResolutions = [320 480];};
    })) {
    trickplayOptions = {widthResolutions = [320 480];};
  })

  # New field tests

  (assertEq "imageSavingConvention Legacy" (mkSystemConfig (nullConfig // {imageSavingConvention = "Legacy";})) {
    imageSavingConvention = "Legacy";
  })

  (assertEq "imageSavingConvention Compatible" (mkSystemConfig (nullConfig // {imageSavingConvention = "Compatible";})) {
    imageSavingConvention = "Compatible";
  })

  (assertEq "chapterImageResolution P1080" (mkSystemConfig (nullConfig // {chapterImageResolution = "P1080";})) {
    chapterImageResolution = "P1080";
  })

  (assertEq "chapterImageResolution MatchSource" (mkSystemConfig (nullConfig // {chapterImageResolution = "MatchSource";})) {
    chapterImageResolution = "MatchSource";
  })

  (assertEq "corsHosts list" (mkSystemConfig (nullConfig // {corsHosts = ["https://app.example.com" "https://other.example.com"];})) {
    corsHosts = ["https://app.example.com" "https://other.example.com"];
  })

  (assertEq "corsHosts empty list" (mkSystemConfig (nullConfig // {corsHosts = [];})) {
    corsHosts = [];
  })

  (assertEq "sortReplaceCharacters list" (mkSystemConfig (nullConfig // {sortReplaceCharacters = ["," "."];})) {
    sortReplaceCharacters = ["," "."];
  })

  (assertEq "sortRemoveCharacters list" (mkSystemConfig (nullConfig // {sortRemoveCharacters = ["!" "?"];})) {
    sortRemoveCharacters = ["!" "?"];
  })

  (assertEq "sortRemoveWords list" (mkSystemConfig (nullConfig // {sortRemoveWords = ["the" "a" "an"];})) {
    sortRemoveWords = ["the" "a" "an"];
  })

  (assertEq "codecsUsed list" (mkSystemConfig (nullConfig // {codecsUsed = ["h264" "hevc"];})) {
    codecsUsed = ["h264" "hevc"];
  })

  (assertEq "cachePath set" (mkSystemConfig (nullConfig // {cachePath = "/var/cache/jellyfin";})) {
    cachePath = "/var/cache/jellyfin";
  })

  (assertEq "metadataPath set" (mkSystemConfig (nullConfig // {metadataPath = "/var/lib/jellyfin/metadata";})) {
    metadataPath = "/var/lib/jellyfin/metadata";
  })

  (assertEq "preferredMetadataLanguage set" (mkSystemConfig (nullConfig // {preferredMetadataLanguage = "en";})) {
    preferredMetadataLanguage = "en";
  })

  (assertEq "metadataCountryCode set" (mkSystemConfig (nullConfig // {metadataCountryCode = "US";})) {
    metadataCountryCode = "US";
  })

  (assertEq "uiCulture set" (mkSystemConfig (nullConfig // {uiCulture = "en-US";})) {
    uiCulture = "en-US";
  })

  (assertEq "logFileRetentionDays set" (mkSystemConfig (nullConfig // {logFileRetentionDays = 14;})) {
    logFileRetentionDays = 14;
  })

  (assertEq "minResumePct set" (mkSystemConfig (nullConfig // {minResumePct = 5;})) {
    minResumePct = 5;
  })

  (assertEq "maxResumePct set" (mkSystemConfig (nullConfig // {maxResumePct = 90;})) {
    maxResumePct = 90;
  })

  (assertEq "minResumeDurationSeconds set" (mkSystemConfig (nullConfig // {minResumeDurationSeconds = 300;})) {
    minResumeDurationSeconds = 300;
  })

  (assertEq "minAudiobookResume set" (mkSystemConfig (nullConfig // {minAudiobookResume = 5;})) {
    minAudiobookResume = 5;
  })

  (assertEq "maxAudiobookResume set" (mkSystemConfig (nullConfig // {maxAudiobookResume = 90;})) {
    maxAudiobookResume = 90;
  })

  (assertEq "inactiveSessionThreshold set" (mkSystemConfig (nullConfig // {inactiveSessionThreshold = 30;})) {
    inactiveSessionThreshold = 30;
  })

  (assertEq "libraryMonitorDelay set" (mkSystemConfig (nullConfig // {libraryMonitorDelay = 60;})) {
    libraryMonitorDelay = 60;
  })

  (assertEq "libraryUpdateDuration set" (mkSystemConfig (nullConfig // {libraryUpdateDuration = 3600;})) {
    libraryUpdateDuration = 3600;
  })

  (assertEq "cacheSize set" (mkSystemConfig (nullConfig // {cacheSize = 1024;})) {
    cacheSize = 1024;
  })

  (assertEq "remoteClientBitrateLimit set" (mkSystemConfig (nullConfig // {remoteClientBitrateLimit = 10000000;})) {
    remoteClientBitrateLimit = 10000000;
  })

  (assertEq "imageExtractionTimeoutMs set" (mkSystemConfig (nullConfig // {imageExtractionTimeoutMs = 5000;})) {
    imageExtractionTimeoutMs = 5000;
  })

  (assertEq "slowResponseThresholdMs set" (mkSystemConfig (nullConfig // {slowResponseThresholdMs = 500;})) {
    slowResponseThresholdMs = 500;
  })

  (assertEq "activityLogRetentionDays set" (mkSystemConfig (nullConfig // {activityLogRetentionDays = 30;})) {
    activityLogRetentionDays = 30;
  })

  (assertEq "libraryScanFanoutConcurrency set" (mkSystemConfig (nullConfig // {libraryScanFanoutConcurrency = 4;})) {
    libraryScanFanoutConcurrency = 4;
  })

  (assertEq "libraryMetadataRefreshConcurrency set" (mkSystemConfig (nullConfig // {libraryMetadataRefreshConcurrency = 2;})) {
    libraryMetadataRefreshConcurrency = 2;
  })

  (assertEq "dummyChapterDuration set" (mkSystemConfig (nullConfig // {dummyChapterDuration = 300;})) {
    dummyChapterDuration = 300;
  })

  (assertEq "parallelImageEncodingLimit set" (mkSystemConfig (nullConfig // {parallelImageEncodingLimit = 8;})) {
    parallelImageEncodingLimit = 8;
  })

  (assertEq "isStartupWizardCompleted true" (mkSystemConfig (nullConfig // {isStartupWizardCompleted = true;})) {
    isStartupWizardCompleted = true;
  })

  (assertEq "enableNormalizedItemByNameIds true" (mkSystemConfig (nullConfig // {enableNormalizedItemByNameIds = true;})) {
    enableNormalizedItemByNameIds = true;
  })

  (assertEq "isPortAuthorized true" (mkSystemConfig (nullConfig // {isPortAuthorized = true;})) {
    isPortAuthorized = true;
  })

  (assertEq "quickConnectAvailable false" (mkSystemConfig (nullConfig // {quickConnectAvailable = false;})) {
    quickConnectAvailable = false;
  })

  (assertEq "enableCaseSensitiveItemIds true" (mkSystemConfig (nullConfig // {enableCaseSensitiveItemIds = true;})) {
    enableCaseSensitiveItemIds = true;
  })

  (assertEq "disableLiveTvChannelUserDataName true" (mkSystemConfig (nullConfig // {disableLiveTvChannelUserDataName = true;})) {
    disableLiveTvChannelUserDataName = true;
  })

  (assertEq "skipDeserializationForBasicTypes false" (mkSystemConfig (nullConfig // {skipDeserializationForBasicTypes = false;})) {
    skipDeserializationForBasicTypes = false;
  })

  (assertEq "saveMetadataHidden true" (mkSystemConfig (nullConfig // {saveMetadataHidden = true;})) {
    saveMetadataHidden = true;
  })

  (assertEq "enableFolderView false" (mkSystemConfig (nullConfig // {enableFolderView = false;})) {
    enableFolderView = false;
  })

  (assertEq "enableGroupingMoviesIntoCollections true" (mkSystemConfig (nullConfig // {enableGroupingMoviesIntoCollections = true;})) {
    enableGroupingMoviesIntoCollections = true;
  })

  (assertEq "enableGroupingShowsIntoCollections true" (mkSystemConfig (nullConfig // {enableGroupingShowsIntoCollections = true;})) {
    enableGroupingShowsIntoCollections = true;
  })

  (assertEq "displaySpecialsWithinSeasons true" (mkSystemConfig (nullConfig // {displaySpecialsWithinSeasons = true;})) {
    displaySpecialsWithinSeasons = true;
  })

  (assertEq "enableExternalContentInSuggestions false" (mkSystemConfig (nullConfig // {enableExternalContentInSuggestions = false;})) {
    enableExternalContentInSuggestions = false;
  })

  (assertEq "enableSlowResponseWarning true" (mkSystemConfig (nullConfig // {enableSlowResponseWarning = true;})) {
    enableSlowResponseWarning = true;
  })

  (assertEq "allowClientLogUpload false" (mkSystemConfig (nullConfig // {allowClientLogUpload = false;})) {
    allowClientLogUpload = false;
  })

  (assertEq "enableLegacyAuthorization false" (mkSystemConfig (nullConfig // {enableLegacyAuthorization = false;})) {
    enableLegacyAuthorization = false;
  })

  (assertEq "multiple new fields together" (mkSystemConfig (nullConfig
    // {
      imageSavingConvention = "Compatible";
      chapterImageResolution = "P720";
      corsHosts = ["https://app.example.com"];
      cachePath = "/var/cache/jellyfin";
      logFileRetentionDays = 7;
      maxResumePct = 95;
      isStartupWizardCompleted = true;
      enableFolderView = false;
      preferredMetadataLanguage = "en";
    })) {
    imageSavingConvention = "Compatible";
    chapterImageResolution = "P720";
    corsHosts = ["https://app.example.com"];
    cachePath = "/var/cache/jellyfin";
    logFileRetentionDays = 7;
    maxResumePct = 95;
    isStartupWizardCompleted = true;
    enableFolderView = false;
    preferredMetadataLanguage = "en";
  })
]
