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
  processThreads: z.ZodOptional<z.ZodNumber>;
  enableKeyFrameOnlyExtraction: z.ZodOptional<z.ZodBoolean>;
  scanBehavior: z.ZodOptional<
    z.ZodEnum<{
      Blocking: "Blocking";
      NonBlocking: "NonBlocking";
    }>
  >;
  processPriority: z.ZodOptional<
    z.ZodEnum<{
      Normal: "Normal";
      Idle: "Idle";
      High: "High";
      RealTime: "RealTime";
      BelowNormal: "BelowNormal";
      AboveNormal: "AboveNormal";
    }>
  >;
  interval: z.ZodOptional<z.ZodNumber>;
  widthResolutions: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
  tileWidth: z.ZodOptional<z.ZodNumber>;
  tileHeight: z.ZodOptional<z.ZodNumber>;
  qscale: z.ZodOptional<z.ZodNumber>;
  jpegQuality: z.ZodOptional<z.ZodNumber>;
}> = z.object({
  enableHwAcceleration: z.boolean().optional(),
  enableHwEncoding: z.boolean().optional(),
  processThreads: z.number().int().positive().optional(),
  enableKeyFrameOnlyExtraction: z.boolean().optional(),
  scanBehavior: z.enum(["Blocking", "NonBlocking"]).optional(),
  processPriority: z
    .enum(["Normal", "Idle", "High", "RealTime", "BelowNormal", "AboveNormal"])
    .optional(),
  interval: z.number().int().optional(),
  widthResolutions: z.array(z.number().int()).optional(),
  tileWidth: z.number().int().optional(),
  tileHeight: z.number().int().optional(),
  qscale: z.number().int().optional(),
  jpegQuality: z.number().int().optional(),
});

export type TrickplayOptionsConfig = z.infer<typeof TrickplayOptionsConfigType>;

export const SystemConfigType: z.ZodObject<{
  serverName: z.ZodOptional<z.ZodString>;
  enableMetrics: z.ZodOptional<z.ZodBoolean>;
  pluginRepositories: z.ZodOptional<
    z.ZodArray<typeof PluginRepositoryConfigType>
  >;
  trickplayOptions: z.ZodOptional<typeof TrickplayOptionsConfigType>;
}> = z
  .object({
    serverName: z.string().min(1).optional(),
    enableMetrics: z.boolean().optional(),
    pluginRepositories: z.array(PluginRepositoryConfigType).optional(),
    trickplayOptions: TrickplayOptionsConfigType.optional(),
  })
  .strict();

export type SystemConfig = z.infer<typeof SystemConfigType>;
