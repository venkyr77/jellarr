import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculatePluginsToInstall,
  installPlugins,
  getPluginConfigurationSchemaByName,
  calculatePluginConfigurationDiff,
  calculatePluginConfigurationsDiff,
  applyPluginConfigurations,
} from "../../src/apply/plugins";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type {
  PluginConfig,
  PluginConfigList,
  PluginConfigurationConfig,
} from "../../src/types/config/plugins";
import type {
  PluginInfoSchema,
  BasePluginConfigurationSchema,
  PluginConfigurationSchema,
} from "../../src/types/schema/plugins";

vi.mock("../../src/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("calculatePluginsToInstall", () => {
  const installedPlugins: PluginInfoSchema[] = [
    {
      Name: "Trakt",
      Version: "26.0.0",
      Id: "plugin-1-id",
      Status: "Active",
    } as PluginInfoSchema,
    {
      Name: "Playback Reporting",
      Version: "10.0.0",
      Id: "plugin-2-id",
      Status: "Active",
    } as PluginInfoSchema,
  ];

  it("should return undefined when no plugins desired", () => {
    // Arrange
    const config: PluginConfigList = [];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when all desired plugins already installed", () => {
    // Arrange
    const config: PluginConfigList = [
      { name: "Trakt" },
      { name: "Playback Reporting" },
    ];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return plugins to install when new plugins desired", () => {
    // Arrange
    const config: PluginConfigList = [{ name: "Trakt" }, { name: "Fanart" }];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({ name: "Fanart" });
  });

  it("should return multiple plugins when multiple new plugins desired", () => {
    // Arrange
    const config: PluginConfigList = [
      { name: "Fanart" },
      { name: "TMDb Box Sets" },
    ];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({ name: "Fanart" });
    expect(result?.[1]).toEqual({ name: "TMDb Box Sets" });
  });

  it("should handle mixed existing and new plugins", () => {
    // Arrange
    const config: PluginConfigList = [
      { name: "Trakt" },
      { name: "Fanart" },
      { name: "Playback Reporting" },
      { name: "TMDb Box Sets" },
    ];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result?.[0]).toEqual({ name: "Fanart" });
    expect(result?.[1]).toEqual({ name: "TMDb Box Sets" });
  });

  it("should handle empty installed plugins list", () => {
    // Arrange
    const config: PluginConfigList = [{ name: "Trakt" }];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      [],
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({ name: "Trakt" });
  });

  it("should handle order-independent comparison", () => {
    // Arrange
    const config: PluginConfigList = [
      { name: "Playback Reporting" },
      { name: "Trakt" },
    ];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should handle undefined plugin names in installed plugins", () => {
    // Arrange
    const installedWithUndefined: PluginInfoSchema[] = [
      {
        Name: undefined,
        Id: "plugin-1-id",
      } as PluginInfoSchema,
      {
        Name: "Trakt",
        Id: "plugin-2-id",
      } as PluginInfoSchema,
    ];

    const config: PluginConfigList = [{ name: "Trakt" }];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedWithUndefined,
      config,
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should be case-sensitive when matching plugin names", () => {
    // Arrange
    const config: PluginConfigList = [{ name: "trakt" }];

    // Act
    const result: PluginConfig[] | undefined = calculatePluginsToInstall(
      installedPlugins,
      config,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result?.[0]).toEqual({ name: "trakt" });
  });
});

describe("installPlugins", () => {
  let mockClient: JellyfinClient;
  let installPackageSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    installPackageSpy = vi.fn();
    mockClient = {
      installPackage: installPackageSpy,
    } as unknown as JellyfinClient;
  });

  it("should do nothing when plugins is undefined", async () => {
    // Act
    await installPlugins(mockClient, undefined);

    // Assert
    expect(installPackageSpy).not.toHaveBeenCalled();
  });

  it("should install single plugin", async () => {
    // Arrange
    const pluginsToInstall: PluginConfig[] = [{ name: "Trakt" }];
    installPackageSpy.mockResolvedValue(undefined);

    // Act
    await installPlugins(mockClient, pluginsToInstall);

    // Assert
    expect(installPackageSpy).toHaveBeenCalledTimes(1);
    expect(installPackageSpy).toHaveBeenCalledWith("Trakt");
  });

  it("should install multiple plugins", async () => {
    // Arrange
    const pluginsToInstall: PluginConfig[] = [
      { name: "Trakt" },
      { name: "Fanart" },
      { name: "Playback Reporting" },
    ];
    installPackageSpy.mockResolvedValue(undefined);

    // Act
    await installPlugins(mockClient, pluginsToInstall);

    // Assert
    expect(installPackageSpy).toHaveBeenCalledTimes(3);
    expect(installPackageSpy).toHaveBeenNthCalledWith(1, "Trakt");
    expect(installPackageSpy).toHaveBeenNthCalledWith(2, "Fanart");
    expect(installPackageSpy).toHaveBeenNthCalledWith(3, "Playback Reporting");
  });

  it("should handle empty plugins list", async () => {
    // Arrange
    const pluginsToInstall: PluginConfig[] = [];

    // Act
    await installPlugins(mockClient, pluginsToInstall);

    // Assert
    expect(installPackageSpy).not.toHaveBeenCalled();
  });

  it("should install plugins with spaces in name", async () => {
    // Arrange
    const pluginsToInstall: PluginConfig[] = [
      { name: "Playback Reporting" },
      { name: "TMDb Box Sets" },
    ];
    installPackageSpy.mockResolvedValue(undefined);

    // Act
    await installPlugins(mockClient, pluginsToInstall);

    // Assert
    expect(installPackageSpy).toHaveBeenCalledTimes(2);
    expect(installPackageSpy).toHaveBeenNthCalledWith(1, "Playback Reporting");
    expect(installPackageSpy).toHaveBeenNthCalledWith(2, "TMDb Box Sets");
  });
});

describe("getPluginConfigurationSchemaByName", () => {
  let mockClient: JellyfinClient;
  let getPluginConfigurationSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    getPluginConfigurationSpy = vi.fn();
    mockClient = {
      getPluginConfiguration: getPluginConfigurationSpy,
    } as unknown as JellyfinClient;
  });

  it("should return empty map when no plugins", async () => {
    // Arrange
    const installedPlugins: PluginInfoSchema[] = [];

    // Act
    const result: Map<string, PluginConfigurationSchema> =
      await getPluginConfigurationSchemaByName(mockClient, installedPlugins);

    // Assert
    expect(result.size).toBe(0);
    expect(getPluginConfigurationSpy).not.toHaveBeenCalled();
  });

  it("should return map with plugin configurations", async () => {
    // Arrange
    const installedPlugins: PluginInfoSchema[] = [
      { Name: "Trakt", Id: "trakt-id" } as PluginInfoSchema,
      { Name: "Fanart", Id: "fanart-id" } as PluginInfoSchema,
    ];
    const traktConfig: BasePluginConfigurationSchema = {
      TraktUsers: [],
    } as unknown as BasePluginConfigurationSchema;
    const fanartConfig: BasePluginConfigurationSchema = {
      EnableImages: true,
    } as unknown as BasePluginConfigurationSchema;
    getPluginConfigurationSpy
      .mockResolvedValueOnce(traktConfig)
      .mockResolvedValueOnce(fanartConfig);

    // Act
    const result: Map<string, PluginConfigurationSchema> =
      await getPluginConfigurationSchemaByName(mockClient, installedPlugins);

    // Assert
    expect(result.size).toBe(2);
    expect(result.get("Trakt")).toEqual({
      id: "trakt-id",
      configuration: traktConfig,
    });
    expect(result.get("Fanart")).toEqual({
      id: "fanart-id",
      configuration: fanartConfig,
    });
    expect(getPluginConfigurationSpy).toHaveBeenCalledTimes(2);
    expect(getPluginConfigurationSpy).toHaveBeenCalledWith("trakt-id");
    expect(getPluginConfigurationSpy).toHaveBeenCalledWith("fanart-id");
  });

  it("should skip plugins without Id", async () => {
    // Arrange
    const installedPlugins: PluginInfoSchema[] = [
      { Name: "Trakt", Id: undefined } as PluginInfoSchema,
      { Name: "Fanart", Id: "fanart-id" } as PluginInfoSchema,
    ];
    const fanartConfig: BasePluginConfigurationSchema = {
      EnableImages: true,
    } as unknown as BasePluginConfigurationSchema;
    getPluginConfigurationSpy.mockResolvedValueOnce(fanartConfig);

    // Act
    const result: Map<string, PluginConfigurationSchema> =
      await getPluginConfigurationSchemaByName(mockClient, installedPlugins);

    // Assert
    expect(result.size).toBe(1);
    expect(result.get("Fanart")).toEqual({
      id: "fanart-id",
      configuration: fanartConfig,
    });
    expect(getPluginConfigurationSpy).toHaveBeenCalledTimes(1);
  });

  it("should skip plugins without Name", async () => {
    // Arrange
    const installedPlugins: PluginInfoSchema[] = [
      { Name: undefined, Id: "trakt-id" } as PluginInfoSchema,
      { Name: "Fanart", Id: "fanart-id" } as PluginInfoSchema,
    ];
    const fanartConfig: BasePluginConfigurationSchema = {
      EnableImages: true,
    } as unknown as BasePluginConfigurationSchema;
    getPluginConfigurationSpy.mockResolvedValueOnce(fanartConfig);

    // Act
    const result: Map<string, PluginConfigurationSchema> =
      await getPluginConfigurationSchemaByName(mockClient, installedPlugins);

    // Assert
    expect(result.size).toBe(1);
    expect(result.get("Fanart")).toEqual({
      id: "fanart-id",
      configuration: fanartConfig,
    });
    expect(getPluginConfigurationSpy).toHaveBeenCalledTimes(1);
  });
});

describe("calculatePluginConfigurationDiff", () => {
  it("should return undefined when no changes", () => {
    // Arrange
    const current: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: false }],
    } as unknown as BasePluginConfigurationSchema;
    const desired: PluginConfigurationConfig = {
      TraktUsers: [{ ExtraLogging: false }],
    };

    // Act
    const result: BasePluginConfigurationSchema | undefined =
      calculatePluginConfigurationDiff(current, desired);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return updated schema when field changes", () => {
    // Arrange
    const current: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: false }],
    } as unknown as BasePluginConfigurationSchema;
    const desired: PluginConfigurationConfig = {
      TraktUsers: [{ ExtraLogging: true }],
    };

    // Act
    const result: BasePluginConfigurationSchema | undefined =
      calculatePluginConfigurationDiff(current, desired);

    // Assert
    expect(result).toBeDefined();
    expect((result as unknown as Record<string, unknown>).TraktUsers).toEqual([
      { ExtraLogging: true },
    ]);
  });

  it("should preserve existing fields not in desired", () => {
    // Arrange
    const current: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: false }],
      OtherField: "preserved",
    } as unknown as BasePluginConfigurationSchema;
    const desired: PluginConfigurationConfig = {
      TraktUsers: [{ ExtraLogging: true }],
    };

    // Act
    const result: BasePluginConfigurationSchema | undefined =
      calculatePluginConfigurationDiff(current, desired);

    // Assert
    expect(result).toBeDefined();
    const resultRecord: Record<string, unknown> = result as unknown as Record<
      string,
      unknown
    >;
    expect(resultRecord.TraktUsers).toEqual([{ ExtraLogging: true }]);
    expect(resultRecord.OtherField).toBe("preserved");
  });

  it("should add new fields from desired", () => {
    // Arrange
    const current: BasePluginConfigurationSchema = {
      ExistingField: "value",
    } as unknown as BasePluginConfigurationSchema;
    const desired: PluginConfigurationConfig = {
      NewField: "new value",
    };

    // Act
    const result: BasePluginConfigurationSchema | undefined =
      calculatePluginConfigurationDiff(current, desired);

    // Assert
    expect(result).toBeDefined();
    const resultRecord: Record<string, unknown> = result as unknown as Record<
      string,
      unknown
    >;
    expect(resultRecord.ExistingField).toBe("value");
    expect(resultRecord.NewField).toBe("new value");
  });

  it("should handle nested object changes", () => {
    // Arrange
    const current: BasePluginConfigurationSchema = {
      Settings: { Option1: true, Option2: false },
    } as unknown as BasePluginConfigurationSchema;
    const desired: PluginConfigurationConfig = {
      Settings: { Option1: false },
    };

    // Act
    const result: BasePluginConfigurationSchema | undefined =
      calculatePluginConfigurationDiff(current, desired);

    // Assert
    expect(result).toBeDefined();
    const resultRecord: Record<
      string,
      Record<string, boolean>
    > = result as unknown as Record<string, Record<string, boolean>>;
    expect(resultRecord.Settings.Option1).toBe(false);
    expect(resultRecord.Settings.Option2).toBe(false);
  });
});

describe("calculatePluginConfigurationsDiff", () => {
  it("should return undefined when no plugins desired", () => {
    // Arrange
    const currentMap: Map<string, PluginConfigurationSchema> = new Map([
      [
        "Trakt",
        {
          id: "trakt-id",
          configuration: {
            TraktUsers: [],
          } as unknown as BasePluginConfigurationSchema,
        },
      ],
    ]);
    const desired: PluginConfigList = [];

    // Act
    const result: Map<string, BasePluginConfigurationSchema> | undefined =
      calculatePluginConfigurationsDiff(currentMap, desired);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when no plugins have configuration", () => {
    // Arrange
    const currentMap: Map<string, PluginConfigurationSchema> = new Map([
      [
        "Trakt",
        {
          id: "trakt-id",
          configuration: {
            TraktUsers: [],
          } as unknown as BasePluginConfigurationSchema,
        },
      ],
    ]);
    const desired: PluginConfigList = [{ name: "Trakt" }];

    // Act
    const result: Map<string, BasePluginConfigurationSchema> | undefined =
      calculatePluginConfigurationsDiff(currentMap, desired);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when plugin not installed", () => {
    // Arrange
    const currentMap: Map<string, PluginConfigurationSchema> = new Map();
    const desired: PluginConfigList = [
      { name: "Trakt", configuration: { TraktUsers: [] } },
    ];

    // Act
    const result: Map<string, BasePluginConfigurationSchema> | undefined =
      calculatePluginConfigurationsDiff(currentMap, desired);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return undefined when configuration unchanged", () => {
    // Arrange
    const currentMap: Map<string, PluginConfigurationSchema> = new Map([
      [
        "Trakt",
        {
          id: "trakt-id",
          configuration: {
            TraktUsers: [{ ExtraLogging: true }],
          } as unknown as BasePluginConfigurationSchema,
        },
      ],
    ]);
    const desired: PluginConfigList = [
      {
        name: "Trakt",
        configuration: { TraktUsers: [{ ExtraLogging: true }] },
      },
    ];

    // Act
    const result: Map<string, BasePluginConfigurationSchema> | undefined =
      calculatePluginConfigurationsDiff(currentMap, desired);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return map with updated configurations", () => {
    // Arrange
    const currentMap: Map<string, PluginConfigurationSchema> = new Map([
      [
        "Trakt",
        {
          id: "trakt-id",
          configuration: {
            TraktUsers: [{ ExtraLogging: false }],
          } as unknown as BasePluginConfigurationSchema,
        },
      ],
    ]);
    const desired: PluginConfigList = [
      {
        name: "Trakt",
        configuration: { TraktUsers: [{ ExtraLogging: true }] },
      },
    ];

    // Act
    const result: Map<string, BasePluginConfigurationSchema> | undefined =
      calculatePluginConfigurationsDiff(currentMap, desired);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(1);
    const config: Record<string, unknown> = result?.get(
      "trakt-id",
    ) as unknown as Record<string, unknown>;
    expect(config.TraktUsers).toEqual([{ ExtraLogging: true }]);
  });

  it("should handle multiple plugins with changes", () => {
    // Arrange
    const currentMap: Map<string, PluginConfigurationSchema> = new Map([
      [
        "Trakt",
        {
          id: "trakt-id",
          configuration: {
            TraktUsers: [{ ExtraLogging: false }],
          } as unknown as BasePluginConfigurationSchema,
        },
      ],
      [
        "Fanart",
        {
          id: "fanart-id",
          configuration: {
            EnableImages: false,
          } as unknown as BasePluginConfigurationSchema,
        },
      ],
    ]);
    const desired: PluginConfigList = [
      {
        name: "Trakt",
        configuration: { TraktUsers: [{ ExtraLogging: true }] },
      },
      { name: "Fanart", configuration: { EnableImages: true } },
    ];

    // Act
    const result: Map<string, BasePluginConfigurationSchema> | undefined =
      calculatePluginConfigurationsDiff(currentMap, desired);

    // Assert
    expect(result).toBeDefined();
    expect(result?.size).toBe(2);
    const traktConfig: Record<string, unknown> = result?.get(
      "trakt-id",
    ) as unknown as Record<string, unknown>;
    expect(traktConfig.TraktUsers).toEqual([{ ExtraLogging: true }]);
    const fanartConfig: Record<string, unknown> = result?.get(
      "fanart-id",
    ) as unknown as Record<string, unknown>;
    expect(fanartConfig.EnableImages).toBe(true);
  });
});

describe("applyPluginConfigurations", () => {
  let mockClient: JellyfinClient;
  let updatePluginConfigurationSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    updatePluginConfigurationSpy = vi.fn();
    mockClient = {
      updatePluginConfiguration: updatePluginConfigurationSpy,
    } as unknown as JellyfinClient;
  });

  it("should do nothing when configurations is undefined", async () => {
    // Act
    await applyPluginConfigurations(mockClient, undefined);

    // Assert
    expect(updatePluginConfigurationSpy).not.toHaveBeenCalled();
  });

  it("should update single plugin configuration", async () => {
    // Arrange
    const config: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: true }],
    } as unknown as BasePluginConfigurationSchema;
    const configurations: Map<string, BasePluginConfigurationSchema> = new Map([
      ["trakt-id", config],
    ]);
    updatePluginConfigurationSpy.mockResolvedValue(undefined);

    // Act
    await applyPluginConfigurations(mockClient, configurations);

    // Assert
    expect(updatePluginConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updatePluginConfigurationSpy).toHaveBeenCalledWith(
      "trakt-id",
      config,
    );
  });

  it("should update multiple plugin configurations", async () => {
    // Arrange
    const traktConfig: BasePluginConfigurationSchema = {
      TraktUsers: [{ ExtraLogging: true }],
    } as unknown as BasePluginConfigurationSchema;
    const fanartConfig: BasePluginConfigurationSchema = {
      EnableImages: true,
    } as unknown as BasePluginConfigurationSchema;
    const configurations: Map<string, BasePluginConfigurationSchema> = new Map([
      ["trakt-id", traktConfig],
      ["fanart-id", fanartConfig],
    ]);
    updatePluginConfigurationSpy.mockResolvedValue(undefined);

    // Act
    await applyPluginConfigurations(mockClient, configurations);

    // Assert
    expect(updatePluginConfigurationSpy).toHaveBeenCalledTimes(2);
    expect(updatePluginConfigurationSpy).toHaveBeenCalledWith(
      "trakt-id",
      traktConfig,
    );
    expect(updatePluginConfigurationSpy).toHaveBeenCalledWith(
      "fanart-id",
      fanartConfig,
    );
  });

  it("should handle empty map", async () => {
    // Arrange
    const configurations: Map<string, BasePluginConfigurationSchema> =
      new Map();

    // Act
    await applyPluginConfigurations(mockClient, configurations);

    // Assert
    expect(updatePluginConfigurationSpy).not.toHaveBeenCalled();
  });
});
