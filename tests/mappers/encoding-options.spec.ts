/**
 * Encoding Options Mapper Test Coverage
 *
 * ## enableHardwareEncoding (Boolean Field)
 * - ✅ Field mapping: enableHardwareEncoding → EnableHardwareEncoding (true/false)
 * - ✅ Undefined field handling
 * - ✅ Property exclusion validation
 *
 * ## hardwareAccelerationType (Enum Field)
 * - ✅ Field mapping: hardwareAccelerationType → HardwareAccelerationType (all 8 values)
 * - ✅ Undefined field handling
 * - ✅ Property exclusion validation
 * - ✅ All 8 enum values (none, amf, qsv, nvenc, v4l2m2m, vaapi, videotoolbox, rkmpp)
 *
 * ## Device Fields (String Fields)
 * - ✅ vaapiDevice → VaapiDevice: path mapping, empty string support, undefined handling
 * - ✅ qsvDevice → QsvDevice: path mapping, empty string support, undefined handling
 * - ✅ Device fields together: combined mapping scenarios
 *
 * ## hardwareDecodingCodecs (Array Field)
 * - ✅ Field mapping: hardwareDecodingCodecs → HardwareDecodingCodecs (all codec arrays)
 * - ✅ Undefined field handling
 * - ✅ Empty array support
 * - ✅ All valid codec combinations (h264, hevc, mpeg2video, vc1, vp8, vp9, av1)
 *
 * ## Boolean Decoding Fields
 * - ✅ enableDecodingColorDepth10Hevc → EnableDecodingColorDepth10Hevc (true/false)
 * - ✅ enableDecodingColorDepth10Vp9 → EnableDecodingColorDepth10Vp9 (true/false)
 * - ✅ enableDecodingColorDepth10HevcRext → EnableDecodingColorDepth10HevcRext (true/false)
 * - ✅ enableDecodingColorDepth12HevcRext → EnableDecodingColorDepth12HevcRext (true/false)
 * - ✅ All decoding fields together: combined scenarios
 *
 * ## Boolean Encoding Format Fields
 * - ✅ allowHevcEncoding → AllowHevcEncoding (true/false)
 * - ✅ allowAv1Encoding → AllowAv1Encoding (true/false)
 * - ✅ Encoding format fields together: combined scenarios
 *
 * ## Complete Multi-field Scenarios
 * - ✅ All 11 fields together: comprehensive mapping test
 * - ✅ Empty config handling
 *
 * Total coverage: 18 comprehensive tests across all 11 encoding options fields.
 */
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

      testCases.forEach(({ input, expected }) => {
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
      });
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

      testCases.forEach(({ config, expected }) => {
        // Act
        const result: Partial<EncodingOptionsSchema> =
          mapEncodingOptionsConfigToSchema(config);

        // Assert
        expect(result).toEqual(expected);
      });
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

      testCases.forEach(({ config, expected }) => {
        // Act
        const result: Partial<EncodingOptionsSchema> =
          mapEncodingOptionsConfigToSchema(config);

        // Assert
        expect(result).toEqual(expected);
      });
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

      testCases.forEach(({ config, expected }) => {
        // Act
        const result: Partial<EncodingOptionsSchema> =
          mapEncodingOptionsConfigToSchema(config);

        // Assert
        expect(result).toEqual(expected);
      });
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

      testCases.forEach(({ config, expected }) => {
        // Act
        const result: Partial<EncodingOptionsSchema> =
          mapEncodingOptionsConfigToSchema(config);

        // Assert
        expect(result).toEqual(expected);
      });
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

    it("should map complete encoding config with all 11 fields", () => {
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
  });
});
