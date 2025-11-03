import type { ServerConfigurationSchema } from "../types/schema/system";
import type { JF } from "./iface";
import { makeClient } from "./client";
import type { paths } from "../../generated/schema";
import type createClient from "openapi-fetch";

export function makeJF(baseUrl: string, apiKey: string): JF {
  const cl: ReturnType<typeof createClient<paths>> = makeClient(
    baseUrl,
    apiKey,
  );

  return {
    async getSystem(): Promise<ServerConfigurationSchema> {
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await cl.GET("/System/Configuration");

      if (res.error) {
        throw new Error(
          `GET /System/Configuration failed: ${res.response.status.toString()}`,
        );
      }

      return res.data as ServerConfigurationSchema;
    },

    async updateSystem(
      body: Partial<ServerConfigurationSchema>,
    ): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/typedef
      const res = await cl.POST("/System/Configuration", {
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
