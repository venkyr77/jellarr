import { describe, it, expect } from "vitest";
import { applySystem } from "../../src/apply/system";
import type { SystemConfig } from "../../src/types/config/system";
import type { ServerConfigurationSchema } from "../../src/types/schema/system";

type Case = {
  name: string;
  current: ServerConfigurationSchema;
  desired: SystemConfig;
  expected: {
    schema: ServerConfigurationSchema;
    patch: Partial<ServerConfigurationSchema>;
  };
};

const cases: Case[] = [
  {
    name: "EnableMetrics false → true",
    current: {
      EnableMetrics: false,
      PluginRepositories: [],
      TrickplayOptions: undefined,
    },
    desired: { enableMetrics: true },
    expected: {
      schema: {
        EnableMetrics: true,
        PluginRepositories: [],
        TrickplayOptions: undefined,
      },
      patch: { EnableMetrics: true },
    },
  },
  {
    name: "EnableMetrics true → false",
    current: {
      EnableMetrics: true,
      PluginRepositories: [],
      TrickplayOptions: undefined,
    },
    desired: { enableMetrics: false },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: undefined,
      },
      patch: { EnableMetrics: false },
    },
  },
  {
    name: "PluginRepositories differ",
    current: {
      EnableMetrics: false,
      PluginRepositories: [{ Name: "A", Url: "https://a", Enabled: true }],
      TrickplayOptions: undefined,
    },
    desired: {
      pluginRepositories: [
        { name: "B", url: "https://b", enabled: true },
        { name: "A", url: "https://a", enabled: true },
      ],
    },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [
          { Name: "B", Url: "https://b", Enabled: true },
          { Name: "A", Url: "https://a", Enabled: true },
        ],
        TrickplayOptions: undefined,
      },
      patch: {
        PluginRepositories: [
          { Name: "B", Url: "https://b", Enabled: true },
          { Name: "A", Url: "https://a", Enabled: true },
        ],
      },
    },
  },
  {
    name: "Trickplay: enableHwAcceleration null → omit key; keep other fields",
    current: {
      EnableMetrics: false,
      PluginRepositories: [],
      TrickplayOptions: {
        EnableHwAcceleration: true,
        EnableHwEncoding: true,
      },
    },
    desired: {
      trickplayOptions: { enableHwAcceleration: null, enableHwEncoding: true },
    },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: undefined,
          EnableHwEncoding: true,
        },
      },
      patch: {
        TrickplayOptions: {
          EnableHwAcceleration: undefined,
          EnableHwEncoding: true,
        },
      },
    },
  },
  {
    name: "Trickplay: enableHwEncoding null → omit key; keep other fields",
    current: {
      EnableMetrics: false,
      PluginRepositories: [],
      TrickplayOptions: {
        EnableHwAcceleration: true,
        EnableHwEncoding: true,
      },
    },
    desired: {
      trickplayOptions: { enableHwAcceleration: true, enableHwEncoding: null },
    },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: undefined,
        },
      },
      patch: {
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: undefined,
        },
      },
    },
  },
  {
    name: "Trickplay: enableHwAcceleration has change; only it is updated",
    current: {
      EnableMetrics: false,
      PluginRepositories: [],
      TrickplayOptions: {
        EnableHwAcceleration: false,
        EnableHwEncoding: true,
      },
    },
    desired: { trickplayOptions: { enableHwAcceleration: true } },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
      patch: { TrickplayOptions: { EnableHwAcceleration: true } },
    },
  },
  {
    name: "Trickplay: enableHwEncoding has change; only it is updated",
    current: {
      EnableMetrics: false,
      PluginRepositories: [],
      TrickplayOptions: {
        EnableHwAcceleration: true,
        EnableHwEncoding: false,
      },
    },
    desired: { trickplayOptions: { enableHwEncoding: true } },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
      patch: { TrickplayOptions: { EnableHwEncoding: true } },
    },
  },
  {
    name: "Trickplay: all fields have change → all fields are updated",
    current: {
      EnableMetrics: false,
      PluginRepositories: [],
      TrickplayOptions: {
        EnableHwAcceleration: false,
        EnableHwEncoding: false,
      },
    },
    desired: {
      trickplayOptions: {
        enableHwAcceleration: true,
        enableHwEncoding: true,
      },
    },
    expected: {
      schema: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
      patch: {
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
    },
  },
  {
    name: "No desired changes → identical output",
    current: {
      EnableMetrics: true,
      PluginRepositories: [{ Name: "A", Url: "https://a", Enabled: true }],
      TrickplayOptions: {
        EnableHwAcceleration: true,
        EnableHwEncoding: true,
      },
    },
    desired: {},
    expected: {
      schema: {
        EnableMetrics: true,
        PluginRepositories: [{ Name: "A", Url: "https://a", Enabled: true }],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
      patch: {},
    },
  },
];

describe("apply/system — table driven", () => {
  it.each(cases)("when $name", ({ current, desired, expected }): void => {
    // Act
    const updated: ServerConfigurationSchema = applySystem(current, desired);

    // Assert
    expect(updated).toEqual(expected.schema);

    if (Object.keys(expected.patch).length > 0) {
      expect(updated).not.toBe(current);
    }
  });
});
