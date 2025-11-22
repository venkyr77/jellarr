import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import {
  getPlaintextPassword,
  getPasswordFromFile,
  getPassword,
  mapUserConfigToCreateSchema,
  mapUserPolicyConfigToSchema,
} from "../../src/mappers/users";
import {
  type UserConfig,
  type UserPolicyConfig,
} from "../../src/types/config/users";
import {
  type CreateUserByNameSchema,
  type UserPolicySchema,
} from "../../src/types/schema/users";

describe("mappers/users", () => {
  const testPasswordFile: string = "/tmp/test-user-password";

  beforeEach(() => {
    if (existsSync(testPasswordFile)) {
      unlinkSync(testPasswordFile);
    }
  });

  afterEach(() => {
    if (existsSync(testPasswordFile)) {
      unlinkSync(testPasswordFile);
    }
  });

  describe("getPlaintextPassword", () => {
    it("should return password when present", () => {
      // Arrange
      const config: UserConfig = {
        name: "test-user",
        password: "plaintext-password",
      };

      // Act
      const result: string | undefined = getPlaintextPassword(config);

      // Assert
      expect(result).toBe("plaintext-password");
    });

    it("should return undefined when password not present", () => {
      // Arrange
      const config: UserConfig = {
        name: "test-user",
        passwordFile: "/path/to/file",
      };

      // Act
      const result: string | undefined = getPlaintextPassword(config);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("getPasswordFromFile", () => {
    it("should return password from file when passwordFile is present", () => {
      // Arrange
      const expectedPassword: string = "secret-from-file";
      writeFileSync(testPasswordFile, expectedPassword);

      const config: UserConfig = {
        name: "test-user",
        passwordFile: testPasswordFile,
      };

      // Act
      const result: string | undefined = getPasswordFromFile(config);

      // Assert
      expect(result).toBe(expectedPassword);
    });

    it("should trim whitespace from file content", () => {
      // Arrange
      const expectedPassword: string = "secret-with-whitespace";
      writeFileSync(testPasswordFile, `  ${expectedPassword}  \n`);

      const config: UserConfig = {
        name: "test-user",
        passwordFile: testPasswordFile,
      };

      // Act
      const result: string | undefined = getPasswordFromFile(config);

      // Assert
      expect(result).toBe(expectedPassword);
    });

    it("should return undefined when passwordFile not present", () => {
      // Arrange
      const config: UserConfig = {
        name: "test-user",
        password: "plaintext",
      };

      // Act
      const result: string | undefined = getPasswordFromFile(config);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should throw error when passwordFile does not exist", () => {
      // Arrange
      const config: UserConfig = {
        name: "test-user",
        passwordFile: "/nonexistent/password/file",
      };

      // Act & Assert
      expect(() => getPasswordFromFile(config)).toThrow();
    });
  });

  describe("getPassword", () => {
    it("should return plaintext password when present", () => {
      // Arrange
      const config: UserConfig = {
        name: "test-user",
        password: "plaintext-password",
      };

      // Act
      const result: string = getPassword(config);

      // Assert
      expect(result).toBe("plaintext-password");
    });

    it("should return password from file when passwordFile present and password not present", () => {
      // Arrange
      const expectedPassword: string = "file-password";
      writeFileSync(testPasswordFile, expectedPassword);

      const config: UserConfig = {
        name: "test-user",
        passwordFile: testPasswordFile,
      };

      // Act
      const result: string = getPassword(config);

      // Assert
      expect(result).toBe(expectedPassword);
    });

    it("should prefer plaintext password over passwordFile when both present", () => {
      // Arrange
      writeFileSync(testPasswordFile, "file-password");

      const config: UserConfig = {
        name: "test-user",
        password: "plaintext-password",
        passwordFile: testPasswordFile,
      };

      // Act
      const result: string = getPassword(config);

      // Assert
      expect(result).toBe("plaintext-password");
    });

    it("should return empty string when neither password nor passwordFile present", () => {
      // Arrange
      const config: UserConfig = {
        name: "test-user",
      } as UserConfig;

      // Act
      const result: string = getPassword(config);

      // Assert
      expect(result).toBe("");
    });
  });

  describe("mapUserConfigToCreateSchema", () => {
    it("should map user config with password to create schema", () => {
      // Arrange
      const userConfig: UserConfig = {
        name: "test-user",
        password: "test-password",
      };

      // Act
      const result: CreateUserByNameSchema =
        mapUserConfigToCreateSchema(userConfig);

      // Assert
      expect(result).toEqual({
        Name: "test-user",
        Password: "test-password",
      });
    });

    it("should map user config with passwordFile to create schema", () => {
      // Arrange
      const expectedPassword: string = "secret-from-file";
      writeFileSync(testPasswordFile, expectedPassword);

      const userConfig: UserConfig = {
        name: "test-user",
        passwordFile: testPasswordFile,
      };

      // Act
      const result: CreateUserByNameSchema =
        mapUserConfigToCreateSchema(userConfig);

      // Assert
      expect(result).toEqual({
        Name: "test-user",
        Password: expectedPassword,
      });
    });

    it("should handle empty password when neither source available", () => {
      // Arrange
      const userConfig: UserConfig = {
        name: "test-user",
      } as UserConfig;

      // Act
      const result: CreateUserByNameSchema =
        mapUserConfigToCreateSchema(userConfig);

      // Assert
      expect(result).toEqual({
        Name: "test-user",
        Password: "",
      });
    });
  });

  describe("mapUserPolicyConfigToSchema", () => {
    it("should map all policy fields to schema", () => {
      // Arrange
      const config: UserPolicyConfig = {
        isAdministrator: true,
        loginAttemptsBeforeLockout: 5,
      };

      // Act
      const result: Partial<UserPolicySchema> =
        mapUserPolicyConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        IsAdministrator: true,
        LoginAttemptsBeforeLockout: 5,
      });
    });

    it("should map individual policy fields", () => {
      // Arrange
      const testCases: Array<{
        config: UserPolicyConfig;
        expected: Partial<UserPolicySchema>;
      }> = [
        {
          config: { isAdministrator: true },
          expected: { IsAdministrator: true },
        },
        {
          config: { isAdministrator: false },
          expected: { IsAdministrator: false },
        },
        {
          config: { loginAttemptsBeforeLockout: 10 },
          expected: { LoginAttemptsBeforeLockout: 10 },
        },
      ];

      testCases.forEach(
        ({
          config,
          expected,
        }: {
          config: UserPolicyConfig;
          expected: Partial<UserPolicySchema>;
        }) => {
          // Act
          const result: Partial<UserPolicySchema> =
            mapUserPolicyConfigToSchema(config);

          // Assert
          expect(result).toEqual(expected);
        },
      );
    });

    it("should return empty object when no fields provided", () => {
      // Arrange
      const config: UserPolicyConfig = {};

      // Act
      const result: Partial<UserPolicySchema> =
        mapUserPolicyConfigToSchema(config);

      // Assert
      expect(result).toEqual({});
    });

    it("should not include undefined fields in result", () => {
      // Arrange
      const config: UserPolicyConfig = {
        isAdministrator: true,
      };

      // Act
      const result: Partial<UserPolicySchema> =
        mapUserPolicyConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        IsAdministrator: true,
      });
      expect(result).not.toHaveProperty("LoginAttemptsBeforeLockout");
    });

    it("should handle mixed defined and undefined fields", () => {
      // Arrange
      const config: UserPolicyConfig = {
        isAdministrator: false,
        loginAttemptsBeforeLockout: 3,
      };

      // Act
      const result: Partial<UserPolicySchema> =
        mapUserPolicyConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        IsAdministrator: false,
        LoginAttemptsBeforeLockout: 3,
      });
    });

    it("should handle zero value for loginAttemptsBeforeLockout", () => {
      // Arrange
      const config: UserPolicyConfig = {
        loginAttemptsBeforeLockout: 0,
      };

      // Act
      const result: Partial<UserPolicySchema> =
        mapUserPolicyConfigToSchema(config);

      // Assert
      expect(result).toEqual({
        LoginAttemptsBeforeLockout: 0,
      });
    });
  });
});
