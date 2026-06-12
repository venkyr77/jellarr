import { describe, it, expect } from "vitest";
import {
  toPluginRepositorySchemas,
  mapSystemConfigurationConfigToSchema,
} from "../../src/mappers/system";
import type { SystemConfig } from "../../src/types/config/system";
import type { PluginRepositoryConfig } from "../../src/types/config/system";
import type {
  PluginRepositorySchema,
  ServerConfigurationSchema,
} from "../../src/types/schema/system";

describe("mappers/system", () => {
  describe("toPluginRepositorySchemas", () => {
    it("should convert empty config array to empty server schema array", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([]);
    });

    it("should convert config format to server schema with proper field mapping", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [
        { name: "Config Repo A", url: "https://config-a.com", enabled: true },
        { name: "Config Repo B", url: "https://config-b.com", enabled: false },
      ];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([
        { Name: "Config Repo A", Url: "https://config-a.com", Enabled: true },
        { Name: "Config Repo B", Url: "https://config-b.com", Enabled: false },
      ]);
    });

    it("should handle single repository conversion", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [
        {
          name: "Single Config",
          url: "https://single-config.com",
          enabled: true,
        },
      ];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([
        {
          Name: "Single Config",
          Url: "https://single-config.com",
          Enabled: true,
        },
      ]);
    });

    it("should convert disabled repositories correctly", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [
        {
          name: "Disabled Config",
          url: "https://disabled-config.com",
          enabled: false,
        },
      ];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([
        {
          Name: "Disabled Config",
          Url: "https://disabled-config.com",
          Enabled: false,
        },
      ]);
    });
  });

  describe("mapSystemConfigurationConfigToSchema", () => {
    it("should map enableMetrics to EnableMetrics", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: true,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableMetrics: true,
      });
    });

    it("should map enableMetrics false to EnableMetrics false", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: false,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableMetrics: false,
      });
    });

    it("should map pluginRepositories to PluginRepositories", () => {
      // Arrange
      const config: SystemConfig = {
        pluginRepositories: [
          { name: "Test Repo", url: "https://test.com", enabled: true },
          { name: "Another Repo", url: "https://another.com", enabled: false },
        ],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        PluginRepositories: [
          { Name: "Test Repo", Url: "https://test.com", Enabled: true },
          { Name: "Another Repo", Url: "https://another.com", Enabled: false },
        ],
      });
    });

    it("should map empty pluginRepositories to empty PluginRepositories", () => {
      // Arrange
      const config: SystemConfig = {
        pluginRepositories: [],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        PluginRepositories: [],
      });
    });

    it("should map trickplayOptions to TrickplayOptions", () => {
      // Arrange
      const config: SystemConfig = {
        serverName: "MyServer",
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
          processThreads: 2,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        ServerName: "MyServer",
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: false,
          ProcessThreads: 2,
        },
      });
    });

    it("should map partial trickplayOptions (enableHwAcceleration only)", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwAcceleration: true,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {
          EnableHwAcceleration: true,
        },
      });
    });

    it("should map partial trickplayOptions (enableHwEncoding only)", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwEncoding: false,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {
          EnableHwEncoding: false,
        },
      });
    });

    it("should map empty trickplayOptions to empty TrickplayOptions", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {},
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {},
      });
    });

    it("should map multiple fields simultaneously", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: true,
        pluginRepositories: [
          { name: "Multi Repo", url: "https://multi.com", enabled: true },
        ],
        trickplayOptions: {
          enableHwAcceleration: false,
          enableHwEncoding: true,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableMetrics: true,
        PluginRepositories: [
          { Name: "Multi Repo", Url: "https://multi.com", Enabled: true },
        ],
        TrickplayOptions: {
          EnableHwAcceleration: false,
          EnableHwEncoding: true,
        },
      });
    });

    it("should return empty object when no fields are provided", () => {
      // Arrange
      const config: SystemConfig = {};

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include EnableMetrics when enableMetrics is undefined", () => {
      // Arrange
      const config: SystemConfig = {
        pluginRepositories: [],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableMetrics");
      expect(result).toEqual({
        PluginRepositories: [],
      });
    });

    it("should not include PluginRepositories when pluginRepositories is undefined", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: true,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("PluginRepositories");
      expect(result).toEqual({
        EnableMetrics: true,
      });
    });

    it("should not include TrickplayOptions when trickplayOptions is undefined", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: false,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("TrickplayOptions");
      expect(result).toEqual({
        EnableMetrics: false,
      });
    });

    it("should map trickplayOptions enableKeyFrameOnlyExtraction to EnableKeyFrameOnlyExtraction", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { enableKeyFrameOnlyExtraction: true },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        EnableKeyFrameOnlyExtraction: true,
      });
    });

    it("should map trickplayOptions scanBehavior to ScanBehavior", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { scanBehavior: "NonBlocking" },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ ScanBehavior: "NonBlocking" });
    });

    it("should map trickplayOptions processPriority to ProcessPriority", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { processPriority: "BelowNormal" },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        ProcessPriority: "BelowNormal",
      });
    });

    it("should map trickplayOptions interval to Interval", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { interval: 10000 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ Interval: 10000 });
    });

    it("should map trickplayOptions widthResolutions to WidthResolutions", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { widthResolutions: [320, 640] },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        WidthResolutions: [320, 640],
      });
    });

    it("should map trickplayOptions tileWidth to TileWidth", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { tileWidth: 10 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ TileWidth: 10 });
    });

    it("should map trickplayOptions tileHeight to TileHeight", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { tileHeight: 10 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ TileHeight: 10 });
    });

    it("should map trickplayOptions qscale to Qscale", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { qscale: 4 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ Qscale: 4 });
    });

    it("should map trickplayOptions jpegQuality to JpegQuality", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { jpegQuality: 85 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ JpegQuality: 85 });
    });

    it("should omit undefined trickplayOptions fields from output", () => {
      // Arrange: only interval set; all other fields absent
      const config: SystemConfig = {
        trickplayOptions: { interval: 5000 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toHaveProperty("Interval", 5000);
      expect(result.TrickplayOptions).not.toHaveProperty(
        "EnableHwAcceleration",
      );
      expect(result.TrickplayOptions).not.toHaveProperty("EnableHwEncoding");
      expect(result.TrickplayOptions).not.toHaveProperty("ProcessThreads");
      expect(result.TrickplayOptions).not.toHaveProperty(
        "EnableKeyFrameOnlyExtraction",
      );
      expect(result.TrickplayOptions).not.toHaveProperty("ScanBehavior");
      expect(result.TrickplayOptions).not.toHaveProperty("ProcessPriority");
      expect(result.TrickplayOptions).not.toHaveProperty("WidthResolutions");
      expect(result.TrickplayOptions).not.toHaveProperty("TileWidth");
      expect(result.TrickplayOptions).not.toHaveProperty("TileHeight");
      expect(result.TrickplayOptions).not.toHaveProperty("Qscale");
      expect(result.TrickplayOptions).not.toHaveProperty("JpegQuality");
    });

    it("should map all 12 trickplayOptions fields simultaneously", () => {
      // Arrange: all 12 fields set
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
          processThreads: 4,
          enableKeyFrameOnlyExtraction: true,
          scanBehavior: "Blocking",
          processPriority: "Normal",
          interval: 2000,
          widthResolutions: [160, 320, 640],
          tileWidth: 8,
          tileHeight: 8,
          qscale: 2,
          jpegQuality: 90,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        EnableHwAcceleration: true,
        EnableHwEncoding: false,
        ProcessThreads: 4,
        EnableKeyFrameOnlyExtraction: true,
        ScanBehavior: "Blocking",
        ProcessPriority: "Normal",
        Interval: 2000,
        WidthResolutions: [160, 320, 640],
        TileWidth: 8,
        TileHeight: 8,
        Qscale: 2,
        JpegQuality: 90,
      });
    });

    it("should map imageSavingConvention enum to ImageSavingConvention", () => {
      // Arrange: enum value "Compatible"
      const config: SystemConfig = {
        imageSavingConvention: "Compatible",
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({ ImageSavingConvention: "Compatible" });
    });

    it("should map chapterImageResolution enum to ChapterImageResolution", () => {
      // Arrange: enum value "P1080"
      const config: SystemConfig = {
        chapterImageResolution: "P1080",
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({ ChapterImageResolution: "P1080" });
    });

    it("should map corsHosts array to CorsHosts", () => {
      // Arrange: two CORS origin strings
      const config: SystemConfig = {
        corsHosts: ["https://app.example.com", "https://admin.example.com"],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        CorsHosts: ["https://app.example.com", "https://admin.example.com"],
      });
    });

    it("should map numeric scalar fields", () => {
      // Arrange: a representative set of integer scalars
      const config: SystemConfig = {
        logFileRetentionDays: 14,
        minResumePct: 5,
        maxResumePct: 90,
        minResumeDurationSeconds: 300,
        cacheSize: 1024,
        activityLogRetentionDays: 30,
        dummyChapterDuration: 600,
        parallelImageEncodingLimit: 4,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        LogFileRetentionDays: 14,
        MinResumePct: 5,
        MaxResumePct: 90,
        MinResumeDurationSeconds: 300,
        CacheSize: 1024,
        ActivityLogRetentionDays: 30,
        DummyChapterDuration: 600,
        ParallelImageEncodingLimit: 4,
      });
    });

    it("should map string scalar fields", () => {
      // Arrange: path + locale strings
      const config: SystemConfig = {
        cachePath: "/var/cache/jellyfin",
        metadataPath: "/var/lib/jellyfin/metadata",
        preferredMetadataLanguage: "en",
        metadataCountryCode: "US",
        uiCulture: "en-US",
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        CachePath: "/var/cache/jellyfin",
        MetadataPath: "/var/lib/jellyfin/metadata",
        PreferredMetadataLanguage: "en",
        MetadataCountryCode: "US",
        UICulture: "en-US",
      });
    });

    it("should map boolean scalar fields", () => {
      // Arrange: a representative set of boolean flags
      const config: SystemConfig = {
        isStartupWizardCompleted: true,
        enableFolderView: false,
        displaySpecialsWithinSeasons: true,
        allowClientLogUpload: false,
        enableLegacyAuthorization: false,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        IsStartupWizardCompleted: true,
        EnableFolderView: false,
        DisplaySpecialsWithinSeasons: true,
        AllowClientLogUpload: false,
        EnableLegacyAuthorization: false,
      });
    });

    it("should omit new fields when they are undefined", () => {
      // Arrange: only serverName; all 46 new fields absent
      const config: SystemConfig = {
        serverName: "MyServer",
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert: new fields must not appear on the output
      expect(result).toEqual({ ServerName: "MyServer" });
      expect(result).not.toHaveProperty("ImageSavingConvention");
      expect(result).not.toHaveProperty("ChapterImageResolution");
      expect(result).not.toHaveProperty("SortReplaceCharacters");
      expect(result).not.toHaveProperty("SortRemoveCharacters");
      expect(result).not.toHaveProperty("SortRemoveWords");
      expect(result).not.toHaveProperty("CodecsUsed");
      expect(result).not.toHaveProperty("CorsHosts");
      expect(result).not.toHaveProperty("CachePath");
      expect(result).not.toHaveProperty("MetadataPath");
      expect(result).not.toHaveProperty("PreferredMetadataLanguage");
      expect(result).not.toHaveProperty("MetadataCountryCode");
      expect(result).not.toHaveProperty("UICulture");
      expect(result).not.toHaveProperty("LogFileRetentionDays");
      expect(result).not.toHaveProperty("MinResumePct");
      expect(result).not.toHaveProperty("MaxResumePct");
      expect(result).not.toHaveProperty("MinResumeDurationSeconds");
      expect(result).not.toHaveProperty("MinAudiobookResume");
      expect(result).not.toHaveProperty("MaxAudiobookResume");
      expect(result).not.toHaveProperty("InactiveSessionThreshold");
      expect(result).not.toHaveProperty("LibraryMonitorDelay");
      expect(result).not.toHaveProperty("LibraryUpdateDuration");
      expect(result).not.toHaveProperty("CacheSize");
      expect(result).not.toHaveProperty("RemoteClientBitrateLimit");
      expect(result).not.toHaveProperty("ImageExtractionTimeoutMs");
      expect(result).not.toHaveProperty("SlowResponseThresholdMs");
      expect(result).not.toHaveProperty("ActivityLogRetentionDays");
      expect(result).not.toHaveProperty("LibraryScanFanoutConcurrency");
      expect(result).not.toHaveProperty("LibraryMetadataRefreshConcurrency");
      expect(result).not.toHaveProperty("DummyChapterDuration");
      expect(result).not.toHaveProperty("ParallelImageEncodingLimit");
      expect(result).not.toHaveProperty("IsStartupWizardCompleted");
      expect(result).not.toHaveProperty("EnableNormalizedItemByNameIds");
      expect(result).not.toHaveProperty("IsPortAuthorized");
      expect(result).not.toHaveProperty("QuickConnectAvailable");
      expect(result).not.toHaveProperty("EnableCaseSensitiveItemIds");
      expect(result).not.toHaveProperty("DisableLiveTvChannelUserDataName");
      expect(result).not.toHaveProperty("SkipDeserializationForBasicTypes");
      expect(result).not.toHaveProperty("SaveMetadataHidden");
      expect(result).not.toHaveProperty("EnableFolderView");
      expect(result).not.toHaveProperty("EnableGroupingMoviesIntoCollections");
      expect(result).not.toHaveProperty("EnableGroupingShowsIntoCollections");
      expect(result).not.toHaveProperty("DisplaySpecialsWithinSeasons");
      expect(result).not.toHaveProperty("EnableExternalContentInSuggestions");
      expect(result).not.toHaveProperty("EnableSlowResponseWarning");
      expect(result).not.toHaveProperty("AllowClientLogUpload");
      expect(result).not.toHaveProperty("EnableLegacyAuthorization");
    });

    it("should map all 46 new ServerConfiguration fields simultaneously", () => {
      // Arrange: every newly-added field set to a concrete value
      const config: SystemConfig = {
        imageSavingConvention: "Legacy",
        chapterImageResolution: "P720",
        sortReplaceCharacters: [".", "+", "%"],
        sortRemoveCharacters: ["~"],
        sortRemoveWords: ["the", "a", "an"],
        codecsUsed: ["h264", "hevc"],
        corsHosts: ["*"],
        cachePath: "/cache",
        metadataPath: "/metadata",
        preferredMetadataLanguage: "fr",
        metadataCountryCode: "FR",
        uiCulture: "fr-FR",
        logFileRetentionDays: 7,
        minResumePct: 3,
        maxResumePct: 92,
        minResumeDurationSeconds: 120,
        minAudiobookResume: 5,
        maxAudiobookResume: 5,
        inactiveSessionThreshold: 0,
        libraryMonitorDelay: 60,
        libraryUpdateDuration: 30,
        cacheSize: 512,
        remoteClientBitrateLimit: 10000000,
        imageExtractionTimeoutMs: 60000,
        slowResponseThresholdMs: 500,
        activityLogRetentionDays: null,
        libraryScanFanoutConcurrency: 2,
        libraryMetadataRefreshConcurrency: 2,
        dummyChapterDuration: 300,
        parallelImageEncodingLimit: 0,
        isStartupWizardCompleted: true,
        enableNormalizedItemByNameIds: false,
        isPortAuthorized: true,
        quickConnectAvailable: true,
        enableCaseSensitiveItemIds: false,
        disableLiveTvChannelUserDataName: false,
        skipDeserializationForBasicTypes: true,
        saveMetadataHidden: false,
        enableFolderView: true,
        enableGroupingMoviesIntoCollections: true,
        enableGroupingShowsIntoCollections: false,
        displaySpecialsWithinSeasons: true,
        enableExternalContentInSuggestions: false,
        enableSlowResponseWarning: true,
        allowClientLogUpload: false,
        enableLegacyAuthorization: false,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert: all 46 fields present with correct PascalCase keys
      expect(result).toEqual({
        ImageSavingConvention: "Legacy",
        ChapterImageResolution: "P720",
        SortReplaceCharacters: [".", "+", "%"],
        SortRemoveCharacters: ["~"],
        SortRemoveWords: ["the", "a", "an"],
        CodecsUsed: ["h264", "hevc"],
        CorsHosts: ["*"],
        CachePath: "/cache",
        MetadataPath: "/metadata",
        PreferredMetadataLanguage: "fr",
        MetadataCountryCode: "FR",
        UICulture: "fr-FR",
        LogFileRetentionDays: 7,
        MinResumePct: 3,
        MaxResumePct: 92,
        MinResumeDurationSeconds: 120,
        MinAudiobookResume: 5,
        MaxAudiobookResume: 5,
        InactiveSessionThreshold: 0,
        LibraryMonitorDelay: 60,
        LibraryUpdateDuration: 30,
        CacheSize: 512,
        RemoteClientBitrateLimit: 10000000,
        ImageExtractionTimeoutMs: 60000,
        SlowResponseThresholdMs: 500,
        ActivityLogRetentionDays: null,
        LibraryScanFanoutConcurrency: 2,
        LibraryMetadataRefreshConcurrency: 2,
        DummyChapterDuration: 300,
        ParallelImageEncodingLimit: 0,
        IsStartupWizardCompleted: true,
        EnableNormalizedItemByNameIds: false,
        IsPortAuthorized: true,
        QuickConnectAvailable: true,
        EnableCaseSensitiveItemIds: false,
        DisableLiveTvChannelUserDataName: false,
        SkipDeserializationForBasicTypes: true,
        SaveMetadataHidden: false,
        EnableFolderView: true,
        EnableGroupingMoviesIntoCollections: true,
        EnableGroupingShowsIntoCollections: false,
        DisplaySpecialsWithinSeasons: true,
        EnableExternalContentInSuggestions: false,
        EnableSlowResponseWarning: true,
        AllowClientLogUpload: false,
        EnableLegacyAuthorization: false,
      });
    });
  });
});
