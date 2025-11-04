import { describe, it, expect } from "vitest";
import { mapEncodingOptionsConfigToSchema } from "../../src/mappers/encoding-options";
import { type EncodingOptionsConfig } from "../../src/types/config/encoding-options";
import { type EncodingOptionsSchema } from "../../src/types/schema/encoding-options";

describe("mappers/encoding", () => {
  describe("mapEncodingOptionsConfigToSchema", () => {
    it("should map enableHardwareEncoding to EnableHardwareEncoding", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: true,
      });
    });

    it("should map enableHardwareEncoding false to EnableHardwareEncoding false", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: false,
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: false,
      });
    });

    it("should return empty object when enableHardwareEncoding is undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include EnableHardwareEncoding when field is not provided", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableHardwareEncoding");
    });
  });
});
