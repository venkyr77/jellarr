import { describe, it, expect } from "vitest";
import type { ZodSafeParseResult } from "zod";
import { type z } from "zod";
import {
  UserConfigType,
  type UserConfig,
  UserConfigListType,
  type UserConfigList,
} from "../../../src/types/config/users";

describe("UserConfig", () => {
  it("should reject user with name only (no password source)", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should validate valid user config with name and password", () => {
    // Arrange
    const validConfig: z.input<typeof UserConfigType> = {
      name: "test-jellarr",
      password: "test",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should validate valid user config with name and passwordFile", () => {
    // Arrange
    const validConfig: z.input<typeof UserConfigType> = {
      name: "test-jellarr",
      passwordFile: "/run/secrets/user-password",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject empty name", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "",
      password: "test",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const nameError: z.core.$ZodIssue | undefined = result.error.issues.find(
        (err) => err.path.includes("name"),
      );
      expect(nameError?.message).toContain("User name is required");
    }
  });

  it("should reject missing name", () => {
    // Arrange
    const invalidConfig: Partial<z.input<typeof UserConfigType>> = {
      password: "test",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> = UserConfigType.safeParse(
      invalidConfig as z.input<typeof UserConfigType>,
    );

    // Assert
    expect(result.success).toBe(false);
  });

  it("should reject user with both password and passwordFile", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
      password: "test",
      passwordFile: "/run/secrets/user-password",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should reject user with neither password nor passwordFile", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should reject empty password", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
      password: "",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should reject empty passwordFile", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
      passwordFile: "",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should reject whitespace-only password", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
      password: "   ",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should reject whitespace-only passwordFile", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
      passwordFile: "   ",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
      const refineError: z.core.$ZodIssue | undefined =
        result.error.issues.find((err) => err.code === "custom");
      expect(refineError?.message).toContain(
        "Must specify exactly one of 'password' or 'passwordFile'",
      );
    }
  });

  it("should reject extra fields due to strict mode", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigType> = {
      name: "test-user",
      password: "valid-password",
      // @ts-expect-error intentional extra field for test
      unknownField: "should not be allowed",
    };

    // Act
    const result: ZodSafeParseResult<UserConfig> =
      UserConfigType.safeParse(invalidConfig);

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

describe("UserConfigList", () => {
  it("should validate empty user list", () => {
    // Arrange
    const validConfig: z.input<typeof UserConfigListType> = [];

    // Act
    const result: ZodSafeParseResult<UserConfigList> =
      UserConfigListType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([]);
    }
  });

  it("should validate user list with multiple users", () => {
    // Arrange
    const validConfig: z.input<typeof UserConfigListType> = [
      {
        name: "user1",
        password: "password1",
      },
      {
        name: "user2",
        passwordFile: "/run/secrets/user2-password",
      },
      {
        name: "test-jellarr",
        password: "test",
      },
    ];

    // Act
    const result: ZodSafeParseResult<UserConfigList> =
      UserConfigListType.safeParse(validConfig);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validConfig);
    }
  });

  it("should reject list with invalid user", () => {
    // Arrange
    const invalidConfig: z.input<typeof UserConfigListType> = [
      {
        name: "valid-user",
        password: "valid-password",
      },
      {
        name: "",
        password: "password-for-empty-name",
      },
    ];

    // Act
    const result: ZodSafeParseResult<UserConfigList> =
      UserConfigListType.safeParse(invalidConfig);

    // Assert
    expect(result.success).toBe(false);
  });
});
