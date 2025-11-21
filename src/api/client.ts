import createClient, { type Client } from "openapi-fetch";
import type { paths } from "../../generated/schema";

export function makeClient(baseUrl: string, apiKey: string): Client<paths> {
  const client: Client<paths> = createClient<paths>({
    baseUrl: baseUrl.replace(/\/+$/, ""),
  });

  client.use({
    onRequest({ request }: { request: Request }): Request {
      const headers: Headers = new Headers(request.headers);
      headers.set("X-Emby-Token", apiKey);
      headers.set(
        "X-Emby-Authorization",
        'MediaBrowser Client="jellarr", Device="cli", Version="0.1.0"',
      );
      return new Request(request, { headers });
    },
  });

  return client;
}
