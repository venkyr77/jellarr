import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  ApiKeyConfigType,
  ApiKeyConfigListType,
  type ApiKeyConfig,
  type ApiKeyConfigList,
} from "../../../src/types/config/api-keys";

describe("ApiKeyConfig", () => {
  it("should validate api key config with valid name", () => {
    // Arrange
    const validConfig: z.input<typeof ApiKeyConfigType> = {
      name: "x",
    };

    // Act
    const result: ZodSafeParseResult<ApiKeyConfig> =
      ApiKeyConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("x");
    }
  });

  it("should reject empty name", () => {
    // Arrange
    const invalidConfig: z.input<typeof ApiKeyConfigType> = {
      name: "",
    };

    // Act
    const result: ZodSafeParseResult<ApiKeyConfig> =
      ApiKeyConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof ApiKeyConfigType> = {
      name: "my-key",
      // @ts-expect-error intentional extra field for test
      extraField: "not allowed",
    };

    // Act
    const result: ZodSafeParseResult<ApiKeyConfig> =
      ApiKeyConfigType.safeParse(invalidConfig);

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
});

describe("ApiKeyConfigList", () => {
  it("should validate array of api key configs", () => {
    // Arrange
    const validConfigs: z.input<typeof ApiKeyConfigListType> = [
      { name: "jellyseerr" },
      { name: "sonarr" },
    ];

    // Act
    const result: ZodSafeParseResult<ApiKeyConfigList> =
      ApiKeyConfigListType.safeParse(validConfigs);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe("jellyseerr");
      expect(result.data[1].name).toBe("sonarr");
    }
  });

  it("should validate empty array", () => {
    // Arrange
    const validConfigs: z.input<typeof ApiKeyConfigListType> = [];

    // Act
    const result: ZodSafeParseResult<ApiKeyConfigList> =
      ApiKeyConfigListType.safeParse(validConfigs);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
  });

  it("should reject array with invalid api key config", () => {
    // Arrange
    const invalidConfigs: Array<{ name: string }> = [
      { name: "valid-key" },
      { name: "" },
    ];

    // Act
    const result: ZodSafeParseResult<ApiKeyConfigList> =
      ApiKeyConfigListType.safeParse(invalidConfigs);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});
