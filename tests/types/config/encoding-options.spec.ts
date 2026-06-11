import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  EncodingOptionsConfigType,
  type EncodingOptionsConfig,
} from "../../../src/types/config/encoding-options";

describe("EncodingOptionsConfig", () => {
  it("should validate empty encoding config", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {};

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should validate encoding config with enableHardwareEncoding true", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      enableHardwareEncoding: true,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate encoding config with enableHardwareEncoding false", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      enableHardwareEncoding: false,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-boolean enableHardwareEncoding", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      // @ts-expect-error intentional bad type for test
      enableHardwareEncoding: "true",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate hardwareAccelerationType with valid values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { hardwareAccelerationType: "none" as const },
      { hardwareAccelerationType: "amf" as const },
      { hardwareAccelerationType: "qsv" as const },
      { hardwareAccelerationType: "nvenc" as const },
      { hardwareAccelerationType: "v4l2m2m" as const },
      { hardwareAccelerationType: "vaapi" as const },
      { hardwareAccelerationType: "videotoolbox" as const },
      { hardwareAccelerationType: "rkmpp" as const },
      {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "vaapi" as const,
      },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should reject invalid hardwareAccelerationType values", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      // @ts-expect-error intentional bad value for test
      hardwareAccelerationType: "invalid_type",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);

      const hasEnumError: boolean = result.error.issues.some(
        (issue: z.core.$ZodIssue) =>
          issue.code === "invalid_value" &&
          issue.path[0] === "hardwareAccelerationType",
      );
      expect(hasEnumError).toBe(true);
    }
  });

  it("should validate vaapiDevice and qsvDevice string fields", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { vaapiDevice: "/dev/dri/renderD128" },
      { qsvDevice: "/dev/dri/renderD129" },
      { vaapiDevice: "", qsvDevice: "" },
      { vaapiDevice: "/path/to/device", qsvDevice: "/another/path" },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should reject non-string vaapiDevice and qsvDevice", () => {
    // Arrange
    const invalidConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      // @ts-expect-error intentional bad type for test
      { vaapiDevice: 123 },
      // @ts-expect-error intentional bad type for test
      { qsvDevice: true },
      // @ts-expect-error intentional bad type for test
      { vaapiDevice: null },
    ];

    invalidConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(false);
      },
    );
  });

  it("should validate hardwareDecodingCodecs array with valid codec values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { hardwareDecodingCodecs: ["h264"] },
      { hardwareDecodingCodecs: ["h264", "hevc", "vp9"] },
      {
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
      { hardwareDecodingCodecs: [] },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should reject invalid hardwareDecodingCodecs values", () => {
    // Arrange
    const invalidConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      // @ts-expect-error intentional bad codec for test
      { hardwareDecodingCodecs: ["invalid_codec"] },
      // @ts-expect-error intentional bad codec for test
      { hardwareDecodingCodecs: ["h264", "bad_codec"] },
      // @ts-expect-error intentional bad type for test
      { hardwareDecodingCodecs: "not_array" },
      // @ts-expect-error intentional bad type for test
      { hardwareDecodingCodecs: [123] },
    ];

    invalidConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(false);
      },
    );
  });

  it("should validate all decoding color depth boolean fields", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { enableDecodingColorDepth10Hevc: true },
      { enableDecodingColorDepth10Hevc: false },
      { enableDecodingColorDepth10Vp9: true },
      { enableDecodingColorDepth10Vp9: false },
      { enableDecodingColorDepth10HevcRext: true },
      { enableDecodingColorDepth10HevcRext: false },
      { enableDecodingColorDepth12HevcRext: true },
      { enableDecodingColorDepth12HevcRext: false },
      {
        enableDecodingColorDepth10Hevc: true,
        enableDecodingColorDepth10Vp9: false,
        enableDecodingColorDepth10HevcRext: true,
        enableDecodingColorDepth12HevcRext: false,
      },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should reject non-boolean decoding color depth fields", () => {
    // Arrange
    const invalidConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      // @ts-expect-error intentional bad type for test
      { enableDecodingColorDepth10Hevc: "true" },
      // @ts-expect-error intentional bad type for test
      { enableDecodingColorDepth10Vp9: 1 },
      // @ts-expect-error intentional bad type for test
      { enableDecodingColorDepth10HevcRext: null },
      // @ts-expect-error intentional bad type for test
      { enableDecodingColorDepth12HevcRext: [] },
    ];

    invalidConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(false);
      },
    );
  });

  it("should validate encoding format boolean fields", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { allowHevcEncoding: true },
      { allowHevcEncoding: false },
      { allowAv1Encoding: true },
      { allowAv1Encoding: false },
      { allowHevcEncoding: true, allowAv1Encoding: false },
      { allowHevcEncoding: false, allowAv1Encoding: true },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should reject non-boolean encoding format fields", () => {
    // Arrange
    const invalidConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      // @ts-expect-error intentional bad type for test
      { allowHevcEncoding: "false" },
      // @ts-expect-error intentional bad type for test
      { allowAv1Encoding: 0 },
      // @ts-expect-error intentional bad type for test
      { allowHevcEncoding: null },
    ];

    invalidConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(false);
      },
    );
  });

  it("should validate new boolean fields (representative)", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
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
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate int fields (representative)", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      encodingThreadCount: 4,
      maxMuxingQueueSize: 2048,
      throttleDelaySeconds: 180,
      segmentKeepSeconds: 60,
      h264Crf: 23,
      h265Crf: 28,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject non-integer for int field (h264Crf: 23.5)", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      h264Crf: 23.5,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should accept decimal for double field (tonemappingPeak: 100.5)", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      tonemappingPeak: 100.5,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate double fields (representative)", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      downMixAudioBoost: 2.0,
      tonemappingDesat: 0.5,
      tonemappingPeak: 100.0,
      tonemappingParam: 16.5,
      vppTonemappingBrightness: 1.2,
      vppTonemappingContrast: 1.0,
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate string fields (representative)", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
      transcodingTempPath: "/tmp/transcoding",
      fallbackFontPath: "/usr/share/fonts/fallback.ttf",
      encoderAppPath: "/usr/bin/ffmpeg",
      encoderAppPathDisplay: "/usr/bin/ffmpeg",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate downMixStereoAlgorithm enum with sampled values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { downMixStereoAlgorithm: "None" as const },
      { downMixStereoAlgorithm: "Dave750" as const },
      { downMixStereoAlgorithm: "NightmodeDialogue" as const },
      { downMixStereoAlgorithm: "Rfc7845" as const },
      { downMixStereoAlgorithm: "Ac4" as const },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should validate tonemappingAlgorithm enum with sampled values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { tonemappingAlgorithm: "none" as const },
      { tonemappingAlgorithm: "hable" as const },
      { tonemappingAlgorithm: "bt2390" as const },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should validate tonemappingMode enum with sampled values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { tonemappingMode: "auto" as const },
      { tonemappingMode: "rgb" as const },
      { tonemappingMode: "itp" as const },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should validate tonemappingRange enum with sampled values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { tonemappingRange: "auto" as const },
      { tonemappingRange: "tv" as const },
      { tonemappingRange: "pc" as const },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should validate encoderPreset enum with sampled values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { encoderPreset: "auto" as const },
      { encoderPreset: "medium" as const },
      { encoderPreset: "ultrafast" as const },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should validate deinterlaceMethod enum with sampled values", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { deinterlaceMethod: "yadif" as const },
      { deinterlaceMethod: "bwdif" as const },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should reject invalid enum value for downMixStereoAlgorithm", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      // @ts-expect-error intentional bad enum value for test
      downMixStereoAlgorithm: "InvalidAlgo",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate allowOnDemandMetadataBasedKeyframeExtractionForExtensions array", () => {
    // Arrange
    const validConfigs: Array<z.input<typeof EncodingOptionsConfigType>> = [
      { allowOnDemandMetadataBasedKeyframeExtractionForExtensions: [] },
      {
        allowOnDemandMetadataBasedKeyframeExtractionForExtensions: [
          "mkv",
          "mp4",
        ],
      },
      {
        allowOnDemandMetadataBasedKeyframeExtractionForExtensions: [
          "mkv",
          "mp4",
          "ts",
          "avi",
        ],
      },
    ];

    validConfigs.forEach(
      (config: z.input<typeof EncodingOptionsConfigType>) => {
        // Act
        const result: ZodSafeParseResult<EncodingOptionsConfig> =
          EncodingOptionsConfigType.safeParse(config);

        // Assert
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(config);
        }
      },
    );
  });

  it("should validate complete encoding config with all 47 fields", () => {
    // Arrange
    const validConfig: z.input<typeof EncodingOptionsConfigType> = {
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
      allowAv1Encoding: false,
      enableFallbackFont: false,
      enableAudioVbr: true,
      enableThrottling: false,
      enableSegmentDeletion: false,
      enableTonemapping: true,
      enableVppTonemapping: false,
      enableVideoToolboxTonemapping: false,
      deinterlaceDoubleRate: false,
      enableEnhancedNvdecDecoder: true,
      preferSystemNativeHwDecoder: false,
      enableIntelLowPowerH264HwEncoder: false,
      enableIntelLowPowerHevcHwEncoder: false,
      enableSubtitleExtraction: true,
      encodingThreadCount: 0,
      maxMuxingQueueSize: 2048,
      throttleDelaySeconds: 180,
      segmentKeepSeconds: 60,
      h264Crf: 23,
      h265Crf: 28,
      downMixAudioBoost: 2.0,
      tonemappingDesat: 0.0,
      tonemappingPeak: 100.0,
      tonemappingParam: 0.0,
      vppTonemappingBrightness: 0.0,
      vppTonemappingContrast: 1.0,
      transcodingTempPath: "/var/lib/jellyfin/transcodes",
      fallbackFontPath: "",
      encoderAppPath: "/usr/bin/ffmpeg",
      encoderAppPathDisplay: "/usr/bin/ffmpeg",
      downMixStereoAlgorithm: "None",
      tonemappingAlgorithm: "bt2390",
      tonemappingMode: "auto",
      tonemappingRange: "auto",
      encoderPreset: "auto",
      deinterlaceMethod: "yadif",
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions: ["mkv", "mp4"],
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof EncodingOptionsConfigType> = {
      enableHardwareEncoding: true,
      // @ts-expect-error intentional extra field for test
      unknownField: "should not be allowed",
    };

    // Act
    const result: ZodSafeParseResult<EncodingOptionsConfig> =
      EncodingOptionsConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });
});
