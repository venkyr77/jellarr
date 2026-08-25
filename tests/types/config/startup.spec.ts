import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  StartupConfigType,
  type StartupConfig,
} from "../../../src/types/config/startup";

describe("StartupConfig", () => {
  it("should validate startup config with completeStartupWizard true", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      completeStartupWizard: true,
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.completeStartupWizard).toBe(true);
    }
  });

  it("should validate startup config with completeStartupWizard false", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      completeStartupWizard: false,
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.completeStartupWizard).toBe(false);
    }
  });

  it("should reject invalid completeStartupWizard value", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      // @ts-expect-error intentional invalid value for test
      completeStartupWizard: "invalid",
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should validate empty startup config", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {};

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.completeStartupWizard).toBeUndefined();
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      completeStartupWizard: true,
      // @ts-expect-error intentional extra field for test
      extraField: "not allowed",
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      const strictError: z.core.$ZodIssue | undefined =
        result.error.issues.find(
          (err: z.core.$ZodIssue) => err.code === "unrecognized_keys",
        );
      expect(strictError?.code).toBe("unrecognized_keys");
    }
  });

  it("should validate full startup config with all fields", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      serverName: "My Jellyfin",
      preferredMetadataLanguage: "en",
      metadataCountryCode: "US",
      uiCulture: "en-US",
      remoteAccess: {
        enableRemoteAccess: true,
        enableAutomaticPortMapping: false,
      },
      user: {
        name: "admin",
        password: "secret",
      },
      apiKeyApp: "jellarr",
      apiKeyFile: "/run/jellarr/api-key",
      completeStartupWizard: true,
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serverName).toBe("My Jellyfin");
      expect(result.data.preferredMetadataLanguage).toBe("en");
      expect(result.data.metadataCountryCode).toBe("US");
      expect(result.data.uiCulture).toBe("en-US");
      expect(result.data.remoteAccess?.enableRemoteAccess).toBe(true);
      expect(result.data.remoteAccess?.enableAutomaticPortMapping).toBe(false);
      expect(result.data.user?.name).toBe("admin");
      expect(result.data.user?.password).toBe("secret");
      expect(result.data.apiKeyApp).toBe("jellarr");
      expect(result.data.apiKeyFile).toBe("/run/jellarr/api-key");
      expect(result.data.completeStartupWizard).toBe(true);
    }
  });

  it("should validate startup user with passwordFile", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      user: {
        name: "admin",
        passwordFile: "/run/secrets/admin-pw",
      },
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user?.name).toBe("admin");
      expect(result.data.user?.passwordFile).toBe("/run/secrets/admin-pw");
    }
  });

  it("should reject startup user with both password and passwordFile", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      user: {
        name: "admin",
        password: "secret",
        passwordFile: "/run/secrets/admin-pw",
      },
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject startup user with neither password nor passwordFile", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      user: {
        name: "admin",
      },
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject startup user with empty name", () => {
    // Arrange
    const invalidConfig: z.input<typeof StartupConfigType> = {
      user: {
        name: "",
        password: "secret",
      },
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject remoteAccess with extra fields", () => {
    // Arrange
    const invalidConfig = {
      remoteAccess: {
        enableRemoteAccess: true,
        enableAutomaticPortMapping: false,
        extraField: "not allowed",
      },
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });

  it("should validate config with only server settings", () => {
    // Arrange
    const validConfig: z.input<typeof StartupConfigType> = {
      serverName: "Test Server",
      uiCulture: "de-DE",
    };

    // Act
    const result: ZodSafeParseResult<StartupConfig> =
      StartupConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serverName).toBe("Test Server");
      expect(result.data.uiCulture).toBe("de-DE");
      expect(result.data.user).toBeUndefined();
      expect(result.data.remoteAccess).toBeUndefined();
    }
  });
});
