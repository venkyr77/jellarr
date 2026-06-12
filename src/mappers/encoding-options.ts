import { type EncodingOptionsConfig } from "../types/config/encoding-options";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";
import { withoutUndefined } from "../lib/objects";

export function mapEncodingOptionsConfigToSchema(
  desired: EncodingOptionsConfig,
): Partial<EncodingOptionsSchema> {
  return withoutUndefined({
    EnableHardwareEncoding: desired.enableHardwareEncoding,
    HardwareAccelerationType: desired.hardwareAccelerationType,
    HardwareDecodingCodecs: desired.hardwareDecodingCodecs,
    EnableDecodingColorDepth10Hevc: desired.enableDecodingColorDepth10Hevc,
    EnableDecodingColorDepth10Vp9: desired.enableDecodingColorDepth10Vp9,
    EnableDecodingColorDepth10HevcRext:
      desired.enableDecodingColorDepth10HevcRext,
    EnableDecodingColorDepth12HevcRext:
      desired.enableDecodingColorDepth12HevcRext,
    VaapiDevice: desired.vaapiDevice,
    QsvDevice: desired.qsvDevice,
    AllowHevcEncoding: desired.allowHevcEncoding,
    AllowAv1Encoding: desired.allowAv1Encoding,
    EnableFallbackFont: desired.enableFallbackFont,
    EnableAudioVbr: desired.enableAudioVbr,
    EnableThrottling: desired.enableThrottling,
    EnableSegmentDeletion: desired.enableSegmentDeletion,
    EnableTonemapping: desired.enableTonemapping,
    EnableVppTonemapping: desired.enableVppTonemapping,
    EnableVideoToolboxTonemapping: desired.enableVideoToolboxTonemapping,
    DeinterlaceDoubleRate: desired.deinterlaceDoubleRate,
    EnableEnhancedNvdecDecoder: desired.enableEnhancedNvdecDecoder,
    PreferSystemNativeHwDecoder: desired.preferSystemNativeHwDecoder,
    EnableIntelLowPowerH264HwEncoder: desired.enableIntelLowPowerH264HwEncoder,
    EnableIntelLowPowerHevcHwEncoder: desired.enableIntelLowPowerHevcHwEncoder,
    EnableSubtitleExtraction: desired.enableSubtitleExtraction,
    EncodingThreadCount: desired.encodingThreadCount,
    MaxMuxingQueueSize: desired.maxMuxingQueueSize,
    ThrottleDelaySeconds: desired.throttleDelaySeconds,
    SegmentKeepSeconds: desired.segmentKeepSeconds,
    H264Crf: desired.h264Crf,
    H265Crf: desired.h265Crf,
    DownMixAudioBoost: desired.downMixAudioBoost,
    TonemappingDesat: desired.tonemappingDesat,
    TonemappingPeak: desired.tonemappingPeak,
    TonemappingParam: desired.tonemappingParam,
    VppTonemappingBrightness: desired.vppTonemappingBrightness,
    VppTonemappingContrast: desired.vppTonemappingContrast,
    TranscodingTempPath: desired.transcodingTempPath,
    FallbackFontPath: desired.fallbackFontPath,
    EncoderAppPath: desired.encoderAppPath,
    EncoderAppPathDisplay: desired.encoderAppPathDisplay,
    DownMixStereoAlgorithm: desired.downMixStereoAlgorithm,
    TonemappingAlgorithm: desired.tonemappingAlgorithm,
    TonemappingMode: desired.tonemappingMode,
    TonemappingRange: desired.tonemappingRange,
    EncoderPreset: desired.encoderPreset,
    DeinterlaceMethod: desired.deinterlaceMethod,
    AllowOnDemandMetadataBasedKeyframeExtractionForExtensions:
      desired.allowOnDemandMetadataBasedKeyframeExtractionForExtensions,
  }) as Partial<EncodingOptionsSchema>;
}
