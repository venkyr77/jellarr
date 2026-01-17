import type { JellyfinClient } from "../api/jellyfin.types";
import { logger } from "../lib/logger";
import type {
  UserConfig,
  UserConfigList,
  UserPolicyConfig,
} from "../types/config/users";
import type {
  UserDtoSchema,
  UserPolicySchema,
  UserConfigurationSchema,
} from "../types/schema/users";
import {
  mapUserConfigToCreateSchema,
  mapUserPolicyConfigToSchema,
  mapUserConfigToConfiguration,
} from "../mappers/users";
import type { VirtualFolderInfoSchema } from "../types/schema/library";

function buildFolderNameToIdMap(
  virtualFolders: VirtualFolderInfoSchema[] | undefined,
): Map<string, string> {
  const folderNameToIdMap: Map<string, string> = new Map();

  for (const folder of virtualFolders ?? []) {
    const name: string | undefined = folder.Name ?? undefined;
    const id: string | undefined =
      (folder as { Id?: string }).Id ??
      (folder as { ItemId?: string | null }).ItemId ??
      undefined;

    if (!name || !id) continue;
    if (!folderNameToIdMap.has(name)) {
      folderNameToIdMap.set(name, id);
    }
  }

  return folderNameToIdMap;
}

export function calculateNewUsersDiff(
  current: UserDtoSchema[],
  desired: UserConfigList,
): UserConfig[] | undefined {
  if (desired.length === 0) return undefined;

  const out: UserConfig[] = desired.filter(
    (desiredUser: UserConfig) =>
      !current.find((user: UserDtoSchema) => user.Name === desiredUser.name),
  );

  return out.length === 0 ? undefined : out;
}

export async function createNewUsers(
  client: JellyfinClient,
  users: UserConfig[] | undefined,
): Promise<void> {
  if (!users) return;

  for (const userConfig of users) {
    await client.createUser(mapUserConfigToCreateSchema(userConfig));
  }
}

export function calculateUserPolicyDiff(
  current: UserPolicySchema,
  desired: UserPolicyConfig,
  folderNameToIdMap?: Map<string, string>,
): UserPolicySchema | undefined {
  const mapped: Partial<UserPolicySchema> = mapUserPolicyConfigToSchema(
    desired,
    folderNameToIdMap,
  );

  const next: UserPolicySchema = { ...current, ...mapped };

  return JSON.stringify(next) === JSON.stringify(current) ? undefined : next;
}

export function calculateUserPoliciesDiff(
  current: UserDtoSchema[],
  desired: UserConfigList,
  virtualFolders?: VirtualFolderInfoSchema[],
): Map<string, UserPolicySchema> | undefined {
  if (desired.length === 0) return undefined;

  const userPoliciesToUpdate: Map<string, UserPolicySchema> = new Map();
  const enabledLibraryNames: string[] = desired
    .map(
      (userConfig: UserConfig) =>
        userConfig.policy?.enabledLibraries ?? undefined,
    )
    .filter((names): names is string[] => typeof names !== "undefined")
    .flat();

  const hasEnabledFoldersDefined: boolean = desired.some(
    (userConfig: UserConfig) =>
      typeof userConfig.policy?.enabledLibraries !== "undefined",
  );

  const folderNameToIdMap: Map<string, string> | undefined =
    hasEnabledFoldersDefined && virtualFolders
      ? buildFolderNameToIdMap(virtualFolders)
      : hasEnabledFoldersDefined
        ? new Map()
        : undefined;

  if (
    enabledLibraryNames.length > 0 &&
    (folderNameToIdMap?.size === 0 || !folderNameToIdMap)
  ) {
    throw new Error(
      "policy.enabledLibraries provided but no libraries were found to resolve names",
    );
  }

  desired.forEach((userConfig: UserConfig) => {
    const currentUserDtoSchema: UserDtoSchema | undefined = current.find(
      (curr: UserDtoSchema) => curr.Name === userConfig.name,
    );

    const hasPolicyUpdates: boolean =
      typeof userConfig.policy !== "undefined" ||
      typeof userConfig.maxActiveSessions !== "undefined";

    if (currentUserDtoSchema?.Id && hasPolicyUpdates) {
      const currentPolicy: UserPolicySchema =
        (currentUserDtoSchema.Policy as UserPolicySchema) ?? {};
      const desiredPolicy: UserPolicyConfig = {
        ...(userConfig.policy ?? {}),
        ...(typeof userConfig.maxActiveSessions !== "undefined"
          ? { maxActiveSessions: userConfig.maxActiveSessions }
          : {}),
      };

      const userPolicyDiff: UserPolicySchema | undefined =
        calculateUserPolicyDiff(
          currentPolicy,
          desiredPolicy,
          folderNameToIdMap,
        );

      if (userPolicyDiff) {
        logger.info(`Updating user policy: ${userConfig.name}`);
        userPoliciesToUpdate.set(currentUserDtoSchema.Id, userPolicyDiff);
      }
    }
  });

  return userPoliciesToUpdate.size > 0 ? userPoliciesToUpdate : undefined;
}

export function calculateUserConfigurationsDiff(
  current: UserDtoSchema[],
  desired: UserConfigList,
): Map<string, UserConfigurationSchema> | undefined {
  if (desired.length === 0) return undefined;

  const userConfigsToUpdate: Map<string, UserConfigurationSchema> = new Map();

  desired.forEach((userConfig: UserConfig) => {
    if (
      typeof userConfig.displayMissingEpisodes === "undefined" &&
      typeof userConfig.subtitleLanguagePreference === "undefined"
    ) {
      return;
    }

    const currentUserDtoSchema: UserDtoSchema | undefined = current.find(
      (curr: UserDtoSchema) => curr.Name === userConfig.name,
    );

    if (currentUserDtoSchema?.Id) {
      const currentConfig: UserConfigurationSchema =
        (currentUserDtoSchema.Configuration as UserConfigurationSchema) ?? {};
      const desiredConfig: Partial<UserConfigurationSchema> =
        mapUserConfigToConfiguration(userConfig);

      const next: UserConfigurationSchema = {
        ...currentConfig,
        ...desiredConfig,
      };

      if (JSON.stringify(next) !== JSON.stringify(currentConfig)) {
        userConfigsToUpdate.set(currentUserDtoSchema.Id, next);
      }
    }
  });

  return userConfigsToUpdate.size > 0 ? userConfigsToUpdate : undefined;
}

export async function applyUserPolicies(
  client: JellyfinClient,
  policies: Map<string, UserPolicySchema> | undefined,
): Promise<void> {
  if (!policies) return;

  for (const [userId, policy] of policies) {
    await client.updateUserPolicy(userId, policy);
  }
}

export async function applyUserConfigurations(
  client: JellyfinClient,
  configurations: Map<string, UserConfigurationSchema> | undefined,
): Promise<void> {
  if (!configurations) return;

  for (const [userId, configuration] of configurations) {
    await client.updateUserConfiguration(userId, configuration);
  }
}
