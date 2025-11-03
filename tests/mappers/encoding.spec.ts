import { describe, it, expect } from "vitest";
import { mapEncodingConfigurationConfigToSchema } from "../../src/mappers/encoding";
import { type EncodingConfig } from "../../src/types/config/encoding";
import { type EncodingConfigurationSchema } from "../../src/types/schema/encoding";

describe("mappers/encoding", () => {
  describe("mapEncodingConfigurationConfigToSchema", () => {
    it("should map enableHardwareEncoding to EnableHardwareEncoding", () => {
      // Arrange
      const config: EncodingConfig = {
        enableHardwareEncoding: true,
      };

      // Act
      const result: Partial<EncodingConfigurationSchema> =
        mapEncodingConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: true,
      });
    });

    it("should map enableHardwareEncoding false to EnableHardwareEncoding false", () => {
      // Arrange
      const config: EncodingConfig = {
        enableHardwareEncoding: false,
      };

      // Act
      const result: Partial<EncodingConfigurationSchema> =
        mapEncodingConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: false,
      });
    });

    it("should return empty object when enableHardwareEncoding is undefined", () => {
      // Arrange
      const config: EncodingConfig = {};

      // Act
      const result: Partial<EncodingConfigurationSchema> =
        mapEncodingConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include EnableHardwareEncoding when field is not provided", () => {
      // Arrange
      const config: EncodingConfig = {};

      // Act
      const result: Partial<EncodingConfigurationSchema> =
        mapEncodingConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableHardwareEncoding");
    });
  });
});
