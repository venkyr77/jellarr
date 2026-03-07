import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import type { ApiKeyConfig, ApiKeyConfigList } from "../types/config/api-keys";
import type { AuthenticationInfoSchema } from "../types/schema/api-keys";

export function calculateApiKeysToCreate(
  current: AuthenticationInfoSchema[],
  desired: ApiKeyConfigList,
): ApiKeyConfig[] | undefined {
  const existingNames = new Set(
    current.map((key: AuthenticationInfoSchema) => key.AppName),
  );

  const toCreate = desired.filter(
    (key: ApiKeyConfig) => !existingNames.has(key.name),
  );

  return toCreate.length > 0 ? toCreate : undefined;
}

export async function createApiKeys(
  client: JellyfinClient,
  keys: ApiKeyConfig[] | undefined,
): Promise<void> {
  if (!keys) return;

  for (const key of keys) {
    logger.info(`Creating API key: ${key.name}`);
    await client.createApiKey(key.name);
    logger.info(`✓ Created API key: ${key.name}`);
  }
}
