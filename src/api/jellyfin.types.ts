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
import {
  type PluginInfoSchema,
  type BasePluginConfigurationSchema,
} from "../types/schema/plugins";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: unknown;
  response: Response;
}

export type GetSystemConfigurationResponse =
  ApiResponse<ServerConfigurationSchema>;
export type PostSystemConfigurationResponse = ApiResponse<void>;
export type GetEncodingConfigurationResponse = ApiResponse;
export type PostEncodingConfigurationResponse = ApiResponse<void>;
export type GetVirtualFoldersResponse = ApiResponse<VirtualFolderInfoSchema[]>;
export type PostVirtualFolderResponse = ApiResponse<void>;
export type GetBrandingConfigurationResponse = ApiResponse;
export type PostBrandingConfigurationResponse = ApiResponse<void>;
export type GetUsersResponse = ApiResponse<UserDtoSchema[]>;
export type PostNewUserResponse = ApiResponse<UserDtoSchema>;
export type PostUserPolicyResponse = ApiResponse<void>;
export type PostStartupCompleteResponse = ApiResponse<void>;
export type GetPluginsResponse = ApiResponse<PluginInfoSchema[]>;
export type PostInstallPackageResponse = ApiResponse<void>;
export type GetPluginConfigurationResponse =
  ApiResponse<BasePluginConfigurationSchema>;
export type PostPluginConfigurationResponse = ApiResponse<void>;

export interface JellyfinClient {
  getSystemConfiguration(): Promise<ServerConfigurationSchema>;
  updateSystemConfiguration(
    body: Partial<ServerConfigurationSchema>,
  ): Promise<void>;
  getEncodingConfiguration(): Promise<EncodingOptionsSchema>;
  updateEncodingConfiguration(
    body: Partial<EncodingOptionsSchema>,
  ): Promise<void>;
  getVirtualFolders(): Promise<VirtualFolderInfoSchema[]>;
  addVirtualFolder(
    name: string,
    collectionType: CollectionTypeSchema | undefined,
    body: AddVirtualFolderDtoSchema,
  ): Promise<void>;
  getBrandingConfiguration(): Promise<BrandingOptionsDtoSchema>;
  updateBrandingConfiguration(
    body: Partial<BrandingOptionsDtoSchema>,
  ): Promise<void>;
  getUsers(): Promise<UserDtoSchema[]>;
  createUser(body: CreateUserByNameSchema): Promise<void>;
  updateUserPolicy(userId: string, body: UserPolicySchema): Promise<void>;
  completeStartupWizard(): Promise<void>;
  getPlugins(): Promise<PluginInfoSchema[]>;
  installPackage(name: string): Promise<void>;
  getPluginConfiguration(
    pluginId: string,
  ): Promise<BasePluginConfigurationSchema>;
  updatePluginConfiguration(
    pluginId: string,
    body: BasePluginConfigurationSchema,
  ): Promise<void>;
}
