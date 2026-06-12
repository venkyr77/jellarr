{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  networkingConfigType = types.submodule {
    options = {
      baseUrl = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Base URL for the Jellyfin server.";
      };
      enableHttps = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable HTTPS.";
      };
      requireHttps = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Require HTTPS for all connections.";
      };
      autoDiscovery = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable auto-discovery.";
      };
      enableUPnP = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable UPnP.";
      };
      enableIPv4 = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable IPv4.";
      };
      enableIPv6 = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable IPv6.";
      };
      enableRemoteAccess = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable remote access.";
      };
      ignoreVirtualInterfaces = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Ignore virtual network interfaces.";
      };
      enablePublishedServerUriByRequest = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable published server URI by request.";
      };
      isRemoteIPFilterBlacklist = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Treat the remote IP filter as a blacklist rather than a whitelist.";
      };
      certificatePath = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to the SSL certificate file.";
      };
      certificatePassword = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Password for the SSL certificate.";
      };
      internalHttpPort = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Internal HTTP port.";
      };
      internalHttpsPort = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Internal HTTPS port.";
      };
      publicHttpPort = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Public HTTP port.";
      };
      publicHttpsPort = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Public HTTPS port.";
      };
      localNetworkSubnets = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of local network subnets.";
      };
      localNetworkAddresses = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of local network addresses to bind to.";
      };
      knownProxies = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of known proxy addresses.";
      };
      virtualInterfaceNames = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of virtual interface names to ignore.";
      };
      publishedServerUriBySubnet = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of published server URIs by subnet.";
      };
      remoteIPFilter = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of remote IP addresses to filter.";
      };
    };
  };

  mkNetworkingConfig = cfg:
    {}
    // optionalAttrs (cfg ? baseUrl && cfg.baseUrl != null) {inherit (cfg) baseUrl;}
    // optionalAttrs (cfg ? enableHttps && cfg.enableHttps != null) {inherit (cfg) enableHttps;}
    // optionalAttrs (cfg ? requireHttps && cfg.requireHttps != null) {inherit (cfg) requireHttps;}
    // optionalAttrs (cfg ? autoDiscovery && cfg.autoDiscovery != null) {inherit (cfg) autoDiscovery;}
    // optionalAttrs (cfg ? enableUPnP && cfg.enableUPnP != null) {inherit (cfg) enableUPnP;}
    // optionalAttrs (cfg ? enableIPv4 && cfg.enableIPv4 != null) {inherit (cfg) enableIPv4;}
    // optionalAttrs (cfg ? enableIPv6 && cfg.enableIPv6 != null) {inherit (cfg) enableIPv6;}
    // optionalAttrs (cfg ? enableRemoteAccess && cfg.enableRemoteAccess != null) {inherit (cfg) enableRemoteAccess;}
    // optionalAttrs (cfg ? ignoreVirtualInterfaces && cfg.ignoreVirtualInterfaces != null) {inherit (cfg) ignoreVirtualInterfaces;}
    // optionalAttrs (cfg ? enablePublishedServerUriByRequest && cfg.enablePublishedServerUriByRequest != null) {inherit (cfg) enablePublishedServerUriByRequest;}
    // optionalAttrs (cfg ? isRemoteIPFilterBlacklist && cfg.isRemoteIPFilterBlacklist != null) {inherit (cfg) isRemoteIPFilterBlacklist;}
    // optionalAttrs (cfg ? certificatePath && cfg.certificatePath != null) {inherit (cfg) certificatePath;}
    // optionalAttrs (cfg ? certificatePassword && cfg.certificatePassword != null) {inherit (cfg) certificatePassword;}
    // optionalAttrs (cfg ? internalHttpPort && cfg.internalHttpPort != null) {inherit (cfg) internalHttpPort;}
    // optionalAttrs (cfg ? internalHttpsPort && cfg.internalHttpsPort != null) {inherit (cfg) internalHttpsPort;}
    // optionalAttrs (cfg ? publicHttpPort && cfg.publicHttpPort != null) {inherit (cfg) publicHttpPort;}
    // optionalAttrs (cfg ? publicHttpsPort && cfg.publicHttpsPort != null) {inherit (cfg) publicHttpsPort;}
    // optionalAttrs (cfg ? localNetworkSubnets && cfg.localNetworkSubnets != null) {inherit (cfg) localNetworkSubnets;}
    // optionalAttrs (cfg ? localNetworkAddresses && cfg.localNetworkAddresses != null) {inherit (cfg) localNetworkAddresses;}
    // optionalAttrs (cfg ? knownProxies && cfg.knownProxies != null) {inherit (cfg) knownProxies;}
    // optionalAttrs (cfg ? virtualInterfaceNames && cfg.virtualInterfaceNames != null) {inherit (cfg) virtualInterfaceNames;}
    // optionalAttrs (cfg ? publishedServerUriBySubnet && cfg.publishedServerUriBySubnet != null) {inherit (cfg) publishedServerUriBySubnet;}
    // optionalAttrs (cfg ? remoteIPFilter && cfg.remoteIPFilter != null) {inherit (cfg) remoteIPFilter;};
in {
  inherit networkingConfigType mkNetworkingConfig;
}
