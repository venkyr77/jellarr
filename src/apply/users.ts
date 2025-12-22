import type { JellyfinClient } from "../api/jellyfin.types";
import { ChangeSetBuilder } from "../lib/changeset";
import { logger } from "../lib/logger";
import type {
  UserConfig,
  UserConfigList,
  UserPolicyConfig,
} from "../types/config/users";
import type { UserDtoSchema, UserPolicySchema } from "../types/schema/users";
import {
  mapUserConfigToCreateSchema,
  mapUserPolicyConfigToSchema,
} from "../mappers/users";
import { applyChangeset, diff, type IChange } from "json-diff-ts";

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
): UserPolicySchema | undefined {
  const patch: IChange[] = new ChangeSetBuilder(
    diff(current, mapUserPolicyConfigToSchema(desired)),
  )
    .atomize()
    .withoutRemoves()
    .toArray();

  if (patch.length > 0) {
    return applyChangeset(current, patch) as UserPolicySchema;
  }

  return undefined;
}

export function calculateUserPoliciesDiff(
  current: UserDtoSchema[],
  desired: UserConfigList,
): Map<string, UserPolicySchema> | undefined {
  if (desired.length === 0) return undefined;

  const userPoliciesToUpdate: Map<string, UserPolicySchema> = new Map();

  desired.forEach((userConfig: UserConfig) => {
    const currentUserDtoSchema: UserDtoSchema | undefined = current.find(
      (curr: UserDtoSchema) => curr.Name === userConfig.name,
    );

    if (
      currentUserDtoSchema?.Id &&
      currentUserDtoSchema.Policy &&
      userConfig.policy
    ) {
      const userPolicyDiff: UserPolicySchema | undefined =
        calculateUserPolicyDiff(currentUserDtoSchema.Policy, userConfig.policy);

      if (userPolicyDiff) {
        logger.info(`Updating user policy: ${userConfig.name}`);
        userPoliciesToUpdate.set(currentUserDtoSchema.Id, userPolicyDiff);
      }
    }
  });

  return userPoliciesToUpdate.size > 0 ? userPoliciesToUpdate : undefined;
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
