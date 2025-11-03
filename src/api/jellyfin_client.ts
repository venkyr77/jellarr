import type { ServerConfigurationSchema } from "../types/schema/system";
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
  };
}
