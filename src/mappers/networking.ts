import { type NetworkingConfig } from "../types/config/networking";
import { type NetworkConfigurationSchema } from "../types/schema/networking";
import { withoutUndefined } from "../lib/objects";

export function mapNetworkingConfigToSchema(
  desired: NetworkingConfig,
): Partial<NetworkConfigurationSchema> {
  return withoutUndefined({
    BaseUrl: desired.baseUrl,
    EnableHttps: desired.enableHttps,
    RequireHttps: desired.requireHttps,
    CertificatePath: desired.certificatePath,
    CertificatePassword: desired.certificatePassword,
    InternalHttpPort: desired.internalHttpPort,
    InternalHttpsPort: desired.internalHttpsPort,
    PublicHttpPort: desired.publicHttpPort,
    PublicHttpsPort: desired.publicHttpsPort,
    AutoDiscovery: desired.autoDiscovery,
    EnableUPnP: desired.enableUPnP,
    EnableIPv4: desired.enableIPv4,
    EnableIPv6: desired.enableIPv6,
    EnableRemoteAccess: desired.enableRemoteAccess,
    LocalNetworkSubnets: desired.localNetworkSubnets,
    LocalNetworkAddresses: desired.localNetworkAddresses,
    KnownProxies: desired.knownProxies,
    IgnoreVirtualInterfaces: desired.ignoreVirtualInterfaces,
    VirtualInterfaceNames: desired.virtualInterfaceNames,
    EnablePublishedServerUriByRequest:
      desired.enablePublishedServerUriByRequest,
    PublishedServerUriBySubnet: desired.publishedServerUriBySubnet,
    RemoteIPFilter: desired.remoteIPFilter,
    IsRemoteIPFilterBlacklist: desired.isRemoteIPFilterBlacklist,
  }) as Partial<NetworkConfigurationSchema>;
}
