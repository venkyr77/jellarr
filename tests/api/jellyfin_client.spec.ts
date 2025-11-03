import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from "vitest";
import { createJellyfinClient } from "../../src/api/jellyfin_client";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type { ServerConfigurationSchema } from "../../src/types/schema/system";

const baseUrl: string = "http://localhost:8096/";
const apiKey: string = "test-key";

let fetchMock: Mock;

function mockFetchJson(body: unknown, status: number = 200): void {
  fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json; charset=utf-8" },
    }),
  );
}

function mockFetchNoContent(status: number = 204): void {
  fetchMock = vi
    .spyOn(global, "fetch")
    .mockResolvedValue(new Response(null, { status }));
}

function getLastRequest(): Request {
  const calls: unknown[][] = fetchMock.mock.calls;
  const lastCall: unknown[] | undefined = calls.at(-1);
  if (!lastCall || !(lastCall[0] instanceof Request)) {
    throw new Error("No Request found in fetch mock calls");
  }
  return lastCall[0];
}

describe("api/jf System façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when GET /System/Configuration returns JSON then it returns the parsed object", async (): Promise<void> => {
    // Arrange
    const payload: ServerConfigurationSchema = {
      EnableMetrics: true,
    } as ServerConfigurationSchema;
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: ServerConfigurationSchema =
      await jellyfinClient.getSystemConfiguration();

    // Assert
    expect(out).toEqual(payload);

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/System\/Configuration$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
    expect(req.headers.get("X-Emby-Authorization")).toContain(
      'MediaBrowser Client="jellarr"',
    );
  });

  it("when POST /System/Configuration succeeds with JSON then it sends JSON body and resolves", async (): Promise<void> => {
    // Arrange
    mockFetchJson({});

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.updateSystemConfiguration({ EnableMetrics: false });

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/System\/Configuration$/);
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("EnableMetrics");
  });

  it("when POST /System/Configuration returns 204 then it still resolves (no body)", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.updateSystemConfiguration({});

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/System\/Configuration$/);
  });

  it("when GET /System/Configuration fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 500 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.getSystemConfiguration()).rejects.toThrow(
      /GET \/System\/Configuration failed/i,
    );
  });

  it("when POST /System/Configuration fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 400 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.updateSystemConfiguration({})).rejects.toThrow(
      /POST \/System\/Configuration failed/i,
    );
  });
});
