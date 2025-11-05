import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  EncodingOptionsConfigType,
  type EncodingOptionsConfig,
} from "../../../src/types/config/encoding-options";

describe("EncodingOptionsConfig", () => {
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

  it("should validate hardwareAccelerationType with valid values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { hardwareAccelerationType: "none" as const },
      { hardwareAccelerationType: "amf" as const },
      { hardwareAccelerationType: "qsv" as const },
      { hardwareAccelerationType: "nvenc" as const },
      { hardwareAccelerationType: "v4l2m2m" as const },
      { hardwareAccelerationType: "vaapi" as const },
      { hardwareAccelerationType: "videotoolbox" as const },
      { hardwareAccelerationType: "rkmpp" as const },
      {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "vaapi" as const,
      },
    ];

    validConfigs.forEach((config) => {
      // Act
      const result: ZodSafeParseResult<EncodingOptionsConfig> =
        EncodingOptionsConfigType.safeParse(config);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(config);
      }
    });
  });

  it("should reject invalid hardwareAccelerationType values", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      // @ts-expect-error intentional bad value for test
      hardwareAccelerationType: "invalid_type",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      // Should have an invalid_enum_value error for hardwareAccelerationType
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);

      // Find the error related to hardwareAccelerationType
      const hasEnumError: boolean = result.error.issues.some(
        (issue) =>
          issue.code === "invalid_value" &&
          issue.path[0] === "hardwareAccelerationType",
      );
      expect(hasEnumError).toBe(true);
    }
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
