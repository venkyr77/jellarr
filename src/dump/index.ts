import { createJellyfinClient } from "../api/jellyfin_client";
import type { JellyfinClient } from "../api/jellyfin.types";
import type {
  ServerConfigurationSchema,
  PluginRepositorySchema,
} from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding-options";
import type {
  VirtualFolderInfoSchema,
  MediaPathInfoSchema,
} from "../types/schema/library";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import type { UserDtoSchema } from "../types/schema/users";
import type {
  PluginInfoSchema,
  BasePluginConfigurationSchema,
} from "../types/schema/plugins";
import * as yaml from "yaml";

interface PluginWithConfig {
  name: string;
  configuration?: BasePluginConfigurationSchema;
}

export async function runDump(baseUrl: string): Promise<void> {
  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) {
    throw new Error("JELLARR_API_KEY environment variable is required");
  }

  const client: JellyfinClient = createJellyfinClient(baseUrl, apiKey);

  console.error("⚠️  EXPERIMENTAL: Dumping Jellyfin configuration...\n");

  const [
    systemConfig,
    encodingConfig,
    virtualFolders,
    brandingConfig,
    users,
    plugins,
  ]: [
    ServerConfigurationSchema,
    EncodingOptionsSchema,
    VirtualFolderInfoSchema[],
    BrandingOptionsDtoSchema,
    UserDtoSchema[],
    PluginInfoSchema[],
  ] = await Promise.all([
    client.getSystemConfiguration(),
    client.getEncodingConfiguration(),
    client.getVirtualFolders(),
    client.getBrandingConfiguration(),
    client.getUsers(),
    client.getPlugins(),
  ]);

  const pluginsWithConfig: PluginWithConfig[] = await Promise.all(
    plugins.map(async (plugin: PluginInfoSchema): Promise<PluginWithConfig> => {
      if (!plugin.Id) return { name: plugin.Name ?? "unknown" };
      try {
        const pluginConfig: BasePluginConfigurationSchema =
          await client.getPluginConfiguration(plugin.Id);
        return {
          name: plugin.Name ?? "unknown",
          configuration: pluginConfig,
        };
      } catch {
        return { name: plugin.Name ?? "unknown" };
      }
    }),
  );

  const config: object = {
    version: 1,
    base_url: baseUrl,

    system: {
      enableMetrics: systemConfig.EnableMetrics,
      pluginRepositories: systemConfig.PluginRepositories?.map(
        (repo: PluginRepositorySchema) => ({
          name: repo.Name ?? "",
          url: repo.Url ?? "",
          enabled: repo.Enabled ?? false,
        }),
      ),
      trickplayOptions: {
        enableHwAcceleration:
          systemConfig.TrickplayOptions?.EnableHwAcceleration,
        enableHwEncoding: systemConfig.TrickplayOptions?.EnableHwEncoding,
      },
    },

    encoding: {
      enableHardwareEncoding: encodingConfig.EnableHardwareEncoding,
      hardwareAccelerationType: encodingConfig.HardwareAccelerationType,
      vaapiDevice: encodingConfig.VaapiDevice,
      qsvDevice: encodingConfig.QsvDevice,
      hardwareDecodingCodecs: encodingConfig.HardwareDecodingCodecs,
      enableDecodingColorDepth10Hevc:
        encodingConfig.EnableDecodingColorDepth10Hevc,
      enableDecodingColorDepth10Vp9:
        encodingConfig.EnableDecodingColorDepth10Vp9,
      enableDecodingColorDepth10HevcRext:
        encodingConfig.EnableDecodingColorDepth10HevcRext,
      enableDecodingColorDepth12HevcRext:
        encodingConfig.EnableDecodingColorDepth12HevcRext,
      allowHevcEncoding: encodingConfig.AllowHevcEncoding,
      allowAv1Encoding: encodingConfig.AllowAv1Encoding,
    },

    library: {
      virtualFolders: virtualFolders.map((folder: VirtualFolderInfoSchema) => ({
        name: folder.Name ?? "",
        collectionType: folder.CollectionType ?? "mixed",
        libraryOptions: {
          pathInfos:
            folder.LibraryOptions?.PathInfos?.map((p: MediaPathInfoSchema) => ({
              path: p.Path ?? "",
            })) ?? [],
        },
      })),
    },

    branding: {
      loginDisclaimer: brandingConfig.LoginDisclaimer,
      customCss: brandingConfig.CustomCss,
      splashscreenEnabled: brandingConfig.SplashscreenEnabled,
    },

    users: users.map((user: UserDtoSchema) => ({
      name: user.Name ?? "",
      policy: {
        isAdministrator: user.Policy?.IsAdministrator,
        loginAttemptsBeforeLockout: user.Policy?.LoginAttemptsBeforeLockout,
      },
    })),

    plugins: pluginsWithConfig,
  };

  console.log(yaml.stringify(config));

  console.error(
    "\n⚠️  Note: User passwords cannot be exported. Add them manually.",
  );
}
