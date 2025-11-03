import { describe, it, expect } from "vitest";
import { deepEqual } from "fast-equals";

describe("lib/deep-equality", () => {
  describe("deepEqual vs JSON.stringify", () => {
    it("should handle objects with different property order correctly", () => {
      // Arrange
      const obj1: { a: number; b: number; c: number } = { a: 1, b: 2, c: 3 };
      const obj2: { c: number; b: number; a: number } = { c: 3, b: 2, a: 1 };

      // Act & Assert
      // deep equality should correctly identify these as equal
      expect(deepEqual(obj1, obj2)).toBe(true);

      // JSON.stringify would incorrectly identify these as different
      expect(JSON.stringify(obj1) === JSON.stringify(obj2)).toBe(false);
    });

    it("should handle undefined values correctly", () => {
      // Arrange
      const obj1: { a: number; b: undefined } = { a: 1, b: undefined };
      const obj2: { a: number; b: undefined } = { a: 1, b: undefined };

      // Act & Assert
      // deep equality should correctly handle undefined
      expect(deepEqual(obj1, obj2)).toBe(true);

      // JSON.stringify would not serialize undefined values at all
      expect(JSON.stringify(obj1) === JSON.stringify(obj2)).toBe(true);

      // But JSON.stringify would miss differences involving undefined
      const obj3: { a: number } = { a: 1 };
      expect(deepEqual(obj1, obj3)).toBe(false);
      expect(JSON.stringify(obj1) === JSON.stringify(obj3)).toBe(true); // false positive!
    });

    it("should handle nested objects correctly", () => {
      // Arrange
      const obj1: {
        system: { enableMetrics: boolean };
        encoding: { enableHardwareEncoding: boolean };
      } = {
        system: { enableMetrics: true },
        encoding: { enableHardwareEncoding: false },
      };
      const obj2: {
        encoding: { enableHardwareEncoding: boolean };
        system: { enableMetrics: boolean };
      } = {
        encoding: { enableHardwareEncoding: false },
        system: { enableMetrics: true },
      };

      // Act & Assert
      expect(deepEqual(obj1, obj2)).toBe(true);
      expect(JSON.stringify(obj1) === JSON.stringify(obj2)).toBe(false);
    });

    it("should handle Date objects correctly", () => {
      // Arrange
      const date: Date = new Date("2024-01-01");
      const obj1: { timestamp: Date } = { timestamp: date };
      const obj2: { timestamp: Date } = { timestamp: new Date("2024-01-01") };

      // Act & Assert
      expect(deepEqual(obj1, obj2)).toBe(true);
      expect(JSON.stringify(obj1) === JSON.stringify(obj2)).toBe(true); // works but converts to string

      // But deepEqual preserves type information
      const obj3: { timestamp: string } = {
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      expect(deepEqual(obj1, obj3)).toBe(false); // correctly different types
      expect(JSON.stringify(obj1) === JSON.stringify(obj3)).toBe(true); // false positive!
    });
  });
});
