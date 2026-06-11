{
  lib,
  assertEq,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.encodingOptions) mkEncodingOptionsConfig;

  nullConfig = {
    enableHardwareEncoding = null;
    hardwareAccelerationType = null;
    vaapiDevice = null;
    qsvDevice = null;
    hardwareDecodingCodecs = null;
    enableDecodingColorDepth10Hevc = null;
    enableDecodingColorDepth10Vp9 = null;
    enableDecodingColorDepth10HevcRext = null;
    enableDecodingColorDepth12HevcRext = null;
    allowHevcEncoding = null;
    allowAv1Encoding = null;
    enableFallbackFont = null;
    enableAudioVbr = null;
    enableThrottling = null;
    enableSegmentDeletion = null;
    enableTonemapping = null;
    enableVppTonemapping = null;
    enableVideoToolboxTonemapping = null;
    deinterlaceDoubleRate = null;
    enableEnhancedNvdecDecoder = null;
    preferSystemNativeHwDecoder = null;
    enableIntelLowPowerH264HwEncoder = null;
    enableIntelLowPowerHevcHwEncoder = null;
    enableSubtitleExtraction = null;
    encodingThreadCount = null;
    maxMuxingQueueSize = null;
    throttleDelaySeconds = null;
    segmentKeepSeconds = null;
    h264Crf = null;
    h265Crf = null;
    downMixAudioBoost = null;
    tonemappingDesat = null;
    tonemappingPeak = null;
    tonemappingParam = null;
    vppTonemappingBrightness = null;
    vppTonemappingContrast = null;
    transcodingTempPath = null;
    fallbackFontPath = null;
    encoderAppPath = null;
    encoderAppPathDisplay = null;
    downMixStereoAlgorithm = null;
    tonemappingAlgorithm = null;
    tonemappingMode = null;
    tonemappingRange = null;
    encoderPreset = null;
    deinterlaceMethod = null;
    allowOnDemandMetadataBasedKeyframeExtractionForExtensions = null;
  };
in [
  (assertEq "empty config" (mkEncodingOptionsConfig nullConfig) {})

  (assertEq "enableHardwareEncoding true" (mkEncodingOptionsConfig (nullConfig // {enableHardwareEncoding = true;})) {
    enableHardwareEncoding = true;
  })

  (assertEq "enableHardwareEncoding false" (mkEncodingOptionsConfig (nullConfig // {enableHardwareEncoding = false;})) {
    enableHardwareEncoding = false;
  })

  (assertEq "hardwareAccelerationType none" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "none";})) {
    hardwareAccelerationType = "none";
  })

  (assertEq "hardwareAccelerationType amf" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "amf";})) {
    hardwareAccelerationType = "amf";
  })

  (assertEq "hardwareAccelerationType qsv" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "qsv";})) {
    hardwareAccelerationType = "qsv";
  })

  (assertEq "hardwareAccelerationType nvenc" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "nvenc";})) {
    hardwareAccelerationType = "nvenc";
  })

  (assertEq "hardwareAccelerationType v4l2m2m" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "v4l2m2m";})) {
    hardwareAccelerationType = "v4l2m2m";
  })

  (assertEq "hardwareAccelerationType vaapi" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "vaapi";})) {
    hardwareAccelerationType = "vaapi";
  })

  (assertEq "hardwareAccelerationType videotoolbox" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "videotoolbox";})) {
    hardwareAccelerationType = "videotoolbox";
  })

  (assertEq "hardwareAccelerationType rkmpp" (mkEncodingOptionsConfig (nullConfig // {hardwareAccelerationType = "rkmpp";})) {
    hardwareAccelerationType = "rkmpp";
  })

  (assertEq "enableHardwareEncoding + vaapi" (mkEncodingOptionsConfig (nullConfig
    // {
      enableHardwareEncoding = true;
      hardwareAccelerationType = "vaapi";
    })) {
    enableHardwareEncoding = true;
    hardwareAccelerationType = "vaapi";
  })

  (assertEq "vaapiDevice path" (mkEncodingOptionsConfig (nullConfig // {vaapiDevice = "/dev/dri/renderD128";})) {
    vaapiDevice = "/dev/dri/renderD128";
  })

  (assertEq "qsvDevice path" (mkEncodingOptionsConfig (nullConfig // {qsvDevice = "/dev/dri/renderD129";})) {
    qsvDevice = "/dev/dri/renderD129";
  })

  (assertEq "both devices empty" (mkEncodingOptionsConfig (nullConfig
    // {
      vaapiDevice = "";
      qsvDevice = "";
    })) {
    vaapiDevice = "";
    qsvDevice = "";
  })

  (assertEq "both devices with paths" (mkEncodingOptionsConfig (nullConfig
    // {
      vaapiDevice = "/path/to/device";
      qsvDevice = "/another/path";
    })) {
    vaapiDevice = "/path/to/device";
    qsvDevice = "/another/path";
  })

  (assertEq "hardwareDecodingCodecs single" (mkEncodingOptionsConfig (nullConfig // {hardwareDecodingCodecs = ["h264"];})) {
    hardwareDecodingCodecs = ["h264"];
  })

  (assertEq "hardwareDecodingCodecs multiple" (mkEncodingOptionsConfig (nullConfig
    // {
      hardwareDecodingCodecs = ["h264" "hevc" "vp9"];
    })) {
    hardwareDecodingCodecs = ["h264" "hevc" "vp9"];
  })

  (assertEq "hardwareDecodingCodecs all" (mkEncodingOptionsConfig (nullConfig
    // {
      hardwareDecodingCodecs = ["h264" "hevc" "mpeg2video" "vc1" "vp8" "vp9" "av1"];
    })) {
    hardwareDecodingCodecs = ["h264" "hevc" "mpeg2video" "vc1" "vp8" "vp9" "av1"];
  })

  (assertEq "hardwareDecodingCodecs empty" (mkEncodingOptionsConfig (nullConfig // {hardwareDecodingCodecs = [];})) {
    hardwareDecodingCodecs = [];
  })

  (assertEq "enableDecodingColorDepth10Hevc true" (mkEncodingOptionsConfig (nullConfig // {enableDecodingColorDepth10Hevc = true;})) {
    enableDecodingColorDepth10Hevc = true;
  })

  (assertEq "enableDecodingColorDepth10Hevc false" (mkEncodingOptionsConfig (nullConfig // {enableDecodingColorDepth10Hevc = false;})) {
    enableDecodingColorDepth10Hevc = false;
  })

  (assertEq "enableDecodingColorDepth10Vp9 true" (mkEncodingOptionsConfig (nullConfig // {enableDecodingColorDepth10Vp9 = true;})) {
    enableDecodingColorDepth10Vp9 = true;
  })

  (assertEq "enableDecodingColorDepth10HevcRext true" (mkEncodingOptionsConfig (nullConfig // {enableDecodingColorDepth10HevcRext = true;})) {
    enableDecodingColorDepth10HevcRext = true;
  })

  (assertEq "enableDecodingColorDepth12HevcRext true" (mkEncodingOptionsConfig (nullConfig // {enableDecodingColorDepth12HevcRext = true;})) {
    enableDecodingColorDepth12HevcRext = true;
  })

  (assertEq "all color depth fields" (mkEncodingOptionsConfig (nullConfig
    // {
      enableDecodingColorDepth10Hevc = true;
      enableDecodingColorDepth10Vp9 = false;
      enableDecodingColorDepth10HevcRext = true;
      enableDecodingColorDepth12HevcRext = false;
    })) {
    enableDecodingColorDepth10Hevc = true;
    enableDecodingColorDepth10Vp9 = false;
    enableDecodingColorDepth10HevcRext = true;
    enableDecodingColorDepth12HevcRext = false;
  })

  (assertEq "allowHevcEncoding true" (mkEncodingOptionsConfig (nullConfig // {allowHevcEncoding = true;})) {
    allowHevcEncoding = true;
  })

  (assertEq "allowHevcEncoding false" (mkEncodingOptionsConfig (nullConfig // {allowHevcEncoding = false;})) {
    allowHevcEncoding = false;
  })

  (assertEq "allowAv1Encoding true" (mkEncodingOptionsConfig (nullConfig // {allowAv1Encoding = true;})) {
    allowAv1Encoding = true;
  })

  (assertEq "allowAv1Encoding false" (mkEncodingOptionsConfig (nullConfig // {allowAv1Encoding = false;})) {
    allowAv1Encoding = false;
  })

  (assertEq "both encoding format booleans" (mkEncodingOptionsConfig (nullConfig
    // {
      allowHevcEncoding = true;
      allowAv1Encoding = false;
    })) {
    allowHevcEncoding = true;
    allowAv1Encoding = false;
  })

  # New bool options
  (assertEq "enableFallbackFont true" (mkEncodingOptionsConfig (nullConfig // {enableFallbackFont = true;})) {
    enableFallbackFont = true;
  })

  (assertEq "enableAudioVbr false" (mkEncodingOptionsConfig (nullConfig // {enableAudioVbr = false;})) {
    enableAudioVbr = false;
  })

  (assertEq "enableThrottling true" (mkEncodingOptionsConfig (nullConfig // {enableThrottling = true;})) {
    enableThrottling = true;
  })

  (assertEq "enableSegmentDeletion true" (mkEncodingOptionsConfig (nullConfig // {enableSegmentDeletion = true;})) {
    enableSegmentDeletion = true;
  })

  (assertEq "enableTonemapping true" (mkEncodingOptionsConfig (nullConfig // {enableTonemapping = true;})) {
    enableTonemapping = true;
  })

  (assertEq "enableVppTonemapping true" (mkEncodingOptionsConfig (nullConfig // {enableVppTonemapping = true;})) {
    enableVppTonemapping = true;
  })

  (assertEq "enableVideoToolboxTonemapping false" (mkEncodingOptionsConfig (nullConfig // {enableVideoToolboxTonemapping = false;})) {
    enableVideoToolboxTonemapping = false;
  })

  (assertEq "deinterlaceDoubleRate true" (mkEncodingOptionsConfig (nullConfig // {deinterlaceDoubleRate = true;})) {
    deinterlaceDoubleRate = true;
  })

  (assertEq "enableEnhancedNvdecDecoder true" (mkEncodingOptionsConfig (nullConfig // {enableEnhancedNvdecDecoder = true;})) {
    enableEnhancedNvdecDecoder = true;
  })

  (assertEq "preferSystemNativeHwDecoder true" (mkEncodingOptionsConfig (nullConfig // {preferSystemNativeHwDecoder = true;})) {
    preferSystemNativeHwDecoder = true;
  })

  (assertEq "enableIntelLowPowerH264HwEncoder true" (mkEncodingOptionsConfig (nullConfig // {enableIntelLowPowerH264HwEncoder = true;})) {
    enableIntelLowPowerH264HwEncoder = true;
  })

  (assertEq "enableIntelLowPowerHevcHwEncoder false" (mkEncodingOptionsConfig (nullConfig // {enableIntelLowPowerHevcHwEncoder = false;})) {
    enableIntelLowPowerHevcHwEncoder = false;
  })

  (assertEq "enableSubtitleExtraction true" (mkEncodingOptionsConfig (nullConfig // {enableSubtitleExtraction = true;})) {
    enableSubtitleExtraction = true;
  })

  # Int options
  (assertEq "encodingThreadCount" (mkEncodingOptionsConfig (nullConfig // {encodingThreadCount = 4;})) {
    encodingThreadCount = 4;
  })

  (assertEq "encodingThreadCount auto" (mkEncodingOptionsConfig (nullConfig // {encodingThreadCount = -1;})) {
    encodingThreadCount = -1;
  })

  (assertEq "maxMuxingQueueSize" (mkEncodingOptionsConfig (nullConfig // {maxMuxingQueueSize = 2048;})) {
    maxMuxingQueueSize = 2048;
  })

  (assertEq "throttleDelaySeconds" (mkEncodingOptionsConfig (nullConfig // {throttleDelaySeconds = 180;})) {
    throttleDelaySeconds = 180;
  })

  (assertEq "segmentKeepSeconds" (mkEncodingOptionsConfig (nullConfig // {segmentKeepSeconds = 60;})) {
    segmentKeepSeconds = 60;
  })

  (assertEq "h264Crf" (mkEncodingOptionsConfig (nullConfig // {h264Crf = 23;})) {
    h264Crf = 23;
  })

  (assertEq "h265Crf" (mkEncodingOptionsConfig (nullConfig // {h265Crf = 28;})) {
    h265Crf = 28;
  })

  # Double (number) options
  (assertEq "downMixAudioBoost float" (mkEncodingOptionsConfig (nullConfig // {downMixAudioBoost = 2.0;})) {
    downMixAudioBoost = 2.0;
  })

  (assertEq "tonemappingDesat" (mkEncodingOptionsConfig (nullConfig // {tonemappingDesat = 0.5;})) {
    tonemappingDesat = 0.5;
  })

  (assertEq "tonemappingPeak integer literal" (mkEncodingOptionsConfig (nullConfig // {tonemappingPeak = 100;})) {
    tonemappingPeak = 100;
  })

  (assertEq "tonemappingParam" (mkEncodingOptionsConfig (nullConfig // {tonemappingParam = 1.5;})) {
    tonemappingParam = 1.5;
  })

  (assertEq "vppTonemappingBrightness" (mkEncodingOptionsConfig (nullConfig // {vppTonemappingBrightness = 0.0;})) {
    vppTonemappingBrightness = 0.0;
  })

  (assertEq "vppTonemappingContrast" (mkEncodingOptionsConfig (nullConfig // {vppTonemappingContrast = 1.2;})) {
    vppTonemappingContrast = 1.2;
  })

  # String options
  (assertEq "transcodingTempPath" (mkEncodingOptionsConfig (nullConfig // {transcodingTempPath = "/var/cache/jellyfin/transcodes";})) {
    transcodingTempPath = "/var/cache/jellyfin/transcodes";
  })

  (assertEq "fallbackFontPath" (mkEncodingOptionsConfig (nullConfig // {fallbackFontPath = "/usr/share/fonts/noto/NotoSans.ttf";})) {
    fallbackFontPath = "/usr/share/fonts/noto/NotoSans.ttf";
  })

  (assertEq "encoderAppPath" (mkEncodingOptionsConfig (nullConfig // {encoderAppPath = "/run/current-system/sw/bin/ffmpeg";})) {
    encoderAppPath = "/run/current-system/sw/bin/ffmpeg";
  })

  (assertEq "encoderAppPathDisplay" (mkEncodingOptionsConfig (nullConfig // {encoderAppPathDisplay = "/usr/bin/ffmpeg";})) {
    encoderAppPathDisplay = "/usr/bin/ffmpeg";
  })

  # Enum options
  (assertEq "downMixStereoAlgorithm None" (mkEncodingOptionsConfig (nullConfig // {downMixStereoAlgorithm = "None";})) {
    downMixStereoAlgorithm = "None";
  })

  (assertEq "downMixStereoAlgorithm Dave750" (mkEncodingOptionsConfig (nullConfig // {downMixStereoAlgorithm = "Dave750";})) {
    downMixStereoAlgorithm = "Dave750";
  })

  (assertEq "tonemappingAlgorithm hable" (mkEncodingOptionsConfig (nullConfig // {tonemappingAlgorithm = "hable";})) {
    tonemappingAlgorithm = "hable";
  })

  (assertEq "tonemappingAlgorithm bt2390" (mkEncodingOptionsConfig (nullConfig // {tonemappingAlgorithm = "bt2390";})) {
    tonemappingAlgorithm = "bt2390";
  })

  (assertEq "tonemappingMode auto" (mkEncodingOptionsConfig (nullConfig // {tonemappingMode = "auto";})) {
    tonemappingMode = "auto";
  })

  (assertEq "tonemappingMode itp" (mkEncodingOptionsConfig (nullConfig // {tonemappingMode = "itp";})) {
    tonemappingMode = "itp";
  })

  (assertEq "tonemappingRange tv" (mkEncodingOptionsConfig (nullConfig // {tonemappingRange = "tv";})) {
    tonemappingRange = "tv";
  })

  (assertEq "encoderPreset slow" (mkEncodingOptionsConfig (nullConfig // {encoderPreset = "slow";})) {
    encoderPreset = "slow";
  })

  (assertEq "encoderPreset ultrafast" (mkEncodingOptionsConfig (nullConfig // {encoderPreset = "ultrafast";})) {
    encoderPreset = "ultrafast";
  })

  (assertEq "deinterlaceMethod yadif" (mkEncodingOptionsConfig (nullConfig // {deinterlaceMethod = "yadif";})) {
    deinterlaceMethod = "yadif";
  })

  (assertEq "deinterlaceMethod bwdif" (mkEncodingOptionsConfig (nullConfig // {deinterlaceMethod = "bwdif";})) {
    deinterlaceMethod = "bwdif";
  })

  # String array option
  (assertEq "allowOnDemandMetadataBasedKeyframeExtractionForExtensions empty" (mkEncodingOptionsConfig (nullConfig
    // {
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions = [];
    })) {
    allowOnDemandMetadataBasedKeyframeExtractionForExtensions = [];
  })

  (assertEq "allowOnDemandMetadataBasedKeyframeExtractionForExtensions populated" (mkEncodingOptionsConfig (nullConfig
    // {
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions = ["mkv" "mp4" "ts"];
    })) {
    allowOnDemandMetadataBasedKeyframeExtractionForExtensions = ["mkv" "mp4" "ts"];
  })

  (assertEq "complete config all fields" (mkEncodingOptionsConfig {
      enableHardwareEncoding = true;
      hardwareAccelerationType = "vaapi";
      vaapiDevice = "/dev/dri/renderD128";
      qsvDevice = "";
      hardwareDecodingCodecs = ["h264" "hevc" "vp9" "av1"];
      enableDecodingColorDepth10Hevc = true;
      enableDecodingColorDepth10Vp9 = false;
      enableDecodingColorDepth10HevcRext = true;
      enableDecodingColorDepth12HevcRext = false;
      allowHevcEncoding = false;
      allowAv1Encoding = false;
      enableFallbackFont = true;
      enableAudioVbr = true;
      enableThrottling = false;
      enableSegmentDeletion = true;
      enableTonemapping = true;
      enableVppTonemapping = false;
      enableVideoToolboxTonemapping = false;
      deinterlaceDoubleRate = true;
      enableEnhancedNvdecDecoder = false;
      preferSystemNativeHwDecoder = true;
      enableIntelLowPowerH264HwEncoder = false;
      enableIntelLowPowerHevcHwEncoder = false;
      enableSubtitleExtraction = true;
      encodingThreadCount = -1;
      maxMuxingQueueSize = 4096;
      throttleDelaySeconds = 180;
      segmentKeepSeconds = 60;
      h264Crf = 23;
      h265Crf = 28;
      downMixAudioBoost = 2.0;
      tonemappingDesat = 0.5;
      tonemappingPeak = 100;
      tonemappingParam = 1.5;
      vppTonemappingBrightness = 0.0;
      vppTonemappingContrast = 1.0;
      transcodingTempPath = "/var/cache/jellyfin/transcodes";
      fallbackFontPath = "/usr/share/fonts/noto/NotoSans.ttf";
      encoderAppPath = "/run/current-system/sw/bin/ffmpeg";
      encoderAppPathDisplay = "/usr/bin/ffmpeg";
      downMixStereoAlgorithm = "Dave750";
      tonemappingAlgorithm = "hable";
      tonemappingMode = "auto";
      tonemappingRange = "tv";
      encoderPreset = "slow";
      deinterlaceMethod = "yadif";
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions = ["mkv" "mp4"];
    }) {
      enableHardwareEncoding = true;
      hardwareAccelerationType = "vaapi";
      vaapiDevice = "/dev/dri/renderD128";
      qsvDevice = "";
      hardwareDecodingCodecs = ["h264" "hevc" "vp9" "av1"];
      enableDecodingColorDepth10Hevc = true;
      enableDecodingColorDepth10Vp9 = false;
      enableDecodingColorDepth10HevcRext = true;
      enableDecodingColorDepth12HevcRext = false;
      allowHevcEncoding = false;
      allowAv1Encoding = false;
      enableFallbackFont = true;
      enableAudioVbr = true;
      enableThrottling = false;
      enableSegmentDeletion = true;
      enableTonemapping = true;
      enableVppTonemapping = false;
      enableVideoToolboxTonemapping = false;
      deinterlaceDoubleRate = true;
      enableEnhancedNvdecDecoder = false;
      preferSystemNativeHwDecoder = true;
      enableIntelLowPowerH264HwEncoder = false;
      enableIntelLowPowerHevcHwEncoder = false;
      enableSubtitleExtraction = true;
      encodingThreadCount = -1;
      maxMuxingQueueSize = 4096;
      throttleDelaySeconds = 180;
      segmentKeepSeconds = 60;
      h264Crf = 23;
      h265Crf = 28;
      downMixAudioBoost = 2.0;
      tonemappingDesat = 0.5;
      tonemappingPeak = 100;
      tonemappingParam = 1.5;
      vppTonemappingBrightness = 0.0;
      vppTonemappingContrast = 1.0;
      transcodingTempPath = "/var/cache/jellyfin/transcodes";
      fallbackFontPath = "/usr/share/fonts/noto/NotoSans.ttf";
      encoderAppPath = "/run/current-system/sw/bin/ffmpeg";
      encoderAppPathDisplay = "/usr/bin/ffmpeg";
      downMixStereoAlgorithm = "Dave750";
      tonemappingAlgorithm = "hable";
      tonemappingMode = "auto";
      tonemappingRange = "tv";
      encoderPreset = "slow";
      deinterlaceMethod = "yadif";
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions = ["mkv" "mp4"];
    })
]
