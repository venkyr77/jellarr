import type { ServerConfigurationSchema } from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding-options";
import type {
  VirtualFolderInfoSchema,
  AddVirtualFolderDtoSchema,
  CollectionTypeSchema,
} from "../types/schema/library";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import type {
  UserDtoSchema,
  CreateUserByNameSchema,
  UserPolicySchema,
} from "../types/schema/users";
import type {
  JellyfinClient,
  GetSystemConfigurationResponse,
  PostSystemConfigurationResponse,
  GetEncodingConfigurationResponse,
  PostEncodingConfigurationResponse,
  GetVirtualFoldersResponse,
  PostVirtualFolderResponse,
  GetBrandingConfigurationResponse,
  PostBrandingConfigurationResponse,
  GetUsersResponse,
  PostNewUserResponse,
  PostUserPolicyResponse,
  PostStartupCompleteResponse,
  GetStartupUserResponse,
  PostStartupConfigurationResponse,
  PostStartupUserResponse,
  PostStartupRemoteAccessResponse,
  PostAuthenticateByNameResponse,
  PostCreateKeyResponse,
  GetKeysResponse,
  GetPluginsResponse,
  PostInstallPackageResponse,
  GetPluginConfigurationResponse,
  PostPluginConfigurationResponse,
} from "./jellyfin.types";
import { makeClient } from "./client";
import type { paths } from "../../generated/schema";
import type { Client } from "openapi-fetch";
import {
  type PluginInfoSchema,
  type BasePluginConfigurationSchema,
} from "../types/schema/plugins";
import type {
  StartupConfigurationDtoSchema,
  StartupUserDtoSchema,
  StartupRemoteAccessDtoSchema,
  AuthenticationInfoSchema,
} from "../types/schema/startup";

export function createJellyfinClient(
  baseUrl: string,
  apiKey?: string,
): JellyfinClient {
  const client: Client<paths> = makeClient(baseUrl, apiKey);

  return {
    async getSystemConfiguration(): Promise<ServerConfigurationSchema> {
      const res: GetSystemConfigurationResponse = await client.GET(
        "/System/Configuration",
      );

      if (res.error) {
        throw new Error(
          `GET /System/Configuration failed: ${res.response.status.toString()}`,
        );
      }

      return res.data as ServerConfigurationSchema;
    },

    async updateSystemConfiguration(
      body: Partial<ServerConfigurationSchema>,
    ): Promise<void> {
      const res: PostSystemConfigurationResponse = await client.POST(
        "/System/Configuration",
        {
          body,
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /System/Configuration failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getEncodingConfiguration(): Promise<EncodingOptionsSchema> {
      const res: GetEncodingConfigurationResponse = await client.GET(
        "/System/Configuration/{key}",
        {
          params: { path: { key: "encoding" } },
        },
      );

      if (res.error) {
        throw new Error(
          `GET /System/Configuration/encoding failed: ${res.response.status.toString()}`,
        );
      }

      return res.data as EncodingOptionsSchema;
    },

    async updateEncodingConfiguration(
      body: Partial<EncodingOptionsSchema>,
    ): Promise<void> {
      const res: PostEncodingConfigurationResponse = await client.POST(
        "/System/Configuration/{key}",
        {
          params: { path: { key: "encoding" } },
          body,
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /System/Configuration/encoding failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getVirtualFolders(): Promise<VirtualFolderInfoSchema[]> {
      const res: GetVirtualFoldersResponse = await client.GET(
        "/Library/VirtualFolders",
      );

      if (res.error) {
        throw new Error(
          `GET /Library/VirtualFolders failed: ${res.response.status.toString()}`,
        );
      }

      return res.data as VirtualFolderInfoSchema[];
    },

    async addVirtualFolder(
      name: string,
      collectionType: CollectionTypeSchema | undefined,
      body: AddVirtualFolderDtoSchema,
    ): Promise<void> {
      const res: PostVirtualFolderResponse = await client.POST(
        "/Library/VirtualFolders",
        {
          params: {
            query: {
              name,
              collectionType,
              refreshLibrary: true,
            },
          },
          body,
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /Library/VirtualFolders failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getBrandingConfiguration(): Promise<BrandingOptionsDtoSchema> {
      const res: GetBrandingConfigurationResponse = await client.GET(
        "/System/Configuration/{key}",
        {
          params: {
            path: {
              key: "Branding",
            },
          },
        },
      );

      if (res.error) {
        throw new Error(
          `GET /System/Configuration/Branding failed: ${res.response.status.toString()}`,
        );
      }

      return res.data as BrandingOptionsDtoSchema;
    },

    async updateBrandingConfiguration(
      body: Partial<BrandingOptionsDtoSchema>,
    ): Promise<void> {
      const res: PostBrandingConfigurationResponse = await client.POST(
        "/System/Configuration/Branding",
        {
          body: body as BrandingOptionsDtoSchema,
        },
      );

      if (res.error) {
        throw new Error(
          `POST /System/Configuration/Branding failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getUsers(): Promise<UserDtoSchema[]> {
      const res: GetUsersResponse = await client.GET("/Users");

      if (res.error) {
        throw new Error(`GET /Users failed: ${res.response.status.toString()}`);
      }

      return res.data as UserDtoSchema[];
    },

    async createUser(body: CreateUserByNameSchema): Promise<void> {
      const res: PostNewUserResponse = await client.POST("/Users/New", {
        body,
      });

      if (res.error) {
        throw new Error(
          `POST /Users/New failed: ${res.response.status.toString()}`,
        );
      }
    },

    async updateUserPolicy(
      userId: string,
      body: UserPolicySchema,
    ): Promise<void> {
      const res: PostUserPolicyResponse = await client.POST(
        "/Users/{userId}/Policy",
        {
          params: { path: { userId } },
          body,
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /Users/{userId}/Policy failed: ${res.response.status.toString()}`,
        );
      }
    },

    async completeStartupWizard(): Promise<void> {
      const res: PostStartupCompleteResponse =
        await client.POST("/Startup/Complete");

      if (res.error) {
        throw new Error(
          `POST /Startup/Complete failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getStartupUser(): Promise<void> {
      const res: GetStartupUserResponse = await client.GET("/Startup/User");

      if (res.error) {
        throw new Error(
          `GET /Startup/User failed: ${res.response.status.toString()}`,
        );
      }
    },

    async updateStartupConfiguration(
      body: StartupConfigurationDtoSchema,
    ): Promise<void> {
      const res: PostStartupConfigurationResponse = await client.POST(
        "/Startup/Configuration",
        {
          body,
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /Startup/Configuration failed: ${res.response.status.toString()}`,
        );
      }
    },

    async updateStartupUser(body: StartupUserDtoSchema): Promise<void> {
      const res: PostStartupUserResponse = await client.POST("/Startup/User", {
        body,
        headers: { "content-type": "application/json" },
      });

      if (res.error) {
        throw new Error(
          `POST /Startup/User failed: ${res.response.status.toString()}`,
        );
      }
    },

    async setRemoteAccess(body: StartupRemoteAccessDtoSchema): Promise<void> {
      const res: PostStartupRemoteAccessResponse = await client.POST(
        "/Startup/RemoteAccess",
        {
          body,
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /Startup/RemoteAccess failed: ${res.response.status.toString()}`,
        );
      }
    },

    async authenticateByName(
      username: string,
      password: string,
    ): Promise<string> {
      const res: PostAuthenticateByNameResponse = await client.POST(
        "/Users/AuthenticateByName",
        {
          body: { Username: username, Pw: password },
          headers: { "content-type": "application/json" },
        },
      );

      if (res.error) {
        throw new Error(
          `POST /Users/AuthenticateByName failed: ${res.response.status.toString()}`,
        );
      }

      const accessToken: string | null | undefined = res.data?.AccessToken;
      if (!accessToken) {
        throw new Error(
          "POST /Users/AuthenticateByName succeeded but returned no AccessToken",
        );
      }

      return accessToken;
    },

    async createApiKey(app: string): Promise<void> {
      const res: PostCreateKeyResponse = await client.POST("/Auth/Keys", {
        params: { query: { app } },
      });

      if (res.error) {
        throw new Error(
          `POST /Auth/Keys failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getApiKeys(): Promise<AuthenticationInfoSchema[]> {
      const res: GetKeysResponse = await client.GET("/Auth/Keys");

      if (res.error) {
        throw new Error(
          `GET /Auth/Keys failed: ${res.response.status.toString()}`,
        );
      }

      return (res.data?.Items ?? []) as AuthenticationInfoSchema[];
    },

    async getPlugins(): Promise<PluginInfoSchema[]> {
      const res: GetPluginsResponse = await client.GET("/Plugins");
      if (res.error) {
        throw new Error(
          `GET /Plugins failed: ${res.response.status.toString()}`,
        );
      }
      return res.data as PluginInfoSchema[];
    },

    async installPackage(name: string): Promise<void> {
      const res: PostInstallPackageResponse = await client.POST(
        "/Packages/Installed/{name}",
        {
          params: { path: { name } },
        },
      );
      if (res.error) {
        throw new Error(
          `POST /Packages/Installed/${name} failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getPluginConfiguration(
      pluginId: string,
    ): Promise<BasePluginConfigurationSchema> {
      const res: GetPluginConfigurationResponse = await client.GET(
        "/Plugins/{pluginId}/Configuration",
        {
          params: { path: { pluginId } },
        },
      );
      if (res.error) {
        throw new Error(
          `GET /Plugins/${pluginId}/Configuration failed: ${res.response.status.toString()}`,
        );
      }
      return res.data as BasePluginConfigurationSchema;
    },

    async updatePluginConfiguration(
      pluginId: string,
      body: BasePluginConfigurationSchema,
    ): Promise<void> {
      const res: PostPluginConfigurationResponse = await client.POST(
        "/Plugins/{pluginId}/Configuration",
        {
          params: { path: { pluginId } },
          body,
        } as unknown as { params: { path: { pluginId: string } } },
      );
      if (res.error) {
        throw new Error(
          `POST /Plugins/${pluginId}/Configuration failed: ${res.response.status.toString()}`,
        );
      }
    },
  };
}
