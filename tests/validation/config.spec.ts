import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  RootConfigSchema,
  SystemConfigSchema,
  PluginRepositoryConfigSchema,
  TrickplayOptionsConfigSchema,
  EncodingOptionsConfigSchema,
  type ValidatedPluginRepositoryConfig,
  type ValidatedTrickplayOptionsConfig,
  type ValidatedSystemConfig,
  type ValidatedEncodingOptionsConfig,
  type ValidatedRootConfig,
} from "../../src/validation/config";

describe("validation/config — PluginRepositoryConfigSchema", () => {
  it("should validate valid plugin repository config", () => {
    // Arrange
    const validConfig: z.input<typeof PluginRepositoryConfigSchema> = {
      name: "Test Repository",
      url: "https://example.com/manifest.json",
      enabled: true,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedPluginRepositoryConfig> =
      PluginRepositoryConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject empty name", () => {
    // Arrange
    const invalidConfig: z.input<typeof PluginRepositoryConfigSchema> = {
      name: "",
      url: "https://example.com/manifest.json",
      enabled: true,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedPluginRepositoryConfig> =
      PluginRepositoryConfigSchema.safeParse(invalidConfig);

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
    const invalidConfig: z.input<typeof PluginRepositoryConfigSchema> = {
      name: "Test Repository",
      url: "not-a-valid-url",
      enabled: true,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedPluginRepositoryConfig> =
      PluginRepositoryConfigSchema.safeParse(invalidConfig);

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
    const invalidConfig: Partial<z.input<typeof PluginRepositoryConfigSchema>> =
      {
        name: "Test Repository",
        // missing url and enabled
      };

    // Act
    const result: ZodSafeParseResult<ValidatedPluginRepositoryConfig> =
      PluginRepositoryConfigSchema.safeParse(
        invalidConfig as z.input<typeof PluginRepositoryConfigSchema>,
      );

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("validation/config — TrickplayOptionsConfigSchema", () => {
  it("should validate empty trickplay options", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigSchema> = {};

    // Act
    const result: ZodSafeParseResult<ValidatedTrickplayOptionsConfig> =
      TrickplayOptionsConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate with only enableHwAcceleration", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigSchema> = {
      enableHwAcceleration: true,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedTrickplayOptionsConfig> =
      TrickplayOptionsConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate with both options", () => {
    // Arrange
    const validConfig: z.input<typeof TrickplayOptionsConfigSchema> = {
      enableHwAcceleration: false,
      enableHwEncoding: true,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedTrickplayOptionsConfig> =
      TrickplayOptionsConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-boolean values", () => {
    // Arrange
    const invalidConfig: z.input<typeof TrickplayOptionsConfigSchema> = {
      // @ts-expect-error intentional bad type for test
      enableHwAcceleration: "true",
    };

    // Act
    const result: ZodSafeParseResult<ValidatedTrickplayOptionsConfig> =
      TrickplayOptionsConfigSchema.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });
});

describe("validation/config — SystemConfigSchema", () => {
  it("should validate empty system config", () => {
    // Arrange
    const validConfig: z.input<typeof SystemConfigSchema> = {};

    // Act
    const result: ZodSafeParseResult<ValidatedSystemConfig> =
      SystemConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate full system config", () => {
    // Arrange
    const validConfig: z.input<typeof SystemConfigSchema> = {
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
    const result: ZodSafeParseResult<ValidatedSystemConfig> =
      SystemConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof SystemConfigSchema> = {
      enableMetrics: true,
      // @ts-expect-error intentional extra field for test
      unknownField: "should not be allowed",
    };

    // Act
    const result: ZodSafeParseResult<ValidatedSystemConfig> =
      SystemConfigSchema.safeParse(invalidConfig);

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

describe("validation/config — RootConfigSchema", () => {
  it("should validate complete root config", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigSchema> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {
        enableMetrics: true,
        pluginRepositories: [
          {
            name: "Test Repository",
            url: "https://test.example.com/manifest.json",
            enabled: true,
          },
        ],
        trickplayOptions: {
          enableHwAcceleration: true,
        },
      },
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject invalid version", () => {
    // Arrange
    const invalidConfig: z.input<typeof RootConfigSchema> = {
      version: -1,
      base_url: "http://example.com",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const versionError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.path.includes("version"));
      expect(versionError?.message).toContain("positive integer");
    }
  });

  it("should reject invalid base_url", () => {
    // Arrange
    const invalidConfig: z.input<typeof RootConfigSchema> = {
      version: 1,
      base_url: "not-a-url",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const urlError: z.core.$ZodIssue | undefined = result.error.issues.find(
        (err) => err.path.includes("base_url"),
      );
      expect(urlError?.message).toContain("must be a valid URL");
    }
  });

  it("should reject missing required fields", () => {
    // Arrange
    const invalidConfig: Partial<z.input<typeof RootConfigSchema>> = {
      version: 1,
      // missing base_url and system
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(
        invalidConfig as z.input<typeof RootConfigSchema>,
      );

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof RootConfigSchema> = {
      version: 1,
      base_url: "http://example.com",
      system: {},
      // @ts-expect-error intentional extra field for test
      extraField: "not allowed",
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(invalidConfig);

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

describe("validation/config — EncodingOptionsConfigSchema", () => {
  it("should validate empty encoding config", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigSchema> = {};

    // Act
    const result: ZodSafeParseResult<ValidatedEncodingOptionsConfig> =
      EncodingOptionsConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate encoding config with enableHardwareEncoding true", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigSchema> = {
      enableHardwareEncoding: true,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedEncodingOptionsConfig> =
      EncodingOptionsConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate encoding config with enableHardwareEncoding false", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigSchema> = {
      enableHardwareEncoding: false,
    };

    // Act
    const result: ZodSafeParseResult<ValidatedEncodingOptionsConfig> =
      EncodingOptionsConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-boolean enableHardwareEncoding", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigSchema> = {
      // @ts-expect-error intentional bad type for test
      enableHardwareEncoding: "true",
    };

    // Act
    const result: ZodSafeParseResult<ValidatedEncodingOptionsConfig> =
      EncodingOptionsConfigSchema.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigSchema> = {
      enableHardwareEncoding: true,
      // @ts-expect-error intentional extra field for test
      unknownField: "should not be allowed",
    };

    // Act
    const result: ZodSafeParseResult<ValidatedEncodingOptionsConfig> =
      EncodingOptionsConfigSchema.safeParse(invalidConfig);

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

describe("validation/config — RootConfigSchema with encoding", () => {
  it("should validate root config with encoding section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigSchema> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
      encoding: {
        enableHardwareEncoding: true,
      },
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate root config without encoding section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigSchema> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<ValidatedRootConfig> =
      RootConfigSchema.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });
});
