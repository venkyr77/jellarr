import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  calculatePluginsToInstall,
  installPlugins,
} from "../../src/apply/plugins";
import type { JellyfinClient } from "../../src/api/jellyfin.types";
import type {
  PluginConfig,
  PluginConfigList,
} from "../../src/types/config/plugins";
import type { PluginInfoSchema } from "../../src/types/schema/plugins";

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
