# Nix types that mirror the Zod schemas in src/types/config/
# Keep in sync with TypeScript definitions when updating.
{lib}: let
  inherit (lib) types mkOption;

  # Helper for optional fields (matches Zod's .optional())
  optionalOf = type: types.nullOr type;

  # =============================================================================
  # STARTUP CONFIG (src/types/config/startup.ts)
  # =============================================================================
  startupConfigType = types.submodule {
    options = {
      completeStartupWizard = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Mark the startup wizard as complete.";
      };
    };
  };

  # =============================================================================
  # BRANDING OPTIONS CONFIG (src/types/config/branding-options.ts)
  # =============================================================================
  brandingOptionsConfigType = types.submodule {
    options = {
      loginDisclaimer = mkOption {
        type = optionalOf types.str;
        default = null;
        description = "Custom login disclaimer text (supports HTML).";
      };
      customCss = mkOption {
        type = optionalOf types.str;
        default = null;
        description = "Custom CSS to apply to the Jellyfin web interface.";
      };
      splashscreenEnabled = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable or disable the splashscreen.";
      };
    };
  };

  # =============================================================================
  # ENCODING OPTIONS CONFIG (src/types/config/encoding-options.ts)
  # =============================================================================
  hardwareAccelerationTypeEnum = types.enum [
    "none"
    "amf"
    "qsv"
    "nvenc"
    "v4l2m2m"
    "vaapi"
    "videotoolbox"
    "rkmpp"
  ];

  hardwareDecodingCodecEnum = types.enum [
    "h264"
    "hevc"
    "mpeg2video"
    "vc1"
    "vp8"
    "vp9"
    "av1"
  ];

  encodingOptionsConfigType = types.submodule {
    options = {
      enableHardwareEncoding = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable hardware encoding.";
      };
      hardwareAccelerationType = mkOption {
        type = optionalOf hardwareAccelerationTypeEnum;
        default = null;
        description = "Hardware acceleration type.";
      };
      vaapiDevice = mkOption {
        type = optionalOf types.path;
        default = null;
        description = "VAAPI device path (e.g., /dev/dri/renderD128).";
      };
      qsvDevice = mkOption {
        type = optionalOf types.path;
        default = null;
        description = "QSV device path.";
      };
      hardwareDecodingCodecs = mkOption {
        type = optionalOf (types.listOf hardwareDecodingCodecEnum);
        default = null;
        description = "List of codecs to hardware decode.";
      };
      enableDecodingColorDepth10Hevc = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable 10-bit HEVC decoding.";
      };
      enableDecodingColorDepth10Vp9 = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable 10-bit VP9 decoding.";
      };
      enableDecodingColorDepth10HevcRext = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable 10-bit HEVC RExt decoding.";
      };
      enableDecodingColorDepth12HevcRext = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable 12-bit HEVC RExt decoding.";
      };
      allowHevcEncoding = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Allow HEVC encoding.";
      };
      allowAv1Encoding = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Allow AV1 encoding.";
      };
    };
  };

  # =============================================================================
  # SYSTEM CONFIG (src/types/config/system.ts)
  # =============================================================================
  pluginRepositoryConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.strMatching ".+";
        description = "Plugin repository name (non-empty).";
      };
      url = mkOption {
        type = types.strMatching "^https?://.*";
        description = "Plugin repository URL (must be valid URL).";
      };
      enabled = mkOption {
        type = types.bool;
        description = "Whether the plugin repository is enabled.";
      };
    };
  };

  trickplayOptionsConfigType = types.submodule {
    options = {
      enableHwAcceleration = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable hardware acceleration for trickplay.";
      };
      enableHwEncoding = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable hardware encoding for trickplay.";
      };
    };
  };

  systemConfigType = types.submodule {
    options = {
      enableMetrics = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Enable Prometheus metrics endpoint.";
      };
      pluginRepositories = mkOption {
        type = optionalOf (types.listOf pluginRepositoryConfigType);
        default = null;
        description = "List of plugin repositories.";
      };
      trickplayOptions = mkOption {
        type = optionalOf trickplayOptionsConfigType;
        default = null;
        description = "Trickplay generation options.";
      };
    };
  };

  # =============================================================================
  # LIBRARY CONFIG (src/types/config/library.ts)
  # =============================================================================
  collectionTypeEnum = types.enum [
    "movies"
    "tvshows"
    "music"
    "musicvideos"
    "homevideos"
    "boxsets"
    "books"
    "mixed"
  ];

  pathInfoConfigType = types.submodule {
    options = {
      path = mkOption {
        type = types.path;
        description = "Media path.";
      };
    };
  };

  libraryOptionsConfigType = types.submodule {
    options = {
      pathInfos = mkOption {
        type = types.nonEmptyListOf pathInfoConfigType;
        description = "List of paths for this library (at least one required).";
      };
    };
  };

  virtualFolderConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.strMatching ".+";
        description = "Library name (non-empty).";
      };
      collectionType = mkOption {
        type = collectionTypeEnum;
        description = "Type of media collection.";
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
        type = optionalOf (types.listOf virtualFolderConfigType);
        default = null;
        description = "List of virtual folder (library) configurations.";
      };
    };
  };

  # =============================================================================
  # USERS CONFIG (src/types/config/users.ts)
  # =============================================================================
  userPolicyConfigType = types.submodule {
    options = {
      isAdministrator = mkOption {
        type = optionalOf types.bool;
        default = null;
        description = "Whether the user is an administrator.";
      };
      loginAttemptsBeforeLockout = mkOption {
        type = optionalOf types.ints.positive;
        default = null;
        description = "Number of login attempts before lockout (minimum 1).";
      };
    };
  };

  # Note: The XOR validation for password/passwordFile is handled via assertion
  # in config.nix since Nix types cannot express this constraint directly.
  userConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.strMatching ".+";
        description = "Username (non-empty, required).";
      };
      password = mkOption {
        type = optionalOf types.str;
        default = null;
        description = "Plaintext password (use passwordFile for production).";
      };
      passwordFile = mkOption {
        type = optionalOf types.path;
        default = null;
        description = "Path to file containing the password.";
      };
      policy = mkOption {
        type = optionalOf userPolicyConfigType;
        default = null;
        description = "User policy configuration.";
      };
    };
  };

  # =============================================================================
  # ROOT CONFIG (src/types/config/root.ts)
  # =============================================================================
  rootConfigType = types.submodule {
    options = {
      version = mkOption {
        type = types.ints.positive;
        description = "Configuration version (positive integer).";
      };
      base_url = mkOption {
        type = types.strMatching "^https?://.*";
        description = "Jellyfin server base URL.";
        example = "http://localhost:8096";
      };
      system = mkOption {
        type = systemConfigType;
        description = "System configuration.";
      };
      encoding = mkOption {
        type = optionalOf encodingOptionsConfigType;
        default = null;
        description = "Encoding/transcoding options.";
      };
      library = mkOption {
        type = optionalOf libraryConfigType;
        default = null;
        description = "Library configuration.";
      };
      branding = mkOption {
        type = optionalOf brandingOptionsConfigType;
        default = null;
        description = "Branding options.";
      };
      users = mkOption {
        type = optionalOf (types.listOf userConfigType);
        default = null;
        description = "User configurations.";
      };
      startup = mkOption {
        type = optionalOf startupConfigType;
        default = null;
        description = "Startup configuration.";
      };
    };
  };
in {
  inherit
    rootConfigType
    # Export individual types for testing/reuse
    systemConfigType
    encodingOptionsConfigType
    libraryConfigType
    brandingOptionsConfigType
    userConfigType
    startupConfigType
    ;
}
