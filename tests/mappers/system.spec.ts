import { describe, it, expect } from "vitest";
import {
  fromJFRepos,
  toJFRepos,
  equalReposUnordered,
} from "../../src/mappers/system";
import type {
  JFPluginRepo,
  PluginRepositoryCfg,
} from "../../src/domain/system/types";

describe("mappers/system", () => {
  it("whenJellyfinReposGiven_thenFromJFReposMapsToCfgShape()", () => {
    // Arrange
    const jf: JFPluginRepo[] = [
      { Name: "A", Url: "https://a", Enabled: true },
      { Name: "B", Url: "https://b", Enabled: false },
    ];

    // Act
    const out: PluginRepositoryCfg[] = fromJFRepos(jf);

    // Assert
    expect(out).toEqual<PluginRepositoryCfg[]>([
      { name: "A", url: "https://a", enabled: true },
      { name: "B", url: "https://b", enabled: false },
    ]);
  });

  it("whenCfgReposGiven_thenToJFReposMapsToJellyfinShape()", () => {
    // Arrange
    const cfg: PluginRepositoryCfg[] = [
      { name: "A", url: "https://a", enabled: true },
      { name: "B", url: "https://b", enabled: false },
    ];

    // Act
    const out: JFPluginRepo[] = toJFRepos(cfg);

    // Assert
    expect(out).toEqual<JFPluginRepo[]>([
      { Name: "A", Url: "https://a", Enabled: true },
      { Name: "B", Url: "https://b", Enabled: false },
    ]);
  });

  it("whenReposReordered_thenEqualReposUnorderedReturnsTrue()", () => {
    // Arrange
    const a: PluginRepositoryCfg[] = [
      { name: "A", url: "https://a", enabled: true },
      { name: "B", url: "https://b", enabled: false },
    ];
    const b: PluginRepositoryCfg[] = [
      { name: "B", url: "https://b", enabled: false },
      { name: "A", url: "https://a", enabled: true },
    ];

    // Act & Assert
    expect(equalReposUnordered(a, b)).toBe(true);
  });

  it("whenRepoEnabledFlagDiffers_thenEqualReposUnorderedReturnsFalse()", () => {
    // Arrange
    const a: PluginRepositoryCfg[] = [
      { name: "A", url: "https://a", enabled: true },
    ];
    const b: PluginRepositoryCfg[] = [
      { name: "A", url: "https://a", enabled: false },
    ];

    // Act & Assert
    expect(equalReposUnordered(a, b)).toBe(false);
  });
});
