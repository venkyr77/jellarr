import { z } from "zod";

export const NetworkingConfigType: z.ZodObject<{
  baseUrl: z.ZodOptional<z.ZodString>;
  enableHttps: z.ZodOptional<z.ZodBoolean>;
  requireHttps: z.ZodOptional<z.ZodBoolean>;
  certificatePath: z.ZodOptional<z.ZodString>;
  certificatePassword: z.ZodOptional<z.ZodString>;
  internalHttpPort: z.ZodOptional<z.ZodNumber>;
  internalHttpsPort: z.ZodOptional<z.ZodNumber>;
  publicHttpPort: z.ZodOptional<z.ZodNumber>;
  publicHttpsPort: z.ZodOptional<z.ZodNumber>;
  autoDiscovery: z.ZodOptional<z.ZodBoolean>;
  enableUPnP: z.ZodOptional<z.ZodBoolean>;
  enableIPv4: z.ZodOptional<z.ZodBoolean>;
  enableIPv6: z.ZodOptional<z.ZodBoolean>;
  enableRemoteAccess: z.ZodOptional<z.ZodBoolean>;
  localNetworkSubnets: z.ZodOptional<z.ZodArray<z.ZodString>>;
  localNetworkAddresses: z.ZodOptional<z.ZodArray<z.ZodString>>;
  knownProxies: z.ZodOptional<z.ZodArray<z.ZodString>>;
  ignoreVirtualInterfaces: z.ZodOptional<z.ZodBoolean>;
  virtualInterfaceNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  enablePublishedServerUriByRequest: z.ZodOptional<z.ZodBoolean>;
  publishedServerUriBySubnet: z.ZodOptional<z.ZodArray<z.ZodString>>;
  remoteIPFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
  isRemoteIPFilterBlacklist: z.ZodOptional<z.ZodBoolean>;
}> = z
  .object({
    baseUrl: z.string().optional(),
    enableHttps: z.boolean().optional(),
    requireHttps: z.boolean().optional(),
    certificatePath: z.string().optional(),
    certificatePassword: z.string().optional(),
    internalHttpPort: z.number().int().optional(),
    internalHttpsPort: z.number().int().optional(),
    publicHttpPort: z.number().int().optional(),
    publicHttpsPort: z.number().int().optional(),
    autoDiscovery: z.boolean().optional(),
    enableUPnP: z.boolean().optional(),
    enableIPv4: z.boolean().optional(),
    enableIPv6: z.boolean().optional(),
    enableRemoteAccess: z.boolean().optional(),
    localNetworkSubnets: z.array(z.string()).optional(),
    localNetworkAddresses: z.array(z.string()).optional(),
    knownProxies: z.array(z.string()).optional(),
    ignoreVirtualInterfaces: z.boolean().optional(),
    virtualInterfaceNames: z.array(z.string()).optional(),
    enablePublishedServerUriByRequest: z.boolean().optional(),
    publishedServerUriBySubnet: z.array(z.string()).optional(),
    remoteIPFilter: z.array(z.string()).optional(),
    isRemoteIPFilterBlacklist: z.boolean().optional(),
  })
  .strict();

export type NetworkingConfig = z.infer<typeof NetworkingConfigType>;
