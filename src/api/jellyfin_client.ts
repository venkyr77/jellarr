import type { ServerConfigurationSchema } from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding-options";
import type {
  VirtualFolderInfoSchema,
  AddVirtualFolderDtoSchema,
  CollectionTypeSchema,
} from "../types/schema/library";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import type { JellyfinClient } from "./jellyfin.types";
import { makeClient } from "./client";
import type { paths } from "../../generated/schema";
import type createClient from "openapi-fetch";

export function createJellyfinClient(
  baseUrl: string,
  apiKey: string,
): JellyfinClient {
  const client: ReturnType<typeof createClient<paths>> = makeClient(
    baseUrl,
    apiKey,
  );

  return {
    async getSystemConfiguration(): Promise<ServerConfigurationSchema> {
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.GET("/System/Configuration");

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
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.POST("/System/Configuration", {
        body,
        headers: { "content-type": "application/json" },
      });

      if (res.error) {
        throw new Error(
          `POST /System/Configuration failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getEncodingConfiguration(): Promise<EncodingOptionsSchema> {
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.GET("/System/Configuration/{key}", {
        params: { path: { key: "encoding" } },
      });

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
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.POST("/System/Configuration/{key}", {
        params: { path: { key: "encoding" } },
        body,
        headers: { "content-type": "application/json" },
      });

      if (res.error) {
        throw new Error(
          `POST /System/Configuration/encoding failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getVirtualFolders(): Promise<VirtualFolderInfoSchema[]> {
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.GET("/Library/VirtualFolders");

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
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.POST("/Library/VirtualFolders", {
        params: {
          query: {
            name,
            collectionType,
            refreshLibrary: true,
          },
        },
        body,
        headers: { "content-type": "application/json" },
      });

      if (res.error) {
        throw new Error(
          `POST /Library/VirtualFolders failed: ${res.response.status.toString()}`,
        );
      }
    },

    async getBrandingConfiguration(): Promise<BrandingOptionsDtoSchema> {
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.GET("/System/Configuration/{key}", {
        params: {
          path: {
            key: "Branding",
          },
        },
      });

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
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await client.POST("/System/Configuration/Branding", {
        body: body as BrandingOptionsDtoSchema,
      });

      if (res.error) {
        throw new Error(
          `POST /System/Configuration/Branding failed: ${res.response.status.toString()}`,
        );
      }
    },
  };
}
