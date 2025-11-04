import { z } from "zod";

export const EncodingOptionsConfigType: z.ZodObject<{
  enableHardwareEncoding: z.ZodOptional<z.ZodBoolean>;
}> = z
  .object({
    enableHardwareEncoding: z.boolean().optional(),
  })
  .strict();

export type EncodingOptionsConfig = z.infer<typeof EncodingOptionsConfigType>;
