import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  PluginConfigType,
  PluginConfigListType,
  type PluginConfig,
  type PluginConfigList,
} from "../../../src/types/config/plugins";

describe("PluginConfig", () => {
  it("should validate plugin config with valid name", () => {
    // Arrange
    const validConfig: z.input<typeof PluginConfigType> = {
      name: "Trakt",
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Trakt");
    }
  });

  it("should reject empty name", () => {
    // Arrange
    const invalidConfig: z.input<typeof PluginConfigType> = {
      name: "",
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should reject missing name", () => {
    // Arrange
    const invalidConfig: Record<string, never> = {};

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should reject invalid name type", () => {
    // Arrange
    const invalidConfig: z.input<typeof PluginConfigType> = {
      // @ts-expect-error intentional invalid value for test
      name: 123,
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof PluginConfigType> = {
      name: "Trakt",
      // @ts-expect-error intentional extra field for test
      extraField: "not allowed",
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });

  it("should validate plugin config with configuration field", () => {
    // Arrange
    const validConfig: z.input<typeof PluginConfigType> = {
      name: "Trakt",
      configuration: {
        TraktUsers: [{ ExtraLogging: true }],
      },
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Trakt");
      expect(result.data.configuration).toEqual({
        TraktUsers: [{ ExtraLogging: true }],
      });
    }
  });

  it("should validate configuration with any key-value pairs", () => {
    // Arrange
    const validConfig: z.input<typeof PluginConfigType> = {
      name: "SomePlugin",
      configuration: {
        stringValue: "test",
        numberValue: 123,
        booleanValue: true,
        nestedObject: { key: "value" },
        arrayValue: [1, 2, 3],
      },
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.configuration?.stringValue).toBe("test");
      expect(result.data.configuration?.numberValue).toBe(123);
      expect(result.data.configuration?.booleanValue).toBe(true);
    }
  });

  it("should validate plugin config without configuration (optional)", () => {
    // Arrange
    const validConfig: z.input<typeof PluginConfigType> = {
      name: "Trakt",
    };

    // Act
    const result: ZodSafeParseResult<PluginConfig> =
      PluginConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Trakt");
      expect(result.data.configuration).toBeUndefined();
    }
  });
});

describe("PluginConfigList", () => {
  it("should validate array of plugin configs", () => {
    // Arrange
    const validConfigs: z.input<typeof PluginConfigListType> = [
      { name: "Trakt" },
      { name: "Playback Reporting" },
    ];

    // Act
    const result: ZodSafeParseResult<PluginConfigList> =
      PluginConfigListType.safeParse(validConfigs);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe("Trakt");
      expect(result.data[1].name).toBe("Playback Reporting");
    }
  });

  it("should validate empty array", () => {
    // Arrange
    const validConfigs: z.input<typeof PluginConfigListType> = [];

    // Act
    const result: ZodSafeParseResult<PluginConfigList> =
      PluginConfigListType.safeParse(validConfigs);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
  });

  it("should reject array with invalid plugin config", () => {
    // Arrange
    const invalidConfigs: Array<{ name: string }> = [
      { name: "Trakt" },
      { name: "" },
    ];

    // Act
    const result: ZodSafeParseResult<PluginConfigList> =
      PluginConfigListType.safeParse(invalidConfigs);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should validate array with plugins containing configuration", () => {
    // Arrange
    const validConfigs: z.input<typeof PluginConfigListType> = [
      {
        name: "Trakt",
        configuration: { TraktUsers: [{ ExtraLogging: true }] },
      },
      { name: "Playback Reporting" },
    ];

    // Act
    const result: ZodSafeParseResult<PluginConfigList> =
      PluginConfigListType.safeParse(validConfigs);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0].configuration).toBeDefined();
      expect(result.data[1].configuration).toBeUndefined();
    }
  });
});
