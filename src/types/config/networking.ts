import { z } from "zod";

export const NetworkingConfigType = z
  .object({
    baseUrl: z.string().optional(),
    enableHttps: z.boolean().optional(),
    requireHttps: z.boolean().optional(),
    internalHttpPort: z.number().int().optional(),
    internalHttpsPort: z.number().int().optional(),
    publicHttpPort: z.number().int().optional(),
    publicHttpsPort: z.number().int().optional(),
    enableRemoteAccess: z.boolean().optional(),
    enableIPv4: z.boolean().optional(),
    enableIPv6: z.boolean().optional(),
    autoDiscovery: z.boolean().optional(),
    enableUPnP: z.boolean().optional(),
    knownProxies: z.array(z.string()).optional(),
    localNetworkSubnets: z.array(z.string()).optional(),
    localNetworkAddresses: z.array(z.string()).optional(),
    remoteIpFilter: z.array(z.string()).optional(),
    isRemoteIpFilterBlacklist: z.boolean().optional(),
    ignoreVirtualInterfaces: z.boolean().optional(),
    virtualInterfaceNames: z.array(z.string()).optional(),
    enablePublishedServerUriByRequest: z.boolean().optional(),
    publishedServerUriBySubnet: z.array(z.string()).optional(),
    corsHosts: z.array(z.string()).optional(),
  })
  .strict();

export type NetworkingConfig = z.infer<typeof NetworkingConfigType>;
