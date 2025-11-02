import { describe, it, expect } from "vitest";
import { apply } from "../../../src/services/system/apply";
import type {
  SystemCfg,
  ServerConfiguration,
  JFTrickplay,
  PluginRepositoryCfg,
} from "../../../src/domain/system/types";

function makeConfig(
  partial?: Partial<ServerConfiguration>,
): ServerConfiguration {
  const base: ServerConfiguration = {
    EnableMetrics: false,
    PluginRepositories: [],
    TrickplayOptions: undefined,
  } as ServerConfiguration;
  return { ...base, ...(partial ?? {}) } as ServerConfiguration;
}

describe("services/system/apply", () => {
  it("whenDesiredEmpty_thenApplyReturnsCurrentUnchanged()", () => {
    // Arrange
    const current: ServerConfiguration = makeConfig({ EnableMetrics: true });
    const desired: SystemCfg = {};

    // Act
    const updated: ServerConfiguration = apply(current, desired);

    // Assert
    expect(updated).toEqual(current);
  });

  it("whenEnableMetricsDiffers_thenApplyUpdatesOnlyEnableMetrics()", () => {
    // Arrange
    const current: ServerConfiguration = makeConfig({ EnableMetrics: false });
    const desired: SystemCfg = { enableMetrics: true };

    // Act
    const updated: ServerConfiguration = apply(current, desired);

    // Assert
    expect(updated.EnableMetrics).toBe(true);
    expect(updated.PluginRepositories).toEqual(current.PluginRepositories);
    expect(updated.TrickplayOptions).toEqual(current.TrickplayOptions);
  });

  it("whenPluginRepositoriesProvided_thenApplyReplacesRepos()", () => {
    // Arrange
    const current: ServerConfiguration = makeConfig({
      PluginRepositories: [{ Name: "A", Url: "https://a", Enabled: true }],
    });
    const repos: PluginRepositoryCfg[] = [
      { name: "B", url: "https://b", enabled: true },
      { name: "A", url: "https://a", enabled: true },
    ];
    const desired: SystemCfg = { pluginRepositories: repos };

    // Act
    const updated: ServerConfiguration = apply(current, desired);

    // Assert
    expect(updated.PluginRepositories).toEqual([
      { Name: "B", Url: "https://b", Enabled: true },
      { Name: "A", Url: "https://a", Enabled: true },
    ]);
  });

  describe("trickplay tri-state (true/false/null)", () => {
    it("whenBothBooleansProvided_thenApplySetsBothFields()", () => {
      // Arrange
      const current: ServerConfiguration = makeConfig({
        TrickplayOptions: {} as JFTrickplay,
      });
      const desired: SystemCfg = {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
        },
      };

      // Act
      const updated: ServerConfiguration = apply(current, desired);

      // Assert
      expect(updated.TrickplayOptions?.EnableHwAcceleration).toBe(true);
      expect(updated.TrickplayOptions?.EnableHwEncoding).toBe(false);
    });

    it("whenAccelerationIsNull_thenApplyOmitsAccelerationKey()", () => {
      // Arrange
      const current: ServerConfiguration = makeConfig({
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      });
      const desired: SystemCfg = {
        trickplayOptions: { enableHwAcceleration: null },
      };

      // Act
      const updated: ServerConfiguration = apply(current, desired);

      // Assert
      expect(updated.TrickplayOptions?.EnableHwAcceleration).toBeUndefined();
      expect(updated.TrickplayOptions?.EnableHwEncoding).toBe(true);
    });

    it("whenOnlyAccelerationProvided_thenApplyLeavesEncodingUntouched()", () => {
      // Arrange
      const current: ServerConfiguration = makeConfig({
        TrickplayOptions: {
          EnableHwAcceleration: false,
          EnableHwEncoding: true,
        },
      });
      const desired: SystemCfg = {
        trickplayOptions: { enableHwAcceleration: true },
      };

      // Act
      const updated: ServerConfiguration = apply(current, desired);

      // Assert
      expect(updated.TrickplayOptions?.EnableHwAcceleration).toBe(true);
      expect(updated.TrickplayOptions?.EnableHwEncoding).toBe(true);
    });
  });
});
