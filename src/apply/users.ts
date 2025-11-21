import { deepEqual } from "fast-equals";
import type { JellyfinClient } from "../api/jellyfin.types";
import { logger } from "../lib/logger";
import type { UserConfig, UserConfigList } from "../types/config/users";
import type {
  UserDtoSchema,
  CreateUserByNameSchema,
} from "../types/schema/users";
import { mapUserConfigToCreateSchema } from "../mappers/users";

function hasUsersChanged(
  currentUsers: UserDtoSchema[],
  desiredUsers: UserConfigList,
): boolean {
  if (desiredUsers.length === 0) return false;

  const currentUserNames: string[] = currentUsers
    .map((user) => user.Name)
    .filter((name): name is string => name !== undefined)
    .sort();

  const desiredUserNames: string[] = desiredUsers
    .map((user) => user.name)
    .sort();

  return !deepEqual(currentUserNames, desiredUserNames);
}

export function calculateUsersDiff(
  currentUsers: UserDtoSchema[],
  desired: UserConfigList,
): UserConfig[] | undefined {
  const hasChanges: boolean = hasUsersChanged(currentUsers, desired);

  if (!hasChanges) return undefined;

  const usersToCreate: UserConfig[] = [];

  for (const desiredUser of desired) {
    const existingUser: UserDtoSchema | undefined = currentUsers.find(
      (user) => user.Name === desiredUser.name,
    );

    if (!existingUser) {
      logger.info(`Creating user: ${desiredUser.name}`);
      usersToCreate.push(desiredUser);
    }
  }

  return usersToCreate.length > 0 ? usersToCreate : undefined;
}

export async function applyUsers(
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
