import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculateNewUsersDiff,
  createNewUsers,
  calculateUserPoliciesDiff,
  applyUserPolicies,
} from "../../src/apply/users";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type { UserConfig, UserConfigList } from "../../src/types/config/users";
import type {
  UserDtoSchema,
  UserPolicySchema,
} from "../../src/types/schema/users";
vi.mock("../../src/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../src/mappers/users", () => ({
  mapUserConfigToCreateSchema: vi.fn((config: UserConfig) => ({
    Name: config.name,
    Password: config.password ?? "mocked-password-from-file",
  })),
  mapUserPolicyConfigToSchema: vi.fn(
    (policy: {
      isAdministrator?: boolean;
      loginAttemptsBeforeLockout?: number;
    }) => {
      const result: Record<string, boolean | number> = {};
      if (policy.isAdministrator !== undefined) {
        result.IsAdministrator = policy.isAdministrator;
      }
      if (policy.loginAttemptsBeforeLockout !== undefined) {
        result.LoginAttemptsBeforeLockout = policy.loginAttemptsBeforeLockout;
      }
      return result;
    },
  ),
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

describe("createNewUsers", () => {
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
    await createNewUsers(mockClient, undefined);

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
    await createNewUsers(mockClient, usersToCreate);

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
    await createNewUsers(mockClient, usersToCreate);

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
    await createNewUsers(mockClient, usersToCreate);

    // Assert
    expect(createUserSpy).not.toHaveBeenCalled();
  });
});

describe("calculateUserPoliciesDiff", () => {
  let currentUsers: UserDtoSchema[];

  beforeEach(() => {
    vi.clearAllMocks();
    currentUsers = [
      {
        Name: "existing-user",
        Id: "user-1-id",
        ServerId: "server-id",
        Policy: {
          IsAdministrator: false,
          LoginAttemptsBeforeLockout: 5,
        },
      } as UserDtoSchema,
      {
        Name: "admin-user",
        Id: "user-2-id",
        ServerId: "server-id",
        Policy: {
          IsAdministrator: true,
          LoginAttemptsBeforeLockout: 3,
        },
      } as UserDtoSchema,
    ];
  });

  it("should return undefined when no users desired", () => {
    // Arrange
    const config: UserConfigList = [];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when no existing users match desired users", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "non-existent-user",
        password: "password",
        policy: {
          isAdministrator: true,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when no user policies change", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          isAdministrator: false,
          loginAttemptsBeforeLockout: 5,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return policies to update when isAdministrator changes from false to true", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          isAdministrator: true,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(1);
    expect(result?.has("user-1-id")).toBe(true);
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-1-id");
    expect(updatedPolicy?.IsAdministrator).toBe(true);
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(5);
  });

  it("should return policies to update when isAdministrator changes from true to false", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "admin-user",
        password: "password",
        policy: {
          isAdministrator: false,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(1);
    expect(result?.has("user-2-id")).toBe(true);
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-2-id");
    expect(updatedPolicy?.IsAdministrator).toBe(false);
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(3);
  });

  it("should not modify policy when isAdministrator value is the same", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          isAdministrator: false,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return policies to update when loginAttemptsBeforeLockout changes", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "admin-user",
        password: "password",
        policy: {
          loginAttemptsBeforeLockout: 10,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(1);
    expect(result?.has("user-2-id")).toBe(true);
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-2-id");
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(10);
    expect(updatedPolicy?.IsAdministrator).toBe(true);
  });

  it("should not modify policy when loginAttemptsBeforeLockout value is the same", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          loginAttemptsBeforeLockout: 5,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return multiple policies when multiple users change", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          isAdministrator: true,
        },
      },
      {
        name: "admin-user",
        password: "password",
        policy: {
          isAdministrator: false,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(2);
    expect(result?.has("user-1-id")).toBe(true);
    expect(result?.has("user-2-id")).toBe(true);

    const policy1: UserPolicySchema | undefined = result?.get("user-1-id");
    expect(policy1?.IsAdministrator).toBe(true);
    expect(policy1?.LoginAttemptsBeforeLockout).toBe(5);

    const policy2: UserPolicySchema | undefined = result?.get("user-2-id");
    expect(policy2?.IsAdministrator).toBe(false);
    expect(policy2?.LoginAttemptsBeforeLockout).toBe(3);
  });

  it("should handle users without Id gracefully", () => {
    // Arrange
    const currentUsersWithoutId: UserDtoSchema[] = [
      {
        Name: "no-id-user",
        Id: undefined,
        ServerId: "server-id",
      } as UserDtoSchema,
    ];

    const config: UserConfigList = [
      {
        name: "no-id-user",
        password: "password",
        policy: {
          isAdministrator: true,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsersWithoutId, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should not modify policy when isAdministrator is undefined", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          loginAttemptsBeforeLockout: 10,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-1-id");
    expect(updatedPolicy?.IsAdministrator).toBe(false);
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(10);
  });

  it("should not modify policy when loginAttemptsBeforeLockout is undefined", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          isAdministrator: true,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-1-id");
    expect(updatedPolicy?.IsAdministrator).toBe(true);
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(5);
  });

  it("should preserve existing policy data when no new policy specified", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should handle all policy fields together when both change", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "existing-user",
        password: "password",
        policy: {
          isAdministrator: true,
          loginAttemptsBeforeLockout: 10,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(1);
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-1-id");
    expect(updatedPolicy?.IsAdministrator).toBe(true);
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(10);
  });

  it("should handle mixed scenario where one field changes and one stays same", () => {
    // Arrange
    const config: UserConfigList = [
      {
        name: "admin-user",
        password: "password",
        policy: {
          isAdministrator: true,
          loginAttemptsBeforeLockout: 15,
        },
      },
    ];

    // Act
    const result: Map<string, UserPolicySchema> | undefined =
      calculateUserPoliciesDiff(currentUsers, config);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(1);
    const updatedPolicy: UserPolicySchema | undefined =
      result?.get("user-2-id");
    expect(updatedPolicy?.IsAdministrator).toBe(true);
    expect(updatedPolicy?.LoginAttemptsBeforeLockout).toBe(15);
  });
});

describe("applyUserPolicies", () => {
  let mockClient: JellyfinClient;
  let updatePolicySpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    updatePolicySpy = vi.fn();
    mockClient = {
      updateUserPolicy: updatePolicySpy,
    } as unknown as JellyfinClient;
  });

  it("should do nothing when policiesToUpdate is undefined", async () => {
    // Act
    await applyUserPolicies(mockClient, undefined);

    // Assert
    expect(updatePolicySpy).not.toHaveBeenCalled();
  });

  it("should call client.updateUserPolicy for single user", async () => {
    // Arrange
    const policiesToUpdate: Map<string, UserPolicySchema> = new Map([
      [
        "user-1-id",
        {
          IsAdministrator: true,
          LoginAttemptsBeforeLockout: 5,
        } as UserPolicySchema,
      ],
    ]);

    updatePolicySpy.mockResolvedValue(undefined);

    // Act
    await applyUserPolicies(mockClient, policiesToUpdate);

    // Assert
    expect(updatePolicySpy).toHaveBeenCalledTimes(1);
    expect(updatePolicySpy).toHaveBeenCalledWith("user-1-id", {
      IsAdministrator: true,
      LoginAttemptsBeforeLockout: 5,
    });
  });

  it("should call client.updateUserPolicy for multiple users", async () => {
    // Arrange
    const policiesToUpdate: Map<string, UserPolicySchema> = new Map([
      [
        "user-1-id",
        {
          IsAdministrator: true,
        } as UserPolicySchema,
      ],
      [
        "user-2-id",
        {
          IsAdministrator: false,
          LoginAttemptsBeforeLockout: 10,
        } as UserPolicySchema,
      ],
    ]);

    updatePolicySpy.mockResolvedValue(undefined);

    // Act
    await applyUserPolicies(mockClient, policiesToUpdate);

    // Assert
    expect(updatePolicySpy).toHaveBeenCalledTimes(2);
    expect(updatePolicySpy).toHaveBeenCalledWith("user-1-id", {
      IsAdministrator: true,
    });
    expect(updatePolicySpy).toHaveBeenCalledWith("user-2-id", {
      IsAdministrator: false,
      LoginAttemptsBeforeLockout: 10,
    });
  });

  it("should handle empty policies map", async () => {
    // Arrange
    const policiesToUpdate: Map<string, UserPolicySchema> = new Map();

    // Act
    await applyUserPolicies(mockClient, policiesToUpdate);

    // Assert
    expect(updatePolicySpy).not.toHaveBeenCalled();
  });
});
