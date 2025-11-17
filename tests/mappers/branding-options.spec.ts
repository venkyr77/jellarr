import { describe, it, expect } from "vitest";
import { mapBrandingOptionsConfigToSchema } from "../../src/mappers/branding-options";
import type { BrandingOptionsConfig } from "../../src/types/config/branding-options";
import type { BrandingOptionsDtoSchema } from "../../src/types/schema/branding-options";

describe("mapBrandingOptionsConfigToSchema", () => {
  it("should map all fields when all are specified", () => {
    const config: BrandingOptionsConfig = {
      loginDisclaimer: "Welcome to the server",
      customCss: "@import url('style.css');",
      splashscreenEnabled: true,
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      LoginDisclaimer: "Welcome to the server",
      CustomCss: "@import url('style.css');",
      SplashscreenEnabled: true,
    });
  });

  it("should map only loginDisclaimer when specified", () => {
    const config: BrandingOptionsConfig = {
      loginDisclaimer: "Server message",
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      LoginDisclaimer: "Server message",
    });
  });

  it("should map only customCss when specified", () => {
    const config: BrandingOptionsConfig = {
      customCss: "body { color: red; }",
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      CustomCss: "body { color: red; }",
    });
  });

  it("should map only splashscreenEnabled when specified", () => {
    const config: BrandingOptionsConfig = {
      splashscreenEnabled: false,
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      SplashscreenEnabled: false,
    });
  });

  it("should return empty object when no fields are specified", () => {
    const config: BrandingOptionsConfig = {};

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({});
  });

  it("should handle undefined loginDisclaimer", () => {
    const config: BrandingOptionsConfig = {
      loginDisclaimer: undefined,
      customCss: "test",
      splashscreenEnabled: true,
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      CustomCss: "test",
      SplashscreenEnabled: true,
    });
  });

  it("should handle undefined customCss", () => {
    const config: BrandingOptionsConfig = {
      loginDisclaimer: "test",
      customCss: undefined,
      splashscreenEnabled: false,
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      LoginDisclaimer: "test",
      SplashscreenEnabled: false,
    });
  });

  it("should handle undefined splashscreenEnabled", () => {
    const config: BrandingOptionsConfig = {
      loginDisclaimer: "test",
      customCss: "css",
      splashscreenEnabled: undefined,
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      LoginDisclaimer: "test",
      CustomCss: "css",
    });
  });

  it("should handle empty strings", () => {
    const config: BrandingOptionsConfig = {
      loginDisclaimer: "",
      customCss: "",
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      LoginDisclaimer: "",
      CustomCss: "",
    });
  });

  it("should handle very long strings", () => {
    const longString: string = "a".repeat(10000);
    const config: BrandingOptionsConfig = {
      loginDisclaimer: longString,
      customCss: longString,
    };

    const result: Partial<BrandingOptionsDtoSchema> =
      mapBrandingOptionsConfigToSchema(config);

    expect(result).toEqual({
      LoginDisclaimer: longString,
      CustomCss: longString,
    });
  });
});
