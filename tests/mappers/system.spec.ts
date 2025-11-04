import { describe, it, expect } from "vitest";
import {
  fromPluginRepositorySchemas,
  toPluginRepositorySchemas,
  mapSystemConfigurationConfigToSchema,
} from "../../src/mappers/system";
import type { SystemConfig } from "../../src/types/config/system";
import type { PluginRepositoryConfig } from "../../src/types/config/plugin-repository";
import type {
  PluginRepositorySchema,
  ServerConfigurationSchema,
} from "../../src/types/schema/system";

describe("mappers/system — fromPluginRepositorySchemas", () => {
  it.each([
    {
      name: "fromPluginRepositorySchemas_t1",
      input: [],
      expected: [],
    },
    {
      name: "fromPluginRepositorySchemas_t2",
      input: [
        { Name: "A", Url: "https://a", Enabled: true },
        { Name: "B", Url: "https://b", Enabled: false },
      ],
      expected: [
        { name: "A", url: "https://a", enabled: true },
        { name: "B", url: "https://b", enabled: false },
      ],
    },
    {
      name: "fromPluginRepositorySchemas_t3",
      input: undefined,
      expected: [],
    },
  ])("when $name", ({ input, expected }): void => {
    // Arrange
    const jfRepos: PluginRepositorySchema[] | null | undefined = input;

    // Act
    const out: PluginRepositoryConfig[] = fromPluginRepositorySchemas(
      jfRepos ?? [],
    );

    // Assert
    expect(out).toEqual(expected);
  });
});

describe("mappers/system — toPluginRepositorySchemas", () => {
  it.each([
    {
      name: "toPluginRepositorySchemas_t1",
      input: [],
      expected: [],
    },
    {
      name: "toPluginRepositorySchemas_t2",
      input: [
        { name: "A", url: "https://a", enabled: true },
        { name: "B", url: "https://b", enabled: false },
      ],
      expected: [
        { Name: "A", Url: "https://a", Enabled: true },
        { Name: "B", Url: "https://b", Enabled: false },
      ],
    },
    {
      name: "toPluginRepositorySchemas_t3",
      input: undefined,
      expected: [],
    },
  ])("when $name", ({ input, expected }): void => {
    // Arrange
    const cfgRepos: PluginRepositoryConfig[] | null | undefined = input;

    // Act
    const out: PluginRepositorySchema[] = toPluginRepositorySchemas(
      cfgRepos ?? [],
    );

    // Assert
    expect(out).toEqual(expected);
  });
});

describe("mappers/system — mapSystemConfigurationConfigToSchema", () => {
  it.each([
    {
      name: "mapSystemConfigurationConfigToSchema_t1",
      desired: { enableMetrics: true },
      expected: { EnableMetrics: true },
    },
    {
      name: "mapSystemConfigurationConfigToSchema_t2",
      desired: {
        pluginRepositories: [
          { name: "B", url: "https://b", enabled: true },
          { name: "A", url: "https://a", enabled: false },
        ],
      },
      expected: {
        PluginRepositories: [
          { Name: "B", Url: "https://b", Enabled: true },
          { Name: "A", Url: "https://a", Enabled: false },
        ],
      },
    },
    {
      name: "mapSystemConfigurationConfigToSchema_t3",
      desired: {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: false,
        },
      },
      expected: {
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: false,
        },
      },
    },
    {
      name: "mapSystemConfigurationConfigToSchema_t6",
      desired: {},
      expected: {},
    },
  ])("$name", ({ desired, expected }): void => {
    // Arrange
    const inCfg: SystemConfig = desired;

    // Act
    const patch: Partial<ServerConfigurationSchema> =
      mapSystemConfigurationConfigToSchema(inCfg);

    // Assert
    expect(patch).toEqual(expected);
  });
});
