import { z } from "zod";

export const PluginRepositoryConfigSchema: z.ZodObject<{
  name: z.ZodString;
  url: ReturnType<typeof z.url>;
  enabled: z.ZodBoolean;
}> = z.object({
  name: z.string().min(1, "Plugin repository name cannot be empty"),
  url: z.url({ message: "Plugin repository URL must be a valid URL" }),
  enabled: z.boolean(),
});

export const TrickplayOptionsConfigSchema: z.ZodObject<{
  enableHwAcceleration: z.ZodOptional<z.ZodBoolean>;
  enableHwEncoding: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
  enableHwAcceleration: z.boolean().optional(),
  enableHwEncoding: z.boolean().optional(),
});

export const SystemConfigSchema: z.ZodObject<{
  enableMetrics: z.ZodOptional<z.ZodBoolean>;
  pluginRepositories: z.ZodOptional<
    z.ZodArray<typeof PluginRepositoryConfigSchema>
  >;
  trickplayOptions: z.ZodOptional<typeof TrickplayOptionsConfigSchema>;
}> = z
  .object({
    enableMetrics: z.boolean().optional(),
    pluginRepositories: z.array(PluginRepositoryConfigSchema).optional(),
    trickplayOptions: TrickplayOptionsConfigSchema.optional(),
  })
  .strict();

export const EncodingOptionsConfigSchema: z.ZodObject<{
  enableHardwareEncoding: z.ZodOptional<z.ZodBoolean>;
}> = z
  .object({
    enableHardwareEncoding: z.boolean().optional(),
  })
  .strict();

export const RootConfigSchema: z.ZodObject<{
  version: z.ZodNumber;
  base_url: ReturnType<typeof z.url>;
  system: typeof SystemConfigSchema;
  encoding: z.ZodOptional<typeof EncodingOptionsConfigSchema>;
}> = z
  .object({
    version: z.number().int().positive("Version must be a positive integer"),
    base_url: z.url({ message: "Base URL must be a valid URL" }),
    system: SystemConfigSchema,
    encoding: EncodingOptionsConfigSchema.optional(),
  })
  .strict();

export type ValidatedPluginRepositoryConfig = z.infer<
  typeof PluginRepositoryConfigSchema
>;
export type ValidatedTrickplayOptionsConfig = z.infer<
  typeof TrickplayOptionsConfigSchema
>;
export type ValidatedSystemConfig = z.infer<typeof SystemConfigSchema>;
export type ValidatedEncodingOptionsConfig = z.infer<
  typeof EncodingOptionsConfigSchema
>;
export type ValidatedRootConfig = z.infer<typeof RootConfigSchema>;
