{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  pathInfoConfigType = types.submodule {
    options = {
      path = mkOption {
        type = types.str;
        description = "Path to media folder.";
      };
    };
  };

  typeOptionsConfigType = types.submodule {
    options = {
      type = mkOption {
        type = types.str;
        description = "Type name. E.g., 'Movie', 'Series', etc.";
      };
      metadataFetchers = mkOption {
        type = types.listOf types.str;
        description = "List of metadata fetchers to use for this type.";
      };
      metadataFetcherOrder = mkOption {
        type = types.nullOr (types.listOf types.str);
        description = "List defining the order of metadata fetchers for this type. Defaults to metadataFetchers if not set.";
        default = null;
      };
      imageFetchers = mkOption {
        type = types.listOf types.str;
        description = "List of image fetchers to use for this type.";
      };
      imageFetcherOrder = mkOption {
        type = types.nullOr (types.listOf types.str);
        description = "List defining the order of image fetchers for this type. Defaults to imageFetchers if not set.";
        default = null;
      };
    };
  };

  libraryOptionsConfigType = types.submodule {
    options = {
      pathInfos = mkOption {
        type = types.listOf pathInfoConfigType;
        description = "List of paths for this library.";
      };
      automaticallyAddToCollection = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Automatically add content to collections.";
      };
      enableChapterImageExtraction = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable chapter image extraction.";
      };
      extractChapterImagesDuringLibraryScan = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Extract chapter images during library scan.";
      };
      extractTrickplayImagesDuringLibraryScan = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Extract trickplay images during library scan.";
      };
      enableEmbeddedEpisodeInfos = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable embedded episode infos.";
      };
      enableEmbeddedExtraTitles = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable embedded extra titles.";
      };
      enableTrickplayImageExtraction = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable trickplay image extraction.";
      };
      saveTrickplayWithMedia = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save trickplay with media.";
      };
      metadataSavers = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of metadata savers.";
      };
      saveLocalMetadata = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save local metadata.";
      };
      automaticRefreshIntervalDays = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Automatic refresh interval in days.";
      };
      enableRealtimeMonitor = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable realtime monitor.";
      };
      enabled = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable this library.";
      };
      enablePhotos = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable photos in this library.";
      };
      enableLUFSScan = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable LUFS scan for audio normalization.";
      };
      enableAutomaticSeriesGrouping = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable automatic series grouping.";
      };
      enableEmbeddedTitles = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable embedded titles.";
      };
      skipSubtitlesIfEmbeddedSubtitlesPresent = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Skip subtitle fetching if embedded subtitles are present.";
      };
      skipSubtitlesIfAudioTrackMatches = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Skip subtitle fetching if an audio track matches the preferred language.";
      };
      requirePerfectSubtitleMatch = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Require a perfect subtitle match.";
      };
      saveSubtitlesWithMedia = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save subtitles alongside media files.";
      };
      saveLyricsWithMedia = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Save lyrics alongside media files.";
      };
      preferNonstandardArtistsTag = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Prefer non-standard artists tag.";
      };
      useCustomTagDelimiters = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Use custom tag delimiters.";
      };
      preferredMetadataLanguage = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Preferred metadata language code.";
      };
      metadataCountryCode = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Metadata country code.";
      };
      seasonZeroDisplayName = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Display name for season zero (specials).";
      };
      allowEmbeddedSubtitles = mkOption {
        type = nullOr (types.enum [
          "AllowAll"
          "AllowText"
          "AllowImage"
          "AllowNone"
        ]);
        default = null;
        description = "Policy for allowing embedded subtitles.";
      };
      disabledLocalMetadataReaders = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of disabled local metadata readers.";
      };
      localMetadataReaderOrder = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Order of local metadata readers.";
      };
      disabledSubtitleFetchers = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of disabled subtitle fetchers.";
      };
      subtitleFetcherOrder = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Order of subtitle fetchers.";
      };
      disabledMediaSegmentProviders = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of disabled media segment providers.";
      };
      mediaSegmentProviderOrder = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Order of media segment providers.";
      };
      subtitleDownloadLanguages = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Languages for which to download subtitles.";
      };
      disabledLyricFetchers = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "List of disabled lyric fetchers.";
      };
      lyricFetcherOrder = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Order of lyric fetchers.";
      };
      customTagDelimiters = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Custom tag delimiters to use when splitting tags.";
      };
      delimiterWhitelist = mkOption {
        type = nullOr (types.listOf types.str);
        default = null;
        description = "Whitelist of delimiters to preserve when splitting tags.";
      };
      typeOptions = mkOption {
        type = types.listOf typeOptionsConfigType;
        default = [];
        example = [
          {
            type = "Movie";
            metadataFetchers = ["TheMovieDB"];
            imageFetchers = ["TheMovieDB"];
          }
        ];
        description = "typeOptions config for this library.";
      };
    };
  };

  virtualFolderConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "Library name.";
      };
      collectionType = mkOption {
        type = types.enum [
          "movies"
          "tvshows"
          "music"
          "musicvideos"
          "homevideos"
          "boxsets"
          "books"
          "mixed"
        ];
        description = "Type of media in this library.";
      };
      libraryOptions = mkOption {
        type = libraryOptionsConfigType;
        description = "Library options including paths.";
      };
    };
  };

  libraryConfigType = types.submodule {
    options = {
      virtualFolders = mkOption {
        type = nullOr (types.listOf virtualFolderConfigType);
        default = null;
        description = "List of virtual folders (libraries).";
      };
    };
  };

  mkLibraryConfig = cfg:
    {}
    // optionalAttrs (cfg.virtualFolders != null) {
      virtualFolders = map (folder:
        assert (builtins.length folder.libraryOptions.pathInfos)
        >= 1
        || throw "Library '${folder.name}' must have at least one path in pathInfos"; let
          lo = folder.libraryOptions;
        in {
          inherit (folder) name collectionType;
          libraryOptions =
            {
              pathInfos =
                map (pathInfo: {inherit (pathInfo) path;})
                lo.pathInfos;
            }
            // optionalAttrs (lo ? automaticallyAddToCollection && lo.automaticallyAddToCollection != null) {
              inherit (lo) automaticallyAddToCollection;
            }
            // optionalAttrs (lo ? enableChapterImageExtraction && lo.enableChapterImageExtraction != null) {
              inherit (lo) enableChapterImageExtraction;
            }
            // optionalAttrs (lo ? extractChapterImagesDuringLibraryScan && lo.extractChapterImagesDuringLibraryScan != null) {
              inherit (lo) extractChapterImagesDuringLibraryScan;
            }
            // optionalAttrs (lo ? extractTrickplayImagesDuringLibraryScan && lo.extractTrickplayImagesDuringLibraryScan != null) {
              inherit (lo) extractTrickplayImagesDuringLibraryScan;
            }
            // optionalAttrs (lo ? enableEmbeddedEpisodeInfos && lo.enableEmbeddedEpisodeInfos != null) {
              inherit (lo) enableEmbeddedEpisodeInfos;
            }
            // optionalAttrs (lo ? enableEmbeddedExtraTitles && lo.enableEmbeddedExtraTitles != null) {
              inherit (lo) enableEmbeddedExtraTitles;
            }
            // optionalAttrs (lo ? enableTrickplayImageExtraction && lo.enableTrickplayImageExtraction != null) {
              inherit (lo) enableTrickplayImageExtraction;
            }
            // optionalAttrs (lo ? saveTrickplayWithMedia && lo.saveTrickplayWithMedia != null) {
              inherit (lo) saveTrickplayWithMedia;
            }
            // optionalAttrs (lo ? metadataSavers && lo.metadataSavers != null) {
              inherit (lo) metadataSavers;
            }
            // optionalAttrs (lo ? saveLocalMetadata && lo.saveLocalMetadata != null) {
              inherit (lo) saveLocalMetadata;
            }
            // optionalAttrs (lo ? automaticRefreshIntervalDays && lo.automaticRefreshIntervalDays != null) {
              inherit (lo) automaticRefreshIntervalDays;
            }
            // optionalAttrs (lo ? enableRealtimeMonitor && lo.enableRealtimeMonitor != null) {
              inherit (lo) enableRealtimeMonitor;
            }
            // optionalAttrs (lo ? enabled && lo.enabled != null) {
              inherit (lo) enabled;
            }
            // optionalAttrs (lo ? enablePhotos && lo.enablePhotos != null) {
              inherit (lo) enablePhotos;
            }
            // optionalAttrs (lo ? enableLUFSScan && lo.enableLUFSScan != null) {
              inherit (lo) enableLUFSScan;
            }
            // optionalAttrs (lo ? enableAutomaticSeriesGrouping && lo.enableAutomaticSeriesGrouping != null) {
              inherit (lo) enableAutomaticSeriesGrouping;
            }
            // optionalAttrs (lo ? enableEmbeddedTitles && lo.enableEmbeddedTitles != null) {
              inherit (lo) enableEmbeddedTitles;
            }
            // optionalAttrs (lo ? skipSubtitlesIfEmbeddedSubtitlesPresent && lo.skipSubtitlesIfEmbeddedSubtitlesPresent != null) {
              inherit (lo) skipSubtitlesIfEmbeddedSubtitlesPresent;
            }
            // optionalAttrs (lo ? skipSubtitlesIfAudioTrackMatches && lo.skipSubtitlesIfAudioTrackMatches != null) {
              inherit (lo) skipSubtitlesIfAudioTrackMatches;
            }
            // optionalAttrs (lo ? requirePerfectSubtitleMatch && lo.requirePerfectSubtitleMatch != null) {
              inherit (lo) requirePerfectSubtitleMatch;
            }
            // optionalAttrs (lo ? saveSubtitlesWithMedia && lo.saveSubtitlesWithMedia != null) {
              inherit (lo) saveSubtitlesWithMedia;
            }
            // optionalAttrs (lo ? saveLyricsWithMedia && lo.saveLyricsWithMedia != null) {
              inherit (lo) saveLyricsWithMedia;
            }
            // optionalAttrs (lo ? preferNonstandardArtistsTag && lo.preferNonstandardArtistsTag != null) {
              inherit (lo) preferNonstandardArtistsTag;
            }
            // optionalAttrs (lo ? useCustomTagDelimiters && lo.useCustomTagDelimiters != null) {
              inherit (lo) useCustomTagDelimiters;
            }
            // optionalAttrs (lo ? preferredMetadataLanguage && lo.preferredMetadataLanguage != null) {
              inherit (lo) preferredMetadataLanguage;
            }
            // optionalAttrs (lo ? metadataCountryCode && lo.metadataCountryCode != null) {
              inherit (lo) metadataCountryCode;
            }
            // optionalAttrs (lo ? seasonZeroDisplayName && lo.seasonZeroDisplayName != null) {
              inherit (lo) seasonZeroDisplayName;
            }
            // optionalAttrs (lo ? allowEmbeddedSubtitles && lo.allowEmbeddedSubtitles != null) {
              inherit (lo) allowEmbeddedSubtitles;
            }
            // optionalAttrs (lo ? disabledLocalMetadataReaders && lo.disabledLocalMetadataReaders != null) {
              inherit (lo) disabledLocalMetadataReaders;
            }
            // optionalAttrs (lo ? localMetadataReaderOrder && lo.localMetadataReaderOrder != null) {
              inherit (lo) localMetadataReaderOrder;
            }
            // optionalAttrs (lo ? disabledSubtitleFetchers && lo.disabledSubtitleFetchers != null) {
              inherit (lo) disabledSubtitleFetchers;
            }
            // optionalAttrs (lo ? subtitleFetcherOrder && lo.subtitleFetcherOrder != null) {
              inherit (lo) subtitleFetcherOrder;
            }
            // optionalAttrs (lo ? disabledMediaSegmentProviders && lo.disabledMediaSegmentProviders != null) {
              inherit (lo) disabledMediaSegmentProviders;
            }
            // optionalAttrs (lo ? mediaSegmentProviderOrder && lo.mediaSegmentProviderOrder != null) {
              inherit (lo) mediaSegmentProviderOrder;
            }
            // optionalAttrs (lo ? subtitleDownloadLanguages && lo.subtitleDownloadLanguages != null) {
              inherit (lo) subtitleDownloadLanguages;
            }
            // optionalAttrs (lo ? disabledLyricFetchers && lo.disabledLyricFetchers != null) {
              inherit (lo) disabledLyricFetchers;
            }
            // optionalAttrs (lo ? lyricFetcherOrder && lo.lyricFetcherOrder != null) {
              inherit (lo) lyricFetcherOrder;
            }
            // optionalAttrs (lo ? customTagDelimiters && lo.customTagDelimiters != null) {
              inherit (lo) customTagDelimiters;
            }
            // optionalAttrs (lo ? delimiterWhitelist && lo.delimiterWhitelist != null) {
              inherit (lo) delimiterWhitelist;
            }
            // optionalAttrs ((lo.typeOptions or []) != []) {
              typeOptions =
                map (typeOpt: {
                  inherit (typeOpt) type metadataFetchers imageFetchers;
                  metadataFetcherOrder =
                    if (typeOpt.metadataFetcherOrder or null) != null
                    then typeOpt.metadataFetcherOrder
                    else typeOpt.metadataFetchers;
                  imageFetcherOrder =
                    if (typeOpt.imageFetcherOrder or null) != null
                    then typeOpt.imageFetcherOrder
                    else typeOpt.imageFetchers;
                })
                (folder.libraryOptions.typeOptions or []);
            };
        })
      cfg.virtualFolders;
    };
in {
  inherit libraryConfigType mkLibraryConfig;
}
