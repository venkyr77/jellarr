import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  SystemConfigType,
  type SystemConfig,
  PluginRepositoryConfigType,
  type PluginRepositoryConfig,
  TrickplayOptionsConfigType,
  type TrickplayOptionsConfig,
} from "../../../src/types/config/system";

describe("SystemConfig", () => {
  it("should validate empty system config", () => {
    // Arrange
    const validConfig: z.input<typeof SystemConfigType> = {};

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate full system config", () => {
    // Arrange
    const validConfig: z.input<typeof SystemConfigType> = {
      enableMetrics: true,
      pluginRepositories: [
        {
          name: "Jellyfin Official",
          url: "https://repo.jellyfin.org/releases/plugin/manifest.json",
          enabled: true,
        },
      ],
      trickplayOptions: {
        enableHwAcceleration: true,
        enableHwEncoding: false,
      },
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof SystemConfigType> = {
      enableMetrics: true,
      // @ts-expect-error intentional extra field for test
      unknownField: "should not be allowed",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });
});

describe("PluginRepositoryConfig", () => {
  it("should validate valid plugin repository config", () => {
    // Arrange
    const validConfig: z.input<typeof PluginRepositoryConfigType> = {
      name: "Test Repository",
      url: "https://example.com/manifest.json",
      enabled: true,
    };

    // Act
    const result: ZodSafeParseResult<PluginRepositoryConfig> =
      PluginRepositoryConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject empty name", () => {
    // Arrange
    const invalidConfig: z.input<typeof PluginRepositoryConfigType> = {
      name: "",
      url: "https://example.com/manifest.json",
      enabled: true,
    };

    // Act
    const result: ZodSafeParseResult<PluginRepositoryConfig> =
      PluginRepositoryConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const nameError: z.core.$ZodIssue | undefined = result.error.issues.find(
        (err: z.core.$ZodIssue) => err.path.includes("name"),
      );
      expect(nameError?.message).toContain("cannot be empty");
    }
  });

  it("should reject invalid URL", () => {
    // Arrange
    const invalidConfig: z.input<typeof PluginRepositoryConfigType> = {
      name: "Test Repository",
      url: "not-a-valid-url",
      enabled: true,
    };

    // Act
    const result: ZodSafeParseResult<PluginRepositoryConfig> =
      PluginRepositoryConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const urlError: z.core.$ZodIssue | undefined = result.error.issues.find(
        (err: z.core.$ZodIssue) => err.path.includes("url"),
      );
      expect(urlError?.message).toContain("must be a valid URL");
    }
  });

  it("should reject missing fields", () => {
    // Arrange
    const invalidConfig: Partial<z.input<typeof PluginRepositoryConfigType>> = {
      name: "Test Repository",
    };

    // Act
    const result: ZodSafeParseResult<PluginRepositoryConfig> =
      PluginRepositoryConfigType.safeParse(
        invalidConfig as z.input<typeof PluginRepositoryConfigType>,
      );

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("TrickplayOptionsConfig", () => {
  it("should validate empty trickplay options", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {};

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate with only enableHwAcceleration", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      enableHwAcceleration: true,
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate with both options", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      enableHwAcceleration: false,
      enableHwEncoding: true,
      processThreads: 4,
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-boolean values", () => {
    // Arrange
    const invalidConfig: z.input<typeof TrickplayOptionsConfigType> = {
      // @ts-expect-error intentional bad type for test
      enableHwAcceleration: "true",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate enableKeyFrameOnlyExtraction", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      enableKeyFrameOnlyExtraction: true,
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate scanBehavior Blocking", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      scanBehavior: "Blocking",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate scanBehavior NonBlocking", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      scanBehavior: "NonBlocking",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject invalid scanBehavior value", () => {
    // Arrange
    const invalidConfig: z.input<typeof TrickplayOptionsConfigType> = {
      // @ts-expect-error intentional bad enum value for test
      scanBehavior: "InvalidValue",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate processPriority Normal", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      processPriority: "Normal",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate processPriority BelowNormal", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      processPriority: "BelowNormal",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject invalid processPriority value", () => {
    // Arrange
    const invalidConfig: z.input<typeof TrickplayOptionsConfigType> = {
      // @ts-expect-error intentional bad enum value for test
      processPriority: "Ultra",
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate interval as int", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      interval: 30,
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-int for interval", () => {
    // Arrange
    const invalidConfig: z.input<typeof TrickplayOptionsConfigType> = {
      interval: 1.5,
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject non-integer widthResolutions element", () => {
    // Arrange — array elements are constrained by z.number().int()
    const invalidConfig: z.input<typeof TrickplayOptionsConfigType> = {
      widthResolutions: [320.5],
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate processPriority High, RealTime, and AboveNormal", () => {
    // Arrange — three enum values not covered by the single-value tests above
    const highConfig: z.input<typeof TrickplayOptionsConfigType> = {
      processPriority: "High",
    };
    const realTimeConfig: z.input<typeof TrickplayOptionsConfigType> = {
      processPriority: "RealTime",
    };
    const aboveNormalConfig: z.input<typeof TrickplayOptionsConfigType> = {
      processPriority: "AboveNormal",
    };

    // Act
    const highResult: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(highConfig);
    const realTimeResult: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(realTimeConfig);
    const aboveNormalResult: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(aboveNormalConfig);

    // Assert
    expect(highResult.success).toBe(true);
    expect(realTimeResult.success).toBe(true);
    expect(aboveNormalResult.success).toBe(true);
  });

  it("should validate widthResolutions array", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      widthResolutions: [320, 480, 640],
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate all 12 fields", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigType> = {
      enableHwAcceleration: true,
      enableHwEncoding: false,
      processThreads: 4,
      enableKeyFrameOnlyExtraction: true,
      scanBehavior: "NonBlocking",
      processPriority: "Idle",
      interval: 10,
      widthResolutions: [160, 320],
      tileWidth: 10,
      tileHeight: 10,
      qscale: 4,
      jpegQuality: 90,
    };

    // Act
    const result: ZodSafeParseResult<TrickplayOptionsConfig> =
      TrickplayOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });
});

describe("SystemConfigType", () => {
  it("should allow serverName", () => {
    const config: z.input<typeof SystemConfigType> = {
      serverName: "MyServer",
    };

    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serverName).toBe("MyServer");
    }
  });
});

describe("SystemConfigType — extended ServerConfiguration fields", () => {
  it("should accept imageSavingConvention Legacy", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      imageSavingConvention: "Legacy",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageSavingConvention).toBe("Legacy");
    }
  });

  it("should accept imageSavingConvention Compatible", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      imageSavingConvention: "Compatible",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageSavingConvention).toBe("Compatible");
    }
  });

  it("should reject invalid imageSavingConvention value", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      // @ts-expect-error intentional bad enum value for test
      imageSavingConvention: "Modern",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should accept chapterImageResolution MatchSource", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      chapterImageResolution: "MatchSource",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.chapterImageResolution).toBe("MatchSource");
    }
  });

  it("should accept chapterImageResolution P720 and P2160", () => {
    // Arrange
    const p720Config: z.input<typeof SystemConfigType> = {
      chapterImageResolution: "P720",
    };
    const p2160Config: z.input<typeof SystemConfigType> = {
      chapterImageResolution: "P2160",
    };

    // Act
    const p720Result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(p720Config);
    const p2160Result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(p2160Config);

    // Assert
    expect(p720Result.success).toBe(true);
    expect(p2160Result.success).toBe(true);
  });

  it("should reject invalid chapterImageResolution value", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      // @ts-expect-error intentional bad enum value for test
      chapterImageResolution: "4K",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should accept string array fields", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      sortReplaceCharacters: [".", "+", "%"],
      sortRemoveCharacters: [",", "&", "-"],
      sortRemoveWords: ["the", "a", "an"],
      codecsUsed: ["h264", "hevc"],
      corsHosts: ["https://app.example.com"],
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortReplaceCharacters).toEqual([".", "+", "%"]);
      expect(result.data.corsHosts).toEqual(["https://app.example.com"]);
    }
  });

  it("should accept string fields", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      cachePath: "/var/cache/jellyfin",
      metadataPath: "/var/lib/jellyfin/metadata",
      preferredMetadataLanguage: "en",
      metadataCountryCode: "US",
      uiCulture: "en-US",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cachePath).toBe("/var/cache/jellyfin");
      expect(result.data.uiCulture).toBe("en-US");
    }
  });

  it("should accept int fields", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      logFileRetentionDays: 14,
      minResumePct: 5,
      maxResumePct: 90,
      minResumeDurationSeconds: 300,
      minAudiobookResume: 5,
      maxAudiobookResume: 5,
      inactiveSessionThreshold: 0,
      libraryMonitorDelay: 60,
      libraryUpdateDuration: 30,
      cacheSize: 1000,
      remoteClientBitrateLimit: 0,
      imageExtractionTimeoutMs: 0,
      slowResponseThresholdMs: 500,
      libraryScanFanoutConcurrency: 0,
      libraryMetadataRefreshConcurrency: 0,
      dummyChapterDuration: 0,
      parallelImageEncodingLimit: 0,
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.logFileRetentionDays).toBe(14);
      expect(result.data.slowResponseThresholdMs).toBe(500);
    }
  });

  it("should reject non-integer for int fields", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      logFileRetentionDays: 14.5,
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should accept activityLogRetentionDays as null", () => {
    // Arrange — schema marks this as number | null
    const config: z.input<typeof SystemConfigType> = {
      activityLogRetentionDays: null,
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activityLogRetentionDays).toBeNull();
    }
  });

  it("should accept activityLogRetentionDays as integer", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      activityLogRetentionDays: 30,
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activityLogRetentionDays).toBe(30);
    }
  });

  it("should accept bool fields", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      isStartupWizardCompleted: true,
      enableNormalizedItemByNameIds: false,
      isPortAuthorized: true,
      quickConnectAvailable: false,
      enableCaseSensitiveItemIds: false,
      disableLiveTvChannelUserDataName: false,
      skipDeserializationForBasicTypes: false,
      saveMetadataHidden: false,
      enableFolderView: true,
      enableGroupingMoviesIntoCollections: true,
      enableGroupingShowsIntoCollections: true,
      displaySpecialsWithinSeasons: true,
      enableExternalContentInSuggestions: true,
      enableSlowResponseWarning: true,
      allowClientLogUpload: false,
      enableLegacyAuthorization: false,
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isStartupWizardCompleted).toBe(true);
      expect(result.data.enableLegacyAuthorization).toBe(false);
    }
  });

  it("should validate all new fields together", () => {
    // Arrange — one representative value per new field (46 total)
    const config: z.input<typeof SystemConfigType> = {
      imageSavingConvention: "Compatible",
      chapterImageResolution: "P1080",
      sortReplaceCharacters: ["."],
      sortRemoveCharacters: [","],
      sortRemoveWords: ["the"],
      codecsUsed: ["h264"],
      corsHosts: ["*"],
      cachePath: "/cache",
      metadataPath: "/metadata",
      preferredMetadataLanguage: "en",
      metadataCountryCode: "US",
      uiCulture: "en-US",
      logFileRetentionDays: 3,
      minResumePct: 5,
      maxResumePct: 90,
      minResumeDurationSeconds: 300,
      minAudiobookResume: 5,
      maxAudiobookResume: 5,
      inactiveSessionThreshold: 0,
      libraryMonitorDelay: 60,
      libraryUpdateDuration: 30,
      cacheSize: 500,
      remoteClientBitrateLimit: 0,
      imageExtractionTimeoutMs: 0,
      slowResponseThresholdMs: 500,
      activityLogRetentionDays: 30,
      libraryScanFanoutConcurrency: 0,
      libraryMetadataRefreshConcurrency: 0,
      dummyChapterDuration: 0,
      parallelImageEncodingLimit: 0,
      isStartupWizardCompleted: true,
      enableNormalizedItemByNameIds: true,
      isPortAuthorized: true,
      quickConnectAvailable: false,
      enableCaseSensitiveItemIds: false,
      disableLiveTvChannelUserDataName: false,
      skipDeserializationForBasicTypes: false,
      saveMetadataHidden: false,
      enableFolderView: true,
      enableGroupingMoviesIntoCollections: true,
      enableGroupingShowsIntoCollections: true,
      displaySpecialsWithinSeasons: true,
      enableExternalContentInSuggestions: false,
      enableSlowResponseWarning: true,
      allowClientLogUpload: false,
      enableLegacyAuthorization: false,
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(true);
  });

  it("should still reject unknown keys after extension (strict mode)", () => {
    // Arrange
    const config: z.input<typeof SystemConfigType> = {
      enableMetrics: true,
      // @ts-expect-error intentional extra field for test
      unknownExtendedField: "rejected",
    };

    // Act
    const result: ZodSafeParseResult<SystemConfig> =
      SystemConfigType.safeParse(config);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });
});
