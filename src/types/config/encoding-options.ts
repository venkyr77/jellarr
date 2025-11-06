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
  vaapiDevice: z.ZodOptional<z.ZodString>;
  qsvDevice: z.ZodOptional<z.ZodString>;
  hardwareDecodingCodecs: z.ZodOptional<
    z.ZodArray<
      z.ZodEnum<{
        h264: "h264";
        hevc: "hevc";
        mpeg2video: "mpeg2video";
        vc1: "vc1";
        vp8: "vp8";
        vp9: "vp9";
        av1: "av1";
      }>
    >
  >;
  enableDecodingColorDepth10Hevc: z.ZodOptional<z.ZodBoolean>;
  enableDecodingColorDepth10Vp9: z.ZodOptional<z.ZodBoolean>;
  enableDecodingColorDepth10HevcRext: z.ZodOptional<z.ZodBoolean>;
  enableDecodingColorDepth12HevcRext: z.ZodOptional<z.ZodBoolean>;
  allowHevcEncoding: z.ZodOptional<z.ZodBoolean>;
  allowAv1Encoding: z.ZodOptional<z.ZodBoolean>;
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
    vaapiDevice: z.string().optional(),
    qsvDevice: z.string().optional(),
    hardwareDecodingCodecs: z
      .array(z.enum(["h264", "hevc", "mpeg2video", "vc1", "vp8", "vp9", "av1"]))
      .optional(),
    enableDecodingColorDepth10Hevc: z.boolean().optional(),
    enableDecodingColorDepth10Vp9: z.boolean().optional(),
    enableDecodingColorDepth10HevcRext: z.boolean().optional(),
    enableDecodingColorDepth12HevcRext: z.boolean().optional(),
    allowHevcEncoding: z.boolean().optional(),
    allowAv1Encoding: z.boolean().optional(),
  })
  .strict();

export type EncodingOptionsConfig = z.infer<typeof EncodingOptionsConfigType>;
