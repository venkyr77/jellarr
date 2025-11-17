import { describe, it, expect } from "vitest";
import {
  BrandingOptionsConfigType,
  type BrandingOptionsConfig,
} from "../../../src/types/config/branding-options";
import type { ZodSafeParseResult } from "zod";

describe("BrandingOptionsConfigType", () => {
  it("should accept valid branding configuration", () => {
    const validConfig: BrandingOptionsConfig = {
      loginDisclaimer: "Welcome to my server",
      customCss: "@import url('https://example.com/style.css');",
      splashscreenEnabled: true,
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should accept configuration with only loginDisclaimer", () => {
    const validConfig: BrandingOptionsConfig = {
      loginDisclaimer: "Server notice",
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should accept configuration with only customCss", () => {
    const validConfig: BrandingOptionsConfig = {
      customCss: "body { background: black; }",
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should accept configuration with only splashscreenEnabled", () => {
    const validConfig: BrandingOptionsConfig = {
      splashscreenEnabled: false,
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should accept empty configuration", () => {
    const validConfig: BrandingOptionsConfig = {};

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject configuration with invalid loginDisclaimer type", () => {
    const invalidConfig: unknown = {
      loginDisclaimer: 123,
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should reject configuration with invalid customCss type", () => {
    const invalidConfig: unknown = {
      customCss: true,
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should reject configuration with invalid splashscreenEnabled type", () => {
    const invalidConfig: unknown = {
      splashscreenEnabled: "yes",
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should reject configuration with unknown fields", () => {
    const invalidConfig: unknown = {
      loginDisclaimer: "Welcome",
      unknownField: "value",
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should handle long loginDisclaimer strings", () => {
    const validConfig: BrandingOptionsConfig = {
      loginDisclaimer: "a".repeat(10000),
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.loginDisclaimer).toHaveLength(10000);
    }
  });

  it("should handle multi-line CSS", () => {
    const validConfig: BrandingOptionsConfig = {
      customCss: `
        @import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");
        body {
          background: #000;
          color: #fff;
        }
      `,
    };

    const result: ZodSafeParseResult<BrandingOptionsConfig> =
      BrandingOptionsConfigType.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customCss).toContain("jellyskin");
    }
  });
});
