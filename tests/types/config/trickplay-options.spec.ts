import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  TrickplayOptionsConfigType,
  type TrickplayOptionsConfig,
} from "../../../src/types/config/trickplay-options";

describe("types/config/trickplay-options — TrickplayOptionsConfig", () => {
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
