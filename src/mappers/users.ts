import { readFileSync } from "fs";
import { type UserConfig } from "../types/config/users";
import { type CreateUserByNameSchema } from "../types/schema/users";

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
