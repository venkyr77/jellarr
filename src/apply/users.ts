import type { JellyfinClient } from "../api/jellyfin.types";
import { logger } from "../lib/logger";
import type { UserConfig, UserConfigList } from "../types/config/users";
import type {
  UserDtoSchema,
  CreateUserByNameSchema,
} from "../types/schema/users";
import { mapUserConfigToCreateSchema } from "../mappers/users";

export function calculateNewUsersDiff(
  currentUsers: UserDtoSchema[],
  desired: UserConfigList,
): UserConfig[] | undefined {
  if (desired.length === 0) return undefined;

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
