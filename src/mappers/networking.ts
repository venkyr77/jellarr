import { type NetworkingConfig } from "../types/config/networking";
import { type NetworkConfigurationSchema } from "../types/schema/networking";

export function mapNetworkingConfigToSchema(
  desired: NetworkingConfig,
): Partial<NetworkConfigurationSchema> {
  const out: Partial<NetworkConfigurationSchema> = {};

  if (typeof desired.baseUrl !== "undefined") {
    out.BaseUrl = desired.baseUrl;
  }

  if (typeof desired.enableHttps !== "undefined") {
    out.EnableHttps = desired.enableHttps;
  }

  if (typeof desired.requireHttps !== "undefined") {
    out.RequireHttps = desired.requireHttps;
  }

  if (typeof desired.certificatePath !== "undefined") {
    out.CertificatePath = desired.certificatePath;
  }

  if (typeof desired.certificatePassword !== "undefined") {
    out.CertificatePassword = desired.certificatePassword;
  }

  if (typeof desired.internalHttpPort !== "undefined") {
    out.InternalHttpPort = desired.internalHttpPort;
  }

  if (typeof desired.internalHttpsPort !== "undefined") {
    out.InternalHttpsPort = desired.internalHttpsPort;
  }

  if (typeof desired.publicHttpPort !== "undefined") {
    out.PublicHttpPort = desired.publicHttpPort;
  }

  if (typeof desired.publicHttpsPort !== "undefined") {
    out.PublicHttpsPort = desired.publicHttpsPort;
  }

  if (typeof desired.autoDiscovery !== "undefined") {
    out.AutoDiscovery = desired.autoDiscovery;
  }

  if (typeof desired.enableUPnP !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    out.EnableUPnP = desired.enableUPnP;
  }

  if (typeof desired.enableIPv4 !== "undefined") {
    out.EnableIPv4 = desired.enableIPv4;
  }

  if (typeof desired.enableIPv6 !== "undefined") {
    out.EnableIPv6 = desired.enableIPv6;
  }

  if (typeof desired.enableRemoteAccess !== "undefined") {
    out.EnableRemoteAccess = desired.enableRemoteAccess;
  }

  if (typeof desired.localNetworkSubnets !== "undefined") {
    out.LocalNetworkSubnets = desired.localNetworkSubnets;
  }

  if (typeof desired.localNetworkAddresses !== "undefined") {
    out.LocalNetworkAddresses = desired.localNetworkAddresses;
  }

  if (typeof desired.knownProxies !== "undefined") {
    out.KnownProxies = desired.knownProxies;
  }

  if (typeof desired.ignoreVirtualInterfaces !== "undefined") {
    out.IgnoreVirtualInterfaces = desired.ignoreVirtualInterfaces;
  }

  if (typeof desired.virtualInterfaceNames !== "undefined") {
    out.VirtualInterfaceNames = desired.virtualInterfaceNames;
  }

  if (typeof desired.enablePublishedServerUriByRequest !== "undefined") {
    out.EnablePublishedServerUriByRequest =
      desired.enablePublishedServerUriByRequest;
  }

  if (typeof desired.publishedServerUriBySubnet !== "undefined") {
    out.PublishedServerUriBySubnet = desired.publishedServerUriBySubnet;
  }

  if (typeof desired.remoteIPFilter !== "undefined") {
    out.RemoteIPFilter = desired.remoteIPFilter;
  }

  if (typeof desired.isRemoteIPFilterBlacklist !== "undefined") {
    out.IsRemoteIPFilterBlacklist = desired.isRemoteIPFilterBlacklist;
  }

  return out;
}
