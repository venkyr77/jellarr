/**
 * Networking Mapper Test Coverage
 *
 * ## baseUrl (String Field)
 * - ✅ Field mapping: baseUrl → BaseUrl
 * - ✅ Undefined field handling
 * - ✅ Property exclusion validation
 *
 * ## Boolean Fields
 * - ✅ enableHttps → EnableHttps (true/false)
 * - ✅ requireHttps → RequireHttps (true/false)
 * - ✅ autoDiscovery → AutoDiscovery (true/false)
 * - ✅ enableUPnP → EnableUPnP (true/false)
 * - ✅ enableIPv4 → EnableIPv4 (true/false)
 * - ✅ enableIPv6 → EnableIPv6 (true/false)
 * - ✅ enableRemoteAccess → EnableRemoteAccess (true/false)
 * - ✅ ignoreVirtualInterfaces → IgnoreVirtualInterfaces (true/false)
 * - ✅ enablePublishedServerUriByRequest → EnablePublishedServerUriByRequest (true/false)
 * - ✅ isRemoteIPFilterBlacklist → IsRemoteIPFilterBlacklist (true/false)
 *
 * ## String Fields
 * - ✅ certificatePath → CertificatePath: path mapping, empty string support
 * - ✅ certificatePassword → CertificatePassword: value mapping, empty string support
 *
 * ## Number Fields
 * - ✅ internalHttpPort → InternalHttpPort
 * - ✅ internalHttpsPort → InternalHttpsPort
 * - ✅ publicHttpPort → PublicHttpPort
 * - ✅ publicHttpsPort → PublicHttpsPort
 *
 * ## Array Fields
 * - ✅ localNetworkSubnets → LocalNetworkSubnets
 * - ✅ localNetworkAddresses → LocalNetworkAddresses
 * - ✅ knownProxies → KnownProxies
 * - ✅ virtualInterfaceNames → VirtualInterfaceNames
 * - ✅ publishedServerUriBySubnet → PublishedServerUriBySubnet
 * - ✅ remoteIPFilter → RemoteIPFilter
 *
 * ## Complete Multi-field Scenarios
 * - ✅ All 23 fields together: comprehensive mapping test
 * - ✅ Empty config handling
 *
 * Total coverage: comprehensive tests across all 23 networking fields.
 */
import { describe, it, expect } from "vitest";
import { mapNetworkingConfigToSchema } from "../../src/mappers/networking";
import { type NetworkingConfig } from "../../src/types/config/networking";
import { type NetworkConfigurationSchema } from "../../src/types/schema/networking";

describe("mappers/networking", () => {
  describe("mapNetworkingConfigToSchema", () => {
    it("should map baseUrl to BaseUrl", () => {
      // Arrange
      const config: NetworkingConfig = {
        baseUrl: "https://jellyfin.example.com",
      };

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        BaseUrl: "https://jellyfin.example.com",
      });
    });

    it("should return empty object when baseUrl is undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include BaseUrl when field is not provided", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("BaseUrl");
    });

    it("should map boolean fields enableHttps and requireHttps", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { enableHttps: true },
          expected: { EnableHttps: true },
        },
        {
          config: { enableHttps: false },
          expected: { EnableHttps: false },
        },
        {
          config: { requireHttps: true },
          expected: { RequireHttps: true },
        },
        {
          config: { requireHttps: false },
          expected: { RequireHttps: false },
        },
        {
          config: { enableHttps: true, requireHttps: true },
          expected: { EnableHttps: true, RequireHttps: true },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include https fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableHttps");
      expect(result).not.toHaveProperty("RequireHttps");
    });

    it("should map certificate string fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { certificatePath: "/etc/ssl/certs/jellyfin.pfx" },
          expected: { CertificatePath: "/etc/ssl/certs/jellyfin.pfx" },
        },
        {
          config: { certificatePassword: "s3cr3t" },
          expected: { CertificatePassword: "s3cr3t" },
        },
        {
          config: { certificatePath: "", certificatePassword: "" },
          expected: { CertificatePath: "", CertificatePassword: "" },
        },
        {
          config: {
            certificatePath: "/path/cert.pfx",
            certificatePassword: "pass",
          },
          expected: {
            CertificatePath: "/path/cert.pfx",
            CertificatePassword: "pass",
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include certificate fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("CertificatePath");
      expect(result).not.toHaveProperty("CertificatePassword");
    });

    it("should map port number fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { internalHttpPort: 8096 },
          expected: { InternalHttpPort: 8096 },
        },
        {
          config: { internalHttpsPort: 8920 },
          expected: { InternalHttpsPort: 8920 },
        },
        {
          config: { publicHttpPort: 80 },
          expected: { PublicHttpPort: 80 },
        },
        {
          config: { publicHttpsPort: 443 },
          expected: { PublicHttpsPort: 443 },
        },
        {
          config: {
            internalHttpPort: 8096,
            internalHttpsPort: 8920,
            publicHttpPort: 80,
            publicHttpsPort: 443,
          },
          expected: {
            InternalHttpPort: 8096,
            InternalHttpsPort: 8920,
            PublicHttpPort: 80,
            PublicHttpsPort: 443,
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include port fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("InternalHttpPort");
      expect(result).not.toHaveProperty("InternalHttpsPort");
      expect(result).not.toHaveProperty("PublicHttpPort");
      expect(result).not.toHaveProperty("PublicHttpsPort");
    });

    it("should map discovery and network boolean fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { autoDiscovery: true },
          expected: { AutoDiscovery: true },
        },
        {
          config: { autoDiscovery: false },
          expected: { AutoDiscovery: false },
        },
        {
          config: { enableUPnP: true },
          expected: { EnableUPnP: true },
        },
        {
          config: { enableUPnP: false },
          expected: { EnableUPnP: false },
        },
        {
          config: { enableIPv4: true },
          expected: { EnableIPv4: true },
        },
        {
          config: { enableIPv4: false },
          expected: { EnableIPv4: false },
        },
        {
          config: { enableIPv6: true },
          expected: { EnableIPv6: true },
        },
        {
          config: { enableIPv6: false },
          expected: { EnableIPv6: false },
        },
        {
          config: { enableRemoteAccess: true },
          expected: { EnableRemoteAccess: true },
        },
        {
          config: { enableRemoteAccess: false },
          expected: { EnableRemoteAccess: false },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include discovery and network boolean fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("AutoDiscovery");
      expect(result).not.toHaveProperty("EnableUPnP");
      expect(result).not.toHaveProperty("EnableIPv4");
      expect(result).not.toHaveProperty("EnableIPv6");
      expect(result).not.toHaveProperty("EnableRemoteAccess");
    });

    it("should map local network array fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { localNetworkSubnets: ["192.168.1.0/24"] },
          expected: { LocalNetworkSubnets: ["192.168.1.0/24"] },
        },
        {
          config: {
            localNetworkSubnets: ["192.168.1.0/24", "10.0.0.0/8"],
          },
          expected: {
            LocalNetworkSubnets: ["192.168.1.0/24", "10.0.0.0/8"],
          },
        },
        {
          config: { localNetworkAddresses: ["192.168.1.100"] },
          expected: { LocalNetworkAddresses: ["192.168.1.100"] },
        },
        {
          config: { localNetworkAddresses: [] },
          expected: { LocalNetworkAddresses: [] },
        },
        {
          config: { knownProxies: ["10.0.0.1", "10.0.0.2"] },
          expected: { KnownProxies: ["10.0.0.1", "10.0.0.2"] },
        },
        {
          config: { knownProxies: [] },
          expected: { KnownProxies: [] },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include local network array fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("LocalNetworkSubnets");
      expect(result).not.toHaveProperty("LocalNetworkAddresses");
      expect(result).not.toHaveProperty("KnownProxies");
    });

    it("should map virtual interface fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { ignoreVirtualInterfaces: true },
          expected: { IgnoreVirtualInterfaces: true },
        },
        {
          config: { ignoreVirtualInterfaces: false },
          expected: { IgnoreVirtualInterfaces: false },
        },
        {
          config: { virtualInterfaceNames: ["veth0", "docker0"] },
          expected: { VirtualInterfaceNames: ["veth0", "docker0"] },
        },
        {
          config: { virtualInterfaceNames: [] },
          expected: { VirtualInterfaceNames: [] },
        },
        {
          config: {
            ignoreVirtualInterfaces: true,
            virtualInterfaceNames: ["veth0"],
          },
          expected: {
            IgnoreVirtualInterfaces: true,
            VirtualInterfaceNames: ["veth0"],
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include virtual interface fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("IgnoreVirtualInterfaces");
      expect(result).not.toHaveProperty("VirtualInterfaceNames");
    });

    it("should map published server URI fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { enablePublishedServerUriByRequest: true },
          expected: { EnablePublishedServerUriByRequest: true },
        },
        {
          config: { enablePublishedServerUriByRequest: false },
          expected: { EnablePublishedServerUriByRequest: false },
        },
        {
          config: {
            publishedServerUriBySubnet: [
              "192.168.1.0/24=https://local.example.com",
            ],
          },
          expected: {
            PublishedServerUriBySubnet: [
              "192.168.1.0/24=https://local.example.com",
            ],
          },
        },
        {
          config: { publishedServerUriBySubnet: [] },
          expected: { PublishedServerUriBySubnet: [] },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include published server URI fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnablePublishedServerUriByRequest");
      expect(result).not.toHaveProperty("PublishedServerUriBySubnet");
    });

    it("should map remote IP filter fields", () => {
      // Arrange
      const testCases: Array<{
        config: NetworkingConfig;
        expected: Partial<NetworkConfigurationSchema>;
      }> = [
        {
          config: { remoteIPFilter: ["10.0.0.0/8"] },
          expected: { RemoteIPFilter: ["10.0.0.0/8"] },
        },
        {
          config: { remoteIPFilter: ["10.0.0.0/8", "172.16.0.0/12"] },
          expected: { RemoteIPFilter: ["10.0.0.0/8", "172.16.0.0/12"] },
        },
        {
          config: { remoteIPFilter: [] },
          expected: { RemoteIPFilter: [] },
        },
        {
          config: { isRemoteIPFilterBlacklist: true },
          expected: { IsRemoteIPFilterBlacklist: true },
        },
        {
          config: { isRemoteIPFilterBlacklist: false },
          expected: { IsRemoteIPFilterBlacklist: false },
        },
        {
          config: {
            remoteIPFilter: ["10.0.0.0/8"],
            isRemoteIPFilterBlacklist: true,
          },
          expected: {
            RemoteIPFilter: ["10.0.0.0/8"],
            IsRemoteIPFilterBlacklist: true,
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: NetworkingConfig;
          expected: Partial<NetworkConfigurationSchema>;
        }) => {
          // Act
          const result: Partial<NetworkConfigurationSchema> =
            mapNetworkingConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include remote IP filter fields when undefined", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("RemoteIPFilter");
      expect(result).not.toHaveProperty("IsRemoteIPFilterBlacklist");
    });

    it("should map complete networking config with all 23 fields", () => {
      // Arrange
      const config: NetworkingConfig = {
        baseUrl: "/jellyfin",
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
        localNetworkSubnets: ["192.168.1.0/24"],
        localNetworkAddresses: ["192.168.1.100"],
        knownProxies: ["10.0.0.1"],
        ignoreVirtualInterfaces: true,
        virtualInterfaceNames: ["veth0"],
        enablePublishedServerUriByRequest: false,
        publishedServerUriBySubnet: [
          "192.168.1.0/24=https://local.example.com",
        ],
        remoteIPFilter: ["10.0.0.0/8"],
        isRemoteIPFilterBlacklist: false,
      };

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        BaseUrl: "/jellyfin",
        EnableHttps: true,
        RequireHttps: false,
        CertificatePath: "/etc/ssl/certs/jellyfin.pfx",
        CertificatePassword: "s3cr3t",
        InternalHttpPort: 8096,
        InternalHttpsPort: 8920,
        PublicHttpPort: 80,
        PublicHttpsPort: 443,
        AutoDiscovery: true,
        EnableUPnP: false,
        EnableIPv4: true,
        EnableIPv6: false,
        EnableRemoteAccess: true,
        LocalNetworkSubnets: ["192.168.1.0/24"],
        LocalNetworkAddresses: ["192.168.1.100"],
        KnownProxies: ["10.0.0.1"],
        IgnoreVirtualInterfaces: true,
        VirtualInterfaceNames: ["veth0"],
        EnablePublishedServerUriByRequest: false,
        PublishedServerUriBySubnet: [
          "192.168.1.0/24=https://local.example.com",
        ],
        RemoteIPFilter: ["10.0.0.0/8"],
        IsRemoteIPFilterBlacklist: false,
      } as NetworkConfigurationSchema);
    });

    it("should return empty object for empty config", () => {
      // Arrange
      const config: NetworkingConfig = {};

      // Act
      const result: Partial<NetworkConfigurationSchema> =
        mapNetworkingConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });
  });
});
