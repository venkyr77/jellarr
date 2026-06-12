import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculateApiKeysToCreate,
  createApiKeys,
} from "../../src/apply/api-keys";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type {
  ApiKeyConfig,
  ApiKeyConfigList,
} from "../../src/types/config/api-keys";
import type { AuthenticationInfoSchema } from "../../src/types/schema/api-keys";

vi.mock("../../src/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("calculateApiKeysToCreate", () => {
  it("should return all desired keys when none currently exist", () => {
    // Arrange
    const current: AuthenticationInfoSchema[] = [];
    const desired: ApiKeyConfigList = [
      { name: "jellyseerr" },
      { name: "sonarr" },
    ];

    // Act
    const result: ApiKeyConfig[] | undefined = calculateApiKeysToCreate(
      current,
      desired,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({ name: "jellyseerr" });
    expect(result?.[1]).toEqual({ name: "sonarr" });
  });

  it("should return only missing keys when some already exist", () => {
    // Arrange
    const current: AuthenticationInfoSchema[] = [
      { AppName: "jellyseerr" } as AuthenticationInfoSchema,
    ];
    const desired: ApiKeyConfigList = [
      { name: "jellyseerr" },
      { name: "sonarr" },
    ];

    // Act
    const result: ApiKeyConfig[] | undefined = calculateApiKeysToCreate(
      current,
      desired,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({ name: "sonarr" });
  });

  it("should return undefined when all desired keys already exist", () => {
    // Arrange
    const current: AuthenticationInfoSchema[] = [
      { AppName: "jellyseerr" } as AuthenticationInfoSchema,
      { AppName: "sonarr" } as AuthenticationInfoSchema,
    ];
    const desired: ApiKeyConfigList = [
      { name: "jellyseerr" },
      { name: "sonarr" },
    ];

    // Act
    const result: ApiKeyConfig[] | undefined = calculateApiKeysToCreate(
      current,
      desired,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when desired list is empty", () => {
    // Arrange
    const current: AuthenticationInfoSchema[] = [
      { AppName: "jellyseerr" } as AuthenticationInfoSchema,
    ];
    const desired: ApiKeyConfigList = [];

    // Act
    const result: ApiKeyConfig[] | undefined = calculateApiKeysToCreate(
      current,
      desired,
    );

    // Assert
    expect(result).toBeUndefined();
  });
});

describe("createApiKeys", () => {
  let mockClient: JellyfinClient;
  let createApiKeySpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    createApiKeySpy = vi.fn();
    mockClient = {
      createApiKey: createApiKeySpy,
    } as unknown as JellyfinClient;
  });

  it("should do nothing when keys is undefined", async () => {
    // Act
    await createApiKeys(mockClient, undefined);

    // Assert
    expect(createApiKeySpy).not.toHaveBeenCalled();
  });

  it("should call createApiKey once per key with the correct name", async () => {
    // Arrange
    const keys: ApiKeyConfig[] = [{ name: "jellyseerr" }, { name: "sonarr" }];
    createApiKeySpy.mockResolvedValue(undefined);

    // Act
    await createApiKeys(mockClient, keys);

    // Assert
    expect(createApiKeySpy).toHaveBeenCalledTimes(2);
    expect(createApiKeySpy).toHaveBeenNthCalledWith(1, "jellyseerr");
    expect(createApiKeySpy).toHaveBeenNthCalledWith(2, "sonarr");
  });

  it("should handle empty keys list without calling createApiKey", async () => {
    // Arrange
    const keys: ApiKeyConfig[] = [];

    // Act
    await createApiKeys(mockClient, keys);

    // Assert
    expect(createApiKeySpy).not.toHaveBeenCalled();
  });
});
