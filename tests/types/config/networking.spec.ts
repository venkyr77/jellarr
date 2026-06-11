import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  NetworkingConfigType,
  type NetworkingConfig,
} from "../../../src/types/config/networking";

describe("NetworkingConfig", () => {
  it("should validate empty networking config", () => {
    // Arrange
    const validConfig: z.input<typeof NetworkingConfigType> = {};

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate string fields: baseUrl, certificatePath, certificatePassword", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof NetworkingConfigType>> = [
      { baseUrl: "https://jellyfin.example.com" },
      { baseUrl: "" },
      { certificatePath: "/etc/ssl/certs/jellyfin.pfx" },
      { certificatePassword: "s3cr3t" },
      { certificatePassword: "" },
      {
        baseUrl: "https://media.home.arpa",
        certificatePath: "/path/to/cert.pfx",
        certificatePassword: "pass",
      },
    ];

    validConfigs.forEach((config: z.input<typeof NetworkingConfigType>) => {
      // Act
      const result: ZodSafeParseResult<NetworkingConfig> =
        NetworkingConfigType.safeParse(config);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(config);
      }
    });
  });

  it("should reject non-string baseUrl", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional bad type for test
      baseUrl: true,
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate boolean fields", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof NetworkingConfigType>> = [
      { enableHttps: true },
      { enableHttps: false },
      { requireHttps: true },
      { requireHttps: false },
      { autoDiscovery: true },
      { autoDiscovery: false },
      { enableUPnP: true },
      { enableIPv4: true },
      { enableIPv6: false },
      { enableRemoteAccess: true },
      { ignoreVirtualInterfaces: false },
      { enablePublishedServerUriByRequest: true },
      { isRemoteIPFilterBlacklist: false },
      {
        enableHttps: true,
        requireHttps: true,
        enableIPv4: true,
        enableIPv6: false,
        enableRemoteAccess: true,
      },
    ];

    validConfigs.forEach((config: z.input<typeof NetworkingConfigType>) => {
      // Act
      const result: ZodSafeParseResult<NetworkingConfig> =
        NetworkingConfigType.safeParse(config);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(config);
      }
    });
  });

  it("should reject non-boolean enableHttps", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional bad type for test
      enableHttps: "true",
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject non-boolean requireHttps", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional bad type for test
      requireHttps: 1,
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate integer port fields", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof NetworkingConfigType>> = [
      { internalHttpPort: 8096 },
      { internalHttpsPort: 8920 },
      { publicHttpPort: 80 },
      { publicHttpsPort: 443 },
      {
        internalHttpPort: 8096,
        internalHttpsPort: 8920,
        publicHttpPort: 80,
        publicHttpsPort: 443,
      },
    ];

    validConfigs.forEach((config: z.input<typeof NetworkingConfigType>) => {
      // Act
      const result: ZodSafeParseResult<NetworkingConfig> =
        NetworkingConfigType.safeParse(config);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(config);
      }
    });
  });

  it("should reject non-integer internalHttpPort (float)", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      internalHttpPort: 8096.5,
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject non-number internalHttpPort", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional bad type for test
      internalHttpPort: "8096",
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate string array fields", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof NetworkingConfigType>> = [
      { localNetworkSubnets: ["192.168.1.0/24"] },
      { localNetworkSubnets: ["10.0.0.0/8", "172.16.0.0/12"] },
      { localNetworkSubnets: [] },
      { localNetworkAddresses: ["192.168.1.100"] },
      { localNetworkAddresses: [] },
      { knownProxies: ["192.168.1.1", "10.0.0.1"] },
      { knownProxies: [] },
      { virtualInterfaceNames: ["veth0", "docker0"] },
      { publishedServerUriBySubnet: ["192.168.1.0/24=https://jellyfin.local"] },
      { publishedServerUriBySubnet: [] },
      { remoteIPFilter: ["203.0.113.0/24"] },
      { remoteIPFilter: [] },
    ];

    validConfigs.forEach((config: z.input<typeof NetworkingConfigType>) => {
      // Act
      const result: ZodSafeParseResult<NetworkingConfig> =
        NetworkingConfigType.safeParse(config);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(config);
      }
    });
  });

  it("should reject non-array knownProxies", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional bad type for test
      knownProxies: "192.168.1.1",
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject non-string elements in publishedServerUriBySubnet", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional bad element type for test
      publishedServerUriBySubnet: [123],
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject extra fields due to strict mode (unrecognized_keys)", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      enableHttps: true,
      // @ts-expect-error intentional extra field for test
      corsHosts: [],
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });

  it("should reject unknown fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof NetworkingConfigType> = {
      // @ts-expect-error intentional extra field for test
      notAField: 1,
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });

  it("should validate complete networking config with all 23 fields", () => {
    // Arrange
    const validConfig: z.input<typeof NetworkingConfigType> = {
      baseUrl: "https://jellyfin.example.com",
      enableHttps: true,
      requireHttps: false,
      certificatePath: "/etc/ssl/certs/jellyfin.pfx",
      certificatePassword: "s3cr3t",
      internalHttpPort: 8096,
      internalHttpsPort: 8920,
      publicHttpPort: 80,
      publicHttpsPort: 443,
      autoDiscovery: true,
      enableUPnP: false,
      enableIPv4: true,
      enableIPv6: false,
      enableRemoteAccess: true,
      localNetworkSubnets: ["192.168.1.0/24", "10.0.0.0/8"],
      localNetworkAddresses: ["192.168.1.100"],
      knownProxies: ["192.168.1.1"],
      ignoreVirtualInterfaces: true,
      virtualInterfaceNames: ["veth0", "docker0"],
      enablePublishedServerUriByRequest: false,
      publishedServerUriBySubnet: ["192.168.1.0/24=https://jellyfin.local"],
      remoteIPFilter: ["203.0.113.0/24"],
      isRemoteIPFilterBlacklist: false,
    };

    // Act
    const result: ZodSafeParseResult<NetworkingConfig> =
      NetworkingConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });
});
