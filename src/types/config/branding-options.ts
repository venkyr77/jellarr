import { z } from "zod";

export const BrandingOptionsConfigType: z.ZodObject<{
  loginDisclaimer: z.ZodOptional<z.ZodString>;
  customCss: z.ZodOptional<z.ZodString>;
  splashscreenEnabled: z.ZodOptional<z.ZodBoolean>;
}> = z
  .object({
    loginDisclaimer: z.string().optional(),
    customCss: z.string().optional(),
    splashscreenEnabled: z.boolean().optional(),
  })
  .strict();

export type BrandingOptionsConfig = z.infer<typeof BrandingOptionsConfigType>;
