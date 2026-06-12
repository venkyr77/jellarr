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

      it("should not modify EnableMetrics when value is the same (true -> true)", () => {
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

      it("should not modify EnableMetrics when value is the same (false -> false)", () => {
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

      it("should replace PluginRepositories when pluginRepositories is specified (populated -> different populated)", () => {
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

      it("should replace PluginRepositories (empty -> populated)", () => {
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

      it("should replace PluginRepositories (populated -> empty)", () => {
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

      it("should not modify PluginRepositories when content is the same (empty -> empty)", () => {
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

      it("should replace PluginRepositories (single -> multiple)", () => {
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

      it("should replace PluginRepositories (multiple -> single)", () => {
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

        // Assert: no phantom diff
        expect(result).toBeUndefined();
      });

      it("should grow WidthResolutions ([320] -> [480, 320]) and converge on re-run", () => {
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

        // Act: first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: exact grown array, order preserved
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([480, 320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);

        // Act: second apply (idempotency: re-run with result as current)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert: no further diff
        expect(result2).toBeUndefined();
      });

      it("should shrink WidthResolutions ([480, 320] -> [320]) and converge on re-run", () => {
        // Arrange: current has the grown array
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

        // Act: first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: shrink applied, exact result
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
        expect(result?.EnableMetrics).toBe(false);
        expect(result?.PluginRepositories).toEqual([]);

        // Act: second apply (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert: no further diff
        expect(result2).toBeUndefined();
      });

      it("should swap WidthResolutions ([480] -> [320]) without throwing", () => {
        // Arrange: a swap forces a $value REMOVE after an index shift, which whole-array replacement sidesteps
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

        // Act: must not throw
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: exact replacement
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

        // Assert: both changes land
        expect(result?.TrickplayOptions?.TileWidth).toBe(10);
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should not clobber other TrickplayOptions fields when only tileWidth is set", () => {
        // Arrange: partial-config preservation: an unrelated existing field
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

        // Assert: tileWidth updated, everything else preserved
        expect(result?.TrickplayOptions?.TileWidth).toBe(10);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([480, 320]);
      });

      it("should shrink WidthResolutions across multiple elements ([320, 480, 640, 720, 1080] -> [320, 480]) and converge", () => {
        // Arrange: multi-element removal that index-shift diffing corrupts
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

        // Act: first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: exact, order-preserving multi-element shrink
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320, 480]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        // Act: second apply (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert: no further diff
        expect(result2).toBeUndefined();
      });

      it("should handle middle-element removal + reorder ([800, 640, 480, 320] -> [320, 640]) and converge", () => {
        // Arrange: non-contiguous removal with a reorder
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

        // Act: first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: exact order, not just same set
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320, 640]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);

        // Act: second apply (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert: no further diff
        expect(result2).toBeUndefined();
      });

      it("should add WidthResolutions when current TrickplayOptions lacks it", () => {
        // Arrange: TrickplayOptions present but no WidthResolutions key
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

        // Assert: array added exactly
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(false);
      });

      it("should create TrickplayOptions and set WidthResolutions when server has no TrickplayOptions at all", () => {
        // Arrange: server has no TrickplayOptions; desired sets ONLY widthResolutions.
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          TrickplayOptions: undefined,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          trickplayOptions: { widthResolutions: [320] },
        };

        // Act: first apply
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: TrickplayOptions is lazily created and WidthResolutions is set exactly
        expect(result?.TrickplayOptions?.WidthResolutions).toEqual([320]);

        // Act: second apply (idempotency: re-run with result as current)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert: no further diff
        expect(result2).toBeUndefined();
      });
    });

    describe("top-level string arrays (whole-array replacement)", () => {
      describe("corsHosts (exhaustive)", () => {
        it("should return undefined when CorsHosts is identical (no phantom diff)", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["a", "b"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = { corsHosts: ["a", "b"] };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result).toBeUndefined();
        });

        it("should grow CorsHosts ([a] -> [a, b, c]) and converge on re-run", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["a"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = { corsHosts: ["a", "b", "c"] };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.CorsHosts).toEqual(["a", "b", "c"]);

          expect(result).toBeDefined();
          const result2: ServerConfigurationSchema | undefined =
            calculateSystemDiff(result as ServerConfigurationSchema, desired);
          expect(result2).toBeUndefined();
        });

        it("should shrink CorsHosts across multiple elements ([a, b, c, d] -> [a, b]) and converge", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["a", "b", "c", "d"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = { corsHosts: ["a", "b"] };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.CorsHosts).toEqual(["a", "b"]);

          expect(result).toBeDefined();
          const result2: ServerConfigurationSchema | undefined =
            calculateSystemDiff(result as ServerConfigurationSchema, desired);
          expect(result2).toBeUndefined();
        });

        it("should swap CorsHosts ([a] -> [b]) and converge", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["a"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = { corsHosts: ["b"] };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.CorsHosts).toEqual(["b"]);

          const result2: ServerConfigurationSchema | undefined =
            calculateSystemDiff(result as ServerConfigurationSchema, desired);
          expect(result2).toBeUndefined();
        });

        it("should apply a scalar change AND a CorsHosts shrink together", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["a", "b", "c", "d"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = {
            enableMetrics: true,
            corsHosts: ["a", "b"],
          };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.EnableMetrics).toBe(true);
          expect(result?.CorsHosts).toEqual(["a", "b"]);

          const result2: ServerConfigurationSchema | undefined =
            calculateSystemDiff(result as ServerConfigurationSchema, desired);
          expect(result2).toBeUndefined();
        });

        it("should preserve CorsHosts when only a scalar is set (partial-config)", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["keep1", "keep2"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = { enableMetrics: true };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.EnableMetrics).toBe(true);
          expect(result?.CorsHosts).toEqual(["keep1", "keep2"]);
        });

        it("should preserve CorsHosts when corsHosts is undefined (no-op)", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CorsHosts: ["a", "b"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = {};

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result).toBeUndefined();
        });
      });

      describe("sortReplaceCharacters (representative)", () => {
        it("should multi-element shrink ([a, b, c, d] -> [a, b]) and converge", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            SortReplaceCharacters: ["a", "b", "c", "d"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = {
            sortReplaceCharacters: ["a", "b"],
          };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.SortReplaceCharacters).toEqual(["a", "b"]);

          const result2: ServerConfigurationSchema | undefined =
            calculateSystemDiff(result as ServerConfigurationSchema, desired);
          expect(result2).toBeUndefined();
        });

        it("should grow and swap exactly", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            SortReplaceCharacters: ["."],
          } as ServerConfigurationSchema;

          expect(
            calculateSystemDiff(current, {
              sortReplaceCharacters: [".", "-", "_"],
            })?.SortReplaceCharacters,
          ).toEqual([".", "-", "_"]);

          expect(
            calculateSystemDiff(current, { sortReplaceCharacters: ["-"] })
              ?.SortReplaceCharacters,
          ).toEqual(["-"]);
        });
      });

      describe("sortRemoveCharacters (representative)", () => {
        it("should multi-element shrink and converge", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            SortRemoveCharacters: ["a", "b", "c", "d"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = {
            sortRemoveCharacters: ["a", "b"],
          };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.SortRemoveCharacters).toEqual(["a", "b"]);
          expect(
            calculateSystemDiff(result as ServerConfigurationSchema, desired),
          ).toBeUndefined();
        });
      });

      describe("sortRemoveWords (representative)", () => {
        it("should multi-element shrink and converge", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            SortRemoveWords: ["the", "a", "an", "of"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = {
            sortRemoveWords: ["the", "a"],
          };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.SortRemoveWords).toEqual(["the", "a"]);
          expect(
            calculateSystemDiff(result as ServerConfigurationSchema, desired),
          ).toBeUndefined();
        });
      });

      describe("codecsUsed (representative)", () => {
        it("should multi-element shrink and converge", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CodecsUsed: ["h264", "hevc", "av1", "vp9"],
          } as ServerConfigurationSchema;

          const desired: SystemConfig = {
            codecsUsed: ["h264", "hevc"],
          };

          const result: ServerConfigurationSchema | undefined =
            calculateSystemDiff(current, desired);

          expect(result?.CodecsUsed).toEqual(["h264", "hevc"]);
          expect(
            calculateSystemDiff(result as ServerConfigurationSchema, desired),
          ).toBeUndefined();
        });

        it("should return undefined when identical", () => {
          const current: ServerConfigurationSchema = {
            EnableMetrics: false,
            PluginRepositories: [],
            CodecsUsed: ["h264", "hevc"],
          } as ServerConfigurationSchema;

          expect(
            calculateSystemDiff(current, { codecsUsed: ["h264", "hevc"] }),
          ).toBeUndefined();
        });
      });

      it("should preserve a server array untouched while replacing a different one", () => {
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          CorsHosts: ["x", "y", "z"],
          CodecsUsed: ["h264", "hevc"],
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { corsHosts: ["x"] };

        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        expect(result?.CorsHosts).toEqual(["x"]);
        expect(result?.CodecsUsed).toEqual(["h264", "hevc"]);
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

    describe("extended scalar fields (generic diff pass)", () => {
      it("should apply imageSavingConvention enum (Legacy -> Compatible) and be idempotent", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          ImageSavingConvention: "Legacy",
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          imageSavingConvention: "Compatible",
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: change detected and applied exactly
        expect(result?.ImageSavingConvention).toBe("Compatible");
        expect(result?.EnableMetrics).toBe(false);

        // Act: re-run with result as current (idempotency)
        expect(result).toBeDefined();
        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);

        // Assert: no further diff
        expect(result2).toBeUndefined();
      });

      it("should apply libraryMonitorDelay int and be idempotent", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          LibraryMonitorDelay: 60,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { libraryMonitorDelay: 90 };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.LibraryMonitorDelay).toBe(90);

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should apply enableFolderView bool and be idempotent", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          EnableFolderView: false,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { enableFolderView: true };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.EnableFolderView).toBe(true);

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should apply cachePath string and be idempotent", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          CachePath: "/old/cache",
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { cachePath: "/new/cache" };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert
        expect(result?.CachePath).toBe("/new/cache");

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should apply an enum + int + bool change together", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          ImageSavingConvention: "Legacy",
          LibraryMonitorDelay: 60,
          EnableFolderView: false,
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          imageSavingConvention: "Compatible",
          libraryMonitorDelay: 120,
          enableFolderView: true,
        };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: all three land
        expect(result?.ImageSavingConvention).toBe("Compatible");
        expect(result?.LibraryMonitorDelay).toBe(120);
        expect(result?.EnableFolderView).toBe(true);

        const result2: ServerConfigurationSchema | undefined =
          calculateSystemDiff(result as ServerConfigurationSchema, desired);
        expect(result2).toBeUndefined();
      });

      it("should not clobber unrelated server fields when only cachePath is set (partial-config)", () => {
        // Arrange: server carries unrelated scalar + TrickplayOptions field
        const current: ServerConfigurationSchema = {
          EnableMetrics: true,
          PluginRepositories: [],
          ImageSavingConvention: "Legacy",
          TrickplayOptions: {
            EnableHwAcceleration: true,
            EnableHwEncoding: false,
          },
        } as ServerConfigurationSchema;

        const desired: SystemConfig = { cachePath: "/new/cache" };

        // Act
        const result: ServerConfigurationSchema | undefined =
          calculateSystemDiff(current, desired);

        // Assert: cachePath set, everything else preserved
        expect(result?.CachePath).toBe("/new/cache");
        expect(result?.EnableMetrics).toBe(true);
        expect(result?.ImageSavingConvention).toBe("Legacy");
        expect(result?.TrickplayOptions?.EnableHwAcceleration).toBe(true);
        expect(result?.TrickplayOptions?.EnableHwEncoding).toBe(false);
      });

      it("should return undefined when a new scalar equals its current value", () => {
        // Arrange
        const current: ServerConfigurationSchema = {
          EnableMetrics: false,
          PluginRepositories: [],
          ImageSavingConvention: "Compatible",
        } as ServerConfigurationSchema;

        const desired: SystemConfig = {
          imageSavingConvention: "Compatible",
        };

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
