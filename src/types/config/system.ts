import { z } from "zod";

export const PluginRepositoryConfigType: z.ZodObject<{
  name: z.ZodString;
  url: z.ZodURL;
  enabled: z.ZodBoolean;
}> = z.object({
  name: z.string().min(1, "Plugin repository name cannot be empty"),
  url: z.url({ message: "Plugin repository URL must be a valid URL" }),
  enabled: z.boolean(),
});

export type PluginRepositoryConfig = z.infer<typeof PluginRepositoryConfigType>;

export const TrickplayOptionsConfigType: z.ZodObject<{
  enableHwAcceleration: z.ZodOptional<z.ZodBoolean>;
  enableHwEncoding: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
  enableHwAcceleration: z.boolean().optional(),
  enableHwEncoding: z.boolean().optional(),
});

export type TrickplayOptionsConfig = z.infer<typeof TrickplayOptionsConfigType>;

export const SystemConfigType: z.ZodObject<{
  enableMetrics: z.ZodOptional<z.ZodBoolean>;
  pluginRepositories: z.ZodOptional<
    z.ZodArray<typeof PluginRepositoryConfigType>
  >;
  trickplayOptions: z.ZodOptional<typeof TrickplayOptionsConfigType>;
}> = z
  .object({
    enableMetrics: z.boolean().optional(),
    pluginRepositories: z.array(PluginRepositoryConfigType).optional(),
    trickplayOptions: TrickplayOptionsConfigType.optional(),
  })
  .strict();

export type SystemConfig = z.infer<typeof SystemConfigType>;
