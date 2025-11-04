import { z } from "zod";
import { PluginRepositoryConfigType } from "./plugin-repository";
import { TrickplayOptionsConfigType } from "./trickplay-options";

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
