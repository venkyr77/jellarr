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
  enableFallbackFont: z.ZodOptional<z.ZodBoolean>;
  enableAudioVbr: z.ZodOptional<z.ZodBoolean>;
  enableThrottling: z.ZodOptional<z.ZodBoolean>;
  enableSegmentDeletion: z.ZodOptional<z.ZodBoolean>;
  enableTonemapping: z.ZodOptional<z.ZodBoolean>;
  enableVppTonemapping: z.ZodOptional<z.ZodBoolean>;
  enableVideoToolboxTonemapping: z.ZodOptional<z.ZodBoolean>;
  deinterlaceDoubleRate: z.ZodOptional<z.ZodBoolean>;
  enableEnhancedNvdecDecoder: z.ZodOptional<z.ZodBoolean>;
  preferSystemNativeHwDecoder: z.ZodOptional<z.ZodBoolean>;
  enableIntelLowPowerH264HwEncoder: z.ZodOptional<z.ZodBoolean>;
  enableIntelLowPowerHevcHwEncoder: z.ZodOptional<z.ZodBoolean>;
  enableSubtitleExtraction: z.ZodOptional<z.ZodBoolean>;
  encodingThreadCount: z.ZodOptional<z.ZodNumber>;
  maxMuxingQueueSize: z.ZodOptional<z.ZodNumber>;
  throttleDelaySeconds: z.ZodOptional<z.ZodNumber>;
  segmentKeepSeconds: z.ZodOptional<z.ZodNumber>;
  h264Crf: z.ZodOptional<z.ZodNumber>;
  h265Crf: z.ZodOptional<z.ZodNumber>;
  downMixAudioBoost: z.ZodOptional<z.ZodNumber>;
  tonemappingDesat: z.ZodOptional<z.ZodNumber>;
  tonemappingPeak: z.ZodOptional<z.ZodNumber>;
  tonemappingParam: z.ZodOptional<z.ZodNumber>;
  vppTonemappingBrightness: z.ZodOptional<z.ZodNumber>;
  vppTonemappingContrast: z.ZodOptional<z.ZodNumber>;
  transcodingTempPath: z.ZodOptional<z.ZodString>;
  fallbackFontPath: z.ZodOptional<z.ZodString>;
  encoderAppPath: z.ZodOptional<z.ZodString>;
  encoderAppPathDisplay: z.ZodOptional<z.ZodString>;
  downMixStereoAlgorithm: z.ZodOptional<
    z.ZodEnum<{
      None: "None";
      Dave750: "Dave750";
      NightmodeDialogue: "NightmodeDialogue";
      Rfc7845: "Rfc7845";
      Ac4: "Ac4";
    }>
  >;
  tonemappingAlgorithm: z.ZodOptional<
    z.ZodEnum<{
      none: "none";
      clip: "clip";
      linear: "linear";
      gamma: "gamma";
      reinhard: "reinhard";
      hable: "hable";
      mobius: "mobius";
      bt2390: "bt2390";
    }>
  >;
  tonemappingMode: z.ZodOptional<
    z.ZodEnum<{
      auto: "auto";
      max: "max";
      rgb: "rgb";
      lum: "lum";
      itp: "itp";
    }>
  >;
  tonemappingRange: z.ZodOptional<
    z.ZodEnum<{
      auto: "auto";
      tv: "tv";
      pc: "pc";
    }>
  >;
  encoderPreset: z.ZodOptional<
    z.ZodEnum<{
      auto: "auto";
      placebo: "placebo";
      veryslow: "veryslow";
      slower: "slower";
      slow: "slow";
      medium: "medium";
      fast: "fast";
      faster: "faster";
      veryfast: "veryfast";
      superfast: "superfast";
      ultrafast: "ultrafast";
    }>
  >;
  deinterlaceMethod: z.ZodOptional<
    z.ZodEnum<{
      yadif: "yadif";
      bwdif: "bwdif";
    }>
  >;
  allowOnDemandMetadataBasedKeyframeExtractionForExtensions: z.ZodOptional<
    z.ZodArray<z.ZodString>
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
    enableFallbackFont: z.boolean().optional(),
    enableAudioVbr: z.boolean().optional(),
    enableThrottling: z.boolean().optional(),
    enableSegmentDeletion: z.boolean().optional(),
    enableTonemapping: z.boolean().optional(),
    enableVppTonemapping: z.boolean().optional(),
    enableVideoToolboxTonemapping: z.boolean().optional(),
    deinterlaceDoubleRate: z.boolean().optional(),
    enableEnhancedNvdecDecoder: z.boolean().optional(),
    preferSystemNativeHwDecoder: z.boolean().optional(),
    enableIntelLowPowerH264HwEncoder: z.boolean().optional(),
    enableIntelLowPowerHevcHwEncoder: z.boolean().optional(),
    enableSubtitleExtraction: z.boolean().optional(),
    encodingThreadCount: z.number().int().optional(),
    maxMuxingQueueSize: z.number().int().optional(),
    throttleDelaySeconds: z.number().int().optional(),
    segmentKeepSeconds: z.number().int().optional(),
    h264Crf: z.number().int().optional(),
    h265Crf: z.number().int().optional(),
    downMixAudioBoost: z.number().optional(),
    tonemappingDesat: z.number().optional(),
    tonemappingPeak: z.number().optional(),
    tonemappingParam: z.number().optional(),
    vppTonemappingBrightness: z.number().optional(),
    vppTonemappingContrast: z.number().optional(),
    transcodingTempPath: z.string().optional(),
    fallbackFontPath: z.string().optional(),
    encoderAppPath: z.string().optional(),
    encoderAppPathDisplay: z.string().optional(),
    downMixStereoAlgorithm: z
      .enum(["None", "Dave750", "NightmodeDialogue", "Rfc7845", "Ac4"])
      .optional(),
    tonemappingAlgorithm: z
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
    tonemappingMode: z.enum(["auto", "max", "rgb", "lum", "itp"]).optional(),
    tonemappingRange: z.enum(["auto", "tv", "pc"]).optional(),
    encoderPreset: z
      .enum([
        "auto",
        "placebo",
        "veryslow",
        "slower",
        "slow",
        "medium",
        "fast",
        "faster",
        "veryfast",
        "superfast",
        "ultrafast",
      ])
      .optional(),
    deinterlaceMethod: z.enum(["yadif", "bwdif"]).optional(),
    allowOnDemandMetadataBasedKeyframeExtractionForExtensions: z
      .array(z.string())
      .optional(),
  })
  .strict();

export type EncodingOptionsConfig = z.infer<typeof EncodingOptionsConfigType>;
