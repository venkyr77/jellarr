{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  encodingOptionsConfigType = types.submodule {
    options = {
      enableHardwareEncoding = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable hardware encoding.";
      };
      hardwareAccelerationType = mkOption {
        type = nullOr (types.enum [
          "none"
          "amf"
          "qsv"
          "nvenc"
          "v4l2m2m"
          "vaapi"
          "videotoolbox"
          "rkmpp"
        ]);
        default = null;
        description = "Hardware acceleration type.";
      };
      vaapiDevice = mkOption {
        type = nullOr types.str;
        default = null;
        description = "VAAPI device path (e.g., /dev/dri/renderD128).";
      };
      qsvDevice = mkOption {
        type = nullOr types.str;
        default = null;
        description = "QSV device path (e.g., /dev/dri/renderD128).";
      };
      hardwareDecodingCodecs = mkOption {
        type = nullOr (types.listOf (types.enum [
          "h264"
          "hevc"
          "mpeg2video"
          "vc1"
          "vp8"
          "vp9"
          "av1"
        ]));
        default = null;
        description = "List of codecs to decode in hardware.";
      };
      enableDecodingColorDepth10Hevc = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable 10-bit HEVC decoding.";
      };
      enableDecodingColorDepth10Vp9 = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable 10-bit VP9 decoding.";
      };
      enableDecodingColorDepth10HevcRext = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable 10-bit HEVC RExt decoding.";
      };
      enableDecodingColorDepth12HevcRext = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable 12-bit HEVC RExt decoding.";
      };
      allowHevcEncoding = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Allow HEVC encoding.";
      };
      allowAv1Encoding = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Allow AV1 encoding.";
      };

      # Bool options
      enableFallbackFont = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable fallback font for subtitle rendering.";
      };
      enableAudioVbr = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable variable bitrate audio encoding.";
      };
      enableThrottling = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable transcoding throttling.";
      };
      enableSegmentDeletion = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable deletion of transcoded segments after playback.";
      };
      enableTonemapping = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable HDR tonemapping.";
      };
      enableVppTonemapping = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable VPP (hardware) tonemapping.";
      };
      enableVideoToolboxTonemapping = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable VideoToolbox tonemapping (macOS).";
      };
      deinterlaceDoubleRate = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Output double frame rate when deinterlacing.";
      };
      enableEnhancedNvdecDecoder = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable enhanced NVDEC decoder.";
      };
      preferSystemNativeHwDecoder = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Prefer system-native hardware decoder over Jellyfin's built-in.";
      };
      enableIntelLowPowerH264HwEncoder = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable Intel low-power H.264 hardware encoder.";
      };
      enableIntelLowPowerHevcHwEncoder = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable Intel low-power HEVC hardware encoder.";
      };
      enableSubtitleExtraction = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable subtitle extraction from media files.";
      };

      # Int options
      encodingThreadCount = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of threads to use for encoding (-1 for auto).";
      };
      maxMuxingQueueSize = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Maximum muxing queue size in packets.";
      };
      throttleDelaySeconds = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Delay in seconds before throttling begins.";
      };
      segmentKeepSeconds = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of seconds of segments to keep when segment deletion is enabled.";
      };
      h264Crf = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Constant rate factor for H.264 encoding (0-51, lower = higher quality).";
      };
      h265Crf = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Constant rate factor for H.265/HEVC encoding (0-51, lower = higher quality).";
      };

      # Double (number) options
      downMixAudioBoost = mkOption {
        type = nullOr types.number;
        default = null;
        description = "Audio boost applied when downmixing to stereo.";
      };
      tonemappingDesat = mkOption {
        type = nullOr types.number;
        default = null;
        description = "Desaturation parameter for tonemapping.";
      };
      tonemappingPeak = mkOption {
        type = nullOr types.number;
        default = null;
        description = "Peak luminance for tonemapping (nits).";
      };
      tonemappingParam = mkOption {
        type = nullOr types.number;
        default = null;
        description = "Algorithm-specific parameter for tonemapping.";
      };
      vppTonemappingBrightness = mkOption {
        type = nullOr types.number;
        default = null;
        description = "Brightness adjustment for VPP tonemapping.";
      };
      vppTonemappingContrast = mkOption {
        type = nullOr types.number;
        default = null;
        description = "Contrast adjustment for VPP tonemapping.";
      };

      # String options
      transcodingTempPath = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to the transcoding temporary directory.";
      };
      fallbackFontPath = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to the fallback font file for subtitle rendering.";
      };
      encoderAppPath = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to the encoder application (e.g., ffmpeg).";
      };
      encoderAppPathDisplay = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Display path for the encoder application shown in the UI.";
      };

      # Enum options
      downMixStereoAlgorithm = mkOption {
        type = nullOr (types.enum [
          "None"
          "Dave750"
          "NightmodeDialogue"
          "Rfc7845"
          "Ac4"
        ]);
        default = null;
        description = "Algorithm used for downmixing audio to stereo.";
      };
      tonemappingAlgorithm = mkOption {
        type = nullOr (types.enum [
          "none"
          "clip"
          "linear"
          "gamma"
          "reinhard"
          "hable"
          "mobius"
          "bt2390"
        ]);
        default = null;
        description = "Tonemapping algorithm to use for HDR-to-SDR conversion.";
      };
      tonemappingMode = mkOption {
        type = nullOr (types.enum [
          "auto"
          "max"
          "rgb"
          "lum"
          "itp"
        ]);
        default = null;
        description = "Tonemapping mode controlling which channels are processed.";
      };
      tonemappingRange = mkOption {
        type = nullOr (types.enum [
          "auto"
          "tv"
          "pc"
        ]);
        default = null;
        description = "Output color range for tonemapping.";
      };
      encoderPreset = mkOption {
        type = nullOr (types.enum [
          "auto"
          "placebo"
          "veryslow"
          "slower"
          "slow"
          "medium"
          "fast"
          "faster"
          "veryfast"
          "superfast"
          "ultrafast"
        ]);
        default = null;
        description = "Encoder speed preset controlling quality/speed tradeoff.";
      };
      deinterlaceMethod = mkOption {
        type = nullOr (types.enum [
          "yadif"
          "bwdif"
        ]);
        default = null;
        description = "Deinterlacing filter to apply.";
      };

      # String array options
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "File extensions for which on-demand metadata-based keyframe extraction is allowed.";
      };
    };
  };

  mkEncodingOptionsConfig = cfg:
    {}
    // optionalAttrs (cfg ? enableHardwareEncoding && cfg.enableHardwareEncoding != null) {inherit (cfg) enableHardwareEncoding;}
    // optionalAttrs (cfg ? hardwareAccelerationType && cfg.hardwareAccelerationType != null) {inherit (cfg) hardwareAccelerationType;}
    // optionalAttrs (cfg ? vaapiDevice && cfg.vaapiDevice != null) {inherit (cfg) vaapiDevice;}
    // optionalAttrs (cfg ? qsvDevice && cfg.qsvDevice != null) {inherit (cfg) qsvDevice;}
    // optionalAttrs (cfg ? hardwareDecodingCodecs && cfg.hardwareDecodingCodecs != null) {inherit (cfg) hardwareDecodingCodecs;}
    // optionalAttrs (cfg ? enableDecodingColorDepth10Hevc && cfg.enableDecodingColorDepth10Hevc != null) {inherit (cfg) enableDecodingColorDepth10Hevc;}
    // optionalAttrs (cfg ? enableDecodingColorDepth10Vp9 && cfg.enableDecodingColorDepth10Vp9 != null) {inherit (cfg) enableDecodingColorDepth10Vp9;}
    // optionalAttrs (cfg ? enableDecodingColorDepth10HevcRext && cfg.enableDecodingColorDepth10HevcRext != null) {inherit (cfg) enableDecodingColorDepth10HevcRext;}
    // optionalAttrs (cfg ? enableDecodingColorDepth12HevcRext && cfg.enableDecodingColorDepth12HevcRext != null) {inherit (cfg) enableDecodingColorDepth12HevcRext;}
    // optionalAttrs (cfg ? allowHevcEncoding && cfg.allowHevcEncoding != null) {inherit (cfg) allowHevcEncoding;}
    // optionalAttrs (cfg ? allowAv1Encoding && cfg.allowAv1Encoding != null) {inherit (cfg) allowAv1Encoding;}
    // optionalAttrs (cfg ? enableFallbackFont && cfg.enableFallbackFont != null) {inherit (cfg) enableFallbackFont;}
    // optionalAttrs (cfg ? enableAudioVbr && cfg.enableAudioVbr != null) {inherit (cfg) enableAudioVbr;}
    // optionalAttrs (cfg ? enableThrottling && cfg.enableThrottling != null) {inherit (cfg) enableThrottling;}
    // optionalAttrs (cfg ? enableSegmentDeletion && cfg.enableSegmentDeletion != null) {inherit (cfg) enableSegmentDeletion;}
    // optionalAttrs (cfg ? enableTonemapping && cfg.enableTonemapping != null) {inherit (cfg) enableTonemapping;}
    // optionalAttrs (cfg ? enableVppTonemapping && cfg.enableVppTonemapping != null) {inherit (cfg) enableVppTonemapping;}
    // optionalAttrs (cfg ? enableVideoToolboxTonemapping && cfg.enableVideoToolboxTonemapping != null) {inherit (cfg) enableVideoToolboxTonemapping;}
    // optionalAttrs (cfg ? deinterlaceDoubleRate && cfg.deinterlaceDoubleRate != null) {inherit (cfg) deinterlaceDoubleRate;}
    // optionalAttrs (cfg ? enableEnhancedNvdecDecoder && cfg.enableEnhancedNvdecDecoder != null) {inherit (cfg) enableEnhancedNvdecDecoder;}
    // optionalAttrs (cfg ? preferSystemNativeHwDecoder && cfg.preferSystemNativeHwDecoder != null) {inherit (cfg) preferSystemNativeHwDecoder;}
    // optionalAttrs (cfg ? enableIntelLowPowerH264HwEncoder && cfg.enableIntelLowPowerH264HwEncoder != null) {inherit (cfg) enableIntelLowPowerH264HwEncoder;}
    // optionalAttrs (cfg ? enableIntelLowPowerHevcHwEncoder && cfg.enableIntelLowPowerHevcHwEncoder != null) {inherit (cfg) enableIntelLowPowerHevcHwEncoder;}
    // optionalAttrs (cfg ? enableSubtitleExtraction && cfg.enableSubtitleExtraction != null) {inherit (cfg) enableSubtitleExtraction;}
    // optionalAttrs (cfg ? encodingThreadCount && cfg.encodingThreadCount != null) {inherit (cfg) encodingThreadCount;}
    // optionalAttrs (cfg ? maxMuxingQueueSize && cfg.maxMuxingQueueSize != null) {inherit (cfg) maxMuxingQueueSize;}
    // optionalAttrs (cfg ? throttleDelaySeconds && cfg.throttleDelaySeconds != null) {inherit (cfg) throttleDelaySeconds;}
    // optionalAttrs (cfg ? segmentKeepSeconds && cfg.segmentKeepSeconds != null) {inherit (cfg) segmentKeepSeconds;}
    // optionalAttrs (cfg ? h264Crf && cfg.h264Crf != null) {inherit (cfg) h264Crf;}
    // optionalAttrs (cfg ? h265Crf && cfg.h265Crf != null) {inherit (cfg) h265Crf;}
    // optionalAttrs (cfg ? downMixAudioBoost && cfg.downMixAudioBoost != null) {inherit (cfg) downMixAudioBoost;}
    // optionalAttrs (cfg ? tonemappingDesat && cfg.tonemappingDesat != null) {inherit (cfg) tonemappingDesat;}
    // optionalAttrs (cfg ? tonemappingPeak && cfg.tonemappingPeak != null) {inherit (cfg) tonemappingPeak;}
    // optionalAttrs (cfg ? tonemappingParam && cfg.tonemappingParam != null) {inherit (cfg) tonemappingParam;}
    // optionalAttrs (cfg ? vppTonemappingBrightness && cfg.vppTonemappingBrightness != null) {inherit (cfg) vppTonemappingBrightness;}
    // optionalAttrs (cfg ? vppTonemappingContrast && cfg.vppTonemappingContrast != null) {inherit (cfg) vppTonemappingContrast;}
    // optionalAttrs (cfg ? transcodingTempPath && cfg.transcodingTempPath != null) {inherit (cfg) transcodingTempPath;}
    // optionalAttrs (cfg ? fallbackFontPath && cfg.fallbackFontPath != null) {inherit (cfg) fallbackFontPath;}
    // optionalAttrs (cfg ? encoderAppPath && cfg.encoderAppPath != null) {inherit (cfg) encoderAppPath;}
    // optionalAttrs (cfg ? encoderAppPathDisplay && cfg.encoderAppPathDisplay != null) {inherit (cfg) encoderAppPathDisplay;}
    // optionalAttrs (cfg ? downMixStereoAlgorithm && cfg.downMixStereoAlgorithm != null) {inherit (cfg) downMixStereoAlgorithm;}
    // optionalAttrs (cfg ? tonemappingAlgorithm && cfg.tonemappingAlgorithm != null) {inherit (cfg) tonemappingAlgorithm;}
    // optionalAttrs (cfg ? tonemappingMode && cfg.tonemappingMode != null) {inherit (cfg) tonemappingMode;}
    // optionalAttrs (cfg ? tonemappingRange && cfg.tonemappingRange != null) {inherit (cfg) tonemappingRange;}
    // optionalAttrs (cfg ? encoderPreset && cfg.encoderPreset != null) {inherit (cfg) encoderPreset;}
    // optionalAttrs (cfg ? deinterlaceMethod && cfg.deinterlaceMethod != null) {inherit (cfg) deinterlaceMethod;}
    // optionalAttrs (cfg ? allowOnDemandMetadataBasedKeyframeExtractionForExtensions && cfg.allowOnDemandMetadataBasedKeyframeExtractionForExtensions != null) {inherit (cfg) allowOnDemandMetadataBasedKeyframeExtractionForExtensions;};
in {
  inherit encodingOptionsConfigType mkEncodingOptionsConfig;
}
