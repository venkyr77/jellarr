import { describe, it, expect } from "vitest";
import {
  fromPluginRepositorySchemas,
  toPluginRepositorySchemas,
  mapSystemConfigurationConfigToSchema,
} from "../../src/mappers/system";
import type {
  PluginRepositoryConfig,
  SystemConfig,
} from "../../src/types/config/system";
import type {
  PluginRepositorySchema,
  ServerConfigurationSchema,
} from "../../src/types/schema/system";

type FromReposCase = {
  name: string;
  input: PluginRepositorySchema[] | null | undefined;
  expected: PluginRepositoryConfig[];
};

type ToReposCase = {
  name: string;
  input: PluginRepositoryConfig[] | null | undefined;
  expected: PluginRepositorySchema[];
};

type MapSystemCase = {
  name: string;
  desired: SystemConfig;
  expected: Partial<ServerConfigurationSchema>;
};

const fromReposCases: FromReposCase[] = [
  {
    name: "empty list → empty list",
    input: [],
    expected: [],
  },
  {
    name: "maps multiple repos preserving order and fields",
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
    name: "null/undefined input → empty list",
    input: undefined,
    expected: [],
  },
];

const toReposCases: ToReposCase[] = [
  {
    name: "empty list → empty list",
    input: [],
    expected: [],
  },
  {
    name: "maps multiple repos preserving order and fields",
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
    name: "null/undefined input → empty list",
    input: undefined,
    expected: [],
  },
];

const mapSystemCases: MapSystemCase[] = [
  {
    name: "only enableMetrics set → patch with EnableMetrics",
    desired: { enableMetrics: true },
    expected: { EnableMetrics: true },
  },
  {
    name: "only pluginRepositories set → patch with mapped PluginRepositories",
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
    name: "Trickplay: all fields present → patch with all the fields",
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
    name: "Trickplay: enableHwAcceleration null → omit key; keep other fields",
    desired: {
      trickplayOptions: {
        enableHwAcceleration: null,
        enableHwEncoding: true,
      },
    },
    expected: {
      TrickplayOptions: {
        EnableHwAcceleration: undefined,
        EnableHwEncoding: true,
      },
    },
  },
  {
    name: "Trickplay: enableHwEncoding null → omit key; keep other fields",
    desired: {
      trickplayOptions: {
        enableHwAcceleration: true,
        enableHwEncoding: null,
      },
    },
    expected: {
      TrickplayOptions: {
        EnableHwAcceleration: true,
        EnableHwEncoding: undefined,
      },
    },
  },
  {
    name: "empty desired → empty patch",
    desired: {},
    expected: {},
  },
];

describe("mappers/system — fromPluginRepositorySchemas", () => {
  it.each(fromReposCases)("when $name", ({ input, expected }): void => {
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
  it.each(toReposCases)("when $name", ({ input, expected }): void => {
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
  it.each(mapSystemCases)("when $name", ({ desired, expected }): void => {
    // Arrange
    const inCfg: SystemConfig = desired;

    // Act
    const patch: Partial<ServerConfigurationSchema> =
      mapSystemConfigurationConfigToSchema(inCfg);

    // Assert
    expect(patch).toEqual(expected);
  });
});
