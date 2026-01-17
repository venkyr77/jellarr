import { readFileSync } from "fs";
import { type UserConfig, type UserPolicyConfig } from "../types/config/users";
import {
  type CreateUserByNameSchema,
  type UserPolicySchema,
  type UserConfigurationSchema,
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
  folderNameToIdMap?: Map<string, string>,
): Partial<UserPolicySchema> {
  const out: Partial<UserPolicySchema> = {};

  if (typeof desired.isAdministrator !== "undefined") {
    out.IsAdministrator = desired.isAdministrator;
  }

  if (typeof desired.loginAttemptsBeforeLockout !== "undefined") {
    out.LoginAttemptsBeforeLockout = desired.loginAttemptsBeforeLockout;
  }

  if (typeof desired.maxActiveSessions !== "undefined") {
    out.MaxActiveSessions = desired.maxActiveSessions;
  }

  if (typeof desired.enableAllFolders !== "undefined") {
    out.EnableAllFolders = desired.enableAllFolders;
  }

  if (typeof desired.enableCollectionManagement !== "undefined") {
    out.EnableCollectionManagement = desired.enableCollectionManagement;
  }

  if (
    typeof desired.enabledLibraries !== "undefined" &&
    desired.enabledLibraries.length > 0
  ) {
    if (typeof desired.enableAllFolders === "undefined") {
      out.EnableAllFolders = false;
    }

    if (!folderNameToIdMap) {
      throw new Error(
        "policy.enabledLibraries requires available libraries to resolve names",
      );
    }

    out.EnabledFolders = desired.enabledLibraries.map(
      (folderName: string): string => {
        const id: string | undefined = folderNameToIdMap.get(folderName);
        if (!id) {
          throw new Error(
            `Library '${folderName}' not found while resolving enabledLibraries`,
          );
        }
        return id;
      },
    );
  }

  return out;
}

export function mapUserConfigToConfiguration(
  desired: UserConfig,
): Partial<UserConfigurationSchema> {
  const out: Partial<UserConfigurationSchema> = {};

  if (typeof desired.displayMissingEpisodes !== "undefined") {
    out.DisplayMissingEpisodes = desired.displayMissingEpisodes;
  }

  if (typeof desired.subtitleLanguagePreference !== "undefined") {
    out.SubtitleLanguagePreference = desired.subtitleLanguagePreference;
  }

  return out;
}
