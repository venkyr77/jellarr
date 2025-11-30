import { z } from "zod";

export const StartupConfigType: z.ZodObject<{
  completeStartupWizard: z.ZodOptional<z.ZodBoolean>;
}> = z
  .object({
    completeStartupWizard: z.boolean().optional(),
  })
  .strict();

export type StartupConfig = z.infer<typeof StartupConfigType>;
