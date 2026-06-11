{
  lib,
  assertEq,
  ...
}: let
  inherit (import ../../../module/types/networking.nix {inherit lib;}) mkNetworkingConfig;

  nullConfig = {
    baseUrl = null;
    enableHttps = null;
    requireHttps = null;
    certificatePath = null;
    certificatePassword = null;
    internalHttpPort = null;
    internalHttpsPort = null;
    publicHttpPort = null;
    publicHttpsPort = null;
    autoDiscovery = null;
    enableUPnP = null;
    enableIPv4 = null;
    enableIPv6 = null;
    enableRemoteAccess = null;
    localNetworkSubnets = null;
    localNetworkAddresses = null;
    knownProxies = null;
    ignoreVirtualInterfaces = null;
    virtualInterfaceNames = null;
    enablePublishedServerUriByRequest = null;
    publishedServerUriBySubnet = null;
    remoteIPFilter = null;
    isRemoteIPFilterBlacklist = null;
  };
in [
  (assertEq "networking empty config" (mkNetworkingConfig nullConfig) {})

  (assertEq "enableIPv6 true" (mkNetworkingConfig (nullConfig // {enableIPv6 = true;})) {
    enableIPv6 = true;
  })

  (assertEq "enableIPv6 false" (mkNetworkingConfig (nullConfig // {enableIPv6 = false;})) {
    enableIPv6 = false;
  })

  (assertEq "internalHttpPort port" (mkNetworkingConfig (nullConfig // {internalHttpPort = 8096;})) {
    internalHttpPort = 8096;
  })

  (assertEq "baseUrl string" (mkNetworkingConfig (nullConfig // {baseUrl = "/jellyfin";})) {
    baseUrl = "/jellyfin";
  })

  (assertEq "publishedServerUriBySubnet list" (mkNetworkingConfig (nullConfig // {publishedServerUriBySubnet = ["all=https://x"];})) {
    publishedServerUriBySubnet = ["all=https://x"];
  })

  (assertEq "remoteIPFilter list" (mkNetworkingConfig (nullConfig // {remoteIPFilter = ["1.2.3.4"];})) {
    remoteIPFilter = ["1.2.3.4"];
  })

  (assertEq "isRemoteIPFilterBlacklist false" (mkNetworkingConfig (nullConfig // {isRemoteIPFilterBlacklist = false;})) {
    isRemoteIPFilterBlacklist = false;
  })

  (assertEq "isRemoteIPFilterBlacklist true" (mkNetworkingConfig (nullConfig // {isRemoteIPFilterBlacklist = true;})) {
    isRemoteIPFilterBlacklist = true;
  })

  (assertEq "networking complete config" (mkNetworkingConfig {
      baseUrl = "/jellyfin";
      enableHttps = true;
      requireHttps = false;
      certificatePath = "/etc/ssl/cert.pem";
      certificatePassword = "secret";
      internalHttpPort = 8096;
      internalHttpsPort = 8920;
      publicHttpPort = 80;
      publicHttpsPort = 443;
      autoDiscovery = true;
      enableUPnP = false;
      enableIPv4 = true;
      enableIPv6 = false;
      enableRemoteAccess = true;
      localNetworkSubnets = ["192.168.1.0/24"];
      localNetworkAddresses = ["192.168.1.10"];
      knownProxies = ["10.0.0.1"];
      ignoreVirtualInterfaces = true;
      virtualInterfaceNames = ["docker0"];
      enablePublishedServerUriByRequest = false;
      publishedServerUriBySubnet = ["all=https://x"];
      remoteIPFilter = ["1.2.3.4"];
      isRemoteIPFilterBlacklist = true;
    }) {
      baseUrl = "/jellyfin";
      enableHttps = true;
      requireHttps = false;
      certificatePath = "/etc/ssl/cert.pem";
      certificatePassword = "secret";
      internalHttpPort = 8096;
      internalHttpsPort = 8920;
      publicHttpPort = 80;
      publicHttpsPort = 443;
      autoDiscovery = true;
      enableUPnP = false;
      enableIPv4 = true;
      enableIPv6 = false;
      enableRemoteAccess = true;
      localNetworkSubnets = ["192.168.1.0/24"];
      localNetworkAddresses = ["192.168.1.10"];
      knownProxies = ["10.0.0.1"];
      ignoreVirtualInterfaces = true;
      virtualInterfaceNames = ["docker0"];
      enablePublishedServerUriByRequest = false;
      publishedServerUriBySubnet = ["all=https://x"];
      remoteIPFilter = ["1.2.3.4"];
      isRemoteIPFilterBlacklist = true;
    })
]
