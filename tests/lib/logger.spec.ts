import { describe, it, expect, vi, Mock } from "vitest";
import { logger } from "../../src/lib/logger";

describe("lib/logger", () => {
  it("whenInfoCalled_thenWritesToConsoleLog()", () => {
    // Arrange
    const spy: Mock = vi.spyOn(console, "log").mockImplementation(() => {});

    // Act
    logger.info("hello");

    // Assert
    expect(spy).toHaveBeenCalledWith("hello");

    spy.mockRestore();
  });

  it("whenWarnCalled_thenWritesToConsoleWarn()", () => {
    // Arrange
    const spy: Mock = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Act
    logger.warn("w");

    // Assert
    expect(spy).toHaveBeenCalledWith("w");

    spy.mockRestore();
  });

  it("whenErrorCalled_thenWritesToConsoleError()", () => {
    // Arrange
    const spy: Mock = vi.spyOn(console, "error").mockImplementation(() => {});

    // Act
    logger.error("e");

    // Assert
    expect(spy).toHaveBeenCalledWith("e");

    spy.mockRestore();
  });
});
