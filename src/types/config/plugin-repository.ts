import { z } from "zod";

export const PluginRepositoryConfigType: z.ZodObject<{
  name: z.ZodString;
  url: ReturnType<typeof z.url>;
  enabled: z.ZodBoolean;
}> = z.object({
  name: z.string().min(1, "Plugin repository name cannot be empty"),
  url: z.url({ message: "Plugin repository URL must be a valid URL" }),
  enabled: z.boolean(),
});

export type PluginRepositoryConfig = z.infer<typeof PluginRepositoryConfigType>;
