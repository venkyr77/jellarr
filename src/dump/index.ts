import { createJellyfinClient } from "../api/jellyfin_client";
import type { JellyfinClient } from "../api/jellyfin.types";
import type {
  ServerConfigurationSchema,
  PluginRepositorySchema,
} from "../types/schema/system";
import type { EncodingOptionsSchema } from "../types/schema/encoding-options";
import type { NetworkConfigurationSchema } from "../types/schema/networking";
import type {
  VirtualFolderInfoSchema,
  MediaPathInfoSchema,
} from "../types/schema/library";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import type { UserDtoSchema } from "../types/schema/users";
import type {
  PluginInfoSchema,
  BasePluginConfigurationSchema,
} from "../types/schema/plugins";
import * as yaml from "yaml";

interface PluginWithConfig {
  name: string;
  configuration?: BasePluginConfigurationSchema;
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
    networkingConfig,
    virtualFolders,
    brandingConfig,
    users,
    plugins,
  ]: [
    ServerConfigurationSchema,
    EncodingOptionsSchema,
    NetworkConfigurationSchema,
    VirtualFolderInfoSchema[],
    BrandingOptionsDtoSchema,
    UserDtoSchema[],
    PluginInfoSchema[],
  ] = await Promise.all([
    client.getSystemConfiguration(),
    client.getEncodingConfiguration(),
    client.getNetworkingConfiguration(),
    client.getVirtualFolders(),
    client.getBrandingConfiguration(),
    client.getUsers(),
    client.getPlugins(),
  ]);

  const pluginsWithConfig: PluginWithConfig[] = await Promise.all(
    plugins.map(async (plugin: PluginInfoSchema): Promise<PluginWithConfig> => {
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
    }),
  );

  const folderIdToNameMap: Map<string, string> = new Map(
    virtualFolders
      .map((folder: VirtualFolderInfoSchema) => {
        const name: string | undefined = folder.Name ?? undefined;
        const id: string | undefined =
          (folder as { Id?: string }).Id ??
          (folder as { ItemId?: string | null }).ItemId ??
          undefined;
        return name && id ? [id, name] : undefined;
      })
      .filter(
        (
          entry: [string, string] | undefined | [string, string | undefined],
        ): entry is [string, string] => Array.isArray(entry),
      ),
  );

  const resolveEnabledFolders = (
    enabledFolderIds: string[] | null | undefined,
  ): string[] | undefined => {
    if (!enabledFolderIds) return undefined;
    return enabledFolderIds.map(
      (folderId: string) => folderIdToNameMap.get(folderId) ?? folderId,
    );
  };

  const config: object = {
    version: 1,
    base_url: baseUrl,

    system: {
      serverName: systemConfig.ServerName,
      enableMetrics: systemConfig.EnableMetrics,
      pluginRepositories: systemConfig.PluginRepositories?.map(
        (repo: PluginRepositorySchema) => ({
          name: repo.Name ?? "",
          url: repo.Url ?? "",
          enabled: repo.Enabled ?? false,
        }),
      ),
      trickplayOptions: {
        enableHwAcceleration:
          systemConfig.TrickplayOptions?.EnableHwAcceleration,
        enableHwEncoding: systemConfig.TrickplayOptions?.EnableHwEncoding,
        enableKeyFrameOnlyExtraction:
          systemConfig.TrickplayOptions?.EnableKeyFrameOnlyExtraction,
        scanBehavior: systemConfig.TrickplayOptions?.ScanBehavior,
        processPriority: systemConfig.TrickplayOptions?.ProcessPriority,
        interval: systemConfig.TrickplayOptions?.Interval,
        widthResolutions: systemConfig.TrickplayOptions?.WidthResolutions,
        tileWidth: systemConfig.TrickplayOptions?.TileWidth,
        tileHeight: systemConfig.TrickplayOptions?.TileHeight,
        qscale: systemConfig.TrickplayOptions?.Qscale,
        jpegQuality: systemConfig.TrickplayOptions?.JpegQuality,
        processThreads: systemConfig.TrickplayOptions?.ProcessThreads,
      },
    },

    encoding: {
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
      allowHevcEncoding: encodingConfig.AllowHevcEncoding,
      allowAv1Encoding: encodingConfig.AllowAv1Encoding,
      enableFallbackFont: encodingConfig.EnableFallbackFont,
      enableAudioVbr: encodingConfig.EnableAudioVbr,
      enableThrottling: encodingConfig.EnableThrottling,
      enableSegmentDeletion: encodingConfig.EnableSegmentDeletion,
      enableTonemapping: encodingConfig.EnableTonemapping,
      enableVppTonemapping: encodingConfig.EnableVppTonemapping,
      enableVideoToolboxTonemapping:
        encodingConfig.EnableVideoToolboxTonemapping,
      deinterlaceDoubleRate: encodingConfig.DeinterlaceDoubleRate,
      enableEnhancedNvdecDecoder: encodingConfig.EnableEnhancedNvdecDecoder,
      preferSystemNativeHwDecoder: encodingConfig.PreferSystemNativeHwDecoder,
      enableIntelLowPowerH264HwEncoder:
        encodingConfig.EnableIntelLowPowerH264HwEncoder,
      enableIntelLowPowerHevcHwEncoder:
        encodingConfig.EnableIntelLowPowerHevcHwEncoder,
      enableSubtitleExtraction: encodingConfig.EnableSubtitleExtraction,
      encodingThreadCount: encodingConfig.EncodingThreadCount,
      maxMuxingQueueSize: encodingConfig.MaxMuxingQueueSize,
      throttleDelaySeconds: encodingConfig.ThrottleDelaySeconds,
      segmentKeepSeconds: encodingConfig.SegmentKeepSeconds,
      h264Crf: encodingConfig.H264Crf,
      h265Crf: encodingConfig.H265Crf,
      downMixAudioBoost: encodingConfig.DownMixAudioBoost,
      tonemappingDesat: encodingConfig.TonemappingDesat,
      tonemappingPeak: encodingConfig.TonemappingPeak,
      tonemappingParam: encodingConfig.TonemappingParam,
      vppTonemappingBrightness: encodingConfig.VppTonemappingBrightness,
      vppTonemappingContrast: encodingConfig.VppTonemappingContrast,
      transcodingTempPath: encodingConfig.TranscodingTempPath,
      fallbackFontPath: encodingConfig.FallbackFontPath,
      encoderAppPath: encodingConfig.EncoderAppPath,
      encoderAppPathDisplay: encodingConfig.EncoderAppPathDisplay,
      downMixStereoAlgorithm: encodingConfig.DownMixStereoAlgorithm,
      tonemappingAlgorithm: encodingConfig.TonemappingAlgorithm,
      tonemappingMode: encodingConfig.TonemappingMode,
      tonemappingRange: encodingConfig.TonemappingRange,
      encoderPreset: encodingConfig.EncoderPreset,
      deinterlaceMethod: encodingConfig.DeinterlaceMethod,
      allowOnDemandMetadataBasedKeyframeExtractionForExtensions:
        encodingConfig.AllowOnDemandMetadataBasedKeyframeExtractionForExtensions,
    },

    networking: {
      baseUrl: networkingConfig.BaseUrl,
      enableHttps: networkingConfig.EnableHttps,
      requireHttps: networkingConfig.RequireHttps,
      certificatePath: networkingConfig.CertificatePath,
      certificatePassword: networkingConfig.CertificatePassword,
      internalHttpPort: networkingConfig.InternalHttpPort,
      internalHttpsPort: networkingConfig.InternalHttpsPort,
      publicHttpPort: networkingConfig.PublicHttpPort,
      publicHttpsPort: networkingConfig.PublicHttpsPort,
      autoDiscovery: networkingConfig.AutoDiscovery,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      enableUPnP: networkingConfig.EnableUPnP,
      enableIPv4: networkingConfig.EnableIPv4,
      enableIPv6: networkingConfig.EnableIPv6,
      enableRemoteAccess: networkingConfig.EnableRemoteAccess,
      localNetworkSubnets: networkingConfig.LocalNetworkSubnets,
      localNetworkAddresses: networkingConfig.LocalNetworkAddresses,
      knownProxies: networkingConfig.KnownProxies,
      ignoreVirtualInterfaces: networkingConfig.IgnoreVirtualInterfaces,
      virtualInterfaceNames: networkingConfig.VirtualInterfaceNames,
      enablePublishedServerUriByRequest:
        networkingConfig.EnablePublishedServerUriByRequest,
      publishedServerUriBySubnet: networkingConfig.PublishedServerUriBySubnet,
      remoteIPFilter: networkingConfig.RemoteIPFilter,
      isRemoteIPFilterBlacklist: networkingConfig.IsRemoteIPFilterBlacklist,
    },

    library: {
      virtualFolders: virtualFolders.map((folder: VirtualFolderInfoSchema) => ({
        name: folder.Name ?? "",
        collectionType: folder.CollectionType ?? "mixed",
        libraryOptions: {
          pathInfos:
            folder.LibraryOptions?.PathInfos?.map((p: MediaPathInfoSchema) => ({
              path: p.Path ?? "",
            })) ?? [],
          typeOptions: folder.LibraryOptions?.TypeOptions?.map((typeOpt) => ({
            type: typeOpt.Type ?? "",
            metadataFetchers: typeOpt.MetadataFetchers ?? [],
            metadataFetcherOrder: typeOpt.MetadataFetcherOrder ?? undefined,
            imageFetchers: typeOpt.ImageFetchers ?? [],
            imageFetcherOrder: typeOpt.ImageFetcherOrder ?? undefined,
          })),
          automaticallyAddToCollection:
            folder.LibraryOptions?.AutomaticallyAddToCollection,
          enableChapterImageExtraction:
            folder.LibraryOptions?.EnableChapterImageExtraction,
          extractChapterImagesDuringLibraryScan:
            folder.LibraryOptions?.ExtractChapterImagesDuringLibraryScan,
          extractTrickplayImagesDuringLibraryScan:
            folder.LibraryOptions?.ExtractTrickplayImagesDuringLibraryScan,
          enableEmbeddedEpisodeInfos:
            folder.LibraryOptions?.EnableEmbeddedEpisodeInfos,
          enableEmbeddedExtraTitles:
            folder.LibraryOptions?.EnableEmbeddedExtrasTitles,
          enableTrickplayImageExtraction:
            folder.LibraryOptions?.EnableTrickplayImageExtraction,
          saveTrickplayWithMedia: folder.LibraryOptions?.SaveTrickplayWithMedia,
          metadataSavers: folder.LibraryOptions?.MetadataSavers ?? undefined,
          saveLocalMetadata: folder.LibraryOptions?.SaveLocalMetadata,
          automaticRefreshIntervalDays:
            folder.LibraryOptions?.AutomaticRefreshIntervalDays,
          enableRealtimeMonitor: folder.LibraryOptions?.EnableRealtimeMonitor,
          enabled: folder.LibraryOptions?.Enabled,
          enablePhotos: folder.LibraryOptions?.EnablePhotos,
          enableLUFSScan: folder.LibraryOptions?.EnableLUFSScan,
          enableAutomaticSeriesGrouping:
            folder.LibraryOptions?.EnableAutomaticSeriesGrouping,
          enableEmbeddedTitles: folder.LibraryOptions?.EnableEmbeddedTitles,
          skipSubtitlesIfEmbeddedSubtitlesPresent:
            folder.LibraryOptions?.SkipSubtitlesIfEmbeddedSubtitlesPresent,
          skipSubtitlesIfAudioTrackMatches:
            folder.LibraryOptions?.SkipSubtitlesIfAudioTrackMatches,
          requirePerfectSubtitleMatch:
            folder.LibraryOptions?.RequirePerfectSubtitleMatch,
          saveSubtitlesWithMedia: folder.LibraryOptions?.SaveSubtitlesWithMedia,
          saveLyricsWithMedia: folder.LibraryOptions?.SaveLyricsWithMedia,
          preferNonstandardArtistsTag:
            folder.LibraryOptions?.PreferNonstandardArtistsTag,
          useCustomTagDelimiters: folder.LibraryOptions?.UseCustomTagDelimiters,
          preferredMetadataLanguage:
            folder.LibraryOptions?.PreferredMetadataLanguage,
          metadataCountryCode: folder.LibraryOptions?.MetadataCountryCode,
          seasonZeroDisplayName: folder.LibraryOptions?.SeasonZeroDisplayName,
          allowEmbeddedSubtitles: folder.LibraryOptions?.AllowEmbeddedSubtitles,
          disabledLocalMetadataReaders:
            folder.LibraryOptions?.DisabledLocalMetadataReaders,
          localMetadataReaderOrder:
            folder.LibraryOptions?.LocalMetadataReaderOrder ?? undefined,
          disabledSubtitleFetchers:
            folder.LibraryOptions?.DisabledSubtitleFetchers,
          subtitleFetcherOrder: folder.LibraryOptions?.SubtitleFetcherOrder,
          disabledMediaSegmentProviders:
            folder.LibraryOptions?.DisabledMediaSegmentProviders,
          mediaSegmentProviderOrder:
            folder.LibraryOptions?.MediaSegmentProviderOrder,
          subtitleDownloadLanguages:
            folder.LibraryOptions?.SubtitleDownloadLanguages ?? undefined,
          disabledLyricFetchers: folder.LibraryOptions?.DisabledLyricFetchers,
          lyricFetcherOrder: folder.LibraryOptions?.LyricFetcherOrder,
          customTagDelimiters: folder.LibraryOptions?.CustomTagDelimiters,
          delimiterWhitelist: folder.LibraryOptions?.DelimiterWhitelist,
        },
      })),
    },

    branding: {
      loginDisclaimer: brandingConfig.LoginDisclaimer,
      customCss: brandingConfig.CustomCss,
      splashscreenEnabled: brandingConfig.SplashscreenEnabled,
    },

    users: users.map((user: UserDtoSchema) => ({
      name: user.Name ?? "",
      policy: {
        isAdministrator: user.Policy?.IsAdministrator,
        loginAttemptsBeforeLockout: user.Policy?.LoginAttemptsBeforeLockout,
        enableAllFolders: user.Policy?.EnableAllFolders,
        enableCollectionManagement: user.Policy?.EnableCollectionManagement,
        maxActiveSessions: user.Policy?.MaxActiveSessions,
        enabledLibraries: resolveEnabledFolders(user.Policy?.EnabledFolders),
      },
      displayMissingEpisodes: user.Configuration?.DisplayMissingEpisodes,
      subtitleLanguagePreference:
        user.Configuration?.SubtitleLanguagePreference,
    })),

    plugins: pluginsWithConfig,
  };

  console.log(yaml.stringify(config));

  console.error(
    "\n⚠️  Note: User passwords cannot be exported. Add them manually.",
  );
}
