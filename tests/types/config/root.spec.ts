import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  RootConfigType,
  type RootConfig,
} from "../../../src/types/config/root";

describe("RootConfig", () => {
  it("should validate complete root config", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {
        enableMetrics: true,
        pluginRepositories: [
          {
            name: "Test Repository",
            url: "https://test.example.com/manifest.json",
            enabled: true,
          },
        ],
        trickplayOptions: {
          enableHwAcceleration: true,
        },
      },
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate root config with encoding section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
      encoding: {
        enableHardwareEncoding: true,
      },
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate root config without encoding section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate root config with library section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
      library: {
        virtualFolders: [
          {
            name: "test",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/test" }],
            },
          },
        ],
      },
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate complete root config with all sections", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {
        enableMetrics: true,
        pluginRepositories: [
          {
            name: "Test Repository",
            url: "https://test.example.com/manifest.json",
            enabled: true,
          },
        ],
        trickplayOptions: {
          enableHwAcceleration: true,
        },
      },
      encoding: {
        enableHardwareEncoding: true,
      },
      library: {
        virtualFolders: [
          {
            name: "movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/media/movies" }],
            },
          },
          {
            name: "tv shows",
            collectionType: "tvshows",
            libraryOptions: {
              pathInfos: [{ path: "/media/tv" }, { path: "/media/shows" }],
            },
          },
        ],
      },
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate root config without library section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate root config with library section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
      library: {
        virtualFolders: [
          {
            name: "Movies",
            collectionType: "movies",
            libraryOptions: {
              pathInfos: [{ path: "/mnt/movies" }],
            },
          },
        ],
      },
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.library).toBeDefined();
      expect(result.data.library?.virtualFolders).toHaveLength(1);
      expect(result.data.library?.virtualFolders?.[0].name).toBe("Movies");
    }
  });

  it("should validate root config with empty library section", () => {
    // Arrange
    const validConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://10.0.0.76:8096",
      system: {},
      library: {},
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.library).toBeDefined();
      expect(result.data.library?.virtualFolders).toBeUndefined();
    }
  });

  it("should reject invalid version", () => {
    // Arrange
    const invalidConfig: z.input<typeof RootConfigType> = {
      version: -1,
      base_url: "http://example.com",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const versionError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.path.includes("version"));
      expect(versionError?.message).toContain("positive integer");
    }
  });

  it("should reject invalid base_url", () => {
    // Arrange
    const invalidConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "not-a-url",
      system: {},
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const urlError: z.core.$ZodIssue | undefined = result.error.issues.find(
        (err) => err.path.includes("base_url"),
      );
      expect(urlError?.message).toContain("must be a valid URL");
    }
  });

  it("should reject missing required fields", () => {
    // Arrange
    const invalidConfig: Partial<z.input<typeof RootConfigType>> = {
      version: 1,
      // missing base_url and system
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> = RootConfigType.safeParse(
      invalidConfig as z.input<typeof RootConfigType>,
    );

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof RootConfigType> = {
      version: 1,
      base_url: "http://example.com",
      system: {},
      // @ts-expect-error intentional extra field for test
      extraField: "not allowed",
    };

    // Act
    const result: ZodSafeParseResult<RootConfig> =
      RootConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "unrecognized_keys");
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });
});
