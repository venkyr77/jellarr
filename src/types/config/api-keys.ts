import { z } from "zod";

export const ApiKeyConfigType = z
  .object({
    name: z.string().min(1, "API key name cannot be empty"),
  })
  .strict();

export type ApiKeyConfig = z.infer<typeof ApiKeyConfigType>;

export const ApiKeyConfigListType = z.array(ApiKeyConfigType);

export type ApiKeyConfigList = z.infer<typeof ApiKeyConfigListType>;
