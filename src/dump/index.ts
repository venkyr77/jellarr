import { createJellyfinClient } from "../api/jellyfin_client";
import type { JellyfinClient } from "../api/jellyfin.types";
import type {
  ServerConfigurationSchema,
  PluginRepositorySchema,
} from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding-options";
import type {
  VirtualFolderInfoSchema,
  MediaPathInfoSchema,
  LibraryOptionsSchema,
  TypeOptionsSchema,
} from "../types/schema/library";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import type { UserDtoSchema } from "../types/schema/users";
import type {
  PluginInfoSchema,
  BasePluginConfigurationSchema,
} from "../types/schema/plugins";
import type { NetworkConfigurationSchema } from "../types/schema/networking";
import type { AuthenticationInfoSchema } from "../types/schema/api-keys";
import * as yaml from "yaml";

interface PluginWithConfig {
  name: string;
  configuration?: BasePluginConfigurationSchema;
}

function dumpLibraryOptions(opts: LibraryOptionsSchema | null | undefined) {
  if (!opts) return { pathInfos: [] };
  return {
    pathInfos:
      opts.PathInfos?.map((p: MediaPathInfoSchema) => ({
        path: p.Path ?? "",
      })) ?? [],
    ...(opts.SaveLocalMetadata !== undefined && {
      saveLocalMetadata: opts.SaveLocalMetadata,
    }),
    ...(opts.EnableRealtimeMonitor !== undefined && {
      enableRealtimeMonitor: opts.EnableRealtimeMonitor,
    }),
    ...(opts.EnableAutomaticSeriesGrouping !== undefined && {
      enableAutomaticSeriesGrouping: opts.EnableAutomaticSeriesGrouping,
    }),
    ...(opts.EnableEmbeddedTitles !== undefined && {
      enableEmbeddedTitles: opts.EnableEmbeddedTitles,
    }),
    ...(opts.EnableEmbeddedEpisodeInfos !== undefined && {
      enableEmbeddedEpisodeInfos: opts.EnableEmbeddedEpisodeInfos,
    }),
    ...(opts.EnableTrickplayImageExtraction !== undefined && {
      enableTrickplayImageExtraction: opts.EnableTrickplayImageExtraction,
    }),
    ...(opts.EnableChapterImageExtraction !== undefined && {
      enableChapterImageExtraction: opts.EnableChapterImageExtraction,
    }),
    ...(opts.SubtitleDownloadLanguages !== undefined && {
      subtitleDownloadLanguages: opts.SubtitleDownloadLanguages,
    }),
    ...(opts.SkipSubtitlesIfEmbeddedSubtitlesPresent !== undefined && {
      skipSubtitlesIfEmbeddedSubtitlesPresent:
        opts.SkipSubtitlesIfEmbeddedSubtitlesPresent,
    }),
    ...(opts.SkipSubtitlesIfAudioTrackMatches !== undefined && {
      skipSubtitlesIfAudioTrackMatches: opts.SkipSubtitlesIfAudioTrackMatches,
    }),
    ...(opts.MetadataSavers !== undefined && {
      metadataSavers: opts.MetadataSavers,
    }),
    ...(opts.AutomaticallyAddToCollection !== undefined && {
      enableCrossLibrarySeriesMerging: opts.AutomaticallyAddToCollection,
    }),
    ...(opts.TypeOptions &&
      opts.TypeOptions.length > 0 && {
        typeOptions: opts.TypeOptions.map((to: TypeOptionsSchema) => ({
          type: to.Type ?? "",
          ...(to.MetadataFetchers && {
            metadataFetchers: to.MetadataFetchers,
          }),
          ...(to.MetadataFetcherOrder && {
            metadataFetcherOrder: to.MetadataFetcherOrder,
          }),
          ...(to.ImageFetchers && { imageFetchers: to.ImageFetchers }),
          ...(to.ImageFetcherOrder && {
            imageFetcherOrder: to.ImageFetcherOrder,
          }),
        })),
      }),
  };
}

export async function runDump(baseUrl: string): Promise<void> {
  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) {
    throw new Error("JELLARR_API_KEY environment variable is required");
  }

  const client: JellyfinClient = createJellyfinClient(baseUrl, apiKey);

  console.error("⚠️  EXPERIMENTAL: Dumping Jellyfin configuration...\n");

  const [
    systemConfig,
    encodingConfig,
    virtualFolders,
    brandingConfig,
    users,
    plugins,
    networkingConfig,
    apiKeys,
  ]: [
    ServerConfigurationSchema,
    EncodingOptionsSchema,
    VirtualFolderInfoSchema[],
    BrandingOptionsDtoSchema,
    UserDtoSchema[],
    PluginInfoSchema[],
    NetworkConfigurationSchema,
    AuthenticationInfoSchema[],
  ] = await Promise.all([
    client.getSystemConfiguration(),
    client.getEncodingConfiguration(),
    client.getVirtualFolders(),
    client.getBrandingConfiguration(),
    client.getUsers(),
    client.getPlugins(),
    client.getNetworkingConfiguration(),
    client.getApiKeys(),
  ]);

  const pluginsWithConfig: PluginWithConfig[] = await Promise.all(
    plugins.map(
      async (plugin: PluginInfoSchema): Promise<PluginWithConfig> => {
        if (!plugin.Id) return { name: plugin.Name ?? "unknown" };
        try {
          const pluginConfig: BasePluginConfigurationSchema =
            await client.getPluginConfiguration(plugin.Id);
          return {
            name: plugin.Name ?? "unknown",
            configuration: pluginConfig,
          };
        } catch {
          return { name: plugin.Name ?? "unknown" };
        }
      },
    ),
  );

  const trickplay = systemConfig.TrickplayOptions;

  const config: object = {
    version: 1,
    base_url: baseUrl,

    system: {
      serverName: systemConfig.ServerName,
      preferredMetadataLanguage: systemConfig.PreferredMetadataLanguage,
      metadataCountryCode: systemConfig.MetadataCountryCode,
      uiCulture: systemConfig.UICulture,
      quickConnectAvailable: systemConfig.QuickConnectAvailable,
      enableMetrics: systemConfig.EnableMetrics,
      enableFolderView: systemConfig.EnableFolderView,
      enableGroupingMoviesIntoCollections:
        systemConfig.EnableGroupingMoviesIntoCollections,
      enableGroupingShowsIntoCollections:
        systemConfig.EnableGroupingShowsIntoCollections,
      displaySpecialsWithinSeasons: systemConfig.DisplaySpecialsWithinSeasons,
      enableExternalContentInSuggestions:
        systemConfig.EnableExternalContentInSuggestions,
      activityLogRetentionDays: systemConfig.ActivityLogRetentionDays,
      logFileRetentionDays: systemConfig.LogFileRetentionDays,
      libraryMonitorDelay: systemConfig.LibraryMonitorDelay,
      libraryUpdateDuration: systemConfig.LibraryUpdateDuration,
      libraryScanFanoutConcurrency: systemConfig.LibraryScanFanoutConcurrency,
      libraryMetadataRefreshConcurrency:
        systemConfig.LibraryMetadataRefreshConcurrency,
      remoteClientBitrateLimit: systemConfig.RemoteClientBitrateLimit,
      minResumePct: systemConfig.MinResumePct,
      maxResumePct: systemConfig.MaxResumePct,
      minResumeDurationSeconds: systemConfig.MinResumeDurationSeconds,
      sortReplaceCharacters: systemConfig.SortReplaceCharacters,
      sortRemoveCharacters: systemConfig.SortRemoveCharacters,
      sortRemoveWords: systemConfig.SortRemoveWords,
      pluginRepositories: systemConfig.PluginRepositories?.map(
        (repo: PluginRepositorySchema) => ({
          name: repo.Name ?? "",
          url: repo.Url ?? "",
          enabled: repo.Enabled ?? false,
        }),
      ),
      trickplayOptions: {
        enableHwAcceleration: trickplay?.EnableHwAcceleration,
        enableHwEncoding: trickplay?.EnableHwEncoding,
        enableKeyFrameOnlyExtraction: trickplay?.EnableKeyFrameOnlyExtraction,
        scanBehavior: trickplay?.ScanBehavior,
        processPriority: trickplay?.ProcessPriority,
        interval: trickplay?.Interval,
        widthResolutions: trickplay?.WidthResolutions,
        tileWidth: trickplay?.TileWidth,
        tileHeight: trickplay?.TileHeight,
        qscale: trickplay?.Qscale,
        jpegQuality: trickplay?.JpegQuality,
        processThreads: trickplay?.ProcessThreads,
      },
    },

    encoding: {
      encodingThreadCount: encodingConfig.EncodingThreadCount,
      transcodingTempPath: encodingConfig.TranscodingTempPath,
      enableFallbackFont: encodingConfig.EnableFallbackFont,
      fallbackFontPath: encodingConfig.FallbackFontPath,
      enableAudioVbr: encodingConfig.EnableAudioVbr,
      downMixAudioBoost: encodingConfig.DownMixAudioBoost,
      downMixStereoAlgorithm: encodingConfig.DownMixStereoAlgorithm,
      maxMuxingQueueSize: encodingConfig.MaxMuxingQueueSize,
      enableThrottling: encodingConfig.EnableThrottling,
      throttleDelaySeconds: encodingConfig.ThrottleDelaySeconds,
      enableSegmentDeletion: encodingConfig.EnableSegmentDeletion,
      segmentKeepSeconds: encodingConfig.SegmentKeepSeconds,
      enableHardwareEncoding: encodingConfig.EnableHardwareEncoding,
      hardwareAccelerationType: encodingConfig.HardwareAccelerationType,
      vaapiDevice: encodingConfig.VaapiDevice,
      qsvDevice: encodingConfig.QsvDevice,
      hardwareDecodingCodecs: encodingConfig.HardwareDecodingCodecs,
      enableDecodingColorDepth10Hevc:
        encodingConfig.EnableDecodingColorDepth10Hevc,
      enableDecodingColorDepth10Vp9:
        encodingConfig.EnableDecodingColorDepth10Vp9,
      enableDecodingColorDepth10HevcRext:
        encodingConfig.EnableDecodingColorDepth10HevcRext,
      enableDecodingColorDepth12HevcRext:
        encodingConfig.EnableDecodingColorDepth12HevcRext,
      enableEnhancedNvdecDecoder: encodingConfig.EnableEnhancedNvdecDecoder,
      preferSystemNativeHwDecoder: encodingConfig.PreferSystemNativeHwDecoder,
      allowHevcEncoding: encodingConfig.AllowHevcEncoding,
      allowAv1Encoding: encodingConfig.AllowAv1Encoding,
      enableSubtitleExtraction: encodingConfig.EnableSubtitleExtraction,
      h264Crf: encodingConfig.H264Crf,
      h265Crf: encodingConfig.H265Crf,
      deinterlaceMethod: encodingConfig.DeinterlaceMethod,
      deinterlaceDoubleRate: encodingConfig.DeinterlaceDoubleRate,
      tonemapping: {
        enabled: encodingConfig.EnableTonemapping,
        algorithm: encodingConfig.TonemappingAlgorithm,
        mode: encodingConfig.TonemappingMode,
        range: encodingConfig.TonemappingRange,
        desat: encodingConfig.TonemappingDesat,
        peak: encodingConfig.TonemappingPeak,
      },
    },

    library: {
      virtualFolders: virtualFolders.map(
        (folder: VirtualFolderInfoSchema) => ({
          name: folder.Name ?? "",
          collectionType: folder.CollectionType ?? "mixed",
          libraryOptions: dumpLibraryOptions(folder.LibraryOptions),
        }),
      ),
    },

    branding: {
      loginDisclaimer: brandingConfig.LoginDisclaimer,
      customCss: brandingConfig.CustomCss,
      splashscreenEnabled: brandingConfig.SplashscreenEnabled,
    },

    networking: {
      baseUrl: networkingConfig.BaseUrl,
      enableHttps: networkingConfig.EnableHttps,
      requireHttps: networkingConfig.RequireHttps,
      internalHttpPort: networkingConfig.InternalHttpPort,
      internalHttpsPort: networkingConfig.InternalHttpsPort,
      publicHttpPort: networkingConfig.PublicHttpPort,
      publicHttpsPort: networkingConfig.PublicHttpsPort,
      enableRemoteAccess: networkingConfig.EnableRemoteAccess,
      enableIPv4: networkingConfig.EnableIPv4,
      enableIPv6: networkingConfig.EnableIPv6,
      enableUPnP: networkingConfig.EnableUPnP,
      knownProxies: networkingConfig.KnownProxies,
      localNetworkSubnets: networkingConfig.LocalNetworkSubnets,
      localNetworkAddresses: networkingConfig.LocalNetworkAddresses,
      remoteIpFilter: networkingConfig.RemoteIPFilter,
      isRemoteIpFilterBlacklist: networkingConfig.IsRemoteIPFilterBlacklist,
      ignoreVirtualInterfaces: networkingConfig.IgnoreVirtualInterfaces,
      virtualInterfaceNames: networkingConfig.VirtualInterfaceNames,
      enablePublishedServerUriByRequest:
        networkingConfig.EnablePublishedServerUriByRequest,
      publishedServerUriBySubnet: networkingConfig.PublishedServerUriBySubnet,
      corsHosts: systemConfig.CorsHosts,
    },

    users: users.map((user: UserDtoSchema) => ({
      name: user.Name ?? "",
      policy: {
        isAdministrator: user.Policy?.IsAdministrator,
        loginAttemptsBeforeLockout: user.Policy?.LoginAttemptsBeforeLockout,
      },
    })),

    plugins: pluginsWithConfig,

    api_keys: apiKeys.map((key: AuthenticationInfoSchema) => ({
      name: key.AppName ?? "",
    })),
  };

  console.log(yaml.stringify(config));

  console.error(
    "\n⚠️  Note: User passwords cannot be exported. Add them manually.",
  );
}
