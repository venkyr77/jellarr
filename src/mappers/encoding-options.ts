import {
  type EncodingOptionsConfig,
  type TonemappingConfig,
} from "../types/config/encoding-options";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";

function mapTonemapping(
  tm: TonemappingConfig,
  out: Partial<EncodingOptionsSchema>,
): void {
  if (tm.enabled !== undefined) out.EnableTonemapping = tm.enabled;
  if (tm.algorithm !== undefined) out.TonemappingAlgorithm = tm.algorithm;
  if (tm.mode !== undefined) out.TonemappingMode = tm.mode;
  if (tm.range !== undefined) out.TonemappingRange = tm.range;
  if (tm.desat !== undefined) out.TonemappingDesat = tm.desat;
  if (tm.peak !== undefined) out.TonemappingPeak = tm.peak;
}

export function mapEncodingOptionsConfigToSchema(
  desired: EncodingOptionsConfig,
): Partial<EncodingOptionsSchema> {
  const out: Partial<EncodingOptionsSchema> = {};

  if (typeof desired.encodingThreadCount !== "undefined") {
    out.EncodingThreadCount = desired.encodingThreadCount;
  }

  if (typeof desired.transcodingTempPath !== "undefined") {
    out.TranscodingTempPath = desired.transcodingTempPath;
  }

  if (typeof desired.enableFallbackFont !== "undefined") {
    out.EnableFallbackFont = desired.enableFallbackFont;
  }

  if (typeof desired.fallbackFontPath !== "undefined") {
    out.FallbackFontPath = desired.fallbackFontPath;
  }

  if (typeof desired.enableAudioVbr !== "undefined") {
    out.EnableAudioVbr = desired.enableAudioVbr;
  }

  if (typeof desired.downMixAudioBoost !== "undefined") {
    out.DownMixAudioBoost = desired.downMixAudioBoost;
  }

  if (typeof desired.downMixStereoAlgorithm !== "undefined") {
    out.DownMixStereoAlgorithm = desired.downMixStereoAlgorithm;
  }

  if (typeof desired.maxMuxingQueueSize !== "undefined") {
    out.MaxMuxingQueueSize = desired.maxMuxingQueueSize;
  }

  if (typeof desired.enableThrottling !== "undefined") {
    out.EnableThrottling = desired.enableThrottling;
  }

  if (typeof desired.throttleDelaySeconds !== "undefined") {
    out.ThrottleDelaySeconds = desired.throttleDelaySeconds;
  }

  if (typeof desired.enableSegmentDeletion !== "undefined") {
    out.EnableSegmentDeletion = desired.enableSegmentDeletion;
  }

  if (typeof desired.segmentKeepSeconds !== "undefined") {
    out.SegmentKeepSeconds = desired.segmentKeepSeconds;
  }

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

  if (typeof desired.enableEnhancedNvdecDecoder !== "undefined") {
    out.EnableEnhancedNvdecDecoder = desired.enableEnhancedNvdecDecoder;
  }

  if (typeof desired.preferSystemNativeHwDecoder !== "undefined") {
    out.PreferSystemNativeHwDecoder = desired.preferSystemNativeHwDecoder;
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

  if (typeof desired.enableSubtitleExtraction !== "undefined") {
    out.EnableSubtitleExtraction = desired.enableSubtitleExtraction;
  }

  if (typeof desired.h264Crf !== "undefined") {
    out.H264Crf = desired.h264Crf;
  }

  if (typeof desired.h265Crf !== "undefined") {
    out.H265Crf = desired.h265Crf;
  }

  if (typeof desired.deinterlaceMethod !== "undefined") {
    out.DeinterlaceMethod = desired.deinterlaceMethod;
  }

  if (typeof desired.deinterlaceDoubleRate !== "undefined") {
    out.DeinterlaceDoubleRate = desired.deinterlaceDoubleRate;
  }

  if (desired.tonemapping !== undefined) {
    mapTonemapping(desired.tonemapping, out);
  }

  return out;
}
