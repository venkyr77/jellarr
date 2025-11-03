import { describe, it, expect } from "vitest";
import { applySystem } from "../../src/apply/system";
import {
  type ServerConfigurationSchema,
  type TrickplayOptionsSchema,
} from "../../src/types/schema/system";
import {
  type PluginRepositoryConfig,
  type SystemConfig,
} from "../../src/types/config/system";

function makeConfig(
  partial?: Partial<ServerConfigurationSchema>,
): ServerConfigurationSchema {
  const base: ServerConfigurationSchema = {
    EnableMetrics: false,
    PluginRepositories: [],
    TrickplayOptions: undefined,
  } as ServerConfigurationSchema;
  return { ...base, ...(partial ?? {}) } as ServerConfigurationSchema;
}

describe("services/system/apply", () => {
  it("whenDesiredEmpty_thenApplyReturnsCurrentUnchanged()", () => {
    // Arrange
    const current: ServerConfigurationSchema = makeConfig({
      EnableMetrics: true,
    });
    const desired: SystemConfig = {};

    // Act
    const updated: ServerConfigurationSchema = applySystem(current, desired);

    // Assert
    expect(updated).toEqual(current);
  });

  it("whenEnableMetricsDiffers_thenApplyUpdatesOnlyEnableMetrics()", () => {
    // Arrange
    const current: ServerConfigurationSchema = makeConfig({
      EnableMetrics: false,
    });
    const desired: SystemConfig = { enableMetrics: true };

    // Act
    const updated: ServerConfigurationSchema = applySystem(current, desired);

    // Assert
    expect(updated.EnableMetrics).toBe(true);
    expect(updated.PluginRepositories).toEqual(current.PluginRepositories);
    expect(updated.TrickplayOptions).toEqual(current.TrickplayOptions);
  });

  it("whenPluginRepositoriesProvided_thenApplyReplacesRepos()", () => {
    // Arrange
    const current: ServerConfigurationSchema = makeConfig({
      PluginRepositories: [{ Name: "A", Url: "https://a", Enabled: true }],
    });
    const repos: PluginRepositoryConfig[] = [
      { name: "B", url: "https://b", enabled: true },
      { name: "A", url: "https://a", enabled: true },
    ];
    const desired: SystemConfig = { pluginRepositories: repos };

    // Act
    const updated: ServerConfigurationSchema = applySystem(current, desired);

    // Assert
    expect(updated.PluginRepositories).toEqual([
      { Name: "B", Url: "https://b", Enabled: true },
      { Name: "A", Url: "https://a", Enabled: true },
    ]);
  });

  describe("trickplay tri-state (true/false/null)", () => {
    it("whenBothBooleansProvided_thenApplySetsBothFields()", () => {
      // Arrange
      const current: ServerConfigurationSchema = makeConfig({
        TrickplayOptions: {} as TrickplayOptionsSchema,
      });
      const desired: SystemConfig = {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
        },
      };

      // Act
      const updated: ServerConfigurationSchema = applySystem(current, desired);

      // Assert
      expect(updated.TrickplayOptions?.EnableHwAcceleration).toBe(true);
      expect(updated.TrickplayOptions?.EnableHwEncoding).toBe(false);
    });

    it("whenAccelerationIsNull_thenApplyOmitsAccelerationKey()", () => {
      // Arrange
      const current: ServerConfigurationSchema = makeConfig({
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      });
      const desired: SystemConfig = {
        trickplayOptions: { enableHwAcceleration: null },
      };

      // Act
      const updated: ServerConfigurationSchema = applySystem(current, desired);

      // Assert
      expect(updated.TrickplayOptions?.EnableHwAcceleration).toBeUndefined();
      expect(updated.TrickplayOptions?.EnableHwEncoding).toBe(true);
    });

    it("whenOnlyAccelerationProvided_thenApplyLeavesEncodingUntouched()", () => {
      // Arrange
      const current: ServerConfigurationSchema = makeConfig({
        TrickplayOptions: {
          EnableHwAcceleration: false,
          EnableHwEncoding: true,
        },
      });
      const desired: SystemConfig = {
        trickplayOptions: { enableHwAcceleration: true },
      };

      // Act
      const updated: ServerConfigurationSchema = applySystem(current, desired);

      // Assert
      expect(updated.TrickplayOptions?.EnableHwAcceleration).toBe(true);
      expect(updated.TrickplayOptions?.EnableHwEncoding).toBe(true);
    });
  });
});
