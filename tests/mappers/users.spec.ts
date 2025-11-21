import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import {
  getPlaintextPassword,
  getPasswordFromFile,
  getPassword,
  mapUserConfigToCreateSchema,
} from "../../src/mappers/users";
import { type UserConfig } from "../../src/types/config/users";
import { type CreateUserByNameSchema } from "../../src/types/schema/users";

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
});
