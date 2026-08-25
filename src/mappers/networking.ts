import type { NetworkingConfig } from "../types/config/networking";
import type { NetworkConfigurationSchema } from "../types/schema/networking";
import type { ServerConfigurationSchema } from "../types/schema/system";

export function mapNetworkingConfigToSchema(
  desired: NetworkingConfig,
): Partial<NetworkConfigurationSchema> {
  const out: Partial<NetworkConfigurationSchema> = {};

  if (desired.baseUrl !== undefined) out.BaseUrl = desired.baseUrl;
  if (desired.enableHttps !== undefined) out.EnableHttps = desired.enableHttps;
  if (desired.requireHttps !== undefined)
    out.RequireHttps = desired.requireHttps;
  if (desired.internalHttpPort !== undefined)
    out.InternalHttpPort = desired.internalHttpPort;
  if (desired.internalHttpsPort !== undefined)
    out.InternalHttpsPort = desired.internalHttpsPort;
  if (desired.publicHttpPort !== undefined)
    out.PublicHttpPort = desired.publicHttpPort;
  if (desired.publicHttpsPort !== undefined)
    out.PublicHttpsPort = desired.publicHttpsPort;
  if (desired.enableRemoteAccess !== undefined)
    out.EnableRemoteAccess = desired.enableRemoteAccess;
  if (desired.enableIPv4 !== undefined) out.EnableIPv4 = desired.enableIPv4;
  if (desired.enableIPv6 !== undefined) out.EnableIPv6 = desired.enableIPv6;
  if (desired.enableUPnP !== undefined) out.EnableUPnP = desired.enableUPnP;
  if (desired.knownProxies !== undefined)
    out.KnownProxies = desired.knownProxies;
  if (desired.localNetworkSubnets !== undefined)
    out.LocalNetworkSubnets = desired.localNetworkSubnets;
  if (desired.localNetworkAddresses !== undefined)
    out.LocalNetworkAddresses = desired.localNetworkAddresses;
  if (desired.remoteIpFilter !== undefined)
    out.RemoteIPFilter = desired.remoteIpFilter;
  if (desired.isRemoteIpFilterBlacklist !== undefined)
    out.IsRemoteIPFilterBlacklist = desired.isRemoteIpFilterBlacklist;
  if (desired.ignoreVirtualInterfaces !== undefined)
    out.IgnoreVirtualInterfaces = desired.ignoreVirtualInterfaces;
  if (desired.virtualInterfaceNames !== undefined)
    out.VirtualInterfaceNames = desired.virtualInterfaceNames;
  if (desired.enablePublishedServerUriByRequest !== undefined)
    out.EnablePublishedServerUriByRequest =
      desired.enablePublishedServerUriByRequest;
  if (desired.publishedServerUriBySubnet !== undefined)
    out.PublishedServerUriBySubnet = desired.publishedServerUriBySubnet;
  if (desired.autoDiscovery !== undefined)
    out.AutoDiscovery = desired.autoDiscovery;

  return out;
}

export function mapNetworkingCorsHostsToSystemSchema(
  desired: NetworkingConfig,
): Partial<ServerConfigurationSchema> {
  const out: Partial<ServerConfigurationSchema> = {};
  if (desired.corsHosts !== undefined) out.CorsHosts = desired.corsHosts;
  return out;
}
