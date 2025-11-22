import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { calculateNewUsersDiff, applyNewUsers } from "../../src/apply/users";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type { UserConfig, UserConfigList } from "../../src/types/config/users";
import type { UserDtoSchema } from "../../src/types/schema/users";

vi.mock("../../src/mappers/users", () => ({
  mapUserConfigToCreateSchema: vi.fn((config: UserConfig) => ({
    Name: config.name,
    Password: config.password || "mocked-password-from-file",
  })),
}));

describe("calculateNewUsersDiff", () => {
  const currentUsers: UserDtoSchema[] = [
    {
      Name: "existing-user",
      Id: "user-1-id",
      ServerId: "server-id",
    },
    {
      Name: "another-user",
      Id: "user-2-id",
      ServerId: "server-id",
    },
  ];

  it("should return undefined when no users desired", () => {
    // Arrange
    const config: UserConfigList = [];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when all desired users already exist", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
      },
      {
        name: "another-user",
        password: "password",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return users to create when new users desired", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
      },
      {
        name: "new-user",
        password: "new-password",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      name: "new-user",
      password: "new-password",
    });
  });

  it("should return multiple users when multiple new users desired", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "new-user-1",
        password: "password1",
      },
      {
        name: "new-user-2",
        passwordFile: "/secrets/password2",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({
      name: "new-user-1",
      password: "password1",
    });
    expect(result?.[1]).toEqual({
      name: "new-user-2",
      passwordFile: "/secrets/password2",
    });
  });

  it("should handle mixed existing and new users", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
      },
      {
        name: "new-user-1",
        password: "password1",
      },
      {
        name: "another-user",
        password: "password",
      },
      {
        name: "new-user-2",
        passwordFile: "/secrets/password2",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({
      name: "new-user-1",
      password: "password1",
    });
    expect(result?.[1]).toEqual({
      name: "new-user-2",
      passwordFile: "/secrets/password2",
    });
  });

  it("should handle empty current users list", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "new-user",
        password: "password",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff([], config);

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({
      name: "new-user",
      password: "password",
    });
  });

  it("should handle order-independent comparison", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "another-user",
        password: "password",
      },
      {
        name: "existing-user",
        password: "password",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsers,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should handle undefined user names in current users", () => {
    // Arrange
    const currentUsersWithUndefined: UserDtoSchema[] = [
      {
        Name: undefined,
        Id: "user-1-id",
        ServerId: "server-id",
      },
      {
        Name: "existing-user",
        Id: "user-2-id",
        ServerId: "server-id",
      },
    ];

    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
      },
    ];

    // Act
    const result: UserConfig[] | undefined = calculateNewUsersDiff(
      currentUsersWithUndefined,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });
});

describe("applyNewUsers", () => {
  const mockClient: JellyfinClient = {
    createUser: vi.fn(),
  } as unknown as JellyfinClient;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should do nothing when usersToCreate is undefined", async () => {
    // Arrange
    const createUserSpy: Mock = vi.spyOn(mockClient, "createUser");

    // Act
    await applyNewUsers(mockClient, undefined);

    // Assert
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it("should create single user", async () => {
    // Arrange
    const createUserSpy: Mock = vi.spyOn(mockClient, "createUser");
    const usersToCreate: UserConfig[] = [
      {
        name: "test-user",
        password: "test-password",
      },
    ];

    // Act
    await applyNewUsers(mockClient, usersToCreate);

    // Assert
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith({
      Name: "test-user",
      Password: "test-password",
    });
  });

  it("should create multiple users", async () => {
    // Arrange
    const createUserSpy: Mock = vi.spyOn(mockClient, "createUser");
    const usersToCreate: UserConfig[] = [
      {
        name: "user1",
        password: "password1",
      },
      {
        name: "user2",
        passwordFile: "/secrets/password2",
      },
    ];

    // Act
    await applyNewUsers(mockClient, usersToCreate);

    // Assert
    expect(createUserSpy).toHaveBeenCalledTimes(2);
    expect(createUserSpy).toHaveBeenNthCalledWith(1, {
      Name: "user1",
      Password: "password1",
    });
    expect(createUserSpy).toHaveBeenNthCalledWith(2, {
      Name: "user2",
      Password: "mocked-password-from-file",
    });
  });

  it("should handle empty users list", async () => {
    // Arrange
    const createUserSpy: Mock = vi.spyOn(mockClient, "createUser");
    const usersToCreate: UserConfig[] = [];

    // Act
    await applyNewUsers(mockClient, usersToCreate);

    // Assert
    expect(createUserSpy).not.toHaveBeenCalled();
  });
});
