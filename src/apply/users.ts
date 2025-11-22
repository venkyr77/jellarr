import { deepEqual } from "fast-equals";
import type { JellyfinClient } from "../api/jellyfin.types";
import { logger } from "../lib/logger";
import type { UserConfig, UserConfigList } from "../types/config/users";
import type {
  UserDtoSchema,
  CreateUserByNameSchema,
  UserPolicySchema,
} from "../types/schema/users";
import {
  mapUserConfigToCreateSchema,
  mapUserPolicyConfigToSchema,
} from "../mappers/users";

export function calculateNewUsersDiff(
  currentUsers: UserDtoSchema[],
  desired: UserConfigList,
): UserConfig[] | undefined {
  if (desired.length === 0) return undefined;

  const usersToCreate: UserConfig[] = [];

  for (const desiredUser of desired) {
    const existingUser: UserDtoSchema | undefined = currentUsers.find(
      (user: UserDtoSchema) => user.Name === desiredUser.name,
    );

    if (!existingUser) {
      logger.info(`Creating user: ${desiredUser.name}`);
      usersToCreate.push(desiredUser);
    }
  }

  return usersToCreate.length > 0 ? usersToCreate : undefined;
}

export async function applyNewUsers(
  client: JellyfinClient,
  usersToCreate: UserConfig[] | undefined,
): Promise<void> {
  if (!usersToCreate) return;

  for (const userConfig of usersToCreate) {
    const createSchema: CreateUserByNameSchema =
      mapUserConfigToCreateSchema(userConfig);
    await client.createUser(createSchema);
  }
}

export function calculateUserPoliciesDiff(
  currentUsers: UserDtoSchema[],
  desired: UserConfigList,
): Map<string, UserPolicySchema> | undefined {
  if (desired.length === 0) return undefined;

  const userPoliciesToUpdate: Map<string, UserPolicySchema> = new Map();

  for (const desiredUser of desired) {
    const existingUser: UserDtoSchema | undefined = currentUsers.find(
      (user: UserDtoSchema) => user.Name === desiredUser.name,
    );

    if (existingUser && existingUser.Id && desiredUser.policy) {
      const updatedPolicy: Partial<UserPolicySchema> =
        mapUserPolicyConfigToSchema(desiredUser.policy);

      const currentPolicy: Partial<UserPolicySchema> =
        existingUser.Policy || {};
      const newPolicy: UserPolicySchema = {
        ...currentPolicy,
        ...updatedPolicy,
      } as UserPolicySchema;

      if (!deepEqual(currentPolicy, newPolicy)) {
        logger.info(`Updating user policy: ${desiredUser.name}`);
        userPoliciesToUpdate.set(existingUser.Id, newPolicy);
      }
    }
  }

  return userPoliciesToUpdate.size > 0 ? userPoliciesToUpdate : undefined;
}

export async function applyUserPolicies(
  client: JellyfinClient,
  userPolicies: Map<string, UserPolicySchema> | undefined,
): Promise<void> {
  if (!userPolicies) return;

  for (const [userId, policy] of userPolicies) {
    await client.updateUserPolicy(userId, policy);
  }
}
