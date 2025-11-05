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
        result.error.issues.find((err) => err.code === "unrecognized_keys");
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
        (err) => err.path.includes("name"),
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
        (err) => err.path.includes("url"),
      );
      expect(urlError?.message).toContain("must be a valid URL");
    }
  });

  it("should reject missing fields", () => {
    // Arrange
    const invalidConfig: Partial<z.input<typeof PluginRepositoryConfigType>> = {
      name: "Test Repository",
      // missing url and enabled
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
});
