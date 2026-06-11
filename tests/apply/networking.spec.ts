import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculateNetworkingDiff,
  applyNetworking,
} from "../../src/apply/networking";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import { type NetworkingConfig } from "../../src/types/config/networking";
import { type NetworkConfigurationSchema } from "../../src/types/schema/networking";

vi.mock("../../src/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("apply/networking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateNetworkingDiff", () => {
    it("should update EnableHttps and preserve other existing fields", () => {
      // Arrange
      const current: NetworkConfigurationSchema = {
        EnableHttps: false,
        InternalHttpPort: 8096,
        RequireHttps: false,
      } as NetworkConfigurationSchema;

      const desired: NetworkingConfig = {
        enableHttps: true,
      };

      // Act
      const result: NetworkConfigurationSchema | undefined =
        calculateNetworkingDiff(current, desired);

      // Assert
      expect(result?.EnableHttps).toBe(true);
      expect(result?.InternalHttpPort).toBe(8096);
      expect(result?.RequireHttps).toBe(false);
    });

    it("should not include field in diff when desired field is undefined", () => {
      // Arrange
      const current: NetworkConfigurationSchema = {
        EnableHttps: false,
        InternalHttpPort: 8096,
      } as NetworkConfigurationSchema;

      const desired: NetworkingConfig = {};

      // Act
      const result: NetworkConfigurationSchema | undefined =
        calculateNetworkingDiff(current, desired);

      // Assert — no change means undefined
      expect(result).toBeUndefined();
    });

    it("should return undefined when desired value equals current value (idempotent)", () => {
      // Arrange
      const current: NetworkConfigurationSchema = {
        EnableHttps: true,
        InternalHttpPort: 8096,
      } as NetworkConfigurationSchema;

      const desired: NetworkingConfig = {
        enableHttps: true,
      };

      // Act
      const result: NetworkConfigurationSchema | undefined =
        calculateNetworkingDiff(current, desired);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should handle multi-field changes", () => {
      // Arrange
      const current: NetworkConfigurationSchema = {
        EnableHttps: false,
        RequireHttps: false,
        EnableRemoteAccess: true,
        InternalHttpPort: 8096,
        InternalHttpsPort: 8920,
        PublicHttpPort: 80,
        PublicHttpsPort: 443,
      } as NetworkConfigurationSchema;

      const desired: NetworkingConfig = {
        enableHttps: true,
        requireHttps: true,
        enableRemoteAccess: false,
        internalHttpPort: 8096,
        internalHttpsPort: 8920,
      };

      // Act
      const result: NetworkConfigurationSchema | undefined =
        calculateNetworkingDiff(current, desired);

      // Assert
      expect(result?.EnableHttps).toBe(true);
      expect(result?.RequireHttps).toBe(true);
      expect(result?.EnableRemoteAccess).toBe(false);
      expect(result?.InternalHttpPort).toBe(8096);
      expect(result?.InternalHttpsPort).toBe(8920);
      expect(result?.PublicHttpPort).toBe(80);
      expect(result?.PublicHttpsPort).toBe(443);
    });

    describe("array idempotency (critical)", () => {
      it("should return undefined when array fields are identical (no phantom diff)", () => {
        // Arrange
        const current: NetworkConfigurationSchema = {
          PublishedServerUriBySubnet: ["all=https://x"],
          KnownProxies: ["10.0.0.1"],
          InternalHttpPort: 8096,
        } as NetworkConfigurationSchema;

        const desired: NetworkingConfig = {
          publishedServerUriBySubnet: ["all=https://x"],
          knownProxies: ["10.0.0.1"],
        };

        // Act
        const result: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(current, desired);

        // Assert — same arrays must produce no diff
        expect(result).toBeUndefined();
      });

      it("should produce a diff when an array element changes, and re-running with the result is idempotent", () => {
        // Arrange
        const current: NetworkConfigurationSchema = {
          PublishedServerUriBySubnet: ["all=https://old"],
          KnownProxies: ["10.0.0.1"],
          InternalHttpPort: 8096,
        } as NetworkConfigurationSchema;

        const desired: NetworkingConfig = {
          publishedServerUriBySubnet: ["all=https://new"],
          knownProxies: ["10.0.0.1"],
        };

        // Act — first pass should produce a change
        const result: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(current, desired);

        // Assert — change detected
        expect(result).not.toBeUndefined();
        expect(result?.PublishedServerUriBySubnet).toEqual(["all=https://new"]);
        expect(result?.KnownProxies).toEqual(["10.0.0.1"]);
        expect(result?.InternalHttpPort).toBe(8096);

        // Act — second pass with result as new current → idempotent
        if (!result) throw new Error("Expected result to be defined");
        const result2: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(result, desired);

        // Assert — no further diff
        expect(result2).toBeUndefined();
      });

      it("should shrink an array when desired has fewer elements than current", () => {
        // Arrange
        const current: NetworkConfigurationSchema = {
          KnownProxies: ["10.0.0.1", "10.0.0.2", "10.0.0.3"],
          InternalHttpPort: 8096,
        } as NetworkConfigurationSchema;

        const desired: NetworkingConfig = {
          knownProxies: ["10.0.0.1"],
        };

        // Act — first pass applies the shrink
        const result: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(current, desired);

        // Assert — removed elements take effect
        expect(result).not.toBeUndefined();
        expect(result?.KnownProxies).toEqual(["10.0.0.1"]);

        // Act — second pass with result as new current → idempotent
        if (!result) throw new Error("Expected result to be defined");
        const result2: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(result, desired);

        // Assert — converges
        expect(result2).toBeUndefined();
      });

      it("should apply scalar and array changes together and converge", () => {
        // Arrange
        const current: NetworkConfigurationSchema = {
          EnableIPv6: false,
          KnownProxies: ["10.0.0.1", "10.0.0.2"],
          InternalHttpPort: 8096,
        } as NetworkConfigurationSchema;

        const desired: NetworkingConfig = {
          enableIPv6: true,
          knownProxies: ["10.0.0.3"],
        };

        // Act — first pass applies both changes
        const result: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(current, desired);

        // Assert — both changes are reflected
        expect(result).not.toBeUndefined();
        expect(result?.EnableIPv6).toBe(true);
        expect(result?.KnownProxies).toEqual(["10.0.0.3"]);
        expect(result?.InternalHttpPort).toBe(8096);

        // Act — second pass with result as new current → idempotent
        if (!result) throw new Error("Expected result to be defined");
        const result2: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(result, desired);

        // Assert — converges
        expect(result2).toBeUndefined();
      });

      it("should return undefined for all six array fields when identical", () => {
        // Arrange
        const current: NetworkConfigurationSchema = {
          LocalNetworkSubnets: ["192.168.1.0/24"],
          LocalNetworkAddresses: ["192.168.1.100"],
          KnownProxies: ["10.0.0.1"],
          VirtualInterfaceNames: ["veth0"],
          PublishedServerUriBySubnet: ["all=https://x"],
          RemoteIPFilter: ["1.2.3.4"],
          InternalHttpPort: 8096,
        } as NetworkConfigurationSchema;

        const desired: NetworkingConfig = {
          localNetworkSubnets: ["192.168.1.0/24"],
          localNetworkAddresses: ["192.168.1.100"],
          knownProxies: ["10.0.0.1"],
          virtualInterfaceNames: ["veth0"],
          publishedServerUriBySubnet: ["all=https://x"],
          remoteIPFilter: ["1.2.3.4"],
        };

        // Act
        const result: NetworkConfigurationSchema | undefined =
          calculateNetworkingDiff(current, desired);

        // Assert
        expect(result).toBeUndefined();
      });
    });
  });

  describe("applyNetworking", () => {
    let mockClient: JellyfinClient;
    let updateSpy: Mock;

    beforeEach(() => {
      updateSpy = vi.fn();
      mockClient = {
        updateNetworkingConfiguration: updateSpy,
      } as unknown as JellyfinClient;
    });

    it("should do nothing when schema is undefined", async () => {
      await applyNetworking(mockClient, undefined);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it("should call client.updateNetworkingConfiguration with schema", async () => {
      const schema: NetworkConfigurationSchema = {
        EnableHttps: true,
        RequireHttps: false,
      } as NetworkConfigurationSchema;

      updateSpy.mockResolvedValue(undefined);

      await applyNetworking(mockClient, schema);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(schema);
    });
  });
});
