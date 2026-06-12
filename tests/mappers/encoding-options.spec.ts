import { describe, it, expect } from "vitest";
import { mapEncodingOptionsConfigToSchema } from "../../src/mappers/encoding-options";
import { type EncodingOptionsConfig } from "../../src/types/config/encoding-options";
import { type EncodingOptionsSchema } from "../../src/types/schema/encoding-options";

describe("mappers/encoding", () => {
  describe("mapEncodingOptionsConfigToSchema", () => {
    it("should map enableHardwareEncoding to EnableHardwareEncoding", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: true,
      });
    });

    it("should map enableHardwareEncoding false to EnableHardwareEncoding false", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: false,
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: false,
      });
    });

    it("should return empty object when enableHardwareEncoding is undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include EnableHardwareEncoding when field is not provided", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableHardwareEncoding");
    });

    it("should map hardwareAccelerationType to HardwareAccelerationType for all enum values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["hardwareAccelerationType"];
        expected: string;
      }> = [
        { input: "none", expected: "none" },
        { input: "amf", expected: "amf" },
        { input: "qsv", expected: "qsv" },
        { input: "nvenc", expected: "nvenc" },
        { input: "v4l2m2m", expected: "v4l2m2m" },
        { input: "vaapi", expected: "vaapi" },
        { input: "videotoolbox", expected: "videotoolbox" },
        { input: "rkmpp", expected: "rkmpp" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["hardwareAccelerationType"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = {
            hardwareAccelerationType: input,
          };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({
            HardwareAccelerationType: expected,
          });
        },
      );
    });

    it("should return empty object when hardwareAccelerationType is undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include HardwareAccelerationType when field is not provided", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("HardwareAccelerationType");
    });

    it("should map both enableHardwareEncoding and hardwareAccelerationType together", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "nvenc",
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: true,
        HardwareAccelerationType: "nvenc",
      });
    });

    it("should map only specified fields when partial config provided", () => {
      // Arrange
      const config1: EncodingOptionsConfig = {
        enableHardwareEncoding: false,
      };
      const config2: EncodingOptionsConfig = {
        hardwareAccelerationType: "vaapi",
      };

      // Act
      const result1: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config1);
      const result2: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config2);

      // Assert
      expect(result1).toEqual({
        EnableHardwareEncoding: false,
      });
      expect(result1).not.toHaveProperty("HardwareAccelerationType");

      expect(result2).toEqual({
        HardwareAccelerationType: "vaapi",
      });
      expect(result2).not.toHaveProperty("EnableHardwareEncoding");
    });

    it("should map vaapiDevice and qsvDevice string fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { vaapiDevice: "/dev/dri/renderD128" },
          expected: { VaapiDevice: "/dev/dri/renderD128" },
        },
        {
          config: { qsvDevice: "/dev/dri/renderD129" },
          expected: { QsvDevice: "/dev/dri/renderD129" },
        },
        {
          config: { vaapiDevice: "", qsvDevice: "" },
          expected: { VaapiDevice: "", QsvDevice: "" },
        },
        {
          config: {
            vaapiDevice: "/path/to/device",
            qsvDevice: "/another/path",
          },
          expected: {
            VaapiDevice: "/path/to/device",
            QsvDevice: "/another/path",
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include device fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("VaapiDevice");
      expect(result).not.toHaveProperty("QsvDevice");
      expect(result).toEqual({});
    });

    it("should map hardwareDecodingCodecs array field", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { hardwareDecodingCodecs: ["h264"] },
          expected: { HardwareDecodingCodecs: ["h264"] },
        },
        {
          config: { hardwareDecodingCodecs: ["h264", "hevc", "vp9"] },
          expected: { HardwareDecodingCodecs: ["h264", "hevc", "vp9"] },
        },
        {
          config: {
            hardwareDecodingCodecs: [
              "h264",
              "hevc",
              "mpeg2video",
              "vc1",
              "vp8",
              "vp9",
              "av1",
            ],
          },
          expected: {
            HardwareDecodingCodecs: [
              "h264",
              "hevc",
              "mpeg2video",
              "vc1",
              "vp8",
              "vp9",
              "av1",
            ],
          },
        },
        {
          config: { hardwareDecodingCodecs: [] },
          expected: { HardwareDecodingCodecs: [] },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include HardwareDecodingCodecs when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("HardwareDecodingCodecs");
    });

    it("should map all decoding color depth boolean fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { enableDecodingColorDepth10Hevc: true },
          expected: { EnableDecodingColorDepth10Hevc: true },
        },
        {
          config: { enableDecodingColorDepth10Hevc: false },
          expected: { EnableDecodingColorDepth10Hevc: false },
        },
        {
          config: { enableDecodingColorDepth10Vp9: true },
          expected: { EnableDecodingColorDepth10Vp9: true },
        },
        {
          config: { enableDecodingColorDepth10Vp9: false },
          expected: { EnableDecodingColorDepth10Vp9: false },
        },
        {
          config: { enableDecodingColorDepth10HevcRext: true },
          expected: { EnableDecodingColorDepth10HevcRext: true },
        },
        {
          config: { enableDecodingColorDepth10HevcRext: false },
          expected: { EnableDecodingColorDepth10HevcRext: false },
        },
        {
          config: { enableDecodingColorDepth12HevcRext: true },
          expected: { EnableDecodingColorDepth12HevcRext: true },
        },
        {
          config: { enableDecodingColorDepth12HevcRext: false },
          expected: { EnableDecodingColorDepth12HevcRext: false },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include decoding color depth fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableDecodingColorDepth10Hevc");
      expect(result).not.toHaveProperty("EnableDecodingColorDepth10Vp9");
      expect(result).not.toHaveProperty("EnableDecodingColorDepth10HevcRext");
      expect(result).not.toHaveProperty("EnableDecodingColorDepth12HevcRext");
    });

    it("should map encoding format boolean fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { allowHevcEncoding: true },
          expected: { AllowHevcEncoding: true },
        },
        {
          config: { allowHevcEncoding: false },
          expected: { AllowHevcEncoding: false },
        },
        {
          config: { allowAv1Encoding: true },
          expected: { AllowAv1Encoding: true },
        },
        {
          config: { allowAv1Encoding: false },
          expected: { AllowAv1Encoding: false },
        },
        {
          config: { allowHevcEncoding: true, allowAv1Encoding: false },
          expected: { AllowHevcEncoding: true, AllowAv1Encoding: false },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include encoding format fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("AllowHevcEncoding");
      expect(result).not.toHaveProperty("AllowAv1Encoding");
    });

    it("should map complete encoding config with all 11 original fields", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "vaapi",
        vaapiDevice: "/dev/dri/renderD128",
        qsvDevice: "",
        hardwareDecodingCodecs: ["h264", "hevc", "vp9", "av1"],
        enableDecodingColorDepth10Hevc: true,
        enableDecodingColorDepth10Vp9: false,
        enableDecodingColorDepth10HevcRext: true,
        enableDecodingColorDepth12HevcRext: false,
        allowHevcEncoding: false,
        allowAv1Encoding: true,
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: true,
        HardwareAccelerationType: "vaapi",
        VaapiDevice: "/dev/dri/renderD128",
        QsvDevice: "",
        HardwareDecodingCodecs: ["h264", "hevc", "vp9", "av1"],
        EnableDecodingColorDepth10Hevc: true,
        EnableDecodingColorDepth10Vp9: false,
        EnableDecodingColorDepth10HevcRext: true,
        EnableDecodingColorDepth12HevcRext: false,
        AllowHevcEncoding: false,
        AllowAv1Encoding: true,
      });
    });

    it("should map boolean feature toggle fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { enableFallbackFont: true },
          expected: { EnableFallbackFont: true },
        },
        {
          config: { enableFallbackFont: false },
          expected: { EnableFallbackFont: false },
        },
        {
          config: { enableAudioVbr: true },
          expected: { EnableAudioVbr: true },
        },
        {
          config: { enableAudioVbr: false },
          expected: { EnableAudioVbr: false },
        },
        {
          config: { enableThrottling: true },
          expected: { EnableThrottling: true },
        },
        {
          config: { enableThrottling: false },
          expected: { EnableThrottling: false },
        },
        {
          config: { enableSegmentDeletion: true },
          expected: { EnableSegmentDeletion: true },
        },
        {
          config: { enableSegmentDeletion: false },
          expected: { EnableSegmentDeletion: false },
        },
        {
          config: { enableTonemapping: true },
          expected: { EnableTonemapping: true },
        },
        {
          config: { enableTonemapping: false },
          expected: { EnableTonemapping: false },
        },
        {
          config: { enableVppTonemapping: true },
          expected: { EnableVppTonemapping: true },
        },
        {
          config: { enableVppTonemapping: false },
          expected: { EnableVppTonemapping: false },
        },
        {
          config: { enableVideoToolboxTonemapping: true },
          expected: { EnableVideoToolboxTonemapping: true },
        },
        {
          config: { enableVideoToolboxTonemapping: false },
          expected: { EnableVideoToolboxTonemapping: false },
        },
        {
          config: { deinterlaceDoubleRate: true },
          expected: { DeinterlaceDoubleRate: true },
        },
        {
          config: { deinterlaceDoubleRate: false },
          expected: { DeinterlaceDoubleRate: false },
        },
        {
          config: { enableEnhancedNvdecDecoder: true },
          expected: { EnableEnhancedNvdecDecoder: true },
        },
        {
          config: { enableEnhancedNvdecDecoder: false },
          expected: { EnableEnhancedNvdecDecoder: false },
        },
        {
          config: { preferSystemNativeHwDecoder: true },
          expected: { PreferSystemNativeHwDecoder: true },
        },
        {
          config: { preferSystemNativeHwDecoder: false },
          expected: { PreferSystemNativeHwDecoder: false },
        },
        {
          config: { enableIntelLowPowerH264HwEncoder: true },
          expected: { EnableIntelLowPowerH264HwEncoder: true },
        },
        {
          config: { enableIntelLowPowerH264HwEncoder: false },
          expected: { EnableIntelLowPowerH264HwEncoder: false },
        },
        {
          config: { enableIntelLowPowerHevcHwEncoder: true },
          expected: { EnableIntelLowPowerHevcHwEncoder: true },
        },
        {
          config: { enableIntelLowPowerHevcHwEncoder: false },
          expected: { EnableIntelLowPowerHevcHwEncoder: false },
        },
        {
          config: { enableSubtitleExtraction: true },
          expected: { EnableSubtitleExtraction: true },
        },
        {
          config: { enableSubtitleExtraction: false },
          expected: { EnableSubtitleExtraction: false },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include boolean feature toggle fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EnableFallbackFont");
      expect(result).not.toHaveProperty("EnableAudioVbr");
      expect(result).not.toHaveProperty("EnableThrottling");
      expect(result).not.toHaveProperty("EnableSegmentDeletion");
      expect(result).not.toHaveProperty("EnableTonemapping");
      expect(result).not.toHaveProperty("EnableVppTonemapping");
      expect(result).not.toHaveProperty("EnableVideoToolboxTonemapping");
      expect(result).not.toHaveProperty("DeinterlaceDoubleRate");
      expect(result).not.toHaveProperty("EnableEnhancedNvdecDecoder");
      expect(result).not.toHaveProperty("PreferSystemNativeHwDecoder");
      expect(result).not.toHaveProperty("EnableIntelLowPowerH264HwEncoder");
      expect(result).not.toHaveProperty("EnableIntelLowPowerHevcHwEncoder");
      expect(result).not.toHaveProperty("EnableSubtitleExtraction");
    });

    it("should map numeric integer fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { encodingThreadCount: 4 },
          expected: { EncodingThreadCount: 4 },
        },
        {
          config: { encodingThreadCount: 0 },
          expected: { EncodingThreadCount: 0 },
        },
        {
          config: { maxMuxingQueueSize: 2048 },
          expected: { MaxMuxingQueueSize: 2048 },
        },
        {
          config: { throttleDelaySeconds: 180 },
          expected: { ThrottleDelaySeconds: 180 },
        },
        {
          config: { segmentKeepSeconds: 120 },
          expected: { SegmentKeepSeconds: 120 },
        },
        {
          config: { h264Crf: 23 },
          expected: { H264Crf: 23 },
        },
        {
          config: { h265Crf: 28 },
          expected: { H265Crf: 28 },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should map numeric float fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { downMixAudioBoost: 2.0 },
          expected: { DownMixAudioBoost: 2.0 },
        },
        {
          config: { tonemappingDesat: 0.5 },
          expected: { TonemappingDesat: 0.5 },
        },
        {
          config: { tonemappingPeak: 100.0 },
          expected: { TonemappingPeak: 100.0 },
        },
        {
          config: { tonemappingParam: 0.0 },
          expected: { TonemappingParam: 0.0 },
        },
        {
          config: { vppTonemappingBrightness: 0.0 },
          expected: { VppTonemappingBrightness: 0.0 },
        },
        {
          config: { vppTonemappingContrast: 1.2 },
          expected: { VppTonemappingContrast: 1.2 },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include numeric fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("EncodingThreadCount");
      expect(result).not.toHaveProperty("MaxMuxingQueueSize");
      expect(result).not.toHaveProperty("ThrottleDelaySeconds");
      expect(result).not.toHaveProperty("SegmentKeepSeconds");
      expect(result).not.toHaveProperty("H264Crf");
      expect(result).not.toHaveProperty("H265Crf");
      expect(result).not.toHaveProperty("DownMixAudioBoost");
      expect(result).not.toHaveProperty("TonemappingDesat");
      expect(result).not.toHaveProperty("TonemappingPeak");
      expect(result).not.toHaveProperty("TonemappingParam");
      expect(result).not.toHaveProperty("VppTonemappingBrightness");
      expect(result).not.toHaveProperty("VppTonemappingContrast");
    });

    it("should map string path fields", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: { transcodingTempPath: "/tmp/transcoding" },
          expected: { TranscodingTempPath: "/tmp/transcoding" },
        },
        {
          config: { transcodingTempPath: "" },
          expected: { TranscodingTempPath: "" },
        },
        {
          config: { fallbackFontPath: "/usr/share/fonts/fallback.ttf" },
          expected: { FallbackFontPath: "/usr/share/fonts/fallback.ttf" },
        },
        {
          config: { encoderAppPath: "/usr/bin/ffmpeg" },
          expected: { EncoderAppPath: "/usr/bin/ffmpeg" },
        },
        {
          config: { encoderAppPathDisplay: "/usr/bin/ffmpeg" },
          expected: { EncoderAppPathDisplay: "/usr/bin/ffmpeg" },
        },
        {
          config: {
            transcodingTempPath: "/tmp",
            fallbackFontPath: "/fonts/f.ttf",
            encoderAppPath: "/bin/ffmpeg",
            encoderAppPathDisplay: "/bin/ffmpeg",
          },
          expected: {
            TranscodingTempPath: "/tmp",
            FallbackFontPath: "/fonts/f.ttf",
            EncoderAppPath: "/bin/ffmpeg",
            EncoderAppPathDisplay: "/bin/ffmpeg",
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include string path fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("TranscodingTempPath");
      expect(result).not.toHaveProperty("FallbackFontPath");
      expect(result).not.toHaveProperty("EncoderAppPath");
      expect(result).not.toHaveProperty("EncoderAppPathDisplay");
    });

    it("should map downMixStereoAlgorithm enum field for all values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["downMixStereoAlgorithm"];
        expected: string;
      }> = [
        { input: "None", expected: "None" },
        { input: "Dave750", expected: "Dave750" },
        { input: "NightmodeDialogue", expected: "NightmodeDialogue" },
        { input: "Rfc7845", expected: "Rfc7845" },
        { input: "Ac4", expected: "Ac4" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["downMixStereoAlgorithm"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = {
            downMixStereoAlgorithm: input,
          };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({ DownMixStereoAlgorithm: expected });
        },
      );
    });

    it("should map tonemappingAlgorithm enum field for all values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["tonemappingAlgorithm"];
        expected: string;
      }> = [
        { input: "none", expected: "none" },
        { input: "clip", expected: "clip" },
        { input: "linear", expected: "linear" },
        { input: "gamma", expected: "gamma" },
        { input: "reinhard", expected: "reinhard" },
        { input: "hable", expected: "hable" },
        { input: "mobius", expected: "mobius" },
        { input: "bt2390", expected: "bt2390" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["tonemappingAlgorithm"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = {
            tonemappingAlgorithm: input,
          };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({ TonemappingAlgorithm: expected });
        },
      );
    });

    it("should map tonemappingMode enum field for all values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["tonemappingMode"];
        expected: string;
      }> = [
        { input: "auto", expected: "auto" },
        { input: "max", expected: "max" },
        { input: "rgb", expected: "rgb" },
        { input: "lum", expected: "lum" },
        { input: "itp", expected: "itp" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["tonemappingMode"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = { tonemappingMode: input };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({ TonemappingMode: expected });
        },
      );
    });

    it("should map tonemappingRange enum field for all values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["tonemappingRange"];
        expected: string;
      }> = [
        { input: "auto", expected: "auto" },
        { input: "tv", expected: "tv" },
        { input: "pc", expected: "pc" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["tonemappingRange"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = { tonemappingRange: input };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({ TonemappingRange: expected });
        },
      );
    });

    it("should map encoderPreset enum field for all values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["encoderPreset"];
        expected: string;
      }> = [
        { input: "auto", expected: "auto" },
        { input: "placebo", expected: "placebo" },
        { input: "veryslow", expected: "veryslow" },
        { input: "slower", expected: "slower" },
        { input: "slow", expected: "slow" },
        { input: "medium", expected: "medium" },
        { input: "fast", expected: "fast" },
        { input: "faster", expected: "faster" },
        { input: "veryfast", expected: "veryfast" },
        { input: "superfast", expected: "superfast" },
        { input: "ultrafast", expected: "ultrafast" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["encoderPreset"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = { encoderPreset: input };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({ EncoderPreset: expected });
        },
      );
    });

    it("should map deinterlaceMethod enum field for all values", () => {
      // Arrange
      const testCases: Array<{
        input: EncodingOptionsConfig["deinterlaceMethod"];
        expected: string;
      }> = [
        { input: "yadif", expected: "yadif" },
        { input: "bwdif", expected: "bwdif" },
      ];

      testCases.forEach(
        ({
          input,
          expected,
        }: {
          input: EncodingOptionsConfig["deinterlaceMethod"];
          expected: string;
        }) => {
          // Arrange
          const config: EncodingOptionsConfig = { deinterlaceMethod: input };

          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual({ DeinterlaceMethod: expected });
        },
      );
    });

    it("should not include enum fields when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty("DownMixStereoAlgorithm");
      expect(result).not.toHaveProperty("TonemappingAlgorithm");
      expect(result).not.toHaveProperty("TonemappingMode");
      expect(result).not.toHaveProperty("TonemappingRange");
      expect(result).not.toHaveProperty("EncoderPreset");
      expect(result).not.toHaveProperty("DeinterlaceMethod");
    });

    it("should map allowOnDemandMetadataBasedKeyframeExtractionForExtensions array field", () => {
      // Arrange
      const testCases: Array<{
        config: EncodingOptionsConfig;
        expected: Partial<EncodingOptionsSchema>;
      }> = [
        {
          config: {
            allowOnDemandMetadataBasedKeyframeExtractionForExtensions: [
              "mkv",
              "mp4",
            ],
          },
          expected: {
            AllowOnDemandMetadataBasedKeyframeExtractionForExtensions: [
              "mkv",
              "mp4",
            ],
          },
        },
        {
          config: {
            allowOnDemandMetadataBasedKeyframeExtractionForExtensions: [],
          },
          expected: {
            AllowOnDemandMetadataBasedKeyframeExtractionForExtensions: [],
          },
        },
        {
          config: {
            allowOnDemandMetadataBasedKeyframeExtractionForExtensions: ["ts"],
          },
          expected: {
            AllowOnDemandMetadataBasedKeyframeExtractionForExtensions: ["ts"],
          },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: EncodingOptionsConfig;
          expected: Partial<EncodingOptionsSchema>;
        }) => {
          // Act
          const result: Partial<EncodingOptionsSchema> =
            mapEncodingOptionsConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should not include AllowOnDemandMetadataBasedKeyframeExtractionForExtensions when undefined", () => {
      // Arrange
      const config: EncodingOptionsConfig = {};

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).not.toHaveProperty(
        "AllowOnDemandMetadataBasedKeyframeExtractionForExtensions",
      );
    });

    it("should map all 47 fields together", () => {
      // Arrange
      const config: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "vaapi",
        vaapiDevice: "/dev/dri/renderD128",
        qsvDevice: "",
        hardwareDecodingCodecs: ["h264", "hevc", "vp9"],
        enableDecodingColorDepth10Hevc: true,
        enableDecodingColorDepth10Vp9: false,
        enableDecodingColorDepth10HevcRext: true,
        enableDecodingColorDepth12HevcRext: false,
        allowHevcEncoding: true,
        allowAv1Encoding: false,
        enableFallbackFont: true,
        enableAudioVbr: false,
        enableThrottling: true,
        enableSegmentDeletion: false,
        enableTonemapping: true,
        enableVppTonemapping: false,
        enableVideoToolboxTonemapping: true,
        deinterlaceDoubleRate: false,
        enableEnhancedNvdecDecoder: true,
        preferSystemNativeHwDecoder: false,
        enableIntelLowPowerH264HwEncoder: true,
        enableIntelLowPowerHevcHwEncoder: false,
        enableSubtitleExtraction: true,
        encodingThreadCount: 4,
        maxMuxingQueueSize: 2048,
        throttleDelaySeconds: 180,
        segmentKeepSeconds: 120,
        h264Crf: 23,
        h265Crf: 28,
        downMixAudioBoost: 2.0,
        tonemappingDesat: 0.5,
        tonemappingPeak: 100.0,
        tonemappingParam: 0.0,
        vppTonemappingBrightness: 0.0,
        vppTonemappingContrast: 1.2,
        transcodingTempPath: "/tmp/transcoding",
        fallbackFontPath: "/usr/share/fonts/fallback.ttf",
        encoderAppPath: "/usr/bin/ffmpeg",
        encoderAppPathDisplay: "/usr/bin/ffmpeg",
        downMixStereoAlgorithm: "Dave750",
        tonemappingAlgorithm: "hable",
        tonemappingMode: "auto",
        tonemappingRange: "tv",
        encoderPreset: "slow",
        deinterlaceMethod: "yadif",
        allowOnDemandMetadataBasedKeyframeExtractionForExtensions: [
          "mkv",
          "mp4",
        ],
      };

      // Act
      const result: Partial<EncodingOptionsSchema> =
        mapEncodingOptionsConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        EnableHardwareEncoding: true,
        HardwareAccelerationType: "vaapi",
        VaapiDevice: "/dev/dri/renderD128",
        QsvDevice: "",
        HardwareDecodingCodecs: ["h264", "hevc", "vp9"],
        EnableDecodingColorDepth10Hevc: true,
        EnableDecodingColorDepth10Vp9: false,
        EnableDecodingColorDepth10HevcRext: true,
        EnableDecodingColorDepth12HevcRext: false,
        AllowHevcEncoding: true,
        AllowAv1Encoding: false,
        EnableFallbackFont: true,
        EnableAudioVbr: false,
        EnableThrottling: true,
        EnableSegmentDeletion: false,
        EnableTonemapping: true,
        EnableVppTonemapping: false,
        EnableVideoToolboxTonemapping: true,
        DeinterlaceDoubleRate: false,
        EnableEnhancedNvdecDecoder: true,
        PreferSystemNativeHwDecoder: false,
        EnableIntelLowPowerH264HwEncoder: true,
        EnableIntelLowPowerHevcHwEncoder: false,
        EnableSubtitleExtraction: true,
        EncodingThreadCount: 4,
        MaxMuxingQueueSize: 2048,
        ThrottleDelaySeconds: 180,
        SegmentKeepSeconds: 120,
        H264Crf: 23,
        H265Crf: 28,
        DownMixAudioBoost: 2.0,
        TonemappingDesat: 0.5,
        TonemappingPeak: 100.0,
        TonemappingParam: 0.0,
        VppTonemappingBrightness: 0.0,
        VppTonemappingContrast: 1.2,
        TranscodingTempPath: "/tmp/transcoding",
        FallbackFontPath: "/usr/share/fonts/fallback.ttf",
        EncoderAppPath: "/usr/bin/ffmpeg",
        EncoderAppPathDisplay: "/usr/bin/ffmpeg",
        DownMixStereoAlgorithm: "Dave750",
        TonemappingAlgorithm: "hable",
        TonemappingMode: "auto",
        TonemappingRange: "tv",
        EncoderPreset: "slow",
        DeinterlaceMethod: "yadif",
        AllowOnDemandMetadataBasedKeyframeExtractionForExtensions: [
          "mkv",
          "mp4",
        ],
      });
    });
  });
});
