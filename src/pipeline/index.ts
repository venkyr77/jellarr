import { promises as fs } from "fs";
import YAML from "yaml";
import { calculateSystemDiff, applySystem } from "../apply/system";
import {
  calculateEncodingDiff,
  applyEncoding,
} from "../apply/encoding-options";
import { calculateLibraryDiff, applyLibrary } from "../apply/library";
import {
  calculateBrandingOptionsDiff,
  applyBrandingOptions,
} from "../apply/branding-options";
import {
  calculateNewUsersDiff,
  calculateUserPoliciesDiff,
  applyUserPolicies,
  createNewUsers,
} from "../apply/users";
import type { VirtualFolderInfoSchema } from "../types/schema/library";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";
import { type BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import type { UserDtoSchema, UserPolicySchema } from "../types/schema/users";
import type { UserConfig } from "../types/config/users";
import { createJellyfinClient } from "../api/jellyfin_client";
import { type JellyfinClient } from "../api/jellyfin.types";
import { RootConfigType, type RootConfig } from "../types/config/root";
import { type ZodSafeParseResult, type z } from "zod";
import {
  type PluginInfoSchema,
  type BasePluginConfigurationSchema,
} from "../types/schema/plugins";
import {
  calculatePluginsToInstall,
  installPlugins,
  calculatePluginConfigurationsDiff,
  applyPluginConfigurations,
  getPluginConfigurationSchemaByName,
} from "../apply/plugins";
import type { PluginConfig } from "../types/config/plugins";

export async function runPipeline(path: string): Promise<void> {
  const raw: string = await fs.readFile(path, "utf8");

  const validationResult: ZodSafeParseResult<RootConfig> =
    RootConfigType.safeParse(YAML.parse(raw));
  if (!validationResult.success) {
    const errorMessages: string = validationResult.error.issues
      .map((err: z.core.$ZodIssue) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }

  const cfg: RootConfig = validationResult.data;

  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) throw new Error("JELLARR_API_KEY required");

  const jellyfinClient: JellyfinClient = createJellyfinClient(
    cfg.base_url,
    apiKey,
  );

  const currentServerConfigurationSchema: ServerConfigurationSchema =
    await jellyfinClient.getSystemConfiguration();

  const updatedServerConfigurationSchema:
    | ServerConfigurationSchema
    | undefined = calculateSystemDiff(
    currentServerConfigurationSchema,
    cfg.system,
  );

  if (updatedServerConfigurationSchema) {
    console.log("→ updating system config");
    await applySystem(jellyfinClient, updatedServerConfigurationSchema);
    console.log("✓ updated system config");
  } else {
    console.log("✓ system config already up to date");
  }

  if (cfg.encoding) {
    const currentEncodingOptionsSchema: EncodingOptionsSchema =
      await jellyfinClient.getEncodingConfiguration();

    const updatedEncodingOptionsSchema: EncodingOptionsSchema | undefined =
      calculateEncodingDiff(currentEncodingOptionsSchema, cfg.encoding);

    if (updatedEncodingOptionsSchema) {
      console.log("→ updating encoding config");
      await applyEncoding(jellyfinClient, updatedEncodingOptionsSchema);
      console.log("✓ updated encoding config");
    } else {
      console.log("✓ encoding config already up to date");
    }
  }

  if (cfg.library?.virtualFolders) {
    const currentVirtualFolders: VirtualFolderInfoSchema[] =
      await jellyfinClient.getVirtualFolders();
    const foldersToCreate: VirtualFolderInfoSchema[] | undefined =
      calculateLibraryDiff(currentVirtualFolders, cfg.library.virtualFolders);

    if (foldersToCreate) {
      console.log("→ updating library config");
      await applyLibrary(jellyfinClient, foldersToCreate);
      console.log("✓ updated library config");
    } else {
      console.log("✓ library config already up to date");
    }
  }

  if (cfg.branding) {
    const currentBrandingSchema: BrandingOptionsDtoSchema =
      await jellyfinClient.getBrandingConfiguration();

    const updatedBrandingSchema: BrandingOptionsDtoSchema | undefined =
      calculateBrandingOptionsDiff(currentBrandingSchema, cfg.branding);

    if (updatedBrandingSchema) {
      console.log("→ updating branding config");
      await applyBrandingOptions(jellyfinClient, updatedBrandingSchema);
      console.log("✓ updated branding config");
    } else {
      console.log("✓ branding config already up to date");
    }
  }

  if (cfg.users) {
    let currentUsers: UserDtoSchema[] = await jellyfinClient.getUsers();

    const usersToCreate: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      cfg.users,
    );

    if (usersToCreate) {
      console.log("→ creating users");
      await createNewUsers(jellyfinClient, usersToCreate);
      console.log("✓ created users");
      currentUsers = await jellyfinClient.getUsers();
    }

    const userPoliciesToUpdate: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, cfg.users);

    if (userPoliciesToUpdate) {
      console.log("→ updating user policies");
      await applyUserPolicies(jellyfinClient, userPoliciesToUpdate);
      console.log("✓ updated user policies");
    } else {
      console.log("✓ user policies already up to date");
    }
  }

  if (cfg.plugins) {
    let installedPlugins: PluginInfoSchema[] =
      await jellyfinClient.getPlugins();

    const pluginsToInstall: PluginConfig[] | undefined =
      calculatePluginsToInstall(installedPlugins, cfg.plugins);

    if (pluginsToInstall) {
      console.log("→ installing plugins");
      await installPlugins(jellyfinClient, pluginsToInstall);
      console.log("✓ installed plugins");
      installedPlugins = await jellyfinClient.getPlugins();
    } else {
      console.log("✓ plugins already up to date");
    }

    const pluginConfigurationsToUpdate:
      | Map<string, BasePluginConfigurationSchema>
      | undefined = calculatePluginConfigurationsDiff(
      await getPluginConfigurationSchemaByName(
        jellyfinClient,
        installedPlugins,
      ),
      cfg.plugins,
    );

    if (pluginConfigurationsToUpdate) {
      console.log("→ updating plugin configurations");
      await applyPluginConfigurations(
        jellyfinClient,
        pluginConfigurationsToUpdate,
      );
      console.log("✓ updated plugin configurations");
    } else {
      console.log("✓ plugin configurations already up to date");
    }
  }

  if (cfg.startup?.completeStartupWizard) {
    console.log("→ marking startup wizard as complete");
    await jellyfinClient.completeStartupWizard();
    console.log("✓ marked startup wizard as complete");
  }
}
