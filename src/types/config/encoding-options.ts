import { z } from "zod";

export const TonemappingConfigType = z.object({
  enabled: z.boolean().optional(),
  algorithm: z
    .enum([
      "none",
      "clip",
      "linear",
      "gamma",
      "reinhard",
      "hable",
      "mobius",
      "bt2390",
    ])
    .optional(),
  mode: z
    .enum([
      "auto",
      "max",
      "rgb",
      "lum",
      "itp",
    ])
    .optional(),
  range: z
    .enum([
      "auto",
      "tv",
      "pc",
    ])
    .optional(),
  desat: z.number().optional(),
  peak: z.number().optional(),
});

export type TonemappingConfig = z.infer<typeof TonemappingConfigType>;

export const EncodingOptionsConfigType = z
  .object({
    encodingThreadCount: z.number().int().optional(),
    transcodingTempPath: z.string().optional(),
    enableFallbackFont: z.boolean().optional(),
    fallbackFontPath: z.string().optional(),
    enableAudioVbr: z.boolean().optional(),
    downMixAudioBoost: z.number().optional(),
    downMixStereoAlgorithm: z
      .enum([
        "None",
        "Dave750",
        "NightmodeDialogue",
        "Rfc7845",
        "Ac4",
      ])
      .optional(),
    maxMuxingQueueSize: z.number().int().optional(),
    enableThrottling: z.boolean().optional(),
    throttleDelaySeconds: z.number().int().optional(),
    enableSegmentDeletion: z.boolean().optional(),
    segmentKeepSeconds: z.number().int().optional(),
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
      .array(
        z.enum([
          "h264",
          "hevc",
          "mpeg2video",
          "vc1",
          "vp8",
          "vp9",
          "av1",
        ]),
      )
      .optional(),
    enableDecodingColorDepth10Hevc: z.boolean().optional(),
    enableDecodingColorDepth10Vp9: z.boolean().optional(),
    enableDecodingColorDepth10HevcRext: z.boolean().optional(),
    enableDecodingColorDepth12HevcRext: z.boolean().optional(),
    enableEnhancedNvdecDecoder: z.boolean().optional(),
    preferSystemNativeHwDecoder: z.boolean().optional(),
    allowHevcEncoding: z.boolean().optional(),
    allowAv1Encoding: z.boolean().optional(),
    enableSubtitleExtraction: z.boolean().optional(),
    subtitleExtractionTimeoutMinutes: z.number().int().optional(),
    h264Crf: z.number().int().optional(),
    h265Crf: z.number().int().optional(),
    deinterlaceMethod: z
      .enum([
        "yadif",
        "bwdif",
      ])
      .optional(),
    deinterlaceDoubleRate: z.boolean().optional(),
    tonemapping: TonemappingConfigType.optional(),
  })
  .strict();

export type EncodingOptionsConfig = z.infer<typeof EncodingOptionsConfigType>;
