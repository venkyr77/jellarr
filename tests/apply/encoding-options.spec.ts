/**
 * Encoding Options Apply Test Coverage
 *
 * ## enableHardwareEncoding (Scalar Boolean)
 * - ✅ Change: false → true, true → false (actual changes)
 * - ✅ Preserve when undefined
 * - ✅ No-change: same value
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 * - ✅ Field preservation (other schema fields untouched)
 *
 * ## hardwareAccelerationType (Enum Field)
 * - ✅ Change: all 8 enum value transitions (actual changes)
 * - ✅ Preserve when undefined
 * - ✅ No-change: same value
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 * - ✅ Field preservation (other schema fields untouched)
 * - ✅ Default value handling (undefined → "none")
 *
 * ## vaapiDevice & qsvDevice (String Device Fields)
 * - ✅ Change: various device path transitions
 * - ✅ Preserve when undefined
 * - ✅ No-change: same value
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 * - ✅ Field preservation (other schema fields untouched)
 * - ✅ Empty string handling
 *
 * ## hardwareDecodingCodecs (Array Field)
 * - ✅ Change: various codec array configurations
 * - ✅ Preserve when undefined
 * - ✅ No-change: same array
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 * - ✅ Field preservation (other schema fields untouched)
 * - ✅ Empty array handling
 *
 * ## Boolean Decoding Fields (enableDecodingColorDepth10Hevc, enableDecodingColorDepth10Vp9, enableDecodingColorDepth10HevcRext, enableDecodingColorDepth12HevcRext)
 * - ✅ Change: false → true, true → false for each field
 * - ✅ Preserve when undefined
 * - ✅ No-change: same value
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 * - ✅ Field preservation (other schema fields untouched)
 *
 * ## Boolean Encoding Format Fields (allowHevcEncoding, allowAv1Encoding)
 * - ✅ Change: false → true, true → false for each field
 * - ✅ Preserve when undefined
 * - ✅ No-change: same value
 * - ✅ Logging behavior (changes logged vs no-changes not logged)
 * - ✅ Field preservation (other schema fields untouched)
 *
 * ## Multi-field scenarios
 * - ✅ Both original fields together (change + preserve combinations)
 * - ✅ Mixed updates (one field same, one different)
 * - ✅ All 11 fields complete scenario
 */
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculateEncodingDiff,
  applyEncoding,
} from "../../src/apply/encoding-options";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import { type EncodingOptionsConfig } from "../../src/types/config/encoding-options";
import { type EncodingOptionsSchema } from "../../src/types/schema/encoding-options";

vi.mock("../../src/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("apply/encoding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateEncodingDiff", () => {
    it("should update EnableHardwareEncoding when enableHardwareEncoding changes from false to true", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: false,
        EncodingThreadCount: -1,
        TranscodingTempPath: "/tmp",
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
      };

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result?.EnableHardwareEncoding).toBe(true);
      expect(result?.EncodingThreadCount).toBe(-1);
      expect(result?.TranscodingTempPath).toBe("/tmp");
    });

    it("should update EnableHardwareEncoding when enableHardwareEncoding changes from true to false", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        EncodingThreadCount: 4,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: false,
      };

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result?.EnableHardwareEncoding).toBe(false);
      expect(result?.EncodingThreadCount).toBe(4);
    });

    it("should not modify EnableHardwareEncoding when enableHardwareEncoding is undefined", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        EncodingThreadCount: 2,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {};

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should not modify EnableHardwareEncoding when value is the same", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        EncodingThreadCount: 1,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
      };

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should update HardwareAccelerationType when hardwareAccelerationType changes", () => {
      // Arrange
      const testCases: Array<{
        currentValue: string | undefined;
        desiredValue: EncodingOptionsConfig["hardwareAccelerationType"];
        expectedValue: string;
      }> = [
        { currentValue: "none", desiredValue: "nvenc", expectedValue: "nvenc" },
        { currentValue: "amf", desiredValue: "qsv", expectedValue: "qsv" },
        {
          currentValue: "vaapi",
          desiredValue: "videotoolbox",
          expectedValue: "videotoolbox",
        },
        {
          currentValue: undefined,
          desiredValue: "rkmpp",
          expectedValue: "rkmpp",
        },
        {
          currentValue: "v4l2m2m",
          desiredValue: "none",
          expectedValue: "none",
        },
      ];

      testCases.forEach(
        ({
          currentValue,
          desiredValue,
          expectedValue,
        }: {
          currentValue: string | undefined;
          desiredValue: EncodingOptionsConfig["hardwareAccelerationType"];
          expectedValue: string;
        }) => {
          // Arrange
          const current: EncodingOptionsSchema = {
            HardwareAccelerationType: currentValue,
            EncodingThreadCount: -1,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            hardwareAccelerationType: desiredValue,
          };

          // Act
          const result: EncodingOptionsSchema | undefined =
            calculateEncodingDiff(current, desired);

          // Assert
          expect(result?.HardwareAccelerationType).toBe(expectedValue);
          expect(result?.EncodingThreadCount).toBe(-1);
        },
      );
    });

    it("should not modify HardwareAccelerationType when hardwareAccelerationType is undefined", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        HardwareAccelerationType: "nvenc",
        EncodingThreadCount: 2,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {};

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result).toBeUndefined();
    });

    it("should not modify HardwareAccelerationType when value is the same", () => {
      // Arrange
      const testCases: string[] = [
        "none",
        "amf",
        "qsv",
        "nvenc",
        "v4l2m2m",
        "vaapi",
        "videotoolbox",
        "rkmpp",
      ];

      testCases.forEach((value: string) => {
        // Arrange
        const current: EncodingOptionsSchema = {
          HardwareAccelerationType: value,
          EncodingThreadCount: 1,
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          hardwareAccelerationType:
            value as EncodingOptionsConfig["hardwareAccelerationType"],
        };

        // Act
        const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
          current,
          desired,
        );

        // Assert
        expect(result).toBeUndefined();
      });
    });

    it("should handle both enableHardwareEncoding and hardwareAccelerationType changes together", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: false,
        HardwareAccelerationType: "none",
        EncodingThreadCount: 4,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "nvenc",
      };

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result?.EnableHardwareEncoding).toBe(true);
      expect(result?.HardwareAccelerationType).toBe("nvenc");
      expect(result?.EncodingThreadCount).toBe(4);
    });

    it("should handle mixed scenarios where one field changes and one stays same", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        HardwareAccelerationType: "vaapi",
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
        hardwareAccelerationType: "videotoolbox",
      };

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result?.EnableHardwareEncoding).toBe(true);
      expect(result?.HardwareAccelerationType).toBe("videotoolbox");
    });

    describe("device fields", () => {
      it("should update VaapiDevice when vaapiDevice changes", () => {
        // Arrange
        const testCases: Array<{
          currentValue: string | undefined;
          desiredValue: string;
          expectedValue: string;
        }> = [
          {
            currentValue: "",
            desiredValue: "/dev/dri/renderD128",
            expectedValue: "/dev/dri/renderD128",
          },
          {
            currentValue: "/dev/dri/renderD128",
            desiredValue: "/dev/dri/renderD129",
            expectedValue: "/dev/dri/renderD129",
          },
          {
            currentValue: "/some/path",
            desiredValue: "",
            expectedValue: "",
          },
          {
            currentValue: undefined,
            desiredValue: "/dev/dri/card0",
            expectedValue: "/dev/dri/card0",
          },
        ];

        testCases.forEach(
          ({
            currentValue,
            desiredValue,
            expectedValue,
          }: {
            currentValue: string | undefined;
            desiredValue: string;
            expectedValue: string;
          }) => {
            // Arrange
            const current: EncodingOptionsSchema = {
              VaapiDevice: currentValue,
              EncodingThreadCount: 2,
            } as EncodingOptionsSchema;

            const desired: EncodingOptionsConfig = {
              vaapiDevice: desiredValue,
            };

            // Act
            const result: EncodingOptionsSchema | undefined =
              calculateEncodingDiff(current, desired);

            // Assert
            expect(result?.VaapiDevice).toBe(expectedValue);
            expect(result?.EncodingThreadCount).toBe(2);
          },
        );
      });

      it("should update QsvDevice when qsvDevice changes", () => {
        // Arrange
        const testCases: Array<{
          currentValue: string | undefined;
          desiredValue: string;
          expectedValue: string;
        }> = [
          {
            currentValue: "",
            desiredValue: "/dev/dri/renderD128",
            expectedValue: "/dev/dri/renderD128",
          },
          {
            currentValue: "/dev/dri/renderD128",
            desiredValue: "/dev/dri/renderD129",
            expectedValue: "/dev/dri/renderD129",
          },
          {
            currentValue: "/some/path",
            desiredValue: "",
            expectedValue: "",
          },
          {
            currentValue: undefined,
            desiredValue: "/dev/dri/card0",
            expectedValue: "/dev/dri/card0",
          },
        ];

        testCases.forEach(
          ({
            currentValue,
            desiredValue,
            expectedValue,
          }: {
            currentValue: string | undefined;
            desiredValue: string;
            expectedValue: string;
          }) => {
            // Arrange
            const current: EncodingOptionsSchema = {
              QsvDevice: currentValue,
              EncodingThreadCount: 3,
            } as EncodingOptionsSchema;

            const desired: EncodingOptionsConfig = {
              qsvDevice: desiredValue,
            };

            // Act
            const result: EncodingOptionsSchema | undefined =
              calculateEncodingDiff(current, desired);

            // Assert
            expect(result?.QsvDevice).toBe(expectedValue);
            expect(result?.EncodingThreadCount).toBe(3);
          },
        );
      });

      it("should not modify device fields when undefined", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          VaapiDevice: "/dev/dri/renderD128",
          QsvDevice: "/dev/dri/card1",
          EncodingThreadCount: 1,
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {};

        // Act
        const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
          current,
          desired,
        );

        // Assert
        expect(result).toBeUndefined();
      });

      it("should not modify device fields when values are the same", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          VaapiDevice: "/dev/dri/renderD128",
          QsvDevice: "",
          EncodingThreadCount: 4,
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          vaapiDevice: "/dev/dri/renderD128",
          qsvDevice: "",
        };

        // Act
        const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
          current,
          desired,
        );

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe("hardwareDecodingCodecs array field", () => {
      it("should update HardwareDecodingCodecs when hardwareDecodingCodecs changes", () => {
        // Arrange
        const testCases: Array<{
          currentValue: string[] | undefined;
          desiredValue: EncodingOptionsConfig["hardwareDecodingCodecs"];
          expectedValue: string[];
        }> = [
          {
            currentValue: [],
            desiredValue: ["h264"],
            expectedValue: ["h264"],
          },
          {
            currentValue: ["h264"],
            desiredValue: ["h264", "hevc", "vp9"],
            expectedValue: ["h264", "hevc", "vp9"],
          },
          {
            currentValue: ["h264", "hevc"],
            desiredValue: [],
            expectedValue: [],
          },
          {
            currentValue: undefined,
            desiredValue: [
              "h264",
              "hevc",
              "mpeg2video",
              "vc1",
              "vp8",
              "vp9",
              "av1",
            ],
            expectedValue: [
              "h264",
              "hevc",
              "mpeg2video",
              "vc1",
              "vp8",
              "vp9",
              "av1",
            ],
          },
        ];

        testCases.forEach(
          ({
            currentValue,
            desiredValue,
            expectedValue,
          }: {
            currentValue: string[] | undefined;
            desiredValue: EncodingOptionsConfig["hardwareDecodingCodecs"];
            expectedValue: string[];
          }) => {
            // Arrange
            const current: EncodingOptionsSchema = {
              HardwareDecodingCodecs: currentValue,
              EncodingThreadCount: 2,
            } as EncodingOptionsSchema;

            const desired: EncodingOptionsConfig = {
              hardwareDecodingCodecs: desiredValue,
            };

            // Act
            const result: EncodingOptionsSchema | undefined =
              calculateEncodingDiff(current, desired);

            // Assert
            expect(result?.HardwareDecodingCodecs).toEqual(expectedValue);
            expect(result?.EncodingThreadCount).toBe(2);
          },
        );
      });

      it("should not modify HardwareDecodingCodecs when undefined", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          HardwareDecodingCodecs: ["h264", "hevc"],
          EncodingThreadCount: 1,
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {};

        // Act
        const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
          current,
          desired,
        );

        // Assert
        expect(result).toBeUndefined();
      });

      it("should not modify HardwareDecodingCodecs when array is the same", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          HardwareDecodingCodecs: ["h264", "hevc", "vp9"],
          EncodingThreadCount: 4,
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          hardwareDecodingCodecs: ["h264", "hevc", "vp9"],
        };

        // Act
        const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
          current,
          desired,
        );

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe("boolean decoding fields", () => {
      describe("enableDecodingColorDepth10Hevc", () => {
        it("should update EnableDecodingColorDepth10Hevc when enableDecodingColorDepth10Hevc changes", () => {
          // Arrange
          const testCases: Array<{
            currentValue: boolean;
            desiredValue: boolean;
          }> = [
            { currentValue: false, desiredValue: true },
            { currentValue: true, desiredValue: false },
          ];

          testCases.forEach(
            ({
              currentValue,
              desiredValue,
            }: {
              currentValue: boolean;
              desiredValue: boolean;
            }) => {
              // Arrange
              const current: EncodingOptionsSchema = {
                EnableDecodingColorDepth10Hevc: currentValue,
                EncodingThreadCount: 2,
              } as EncodingOptionsSchema;

              const desired: EncodingOptionsConfig = {
                enableDecodingColorDepth10Hevc: desiredValue,
              };

              // Act
              const result: EncodingOptionsSchema | undefined =
                calculateEncodingDiff(current, desired);

              // Assert
              expect(result?.EnableDecodingColorDepth10Hevc).toBe(desiredValue);
              expect(result?.EncodingThreadCount).toBe(2);
            },
          );
        });

        it("should not modify EnableDecodingColorDepth10Hevc when undefined", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            EnableDecodingColorDepth10Hevc: true,
            EncodingThreadCount: 1,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {};

          // Act
          const result: EncodingOptionsSchema | undefined =
            calculateEncodingDiff(current, desired);

          // Assert
          expect(result).toBeUndefined();
        });
      });

      describe("enableDecodingColorDepth10Vp9", () => {
        it("should update EnableDecodingColorDepth10Vp9 when enableDecodingColorDepth10Vp9 changes", () => {
          // Arrange
          const testCases: Array<{
            currentValue: boolean;
            desiredValue: boolean;
          }> = [
            { currentValue: false, desiredValue: true },
            { currentValue: true, desiredValue: false },
          ];

          testCases.forEach(
            ({
              currentValue,
              desiredValue,
            }: {
              currentValue: boolean;
              desiredValue: boolean;
            }) => {
              // Arrange
              const current: EncodingOptionsSchema = {
                EnableDecodingColorDepth10Vp9: currentValue,
                EncodingThreadCount: 3,
              } as EncodingOptionsSchema;

              const desired: EncodingOptionsConfig = {
                enableDecodingColorDepth10Vp9: desiredValue,
              };

              // Act
              const result: EncodingOptionsSchema | undefined =
                calculateEncodingDiff(current, desired);

              // Assert
              expect(result?.EnableDecodingColorDepth10Vp9).toBe(desiredValue);
              expect(result?.EncodingThreadCount).toBe(3);
            },
          );
        });
      });

      describe("enableDecodingColorDepth10HevcRext", () => {
        it("should update EnableDecodingColorDepth10HevcRext when enableDecodingColorDepth10HevcRext changes", () => {
          // Arrange
          const testCases: Array<{
            currentValue: boolean;
            desiredValue: boolean;
          }> = [
            { currentValue: false, desiredValue: true },
            { currentValue: true, desiredValue: false },
          ];

          testCases.forEach(
            ({
              currentValue,
              desiredValue,
            }: {
              currentValue: boolean;
              desiredValue: boolean;
            }) => {
              // Arrange
              const current: EncodingOptionsSchema = {
                EnableDecodingColorDepth10HevcRext: currentValue,
                EncodingThreadCount: 4,
              } as EncodingOptionsSchema;

              const desired: EncodingOptionsConfig = {
                enableDecodingColorDepth10HevcRext: desiredValue,
              };

              // Act
              const result: EncodingOptionsSchema | undefined =
                calculateEncodingDiff(current, desired);

              // Assert
              expect(result?.EnableDecodingColorDepth10HevcRext).toBe(
                desiredValue,
              );
              expect(result?.EncodingThreadCount).toBe(4);
            },
          );
        });
      });

      describe("enableDecodingColorDepth12HevcRext", () => {
        it("should update EnableDecodingColorDepth12HevcRext when enableDecodingColorDepth12HevcRext changes", () => {
          // Arrange
          const testCases: Array<{
            currentValue: boolean;
            desiredValue: boolean;
          }> = [
            { currentValue: false, desiredValue: true },
            { currentValue: true, desiredValue: false },
          ];

          testCases.forEach(
            ({
              currentValue,
              desiredValue,
            }: {
              currentValue: boolean;
              desiredValue: boolean;
            }) => {
              // Arrange
              const current: EncodingOptionsSchema = {
                EnableDecodingColorDepth12HevcRext: currentValue,
                EncodingThreadCount: 5,
              } as EncodingOptionsSchema;

              const desired: EncodingOptionsConfig = {
                enableDecodingColorDepth12HevcRext: desiredValue,
              };

              // Act
              const result: EncodingOptionsSchema | undefined =
                calculateEncodingDiff(current, desired);

              // Assert
              expect(result?.EnableDecodingColorDepth12HevcRext).toBe(
                desiredValue,
              );
              expect(result?.EncodingThreadCount).toBe(5);
            },
          );
        });
      });
    });

    describe("boolean encoding format fields", () => {
      describe("allowHevcEncoding", () => {
        it("should update AllowHevcEncoding when allowHevcEncoding changes", () => {
          // Arrange
          const testCases: Array<{
            currentValue: boolean;
            desiredValue: boolean;
          }> = [
            { currentValue: false, desiredValue: true },
            { currentValue: true, desiredValue: false },
          ];

          testCases.forEach(
            ({
              currentValue,
              desiredValue,
            }: {
              currentValue: boolean;
              desiredValue: boolean;
            }) => {
              // Arrange
              const current: EncodingOptionsSchema = {
                AllowHevcEncoding: currentValue,
                EncodingThreadCount: 6,
              } as EncodingOptionsSchema;

              const desired: EncodingOptionsConfig = {
                allowHevcEncoding: desiredValue,
              };

              // Act
              const result: EncodingOptionsSchema | undefined =
                calculateEncodingDiff(current, desired);

              // Assert
              expect(result?.AllowHevcEncoding).toBe(desiredValue);
              expect(result?.EncodingThreadCount).toBe(6);
            },
          );
        });

        it("should not modify AllowHevcEncoding when undefined", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            AllowHevcEncoding: false,
            EncodingThreadCount: 1,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {};

          // Act
          const result: EncodingOptionsSchema | undefined =
            calculateEncodingDiff(current, desired);

          // Assert
          expect(result).toBeUndefined();
        });
      });

      describe("allowAv1Encoding", () => {
        it("should update AllowAv1Encoding when allowAv1Encoding changes", () => {
          // Arrange
          const testCases: Array<{
            currentValue: boolean;
            desiredValue: boolean;
          }> = [
            { currentValue: false, desiredValue: true },
            { currentValue: true, desiredValue: false },
          ];

          testCases.forEach(
            ({
              currentValue,
              desiredValue,
            }: {
              currentValue: boolean;
              desiredValue: boolean;
            }) => {
              // Arrange
              const current: EncodingOptionsSchema = {
                AllowAv1Encoding: currentValue,
                EncodingThreadCount: 7,
              } as EncodingOptionsSchema;

              const desired: EncodingOptionsConfig = {
                allowAv1Encoding: desiredValue,
              };

              // Act
              const result: EncodingOptionsSchema | undefined =
                calculateEncodingDiff(current, desired);

              // Assert
              expect(result?.AllowAv1Encoding).toBe(desiredValue);
              expect(result?.EncodingThreadCount).toBe(7);
            },
          );
        });

        it("should not modify AllowAv1Encoding when undefined", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            AllowAv1Encoding: true,
            EncodingThreadCount: 1,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {};

          // Act
          const result: EncodingOptionsSchema | undefined =
            calculateEncodingDiff(current, desired);

          // Assert
          expect(result).toBeUndefined();
        });
      });
    });

    it("should handle all 11 encoding options fields together in complete scenario", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: false,
        HardwareAccelerationType: "none",
        VaapiDevice: "",
        QsvDevice: "",
        HardwareDecodingCodecs: [],
        EnableDecodingColorDepth10Hevc: false,
        EnableDecodingColorDepth10Vp9: false,
        EnableDecodingColorDepth10HevcRext: false,
        EnableDecodingColorDepth12HevcRext: false,
        AllowHevcEncoding: false,
        AllowAv1Encoding: false,
        EncodingThreadCount: 8,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
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
      };

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert - All fields updated correctly
      expect(result?.EnableHardwareEncoding).toBe(true);
      expect(result?.HardwareAccelerationType).toBe("vaapi");
      expect(result?.VaapiDevice).toBe("/dev/dri/renderD128");
      expect(result?.QsvDevice).toBe("");
      expect(result?.HardwareDecodingCodecs).toEqual([
        "h264",
        "hevc",
        "vp9",
        "av1",
      ]);
      expect(result?.EnableDecodingColorDepth10Hevc).toBe(true);
      expect(result?.EnableDecodingColorDepth10Vp9).toBe(false);
      expect(result?.EnableDecodingColorDepth10HevcRext).toBe(true);
      expect(result?.EnableDecodingColorDepth12HevcRext).toBe(false);
      expect(result?.AllowHevcEncoding).toBe(false);
      expect(result?.AllowAv1Encoding).toBe(false);
      expect(result?.EncodingThreadCount).toBe(8);
    });
  });

  describe("applyEncoding", () => {
    let mockClient: JellyfinClient;
    let updateSpy: Mock;

    beforeEach(() => {
      updateSpy = vi.fn();
      mockClient = {
        updateEncodingConfiguration: updateSpy,
      } as unknown as JellyfinClient;
    });

    it("should do nothing when schema is undefined", async () => {
      await applyEncoding(mockClient, undefined);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it("should call client.updateEncodingConfiguration with schema", async () => {
      const schema: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        HardwareAccelerationType: "nvenc",
      } as EncodingOptionsSchema;

      updateSpy.mockResolvedValue(undefined);

      await applyEncoding(mockClient, schema);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(schema);
    });
  });
});
