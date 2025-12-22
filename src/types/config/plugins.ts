import { z } from "zod";

export const PluginConfigType: z.ZodObject<{
  name: z.ZodString;
}> = z
  .object({
    name: z.string().min(1, "Plugin name cannot be empty"),
  })
  .strict();

export type PluginConfig = z.infer<typeof PluginConfigType>;

export const PluginConfigListType: z.ZodArray<typeof PluginConfigType> =
  z.array(PluginConfigType);

export type PluginConfigList = z.infer<typeof PluginConfigListType>;
