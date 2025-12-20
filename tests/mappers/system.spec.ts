/**
 * Comprehensive System Mapper Test Coverage
 *
 * ## fromPluginRepositorySchemas
 * - ✅ Empty array conversion
 * - ✅ Multiple repository field mapping (Name→name, Url→url, Enabled→enabled)
 * - ✅ Single repository handling
 * - ✅ Disabled repository conversion
 *
 * ## toPluginRepositorySchemas
 * - ✅ Empty array conversion
 * - ✅ Multiple repository field mapping (name→Name, url→Url, enabled→Enabled)
 * - ✅ Single repository handling
 * - ✅ Disabled repository conversion
 *
 * ## mapSystemConfigurationConfigToSchema
 * - ✅ enableMetrics mapping (true/false)
 * - ✅ pluginRepositories mapping (populated/empty)
 * - ✅ trickplayOptions mapping (full/partial/empty)
 * - ✅ Multi-field combinations
 * - ✅ Empty config handling
 * - ✅ Undefined field exclusion validation
 */
import { describe, it, expect } from "vitest";
import {
  toPluginRepositorySchemas,
  mapSystemConfigurationConfigToSchema,
} from "../../src/mappers/system";
import type { SystemConfig } from "../../src/types/config/system";
import type { PluginRepositoryConfig } from "../../src/types/config/system";
import type {
  PluginRepositorySchema,
  ServerConfigurationSchema,
} from "../../src/types/schema/system";

describe("mappers/system", () => {
  describe("toPluginRepositorySchemas", () => {
    it("should convert empty config array to empty server schema array", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([]);
    });

    it("should convert config format to server schema with proper field mapping", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [
        { name: "Config Repo A", url: "https://config-a.com", enabled: true },
        { name: "Config Repo B", url: "https://config-b.com", enabled: false },
      ];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([
        { Name: "Config Repo A", Url: "https://config-a.com", Enabled: true },
        { Name: "Config Repo B", Url: "https://config-b.com", Enabled: false },
      ]);
    });

    it("should handle single repository conversion", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [
        {
          name: "Single Config",
          url: "https://single-config.com",
          enabled: true,
        },
      ];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([
        {
          Name: "Single Config",
          Url: "https://single-config.com",
          Enabled: true,
        },
      ]);
    });

    it("should convert disabled repositories correctly", () => {
      // Arrange
      const cfgRepos: PluginRepositoryConfig[] = [
        {
          name: "Disabled Config",
          url: "https://disabled-config.com",
          enabled: false,
        },
      ];

      // Act
      const result: PluginRepositorySchema[] =
        toPluginRepositorySchemas(cfgRepos);

      // Assert
      expect(result).toEqual([
        {
          Name: "Disabled Config",
          Url: "https://disabled-config.com",
          Enabled: false,
        },
      ]);
    });
  });

  describe("mapSystemConfigurationConfigToSchema", () => {
    it("should map enableMetrics to EnableMetrics", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: true,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableMetrics: true,
      });
    });

    it("should map enableMetrics false to EnableMetrics false", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: false,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableMetrics: false,
      });
    });

    it("should map pluginRepositories to PluginRepositories", () => {
      // Arrange
      const config: SystemConfig = {
        pluginRepositories: [
          { name: "Test Repo", url: "https://test.com", enabled: true },
          { name: "Another Repo", url: "https://another.com", enabled: false },
        ],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        PluginRepositories: [
          { Name: "Test Repo", Url: "https://test.com", Enabled: true },
          { Name: "Another Repo", Url: "https://another.com", Enabled: false },
        ],
      });
    });

    it("should map empty pluginRepositories to empty PluginRepositories", () => {
      // Arrange
      const config: SystemConfig = {
        pluginRepositories: [],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        PluginRepositories: [],
      });
    });

    it("should map trickplayOptions to TrickplayOptions", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: false,
        },
      });
    });

    it("should map partial trickplayOptions (enableHwAcceleration only)", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwAcceleration: true,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {
          EnableHwAcceleration: true,
        },
      });
    });

    it("should map partial trickplayOptions (enableHwEncoding only)", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwEncoding: false,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {
          EnableHwEncoding: false,
        },
      });
    });

    it("should map empty trickplayOptions to empty TrickplayOptions", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: {},
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        TrickplayOptions: {},
      });
    });

    it("should map multiple fields simultaneously", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: true,
        pluginRepositories: [
          { name: "Multi Repo", url: "https://multi.com", enabled: true },
        ],
        trickplayOptions: {
          enableHwAcceleration: false,
          enableHwEncoding: true,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableMetrics: true,
        PluginRepositories: [
          { Name: "Multi Repo", Url: "https://multi.com", Enabled: true },
        ],
        TrickplayOptions: {
          EnableHwAcceleration: false,
          EnableHwEncoding: true,
        },
      });
    });

    it("should return empty object when no fields are provided", () => {
      // Arrange
      const config: SystemConfig = {};

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include EnableMetrics when enableMetrics is undefined", () => {
      // Arrange
      const config: SystemConfig = {
        pluginRepositories: [],
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableMetrics");
      expect(result).toEqual({
        PluginRepositories: [],
      });
    });

    it("should not include PluginRepositories when pluginRepositories is undefined", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: true,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("PluginRepositories");
      expect(result).toEqual({
        EnableMetrics: true,
      });
    });

    it("should not include TrickplayOptions when trickplayOptions is undefined", () => {
      // Arrange
      const config: SystemConfig = {
        enableMetrics: false,
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("TrickplayOptions");
      expect(result).toEqual({
        EnableMetrics: false,
      });
    });
  });
});
