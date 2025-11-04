import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  PluginRepositoryConfigType,
  type PluginRepositoryConfig,
} from "../../../src/types/config/plugin-repository";

describe("types/config/plugin-repository — PluginRepositoryConfig", () => {
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
