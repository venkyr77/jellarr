import { describe, it, expect } from "vitest";
import { applySystem } from "../../src/apply/system";
import type { ServerConfigurationSchema } from "../../src/types/schema/system";

describe("apply/system — table driven", () => {
  it.each([
    {
      name: "t1",
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
      name: "t2",
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
      name: "t3",
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
      name: "t4",
      current: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
      desired: {
        trickplayOptions: {
          enableHwAcceleration: null,
          enableHwEncoding: true,
        },
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
      name: "t5",
      current: {
        EnableMetrics: false,
        PluginRepositories: [],
        TrickplayOptions: {
          EnableHwAcceleration: true,
          EnableHwEncoding: true,
        },
      },
      desired: {
        trickplayOptions: {
          enableHwAcceleration: true,
          enableHwEncoding: null,
        },
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
      name: "t6",
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
      name: "t7",
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
      name: "t8",
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
      name: "t9",
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
  ])("when $name", ({ current, desired, expected }): void => {
    // Act
    const updated: ServerConfigurationSchema = applySystem(current, desired);

    // Assert
    expect(updated).toEqual(expected.schema);

    if (Object.keys(expected.patch).length > 0) {
      expect(updated).not.toBe(current);
    }
  });
});
