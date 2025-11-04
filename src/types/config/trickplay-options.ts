import { z } from "zod";

export const TrickplayOptionsConfigType: z.ZodObject<{
  enableHwAcceleration: z.ZodOptional<z.ZodBoolean>;
  enableHwEncoding: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
  enableHwAcceleration: z.boolean().optional(),
  enableHwEncoding: z.boolean().optional(),
});

export type TrickplayOptionsConfig = z.infer<typeof TrickplayOptionsConfigType>;
