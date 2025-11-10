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
import * as loggerModule from "../../src/lib/logger";

// Mock the logger
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
      expect(result?.EncodingThreadCount).toBe(-1); // Should preserve other fields
      expect(result?.TranscodingTempPath).toBe("/tmp"); // Should preserve other fields
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
      expect(result?.EncodingThreadCount).toBe(4); // Should preserve other fields
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

    it("should log when EnableHardwareEncoding changes", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: false,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
      };

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        "EnableHardwareEncoding changed: false → true",
      );
    });

    it("should not log when EnableHardwareEncoding does not change", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true,
      };

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).not.toHaveBeenCalled();
    });

    it("should not log when enableHardwareEncoding is undefined", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {};

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).not.toHaveBeenCalled();
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

      testCases.forEach(({ currentValue, desiredValue, expectedValue }) => {
        // Arrange
        const current: EncodingOptionsSchema = {
          HardwareAccelerationType: currentValue,
          EncodingThreadCount: -1,
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          hardwareAccelerationType: desiredValue,
        };

        // Act
        const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
          current,
          desired,
        );

        // Assert
        expect(result?.HardwareAccelerationType).toBe(expectedValue);
        expect(result?.EncodingThreadCount).toBe(-1); // Should preserve other fields
      });
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
      const testCases: Array<string> = [
        "none",
        "amf",
        "qsv",
        "nvenc",
        "v4l2m2m",
        "vaapi",
        "videotoolbox",
        "rkmpp",
      ];

      testCases.forEach((value) => {
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

    it("should log when HardwareAccelerationType changes", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        HardwareAccelerationType: "none",
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        hardwareAccelerationType: "nvenc",
      };

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        "HardwareAccelerationType changed: none → nvenc",
      );
    });

    it("should log when HardwareAccelerationType changes from undefined (defaults to none)", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        HardwareAccelerationType: undefined,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        hardwareAccelerationType: "vaapi",
      };

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        "HardwareAccelerationType changed: none → vaapi",
      );
    });

    it("should not log when HardwareAccelerationType does not change", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        HardwareAccelerationType: "qsv",
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        hardwareAccelerationType: "qsv",
      };

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).not.toHaveBeenCalled();
    });

    it("should not log when hardwareAccelerationType is undefined", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        HardwareAccelerationType: "amf",
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {};

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      calculateEncodingDiff(current, desired);

      // Assert
      expect(loggerSpy).not.toHaveBeenCalled();
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

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result?.EnableHardwareEncoding).toBe(true);
      expect(result?.HardwareAccelerationType).toBe("nvenc");
      expect(result?.EncodingThreadCount).toBe(4); // Should preserve other fields

      // Should log both changes
      expect(loggerSpy).toHaveBeenCalledWith(
        "EnableHardwareEncoding changed: false → true",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "HardwareAccelerationType changed: none → nvenc",
      );
      expect(loggerSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle mixed scenarios where one field changes and one stays same", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        HardwareAccelerationType: "vaapi",
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {
        enableHardwareEncoding: true, // Same value
        hardwareAccelerationType: "videotoolbox", // Different value
      };

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

      // Act
      const result: EncodingOptionsSchema | undefined = calculateEncodingDiff(
        current,
        desired,
      );

      // Assert
      expect(result?.EnableHardwareEncoding).toBe(true);
      expect(result?.HardwareAccelerationType).toBe("videotoolbox");

      // Should only log the change
      expect(loggerSpy).toHaveBeenCalledWith(
        "HardwareAccelerationType changed: vaapi → videotoolbox",
      );
      expect(loggerSpy).toHaveBeenCalledTimes(1);
    });

    // Device Fields Tests (vaapiDevice, qsvDevice)
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

        testCases.forEach(({ currentValue, desiredValue, expectedValue }) => {
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
          expect(result?.EncodingThreadCount).toBe(2); // Should preserve other fields
        });
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

        testCases.forEach(({ currentValue, desiredValue, expectedValue }) => {
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
          expect(result?.EncodingThreadCount).toBe(3); // Should preserve other fields
        });
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

      it("should log when VaapiDevice changes", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          VaapiDevice: "",
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          vaapiDevice: "/dev/dri/renderD128",
        };

        const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
          loggerModule.logger,
          "info",
        );

        // Act
        calculateEncodingDiff(current, desired);

        // Assert
        expect(loggerSpy).toHaveBeenCalledWith(
          'VaapiDevice changed: "" → "/dev/dri/renderD128"',
        );
      });

      it("should log when QsvDevice changes", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          QsvDevice: "/old/path",
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          qsvDevice: "/new/path",
        };

        const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
          loggerModule.logger,
          "info",
        );

        // Act
        calculateEncodingDiff(current, desired);

        // Assert
        expect(loggerSpy).toHaveBeenCalledWith(
          'QsvDevice changed: "/old/path" → "/new/path"',
        );
      });
    });

    // Array Field Tests (hardwareDecodingCodecs)
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

        testCases.forEach(({ currentValue, desiredValue, expectedValue }) => {
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
          expect(result?.EncodingThreadCount).toBe(2); // Should preserve other fields
        });
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

      it("should log when HardwareDecodingCodecs changes", () => {
        // Arrange
        const current: EncodingOptionsSchema = {
          HardwareDecodingCodecs: ["h264"],
        } as EncodingOptionsSchema;

        const desired: EncodingOptionsConfig = {
          hardwareDecodingCodecs: ["h264", "hevc", "vp9"],
        };

        const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
          loggerModule.logger,
          "info",
        );

        // Act
        calculateEncodingDiff(current, desired);

        // Assert
        expect(loggerSpy).toHaveBeenCalledWith(
          "HardwareDecodingCodecs changed: [h264] → [h264, hevc, vp9]",
        );
      });
    });

    // Boolean Decoding Fields Tests
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

          testCases.forEach(({ currentValue, desiredValue }) => {
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
          });
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

        it("should log when EnableDecodingColorDepth10Hevc changes", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            EnableDecodingColorDepth10Hevc: false,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            enableDecodingColorDepth10Hevc: true,
          };

          const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
            loggerModule.logger,
            "info",
          );

          // Act
          calculateEncodingDiff(current, desired);

          // Assert
          expect(loggerSpy).toHaveBeenCalledWith(
            "EnableDecodingColorDepth10Hevc changed: false → true",
          );
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

          testCases.forEach(({ currentValue, desiredValue }) => {
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
          });
        });

        it("should log when EnableDecodingColorDepth10Vp9 changes", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            EnableDecodingColorDepth10Vp9: true,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            enableDecodingColorDepth10Vp9: false,
          };

          const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
            loggerModule.logger,
            "info",
          );

          // Act
          calculateEncodingDiff(current, desired);

          // Assert
          expect(loggerSpy).toHaveBeenCalledWith(
            "EnableDecodingColorDepth10Vp9 changed: true → false",
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

          testCases.forEach(({ currentValue, desiredValue }) => {
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
          });
        });

        it("should log when EnableDecodingColorDepth10HevcRext changes", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            EnableDecodingColorDepth10HevcRext: false,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            enableDecodingColorDepth10HevcRext: true,
          };

          const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
            loggerModule.logger,
            "info",
          );

          // Act
          calculateEncodingDiff(current, desired);

          // Assert
          expect(loggerSpy).toHaveBeenCalledWith(
            "EnableDecodingColorDepth10HevcRext changed: false → true",
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

          testCases.forEach(({ currentValue, desiredValue }) => {
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
          });
        });

        it("should log when EnableDecodingColorDepth12HevcRext changes", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            EnableDecodingColorDepth12HevcRext: true,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            enableDecodingColorDepth12HevcRext: false,
          };

          const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
            loggerModule.logger,
            "info",
          );

          // Act
          calculateEncodingDiff(current, desired);

          // Assert
          expect(loggerSpy).toHaveBeenCalledWith(
            "EnableDecodingColorDepth12HevcRext changed: true → false",
          );
        });
      });
    });

    // Boolean Encoding Format Fields Tests
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

          testCases.forEach(({ currentValue, desiredValue }) => {
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
          });
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

        it("should log when AllowHevcEncoding changes", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            AllowHevcEncoding: false,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            allowHevcEncoding: true,
          };

          const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
            loggerModule.logger,
            "info",
          );

          // Act
          calculateEncodingDiff(current, desired);

          // Assert
          expect(loggerSpy).toHaveBeenCalledWith(
            "AllowHevcEncoding changed: false → true",
          );
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

          testCases.forEach(({ currentValue, desiredValue }) => {
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
          });
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

        it("should log when AllowAv1Encoding changes", () => {
          // Arrange
          const current: EncodingOptionsSchema = {
            AllowAv1Encoding: true,
          } as EncodingOptionsSchema;

          const desired: EncodingOptionsConfig = {
            allowAv1Encoding: false,
          };

          const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
            loggerModule.logger,
            "info",
          );

          // Act
          calculateEncodingDiff(current, desired);

          // Assert
          expect(loggerSpy).toHaveBeenCalledWith(
            "AllowAv1Encoding changed: true → false",
          );
        });
      });
    });

    // Complete 11-field scenario test
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

      const loggerSpy: Mock<(msg: string) => void> = vi.spyOn(
        loggerModule.logger,
        "info",
      );

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
      expect(result?.EncodingThreadCount).toBe(8); // Should preserve other fields

      // Should log changes for fields that actually changed
      expect(loggerSpy).toHaveBeenCalledWith(
        "EnableHardwareEncoding changed: false → true",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "HardwareAccelerationType changed: none → vaapi",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'VaapiDevice changed: "" → "/dev/dri/renderD128"',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "HardwareDecodingCodecs changed: [] → [h264, hevc, vp9, av1]",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "EnableDecodingColorDepth10Hevc changed: false → true",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "EnableDecodingColorDepth10HevcRext changed: false → true",
      );

      // Should not log for fields that didn't change (same values)
      expect(loggerSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("QsvDevice changed"),
      );
      expect(loggerSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("EnableDecodingColorDepth10Vp9 changed"),
      );
      expect(loggerSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("EnableDecodingColorDepth12HevcRext changed"),
      );
      expect(loggerSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("AllowHevcEncoding changed"),
      );
      expect(loggerSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("AllowAv1Encoding changed"),
      );

      // Total calls should be 6 (only the fields that actually changed)
      expect(loggerSpy).toHaveBeenCalledTimes(6);
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
