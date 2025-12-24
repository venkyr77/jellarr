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
    })
]
