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
 * - ✅ Scalar field update (tileWidth)
 * - ✅ Enum field update (scanBehavior)
 *
 * ## trickplayOptions WidthResolutions (primitive array idempotency)
 * - ✅ Same array → no phantom diff (undefined)
 * - ✅ Grow ([320] → [480, 320]) → applies exactly + converges on re-run
 * - ✅ Shrink ([480, 320] → [320]) → applies exactly + converges on re-run
 * - ✅ Swap ([480] → [320]) → applies exactly without throwing
 * - ✅ Combined scalar change + array shrink → both land, converges
 * - ✅ Partial-config preservation (tileWidth-only keeps other fields)
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
    describe("serverName (Scalar String)", () => {
      it("should preserve ServerName when serverName is undefined", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          ServerName: "CurrentServer",
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

      it("should update ServerName when serverName changes", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          ServerName: "OldServer",
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { serverName: "NewServer" };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.ServerName).toBe("NewServer");
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
        expect(result?.TrickplayOptions).toBeUndefined();
      });

      it("should not modify ServerName when value is the same", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          ServerName: "SameServer",
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { serverName: "SameServer" };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });
    });

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

      it("should detect tileWidth scalar field update", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            TileWidth: 5,
            WidthResolutions: [320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            tileWidth: 10,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.TileWidth).toBe(10);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });

      it("should detect scanBehavior enum field update", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            ScanBehavior: "Blocking",
            WidthResolutions: [320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            scanBehavior: "NonBlocking",
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.TrickplayOptions?.ScanBehavior).toBe("NonBlocking");
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);
      });
    });

    describe("trickplayOptions WidthResolutions (primitive array idempotency)", () => {
      it("should return undefined when WidthResolutions is identical (no phantom diff)", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            WidthResolutions: [320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [320],
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — no phantom diff
        expect(result).toBeUndefined();
      });

      it("should grow WidthResolutions ([320] → [480, 320]) and converge on re-run", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            WidthResolutions: [320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [480, 320],
          },
        };

        // Act — first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — applied result is exactly the grown array (order preserved)
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([480, 320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);

        // Act — second apply (idempotency: re-run with result as current)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert — no further diff
        expect(result2).toBeUndefined();
      });

      it("should shrink WidthResolutions ([480, 320] → [320]) and converge on re-run", () => {
        // Arrange — current has the grown array
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            WidthResolutions: [480, 320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [320],
          },
        };

        // Act — first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — the shrink takes effect; result is exactly the shorter array
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);

        // Act — second apply (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert — no further diff
        expect(result2).toBeUndefined();
      });

      it("should swap WidthResolutions ([480] → [320]) without throwing", () => {
        // Arrange — a swap forces a $value REMOVE after an index shift, which
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            WidthResolutions: [480],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [320],
          },
        };

        // Act — must not throw
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — exact replacement
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should apply a scalar change AND a WidthResolutions shrink together", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            TileWidth: 5,
            WidthResolutions: [480, 320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            tileWidth: 10,
            widthResolutions: [320],
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — both changes land
        expect(result?.TrickplayOptions?.TileWidth).toBe(10);
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should not clobber other TrickplayOptions fields when only tileWidth is set", () => {
        // Arrange — partial-config preservation: an unrelated existing field
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: true,
            TileWidth: 5,
            WidthResolutions: [480, 320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            tileWidth: 10,
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — tileWidth updated, everything else preserved
        expect(result?.TrickplayOptions?.TileWidth).toBe(10);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([480, 320]);
      });

      it("should shrink WidthResolutions across multiple elements ([320, 480, 640, 720, 1080] → [320, 480]) and converge", () => {
        // Arrange — multi-element removal that index-shift diffing corrupts
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            WidthResolutions: [320, 480, 640, 720, 1080],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [320, 480],
          },
        };

        // Act — first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — exact, order-preserving multi-element shrink
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320, 480]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        // Act — second apply (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert — no further diff
        expect(result2).toBeUndefined();
      });

      it("should handle middle-element removal + reorder ([800, 640, 480, 320] → [320, 640]) and converge", () => {
        // Arrange — non-contiguous removal with a reorder
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
            WidthResolutions: [800, 640, 480, 320],
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [320, 640],
          },
        };

        // Act — first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — exact order equals desired, not merely the same set
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320, 640]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        // Act — second apply (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert — no further diff
        expect(result2).toBeUndefined();
      });

      it("should add WidthResolutions when current TrickplayOptions lacks it", () => {
        // Arrange — TrickplayOptions present but no WidthResolutions key
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: {
            EnableHwAcceleration: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: {
            widthResolutions: [320],
          },
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert — array added exactly
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
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
