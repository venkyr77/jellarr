import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  EncodingOptionsConfigType,
  type EncodingOptionsConfig,
} from "../../../src/types/config/encoding-options";

describe("types/config/encoding — EncodingOptionsConfig", () => {
  it("should validate empty encoding config", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {};

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate encoding config with enableHardwareEncoding true", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      enableHardwareEncoding: true,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate encoding config with enableHardwareEncoding false", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      enableHardwareEncoding: false,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-boolean enableHardwareEncoding", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      // @ts-expect-error intentional bad type for test
      enableHardwareEncoding: "true",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      enableHardwareEncoding: true,
      // @ts-expect-error intentional extra field for test
      unknownField: "should not be allowed",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

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
