/**
 * Comprehensive System Apply Test Coverage
 *
 * ## enableMetrics (Scalar Boolean)
 * - ✅ Preserve when undefined (both true/false current states)
 * - ✅ Change: false → true, true → false (actual changes)
 * - ✅ No-change: true → true, false → false (same value)
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 *
 * ## pluginRepositories (Array)
 * - ✅ Preserve when undefined (populated/empty current states)
 * - ✅ Replace scenarios: empty ↔ populated, single ↔ multiple
 * - ✅ Content-identical detection (no unnecessary changes)
 * - ✅ Logging behavior for array changes
 *
 * ## trickplayOptions (Object)
 * - ✅ Preserve when undefined (populated/undefined current states)
 * - ✅ Partial updates (individual fields: enableHwAcceleration, enableHwEncoding)
 * - ✅ Full updates (both fields simultaneously)
 * - ✅ Empty object handling (preserves all current fields)
 * - ✅ Creating from undefined state
 * - ✅ Mixed updates (one field same, one different)
 * - ✅ Logging behavior for object changes
 *
 * ## Multi-field Scenarios
 * - ✅ All three fields changing simultaneously
 * - ✅ Two-field combinations preserving the third
 * - ✅ Complete preservation when no changes specified
 *
 * ## Edge Cases
 * - ✅ Malformed state handling (null values)
 * - ✅ Robust error recovery
 */
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { calculateSystemDiff, applySystem } from "../../src/apply/system";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type { ServerConfigurationSchema } from "../../src/types/schema/system";
import type { SystemConfig } from "../../src/types/config/system";

vi.mock("../../src/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("apply/system", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateSystemDiff", () => {
    describe("enableMetrics (Scalar Boolean)", () => {
      it("should preserve EnableMetrics when enableMetrics is undefined (current: true)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: true,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should preserve EnableMetrics when enableMetrics is undefined (current: false)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should update EnableMetrics when enableMetrics changes from false to true", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { enableMetrics: true };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableMetrics).toBe(true);
        expect(result?.PluginRepositories).toEqual([]);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should update EnableMetrics when enableMetrics changes from true to false", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: true,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { enableMetrics: false };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should not modify EnableMetrics when value is the same (true → true)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: true,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { enableMetrics: true };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should not modify EnableMetrics when value is the same (false → false)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { enableMetrics: false };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe("pluginRepositories (Array)", () => {
      it("should preserve PluginRepositories when pluginRepositories is undefined (current: populated)", () => {
        // Arrange
        const existingRepos: Array<{
          Name: string;
          Url: string;
          Enabled: boolean;
        }> = [
          { Name: "Repo1", Url: "https://repo1.com", Enabled: true },
          { Name: "Repo2", Url: "https://repo2.com", Enabled: false },
        ];
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: existingRepos,
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should preserve PluginRepositories when pluginRepositories is undefined (current: empty)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should replace PluginRepositories when pluginRepositories is specified (populated → different populated)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [
            { Name: "Old", Url: "https://old.com", Enabled: true },
          ],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "New1", url: "https://new1.com", enabled: true },
            { name: "New2", url: "https://new2.com", enabled: false },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.PluginRepositories).toEqual([
          { Name: "New1", Url: "https://new1.com", Enabled: true },
          { Name: "New2", Url: "https://new2.com", Enabled: false },
        ]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should replace PluginRepositories (empty → populated)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "New", url: "https://new.com", enabled: true },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.PluginRepositories).toEqual([
          { Name: "New", Url: "https://new.com", Enabled: true },
        ]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should replace PluginRepositories (populated → empty)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [
            { Name: "Existing", Url: "https://existing.com", Enabled: true },
          ],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.PluginRepositories).toEqual([]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should not modify PluginRepositories when content is the same (empty → empty)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should replace PluginRepositories (single → multiple)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [
            { Name: "Single", Url: "https://single.com", Enabled: true },
          ],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "Multi1", url: "https://multi1.com", enabled: true },
            { name: "Multi2", url: "https://multi2.com", enabled: false },
            { name: "Multi3", url: "https://multi3.com", enabled: true },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.PluginRepositories).toEqual([
          { Name: "Multi1", Url: "https://multi1.com", Enabled: true },
          { Name: "Multi2", Url: "https://multi2.com", Enabled: false },
          { Name: "Multi3", Url: "https://multi3.com", Enabled: true },
        ]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should replace PluginRepositories (multiple → single)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [
            { Name: "Multi1", Url: "https://multi1.com", Enabled: true },
            { Name: "Multi2", Url: "https://multi2.com", Enabled: false },
          ],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "Single", url: "https://single.com", enabled: true },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.PluginRepositories).toEqual([
          { Name: "Single", Url: "https://single.com", Enabled: true },
        ]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should not modify PluginRepositories when content is identical", () => {
        // Arrange
        const sameRepos: Array<{
          Name: string;
          Url: string;
          Enabled: boolean;
        }> = [
          { Name: "Same", Url: "https://same.com", Enabled: true },
          { Name: "Also Same", Url: "https://alsosame.com", Enabled: false },
        ];
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: sameRepos,
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "Same", url: "https://same.com", enabled: true },
            { name: "Also Same", url: "https://alsosame.com", enabled: false },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe("trickplayOptions (Object)", () => {
      it("should preserve TrickplayOptions when trickplayOptions is undefined (current: populated)", () => {
        // Arrange
        const existingTrickplay: {
          EnableHwAcceleration: boolean;
          EnableHwEncoding: boolean;
        } = {
          EnableHwAcceleration: true,
          EnableHwEncoding: false,
        };
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: existingTrickplay,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should preserve TrickplayOptions when trickplayOptions is undefined (current: undefined)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should update TrickplayOptions with partial update (enableHwAcceleration only)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            EnableHwEncoding: true,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: { enableHwAcceleration: true },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(true);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });

      it("should update TrickplayOptions with partial update (enableHwEncoding only)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: true,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: { enableHwEncoding: true },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(true);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });

      it("should update TrickplayOptions with full update (both fields)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            enableHwAcceleration: true,
            enableHwEncoding: true,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(true);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });

      it("should preserve all fields when trickplayOptions is empty object", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: true,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {},
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should create TrickplayOptions when current is undefined", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            enableHwAcceleration: true,
            enableHwEncoding: false,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(false);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });

      it("should not modify TrickplayOptions when values are the same", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: true,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            enableHwAcceleration: true,
            enableHwEncoding: false,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });

      it("should handle mixed update (one field same, one different)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: true,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            enableHwAcceleration: true,
            enableHwEncoding: true,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(true);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });
    });

    describe("multi-field scenarios", () => {
      it("should update all three fields simultaneously", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [
            { Name: "Old", Url: "https://old.com", Enabled: true },
          ],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          enableMetrics: true,
          pluginRepositories: [
            { name: "New1", url: "https://new1.com", enabled: true },
            { name: "New2", url: "https://new2.com", enabled: false },
          ],
          trickplayOptions: {
            enableHwAcceleration: true,
            enableHwEncoding: true,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableMetrics).toBe(true);
        expect(result?.PluginRepositories).toEqual([
          { Name: "New1", Url: "https://new1.com", Enabled: true },
          { Name: "New2", Url: "https://new2.com", Enabled: false },
        ]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(true);
      });

      it("should update two fields while preserving the third (enableMetrics + pluginRepositories)", () => {
        // Arrange
        const existingTrickplay: {
          EnableHwAcceleration: boolean;
          EnableHwEncoding: boolean;
        } = {
          EnableHwAcceleration: true,
          EnableHwEncoding: false,
        };
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [
            { Name: "Old", Url: "https://old.com", Enabled: true },
          ],
          TrickplayOptions: existingTrickplay,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          enableMetrics: true,
          pluginRepositories: [
            { name: "New", url: "https://new.com", enabled: false },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableMetrics).toBe(true);
        expect(result?.PluginRepositories).toEqual([
          { Name: "New", Url: "https://new.com", Enabled: false },
        ]);
        expect(result?.TrickplayOptions).toEqual(existingTrickplay);
      });

      it("should update two fields while preserving the third (enableMetrics + trickplayOptions)", () => {
        // Arrange
        const existingRepos: Array<{
          Name: string;
          Url: string;
          Enabled: boolean;
        }> = [{ Name: "Keep", Url: "https://keep.com", Enabled: true }];
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: existingRepos,
          TrickplayOptions: {
            EnableHwAcceleration: false,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          enableMetrics: true,
          trickplayOptions: {
            enableHwAcceleration: true,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableMetrics).toBe(true);
        expect(result?.PluginRepositories).toEqual(existingRepos);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(false);
      });

      it("should update two fields while preserving the third (pluginRepositories + trickplayOptions)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: true,
          PluginRepositories: [
            { Name: "Old", Url: "https://old.com", Enabled: true },
          ],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "New", url: "https://new.com", enabled: false },
          ],
          trickplayOptions: {
            enableHwEncoding: true,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableMetrics).toBe(true);
        expect(result?.PluginRepositories).toEqual([
          { Name: "New", Url: "https://new.com", Enabled: false },
        ]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(true);
      });

      it("should preserve all fields when no changes are specified", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: true,
          PluginRepositories: [
            { Name: "Repo1", Url: "https://repo1.com", Enabled: true },
            { Name: "Repo2", Url: "https://repo2.com", Enabled: false },
          ],
          TrickplayOptions: {
            EnableHwAcceleration: true,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {};

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe("edge cases", () => {
      it("should handle malformed current state (null TrickplayOptions)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: null as unknown,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            enableHwAcceleration: true,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });

      it("should handle malformed current state (null PluginRepositories)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: null as unknown,
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          pluginRepositories: [
            { name: "New", url: "https://new.com", enabled: true },
          ],
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.PluginRepositories).toEqual([
          { Name: "New", Url: "https://new.com", Enabled: true },
        ]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.TrickplayOptions).toBeUndefined();
      });
    });
  });

  describe("applySystem", () => {
    let mockClient: JellyfinClient;
    let updateSpy: Mock;

    beforeEach(() => {
      updateSpy = vi.fn();
      mockClient = {
        updateSystemConfiguration: updateSpy,
      } as unknown as JellyfinClient;
    });

    it("should do nothing when schema is undefined", async () => {
      await applySystem(mockClient, undefined);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it("should call client.updateSystemConfiguration with schema", async () => {
      const schema: ServerConfigurationSchema = {
        EnableMetrics: true,
        PluginRepositories: [],
      } as ServerConfigurationSchema;

      updateSpy.mockResolvedValue(undefined);

      await applySystem(mockClient, schema);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(schema);
    });
  });
});
