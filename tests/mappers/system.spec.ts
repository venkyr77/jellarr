import { describe, it, expect } from "vitest";
import {
  arePluginRepositoryConfigsEqual,
  fromPluginRepositorySchemas,
  toPluginRepositorySchemas,
} from "../../src/mappers/system";
import { PluginRepositoryConfig } from "../../src/types/config/system";
import { PluginRepositorySchema } from "../../src/types/schema/system";

describe("mappers/system", () => {
  it("whenJellyfinReposGiven_thenFromJFReposMapsToCfgShape()", () => {
    // Arrange
    const jf: PluginRepositorySchema[] = [
      { Name: "A", Url: "https://a", Enabled: true },
      { Name: "B", Url: "https://b", Enabled: false },
    ];

    // Act
    const out: PluginRepositoryConfig[] = fromPluginRepositorySchemas(jf);

    // Assert
    expect(out).toEqual<PluginRepositoryConfig[]>([
      { name: "A", url: "https://a", enabled: true },
      { name: "B", url: "https://b", enabled: false },
    ]);
  });

  it("whenCfgReposGiven_thenToJFReposMapsToJellyfinShape()", () => {
    // Arrange
    const cfg: PluginRepositoryConfig[] = [
      { name: "A", url: "https://a", enabled: true },
      { name: "B", url: "https://b", enabled: false },
    ];

    // Act
    const out: PluginRepositorySchema[] = toPluginRepositorySchemas(cfg);

    // Assert
    expect(out).toEqual<PluginRepositorySchema[]>([
      { Name: "A", Url: "https://a", Enabled: true },
      { Name: "B", Url: "https://b", Enabled: false },
    ]);
  });

  it("whenReposReordered_thenEqualReposUnorderedReturnsTrue()", () => {
    // Arrange
    const a: PluginRepositoryConfig[] = [
      { name: "A", url: "https://a", enabled: true },
      { name: "B", url: "https://b", enabled: false },
    ];
    const b: PluginRepositoryConfig[] = [
      { name: "B", url: "https://b", enabled: false },
      { name: "A", url: "https://a", enabled: true },
    ];

    // Act & Assert
    expect(arePluginRepositoryConfigsEqual(a, b)).toBe(true);
  });

  it("whenRepoEnabledFlagDiffers_thenEqualReposUnorderedReturnsFalse()", () => {
    // Arrange
    const a: PluginRepositoryConfig[] = [
      { name: "A", url: "https://a", enabled: true },
    ];
    const b: PluginRepositoryConfig[] = [
      { name: "A", url: "https://a", enabled: false },
    ];

    // Act & Assert
    expect(arePluginRepositoryConfigsEqual(a, b)).toBe(false);
  });
});
