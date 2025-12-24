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
    };
  };

  mkEncodingOptionsConfig = cfg:
    {}
    // optionalAttrs (cfg.enableHardwareEncoding != null) {inherit (cfg) enableHardwareEncoding;}
    // optionalAttrs (cfg.hardwareAccelerationType != null) {inherit (cfg) hardwareAccelerationType;}
    // optionalAttrs (cfg.vaapiDevice != null) {inherit (cfg) vaapiDevice;}
    // optionalAttrs (cfg.qsvDevice != null) {inherit (cfg) qsvDevice;}
    // optionalAttrs (cfg.hardwareDecodingCodecs != null) {inherit (cfg) hardwareDecodingCodecs;}
    // optionalAttrs (cfg.enableDecodingColorDepth10Hevc != null) {inherit (cfg) enableDecodingColorDepth10Hevc;}
    // optionalAttrs (cfg.enableDecodingColorDepth10Vp9 != null) {inherit (cfg) enableDecodingColorDepth10Vp9;}
    // optionalAttrs (cfg.enableDecodingColorDepth10HevcRext != null) {inherit (cfg) enableDecodingColorDepth10HevcRext;}
    // optionalAttrs (cfg.enableDecodingColorDepth12HevcRext != null) {inherit (cfg) enableDecodingColorDepth12HevcRext;}
    // optionalAttrs (cfg.allowHevcEncoding != null) {inherit (cfg) allowHevcEncoding;}
    // optionalAttrs (cfg.allowAv1Encoding != null) {inherit (cfg) allowAv1Encoding;};
in {
  inherit encodingOptionsConfigType mkEncodingOptionsConfig;
}
