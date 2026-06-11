import { type EncodingOptionsConfig } from "../types/config/encoding-options";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";

export function mapEncodingOptionsConfigToSchema(
  desired: EncodingOptionsConfig,
): Partial<EncodingOptionsSchema> {
  const out: Partial<EncodingOptionsSchema> = {};

  if (typeof desired.enableHardwareEncoding !== "undefined") {
    out.EnableHardwareEncoding = desired.enableHardwareEncoding;
  }

  if (typeof desired.hardwareAccelerationType !== "undefined") {
    out.HardwareAccelerationType = desired.hardwareAccelerationType;
  }

  if (typeof desired.hardwareDecodingCodecs !== "undefined") {
    out.HardwareDecodingCodecs = desired.hardwareDecodingCodecs;
  }

  if (typeof desired.enableDecodingColorDepth10Hevc !== "undefined") {
    out.EnableDecodingColorDepth10Hevc = desired.enableDecodingColorDepth10Hevc;
  }

  if (typeof desired.enableDecodingColorDepth10Vp9 !== "undefined") {
    out.EnableDecodingColorDepth10Vp9 = desired.enableDecodingColorDepth10Vp9;
  }

  if (typeof desired.enableDecodingColorDepth10HevcRext !== "undefined") {
    out.EnableDecodingColorDepth10HevcRext =
      desired.enableDecodingColorDepth10HevcRext;
  }

  if (typeof desired.enableDecodingColorDepth12HevcRext !== "undefined") {
    out.EnableDecodingColorDepth12HevcRext =
      desired.enableDecodingColorDepth12HevcRext;
  }

  if (typeof desired.vaapiDevice !== "undefined") {
    out.VaapiDevice = desired.vaapiDevice;
  }

  if (typeof desired.qsvDevice !== "undefined") {
    out.QsvDevice = desired.qsvDevice;
  }

  if (typeof desired.allowHevcEncoding !== "undefined") {
    out.AllowHevcEncoding = desired.allowHevcEncoding;
  }

  if (typeof desired.allowAv1Encoding !== "undefined") {
    out.AllowAv1Encoding = desired.allowAv1Encoding;
  }

  if (typeof desired.enableFallbackFont !== "undefined") {
    out.EnableFallbackFont = desired.enableFallbackFont;
  }

  if (typeof desired.enableAudioVbr !== "undefined") {
    out.EnableAudioVbr = desired.enableAudioVbr;
  }

  if (typeof desired.enableThrottling !== "undefined") {
    out.EnableThrottling = desired.enableThrottling;
  }

  if (typeof desired.enableSegmentDeletion !== "undefined") {
    out.EnableSegmentDeletion = desired.enableSegmentDeletion;
  }

  if (typeof desired.enableTonemapping !== "undefined") {
    out.EnableTonemapping = desired.enableTonemapping;
  }

  if (typeof desired.enableVppTonemapping !== "undefined") {
    out.EnableVppTonemapping = desired.enableVppTonemapping;
  }

  if (typeof desired.enableVideoToolboxTonemapping !== "undefined") {
    out.EnableVideoToolboxTonemapping = desired.enableVideoToolboxTonemapping;
  }

  if (typeof desired.deinterlaceDoubleRate !== "undefined") {
    out.DeinterlaceDoubleRate = desired.deinterlaceDoubleRate;
  }

  if (typeof desired.enableEnhancedNvdecDecoder !== "undefined") {
    out.EnableEnhancedNvdecDecoder = desired.enableEnhancedNvdecDecoder;
  }

  if (typeof desired.preferSystemNativeHwDecoder !== "undefined") {
    out.PreferSystemNativeHwDecoder = desired.preferSystemNativeHwDecoder;
  }

  if (typeof desired.enableIntelLowPowerH264HwEncoder !== "undefined") {
    out.EnableIntelLowPowerH264HwEncoder =
      desired.enableIntelLowPowerH264HwEncoder;
  }

  if (typeof desired.enableIntelLowPowerHevcHwEncoder !== "undefined") {
    out.EnableIntelLowPowerHevcHwEncoder =
      desired.enableIntelLowPowerHevcHwEncoder;
  }

  if (typeof desired.enableSubtitleExtraction !== "undefined") {
    out.EnableSubtitleExtraction = desired.enableSubtitleExtraction;
  }

  if (typeof desired.encodingThreadCount !== "undefined") {
    out.EncodingThreadCount = desired.encodingThreadCount;
  }

  if (typeof desired.maxMuxingQueueSize !== "undefined") {
    out.MaxMuxingQueueSize = desired.maxMuxingQueueSize;
  }

  if (typeof desired.throttleDelaySeconds !== "undefined") {
    out.ThrottleDelaySeconds = desired.throttleDelaySeconds;
  }

  if (typeof desired.segmentKeepSeconds !== "undefined") {
    out.SegmentKeepSeconds = desired.segmentKeepSeconds;
  }

  if (typeof desired.h264Crf !== "undefined") {
    out.H264Crf = desired.h264Crf;
  }

  if (typeof desired.h265Crf !== "undefined") {
    out.H265Crf = desired.h265Crf;
  }

  if (typeof desired.downMixAudioBoost !== "undefined") {
    out.DownMixAudioBoost = desired.downMixAudioBoost;
  }

  if (typeof desired.tonemappingDesat !== "undefined") {
    out.TonemappingDesat = desired.tonemappingDesat;
  }

  if (typeof desired.tonemappingPeak !== "undefined") {
    out.TonemappingPeak = desired.tonemappingPeak;
  }

  if (typeof desired.tonemappingParam !== "undefined") {
    out.TonemappingParam = desired.tonemappingParam;
  }

  if (typeof desired.vppTonemappingBrightness !== "undefined") {
    out.VppTonemappingBrightness = desired.vppTonemappingBrightness;
  }

  if (typeof desired.vppTonemappingContrast !== "undefined") {
    out.VppTonemappingContrast = desired.vppTonemappingContrast;
  }

  if (typeof desired.transcodingTempPath !== "undefined") {
    out.TranscodingTempPath = desired.transcodingTempPath;
  }

  if (typeof desired.fallbackFontPath !== "undefined") {
    out.FallbackFontPath = desired.fallbackFontPath;
  }

  if (typeof desired.encoderAppPath !== "undefined") {
    out.EncoderAppPath = desired.encoderAppPath;
  }

  if (typeof desired.encoderAppPathDisplay !== "undefined") {
    out.EncoderAppPathDisplay = desired.encoderAppPathDisplay;
  }

  if (typeof desired.downMixStereoAlgorithm !== "undefined") {
    out.DownMixStereoAlgorithm = desired.downMixStereoAlgorithm;
  }

  if (typeof desired.tonemappingAlgorithm !== "undefined") {
    out.TonemappingAlgorithm = desired.tonemappingAlgorithm;
  }

  if (typeof desired.tonemappingMode !== "undefined") {
    out.TonemappingMode = desired.tonemappingMode;
  }

  if (typeof desired.tonemappingRange !== "undefined") {
    out.TonemappingRange = desired.tonemappingRange;
  }

  if (typeof desired.encoderPreset !== "undefined") {
    out.EncoderPreset = desired.encoderPreset;
  }

  if (typeof desired.deinterlaceMethod !== "undefined") {
    out.DeinterlaceMethod = desired.deinterlaceMethod;
  }

  if (
    typeof desired.allowOnDemandMetadataBasedKeyframeExtractionForExtensions !==
    "undefined"
  ) {
    out.AllowOnDemandMetadataBasedKeyframeExtractionForExtensions =
      desired.allowOnDemandMetadataBasedKeyframeExtractionForExtensions;
  }

  return out;
}
