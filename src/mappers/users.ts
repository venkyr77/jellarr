import { readFileSync } from "fs";
import { type UserConfig, type UserPolicyConfig } from "../types/config/users";
import {
  type CreateUserByNameSchema,
  type UserPolicySchema,
} from "../types/schema/users";

export function getPlaintextPassword(config: UserConfig): string | undefined {
  return config.password;
}

export function getPasswordFromFile(config: UserConfig): string | undefined {
  if (config.passwordFile === undefined) return undefined;
  return readFileSync(config.passwordFile, "utf8").trim();
}

export function getPassword(config: UserConfig): string {
  return getPlaintextPassword(config) ?? getPasswordFromFile(config) ?? "";
}

export function mapUserConfigToCreateSchema(
  desired: UserConfig,
): CreateUserByNameSchema {
  return {
    Name: desired.name,
    Password: getPassword(desired),
  };
}

export function mapUserPolicyConfigToSchema(
  desired: UserPolicyConfig,
): Partial<UserPolicySchema> {
  const out: Partial<UserPolicySchema> = {};

  if (typeof desired.isAdministrator !== "undefined") {
    out.IsAdministrator = desired.isAdministrator;
  }

  if (typeof desired.loginAttemptsBeforeLockout !== "undefined") {
    out.LoginAttemptsBeforeLockout = desired.loginAttemptsBeforeLockout;
  }

  return out;
}
