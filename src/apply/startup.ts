import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import type { StartupConfig } from "../types/config/startup";
import { createJellyfinClient } from "../api/jellyfin_client";
import type { JellyfinClient } from "../api/jellyfin.types";
import type { AuthenticationInfoSchema } from "../types/schema/startup";

function resolvePassword(config: {
  password?: string;
  passwordFile?: string;
}): string {
  if (config.password !== undefined) return config.password;
  if (config.passwordFile !== undefined) {
    return readFileSync(config.passwordFile, "utf8").trim();
  }
  return "";
}

function readExistingApiKey(
  apiKeyFile: string | undefined,
): string | undefined {
  if (!apiKeyFile || !existsSync(apiKeyFile)) return undefined;
  const content: string = readFileSync(apiKeyFile, "utf8").trim();
  return content.length > 0 ? content : undefined;
}

export async function applyStartupWizard(
  baseUrl: string,
  startup: StartupConfig,
): Promise<string> {
  const existingKey: string | undefined = readExistingApiKey(
    startup.apiKeyFile,
  );
  if (existingKey) {
    console.log("✓ startup API key already exists, skipping wizard");
    return existingKey;
  }

  const unauthClient: JellyfinClient = createJellyfinClient(baseUrl);

  if (
    startup.serverName !== undefined ||
    startup.preferredMetadataLanguage !== undefined ||
    startup.metadataCountryCode !== undefined ||
    startup.uiCulture !== undefined
  ) {
    console.log("→ configuring startup server settings");
    await unauthClient.updateStartupConfiguration({
      ServerName: startup.serverName,
      PreferredMetadataLanguage: startup.preferredMetadataLanguage,
      MetadataCountryCode: startup.metadataCountryCode,
      UICulture: startup.uiCulture,
    });
    console.log("✓ configured startup server settings");
  }

  if (startup.remoteAccess) {
    console.log("→ configuring remote access");
    await unauthClient.setRemoteAccess({
      EnableRemoteAccess: startup.remoteAccess.enableRemoteAccess,
      EnableAutomaticPortMapping:
        startup.remoteAccess.enableAutomaticPortMapping,
    });
    console.log("✓ configured remote access");
  }

  if (startup.user) {
    await unauthClient.getStartupUser();
    const password: string = resolvePassword(startup.user);
    console.log("→ setting startup user");
    await unauthClient.updateStartupUser({
      Name: startup.user.name,
      Password: password,
    });
    console.log("✓ set startup user");
  }

  if (startup.completeStartupWizard) {
    console.log("→ marking startup wizard as complete");
    await unauthClient.completeStartupWizard();
    console.log("✓ marked startup wizard as complete");
  }

  if (!startup.user || !startup.apiKeyApp) {
    throw new Error(
      "startup.user and startup.apiKeyApp are required to create an API key",
    );
  }

  const password: string = resolvePassword(startup.user);
  console.log("→ authenticating as startup user");
  const accessToken: string = await unauthClient.authenticateByName(
    startup.user.name,
    password,
  );
  console.log("✓ authenticated as startup user");

  const authedClient: JellyfinClient = createJellyfinClient(
    baseUrl,
    accessToken,
  );

  console.log("→ creating API key");
  await authedClient.createApiKey(startup.apiKeyApp);

  const keys: AuthenticationInfoSchema[] = await authedClient.getApiKeys();
  const createdKey: AuthenticationInfoSchema | undefined = keys.find(
    (k: AuthenticationInfoSchema) => k.AppName === startup.apiKeyApp,
  );

  if (!createdKey?.AccessToken) {
    throw new Error(
      `Failed to retrieve API key for app "${startup.apiKeyApp}" after creation`,
    );
  }

  const apiKey: string = createdKey.AccessToken;
  console.log("✓ created API key");

  if (startup.apiKeyFile) {
    mkdirSync(dirname(startup.apiKeyFile), { recursive: true });
    writeFileSync(startup.apiKeyFile, apiKey, { mode: 0o600 });
    console.log(`✓ wrote API key to ${startup.apiKeyFile}`);
  }

  return apiKey;
}
