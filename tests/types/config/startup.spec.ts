import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  StartupConfigType,
  type StartupConfig,
} from "../../../src/types/config/startup";

describe("StartupConfig", () => {
  it("should validate startup config with completeStartupWizard true", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      completeStartupWizard: true,
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.completeStartupWizard).toBe(true);
    }
  });

  it("should validate startup config with completeStartupWizard false", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      completeStartupWizard: false,
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.completeStartupWizard).toBe(false);
    }
  });

  it("should reject invalid completeStartupWizard value", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      // @ts-expect-error intentional invalid value for test
      completeStartupWizard: "invalid",
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should validate empty startup config", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {};

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.completeStartupWizard).toBeUndefined();
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      completeStartupWizard: true,
      // @ts-expect-error intentional extra field for test
      extraField: "not allowed",
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

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
