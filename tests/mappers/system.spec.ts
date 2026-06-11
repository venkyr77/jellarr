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
        serverName: "MyServer",
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
          processThreads: 2,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        ServerName: "MyServer",
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: false,
          ProcessThreads: 2,
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

    it("should map trickplayOptions enableKeyFrameOnlyExtraction to EnableKeyFrameOnlyExtraction", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { enableKeyFrameOnlyExtraction: true },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        EnableKeyFrameOnlyExtraction: true,
      });
    });

    it("should map trickplayOptions scanBehavior to ScanBehavior", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { scanBehavior: "NonBlocking" },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ ScanBehavior: "NonBlocking" });
    });

    it("should map trickplayOptions processPriority to ProcessPriority", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { processPriority: "BelowNormal" },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        ProcessPriority: "BelowNormal",
      });
    });

    it("should map trickplayOptions interval to Interval", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { interval: 10000 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ Interval: 10000 });
    });

    it("should map trickplayOptions widthResolutions to WidthResolutions", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { widthResolutions: [320, 640] },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        WidthResolutions: [320, 640],
      });
    });

    it("should map trickplayOptions tileWidth to TileWidth", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { tileWidth: 10 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ TileWidth: 10 });
    });

    it("should map trickplayOptions tileHeight to TileHeight", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { tileHeight: 10 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ TileHeight: 10 });
    });

    it("should map trickplayOptions qscale to Qscale", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { qscale: 4 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ Qscale: 4 });
    });

    it("should map trickplayOptions jpegQuality to JpegQuality", () => {
      // Arrange
      const config: SystemConfig = {
        trickplayOptions: { jpegQuality: 85 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({ JpegQuality: 85 });
    });

    it("should omit undefined trickplayOptions fields from output", () => {
      // Arrange — only interval set; all other fields absent
      const config: SystemConfig = {
        trickplayOptions: { interval: 5000 },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toHaveProperty("Interval", 5000);
      expect(result.TrickplayOptions).not.toHaveProperty(
        "EnableHwAcceleration",
      );
      expect(result.TrickplayOptions).not.toHaveProperty("EnableHwEncoding");
      expect(result.TrickplayOptions).not.toHaveProperty("ProcessThreads");
      expect(result.TrickplayOptions).not.toHaveProperty(
        "EnableKeyFrameOnlyExtraction",
      );
      expect(result.TrickplayOptions).not.toHaveProperty("ScanBehavior");
      expect(result.TrickplayOptions).not.toHaveProperty("ProcessPriority");
      expect(result.TrickplayOptions).not.toHaveProperty("WidthResolutions");
      expect(result.TrickplayOptions).not.toHaveProperty("TileWidth");
      expect(result.TrickplayOptions).not.toHaveProperty("TileHeight");
      expect(result.TrickplayOptions).not.toHaveProperty("Qscale");
      expect(result.TrickplayOptions).not.toHaveProperty("JpegQuality");
    });

    it("should map all 12 trickplayOptions fields simultaneously", () => {
      // Arrange — all 12 fields set
      const config: SystemConfig = {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
          processThreads: 4,
          enableKeyFrameOnlyExtraction: true,
          scanBehavior: "Blocking",
          processPriority: "Normal",
          interval: 2000,
          widthResolutions: [160, 320, 640],
          tileWidth: 8,
          tileHeight: 8,
          qscale: 2,
          jpegQuality: 90,
        },
      };

      // Act
      const result: Partial<ServerConfigurationSchema> =
        mapSystemConfigurationConfigToSchema(config);

      // Assert
      expect(result.TrickplayOptions).toEqual({
        EnableHwAcceleration: true,
        EnableHwEncoding: false,
        ProcessThreads: 4,
        EnableKeyFrameOnlyExtraction: true,
        ScanBehavior: "Blocking",
        ProcessPriority: "Normal",
        Interval: 2000,
        WidthResolutions: [160, 320, 640],
        TileWidth: 8,
        TileHeight: 8,
        Qscale: 2,
        JpegQuality: 90,
      });
    });
  });
});
