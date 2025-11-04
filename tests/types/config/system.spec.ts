import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  SystemConfigType,
  type SystemConfig,
} from "../../../src/types/config/system";

describe("types/config/system — SystemConfig", () => {
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
