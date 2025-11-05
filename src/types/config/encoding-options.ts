import { z } from "zod";

export const EncodingOptionsConfigType: z.ZodObject<{
  enableHardwareEncoding: z.ZodOptional<z.ZodBoolean>;
  hardwareAccelerationType: z.ZodOptional<
    z.ZodEnum<{
      none: "none";
      amf: "amf";
      qsv: "qsv";
      nvenc: "nvenc";
      v4l2m2m: "v4l2m2m";
      vaapi: "vaapi";
      videotoolbox: "videotoolbox";
      rkmpp: "rkmpp";
    }>
  >;
}> = z
  .object({
    enableHardwareEncoding: z.boolean().optional(),
    hardwareAccelerationType: z
      .enum([
        "none",
        "amf",
        "qsv",
        "nvenc",
        "v4l2m2m",
        "vaapi",
        "videotoolbox",
        "rkmpp",
      ])
      .optional(),
  })
  .strict();

export type EncodingOptionsConfig = z.infer<typeof EncodingOptionsConfigType>;
