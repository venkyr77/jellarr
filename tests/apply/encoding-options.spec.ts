import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { applyEncoding } from "../../src/apply/encoding-options";
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

  describe("applyEncoding", () => {
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
      const result: EncodingOptionsSchema = applyEncoding(current, desired);

      // Assert
      expect(result.EnableHardwareEncoding).toBe(true);
      expect(result.EncodingThreadCount).toBe(-1); // Should preserve other fields
      expect(result.TranscodingTempPath).toBe("/tmp"); // Should preserve other fields
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
      const result: EncodingOptionsSchema = applyEncoding(current, desired);

      // Assert
      expect(result.EnableHardwareEncoding).toBe(false);
      expect(result.EncodingThreadCount).toBe(4); // Should preserve other fields
    });

    it("should not modify EnableHardwareEncoding when enableHardwareEncoding is undefined", () => {
      // Arrange
      const current: EncodingOptionsSchema = {
        EnableHardwareEncoding: true,
        EncodingThreadCount: 2,
      } as EncodingOptionsSchema;

      const desired: EncodingOptionsConfig = {};

      // Act
      const result: EncodingOptionsSchema = applyEncoding(current, desired);

      // Assert
      expect(result.EnableHardwareEncoding).toBe(true); // Should remain unchanged
      expect(result.EncodingThreadCount).toBe(2); // Should preserve other fields
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
      const result: EncodingOptionsSchema = applyEncoding(current, desired);

      // Assert
      expect(result.EnableHardwareEncoding).toBe(true);
      expect(result.EncodingThreadCount).toBe(1); // Should preserve other fields
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
      applyEncoding(current, desired);

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
      applyEncoding(current, desired);

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
      applyEncoding(current, desired);

      // Assert
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });
});
