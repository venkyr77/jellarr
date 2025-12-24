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
import type {
  VirtualFolderInfoSchema,
  AddVirtualFolderDtoSchema,
  LibraryOptionsSchema,
} from "../../src/types/schema/library";
import type { EncodingOptionsSchema } from "../../src/types/schema/encoding-options";
import type { BrandingOptionsDtoSchema } from "../../src/types/schema/branding-options";
import type {
  UserDtoSchema,
  CreateUserByNameSchema,
  UserPolicySchema,
} from "../../src/types/schema/users";
import type {
  PluginInfoSchema,
  BasePluginConfigurationSchema,
} from "../../src/types/schema/plugins";

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

describe("api/jf Library façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when GET /Library/VirtualFolders returns JSON then it returns the parsed array", async (): Promise<void> => {
    // Arrange
    const payload: VirtualFolderInfoSchema[] = [
      {
        Name: "Movies",
        CollectionType: "movies",
        Locations: ["/data/movies"],
        ItemId: "123",
      },
      {
        Name: "Shows",
        CollectionType: "tvshows",
        Locations: ["/data/shows"],
        ItemId: "456",
      },
    ];
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: VirtualFolderInfoSchema[] =
      await jellyfinClient.getVirtualFolders();

    // Assert
    expect(out).toEqual(payload);
    expect(out).toHaveLength(2);
    expect(out[0].Name).toBe("Movies");
    expect(out[1].CollectionType).toBe("tvshows");

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/Library\/VirtualFolders$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when GET /Library/VirtualFolders returns empty array then it returns empty array", async (): Promise<void> => {
    // Arrange
    mockFetchJson([]);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: VirtualFolderInfoSchema[] =
      await jellyfinClient.getVirtualFolders();

    // Assert
    expect(out).toEqual([]);
    expect(out).toHaveLength(0);
  });

  it("when GET /Library/VirtualFolders fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 401 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.getVirtualFolders()).rejects.toThrow(
      /GET \/Library\/VirtualFolders failed/i,
    );
  });

  it("when POST /Library/VirtualFolders succeeds then it sends correct body and query params", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);
    const body: AddVirtualFolderDtoSchema = {
      LibraryOptions: {
        PathInfos: [{ Path: "/data/movies" }],
      } as LibraryOptionsSchema,
    };

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.addVirtualFolder("Test Movies", "movies", body);

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Library\/VirtualFolders/);
    expect(req.url).toContain("name=Test%20Movies");
    expect(req.url).toContain("collectionType=movies");
    expect(req.url).toContain("refreshLibrary=true");
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("LibraryOptions");
    expect(bodyText).toContain("/data/movies");
  });

  it("when POST /Library/VirtualFolders fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 500 }));

    const body: AddVirtualFolderDtoSchema = {
      LibraryOptions: {
        PathInfos: [{ Path: "/data/test" }],
      } as LibraryOptionsSchema,
    };

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(
      jellyfinClient.addVirtualFolder("Test", "movies", body),
    ).rejects.toThrow(/POST \/Library\/VirtualFolders failed/i);
  });
});

describe("api/jf Encoding façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when GET /System/Configuration/Encoding returns JSON then it returns the parsed object", async (): Promise<void> => {
    // Arrange
    const payload: EncodingOptionsSchema = {
      EnableHardwareEncoding: true,
      EnableHardwareDecoding: false,
    } as EncodingOptionsSchema;
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: EncodingOptionsSchema =
      await jellyfinClient.getEncodingConfiguration();

    // Assert
    expect(out).toEqual(payload);

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/System\/Configuration\/encoding$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when POST /System/Configuration/Encoding succeeds then it sends JSON body and resolves", async (): Promise<void> => {
    // Arrange
    mockFetchJson({});

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.updateEncodingConfiguration({
      EnableHardwareEncoding: true,
    });

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/System\/Configuration\/encoding$/);
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("EnableHardwareEncoding");
  });

  it("when GET /System/Configuration/Encoding fails then it throws an error with status", async (): Promise<void> => {
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
    await expect(jellyfinClient.getEncodingConfiguration()).rejects.toThrow(
      /GET \/System\/Configuration\/encoding failed/i,
    );
  });

  it("when POST /System/Configuration/Encoding fails then it throws an error with status", async (): Promise<void> => {
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
    await expect(
      jellyfinClient.updateEncodingConfiguration({}),
    ).rejects.toThrow(/POST \/System\/Configuration\/encoding failed/i);
  });
});

describe("api/jf Branding façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when GET /System/Configuration/Branding returns JSON then it returns the parsed object", async (): Promise<void> => {
    // Arrange
    const payload: BrandingOptionsDtoSchema = {
      LoginDisclaimer: "Welcome to our server",
      CustomCss: "body { background: blue; }",
      SplashscreenEnabled: true,
    } as BrandingOptionsDtoSchema;
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: BrandingOptionsDtoSchema =
      await jellyfinClient.getBrandingConfiguration();

    // Assert
    expect(out).toEqual(payload);

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/System\/Configuration\/Branding$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when POST /System/Configuration/Branding succeeds then it sends JSON body and resolves", async (): Promise<void> => {
    // Arrange
    mockFetchJson({});

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.updateBrandingConfiguration({
      LoginDisclaimer: "New disclaimer",
      SplashscreenEnabled: false,
    });

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/System\/Configuration\/Branding$/);
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("LoginDisclaimer");
    expect(bodyText).toContain("SplashscreenEnabled");
  });

  it("when GET /System/Configuration/Branding fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 403 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.getBrandingConfiguration()).rejects.toThrow(
      /GET \/System\/Configuration\/Branding failed/i,
    );
  });

  it("when POST /System/Configuration/Branding fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 422 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(
      jellyfinClient.updateBrandingConfiguration({}),
    ).rejects.toThrow(/POST \/System\/Configuration\/Branding failed/i);
  });
});

describe("api/jf Users façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when GET /Users returns JSON then it returns the parsed array", async (): Promise<void> => {
    // Arrange
    const payload: UserDtoSchema[] = [
      {
        Name: "admin",
        Id: "user1-id",
        ServerId: "server-id",
        HasConfiguredPassword: true,
      },
      {
        Name: "testuser",
        Id: "user2-id",
        ServerId: "server-id",
        HasConfiguredPassword: true,
      },
    ] as UserDtoSchema[];
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: UserDtoSchema[] = await jellyfinClient.getUsers();

    // Assert
    expect(out).toEqual(payload);
    expect(out).toHaveLength(2);
    expect(out[0].Name).toBe("admin");
    expect(out[1].Name).toBe("testuser");

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/Users$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when GET /Users returns empty array then it returns empty array", async (): Promise<void> => {
    // Arrange
    mockFetchJson([]);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: UserDtoSchema[] = await jellyfinClient.getUsers();

    // Assert
    expect(out).toEqual([]);
    expect(out).toHaveLength(0);
  });

  it("when POST /Users/New succeeds then it sends JSON body and resolves", async (): Promise<void> => {
    // Arrange
    const responsePayload: UserDtoSchema = {
      Name: "newuser",
      Id: "new-user-id",
      ServerId: "server-id",
    } as UserDtoSchema;
    mockFetchJson(responsePayload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const createBody: CreateUserByNameSchema = {
      Name: "newuser",
      Password: "testpass",
    };
    await jellyfinClient.createUser(createBody);

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Users\/New$/);
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("newuser");
    expect(bodyText).toContain("testpass");
  });

  it("when GET /Users fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 401 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.getUsers()).rejects.toThrow(
      /GET \/Users failed/i,
    );
  });

  it("when POST /Users/New fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 409 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const createBody: CreateUserByNameSchema = {
      Name: "duplicate",
      Password: "test",
    };

    // Assert
    await expect(jellyfinClient.createUser(createBody)).rejects.toThrow(
      /POST \/Users\/New failed/i,
    );
  });

  it("when POST /Users/{userId}/Policy succeeds then it sends JSON body and resolves", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const policyBody: UserPolicySchema = {
      IsAdministrator: true,
      LoginAttemptsBeforeLockout: 5,
    } as UserPolicySchema;
    await jellyfinClient.updateUserPolicy("user-id-123", policyBody);

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Users\/user-id-123\/Policy/);
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("IsAdministrator");
    expect(bodyText).toContain("LoginAttemptsBeforeLockout");
  });

  it("when POST /Users/{userId}/Policy fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 400 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const policyBody: UserPolicySchema = {
      IsAdministrator: false,
    } as UserPolicySchema;

    // Assert
    await expect(
      jellyfinClient.updateUserPolicy("user-id-123", policyBody),
    ).rejects.toThrow(/POST \/Users\/\{userId\}\/Policy failed/i);
  });
});

describe("api/jf Startup façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when POST /Startup/Complete succeeds then it resolves", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.completeStartupWizard();

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Startup\/Complete$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when POST /Startup/Complete fails then it throws an error with status", async (): Promise<void> => {
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
    await expect(jellyfinClient.completeStartupWizard()).rejects.toThrow(
      /POST \/Startup\/Complete failed/i,
    );
  });
});

describe("api/jf Plugins façade", () => {
  beforeEach((): void => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("when GET /Plugins returns JSON then it returns the parsed array", async (): Promise<void> => {
    // Arrange
    const payload: PluginInfoSchema[] = [
      {
        Name: "Trakt",
        Version: "26.0.0",
        Id: "plugin-id-1",
        Status: "Active",
      },
      {
        Name: "Playback Reporting",
        Version: "10.0.0",
        Id: "plugin-id-2",
        Status: "Active",
      },
    ] as PluginInfoSchema[];
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: PluginInfoSchema[] = await jellyfinClient.getPlugins();

    // Assert
    expect(out).toEqual(payload);
    expect(out).toHaveLength(2);
    expect(out[0].Name).toBe("Trakt");
    expect(out[1].Name).toBe("Playback Reporting");

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/Plugins$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when GET /Plugins returns empty array then it returns empty array", async (): Promise<void> => {
    // Arrange
    mockFetchJson([]);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: PluginInfoSchema[] = await jellyfinClient.getPlugins();

    // Assert
    expect(out).toEqual([]);
    expect(out).toHaveLength(0);
  });

  it("when GET /Plugins fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 401 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.getPlugins()).rejects.toThrow(
      /GET \/Plugins failed/i,
    );
  });

  it("when POST /Packages/Installed/{name} succeeds then it resolves", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.installPackage("Trakt");

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Packages\/Installed\/Trakt$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when POST /Packages/Installed/{name} with spaces succeeds then it URL-encodes the name", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    await jellyfinClient.installPackage("Playback Reporting");

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Packages\/Installed\/Playback%20Reporting$/);
  });

  it("when POST /Packages/Installed/{name} fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 404 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(jellyfinClient.installPackage("NonExistent")).rejects.toThrow(
      /POST \/Packages\/Installed\/NonExistent failed/i,
    );
  });

  it("when GET /Plugins/{pluginId}/Configuration returns JSON then it returns the parsed object", async (): Promise<void> => {
    // Arrange
    const payload: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: false, Scrobble: true }],
    } as unknown as BasePluginConfigurationSchema;
    mockFetchJson(payload);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const out: BasePluginConfigurationSchema =
      await jellyfinClient.getPluginConfiguration("plugin-id-123");

    // Assert
    expect(out).toEqual(payload);

    const req: Request = getLastRequest();
    expect(req.method).toBe("GET");
    expect(req.url).toMatch(/\/Plugins\/plugin-id-123\/Configuration$/);
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);
  });

  it("when GET /Plugins/{pluginId}/Configuration fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 404 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );

    // Assert
    await expect(
      jellyfinClient.getPluginConfiguration("nonexistent-id"),
    ).rejects.toThrow(/GET \/Plugins\/nonexistent-id\/Configuration failed/i);
  });

  it("when POST /Plugins/{pluginId}/Configuration succeeds then it sends JSON body and resolves", async (): Promise<void> => {
    // Arrange
    mockFetchNoContent(204);

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const configBody: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: true, Scrobble: false }],
    } as unknown as BasePluginConfigurationSchema;
    await jellyfinClient.updatePluginConfiguration("plugin-id-123", configBody);

    // Assert
    const req: Request = getLastRequest();
    expect(req.method).toBe("POST");
    expect(req.url).toMatch(/\/Plugins\/plugin-id-123\/Configuration$/);
    expect(req.headers.get("content-type")).toBe("application/json");
    expect(req.headers.get("X-Emby-Token")).toBe(apiKey);

    const bodyText: string = await req.text();
    expect(bodyText).toContain("TraktUsers");
    expect(bodyText).toContain("ExtraLogging");
  });

  it("when POST /Plugins/{pluginId}/Configuration fails then it throws an error with status", async (): Promise<void> => {
    // Arrange
    fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("boom", { status: 400 }));

    // Act
    const jellyfinClient: JellyfinClient = createJellyfinClient(
      baseUrl,
      apiKey,
    );
    const configBody: BasePluginConfigurationSchema =
      {} as BasePluginConfigurationSchema;

    // Assert
    await expect(
      jellyfinClient.updatePluginConfiguration("plugin-id-123", configBody),
    ).rejects.toThrow(/POST \/Plugins\/plugin-id-123\/Configuration failed/i);
  });
});
