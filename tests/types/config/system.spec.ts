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
