import createClient from "openapi-fetch";
import type { paths } from "../generated/schema";

export function makeClient(baseUrl: string, apiKey: string) {
  const client = createClient<paths>({
    baseUrl: baseUrl.replace(/\/+$/, ""),
  });

  client.use({
    async onRequest({ request }) {
      const headers = new Headers(request.headers);
      headers.set("X-Emby-Token", apiKey);
      headers.set(
        "X-Emby-Authorization",
        'MediaBrowser Client="jellarr-ts", Device="cli", Version="0.0.1"',
      );
      return new Request(request, { headers });
    },
  });

  return client;
}
