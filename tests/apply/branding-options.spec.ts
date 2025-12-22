import { describe, it, expect, vi, type Mock } from "vitest";
import {
  calculateBrandingOptionsDiff,
  applyBrandingOptions,
} from "../../src/apply/branding-options";
import type { BrandingOptionsDtoSchema } from "../../src/types/schema/branding-options";
import type { BrandingOptionsConfig } from "../../src/types/config/branding-options";
import type { JellyfinClient } from "../../src/api/jellyfin.types";

describe("calculateBrandingOptionsDiff", () => {
  it("should return undefined when no changes", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Welcome",
      CustomCss: "body {}",
      SplashscreenEnabled: true,
    };
    const desired: BrandingOptionsConfig = {};

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeUndefined();
  });

  it("should return schema when loginDisclaimer changes", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Old message",
      CustomCss: "body {}",
      SplashscreenEnabled: true,
    };
    const desired: BrandingOptionsConfig = {
      loginDisclaimer: "New message",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("New message");
    expect(result?.CustomCss).toBe("body {}");
    expect(result?.SplashscreenEnabled).toBe(true);
  });

  it("should return schema when customCss changes", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Welcome",
      CustomCss: "old css",
      SplashscreenEnabled: false,
    };
    const desired: BrandingOptionsConfig = {
      customCss: "new css",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("Welcome");
    expect(result?.CustomCss).toBe("new css");
    expect(result?.SplashscreenEnabled).toBe(false);
  });

  it("should return schema when splashscreenEnabled changes", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Welcome",
      CustomCss: "body {}",
      SplashscreenEnabled: false,
    };
    const desired: BrandingOptionsConfig = {
      splashscreenEnabled: true,
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("Welcome");
    expect(result?.CustomCss).toBe("body {}");
    expect(result?.SplashscreenEnabled).toBe(true);
  });

  it("should handle null loginDisclaimer from server", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: null,
      CustomCss: "css",
      SplashscreenEnabled: true,
    };
    const desired: BrandingOptionsConfig = {
      loginDisclaimer: "New message",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("New message");
  });

  it("should handle undefined loginDisclaimer from server", () => {
    const current: BrandingOptionsDtoSchema = {
      CustomCss: "css",
      SplashscreenEnabled: true,
    };
    const desired: BrandingOptionsConfig = {
      loginDisclaimer: "New message",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("New message");
  });

  it("should handle null customCss from server", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Welcome",
      CustomCss: null,
      SplashscreenEnabled: false,
    };
    const desired: BrandingOptionsConfig = {
      customCss: "new css",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.CustomCss).toBe("new css");
  });

  it("should handle undefined splashscreenEnabled from server", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Welcome",
      CustomCss: "css",
    };
    const desired: BrandingOptionsConfig = {
      splashscreenEnabled: true,
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.SplashscreenEnabled).toBe(true);
  });

  it("should detect change when setting empty string to null", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: null,
      CustomCss: null,
      SplashscreenEnabled: false,
    };
    const desired: BrandingOptionsConfig = {
      loginDisclaimer: "",
      customCss: "",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("");
    expect(result?.CustomCss).toBe("");
  });

  it("should handle multiple changes", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Old",
      CustomCss: "old css",
      SplashscreenEnabled: false,
    };
    const desired: BrandingOptionsConfig = {
      loginDisclaimer: "New",
      customCss: "new css",
      splashscreenEnabled: true,
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("New");
    expect(result?.CustomCss).toBe("new css");
    expect(result?.SplashscreenEnabled).toBe(true);
  });

  it("should preserve unspecified fields", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Keep this",
      CustomCss: "Keep this too",
      SplashscreenEnabled: false,
    };
    const desired: BrandingOptionsConfig = {
      splashscreenEnabled: true,
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("Keep this");
    expect(result?.CustomCss).toBe("Keep this too");
    expect(result?.SplashscreenEnabled).toBe(true);
  });

  it("should handle setting value to empty string", () => {
    const current: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Something",
      CustomCss: "css",
      SplashscreenEnabled: true,
    };
    const desired: BrandingOptionsConfig = {
      loginDisclaimer: "",
      customCss: "",
    };

    const result: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(current, desired);

    expect(result).toBeDefined();
    expect(result?.LoginDisclaimer).toBe("");
    expect(result?.CustomCss).toBe("");
  });
});

describe("applyBrandingOptions", () => {
  it("should do nothing when schema is undefined", async () => {
    const updateSpy: Mock = vi.fn().mockResolvedValue(undefined);
    const mockClient: JellyfinClient = {
      updateBrandingConfiguration: updateSpy,
    } as unknown as JellyfinClient;

    await applyBrandingOptions(mockClient, undefined);

    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("should call updateBrandingConfiguration with schema", async () => {
    const updateSpy: Mock = vi.fn().mockResolvedValue(undefined);
    const mockClient: JellyfinClient = {
      updateBrandingConfiguration: updateSpy,
    } as unknown as JellyfinClient;

    const schema: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Test",
      CustomCss: "css",
      SplashscreenEnabled: true,
    };

    await applyBrandingOptions(mockClient, schema);

    expect(updateSpy).toHaveBeenCalledWith(schema);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors from updateBrandingConfiguration", async () => {
    const updateSpy: Mock = vi.fn().mockRejectedValue(new Error("API Error"));
    const mockClient: JellyfinClient = {
      updateBrandingConfiguration: updateSpy,
    } as unknown as JellyfinClient;

    const schema: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Test",
      CustomCss: "css",
      SplashscreenEnabled: true,
    };

    await expect(applyBrandingOptions(mockClient, schema)).rejects.toThrow(
      "API Error",
    );
  });
});
