{pkgs}:
pkgs.testers.runNixOSTest {
  extraPythonPackages = p: [p.pyhamcrest];

  globalTimeout = 600;

  name = "jellarr-sanity-full-config";

  nodes.server = {
    imports = [
      ./base.nix
    ];

    services.jellarr.config = {
      api_keys = [
        {name = "test-integration";}
      ];
      base_url = "http://localhost:8096";
      branding = {
        customCss = "@import url(\"https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css\");";
        loginDisclaimer = "Configured by <a href=\"https://github.com/venkyr77/jellarr\">Jellarr</a>";
        splashscreenEnabled = false;
      };
      encoding = {
        allowAv1Encoding = false;
        allowHevcEncoding = false;
        deinterlaceMethod = "yadif";
        enableDecodingColorDepth10Hevc = true;
        enableDecodingColorDepth10HevcRext = true;
        enableDecodingColorDepth12HevcRext = true;
        enableDecodingColorDepth10Vp9 = true;
        enableHardwareEncoding = true;
        enableSubtitleExtraction = true;
        enableTonemapping = true;
        encoderPreset = "auto";
        h264Crf = 23;
        h265Crf = 28;
        hardwareAccelerationType = "vaapi";
        hardwareDecodingCodecs = [
          "h264"
          "hevc"
          "mpeg2video"
          "vc1"
          "vp8"
          "vp9"
          "av1"
        ];
        maxMuxingQueueSize = 2048;
        tonemappingAlgorithm = "bt2390";
        tonemappingMode = "auto";
        vaapiDevice = "/dev/dri/renderD128";
      };
      library = {
        virtualFolders = [
          {
            collectionType = "movies";
            libraryOptions = {
              enableAutomaticSeriesGrouping = true;
              metadataCountryCode = "US";
              pathInfos = [
                {path = "/mnt/movies/English";}
              ];
              preferredMetadataLanguage = "en";
            };
            name = "test-jellarr";
          }
        ];
      };
      networking = {
        autoDiscovery = false;
        enableIPv6 = true;
        enableUPnP = false;
        knownProxies = ["10.0.0.1"];
        publishedServerUriBySubnet = ["all=https://jellyfin.example.com"];
        requireHttps = false;
      };
      system = {
        corsHosts = ["*"];
        enableFolderView = false;
        enableMetrics = true;
        imageSavingConvention = "Legacy";
        # Suspect fields: probed (not hard-asserted) to learn if Jellyfin
        # treats them as read-only / ignores them on round-trip.
        isPortAuthorized = true;
        libraryMonitorDelay = 60;
        metadataCountryCode = "US";
        pluginRepositories = [
          {
            enabled = true;
            name = "Jellyfin Official";
            url = "https://repo.jellyfin.org/releases/plugin/manifest.json";
          }
        ];
        preferredMetadataLanguage = "en";
        quickConnectAvailable = true;
        sortRemoveWords = ["the" "a" "an"];
        trickplayOptions = {
          enableHwAcceleration = true;
          enableHwEncoding = true;
          enableKeyFrameOnlyExtraction = true;
          interval = 10000;
          jpegQuality = 90;
          processPriority = "Normal";
          qscale = 4;
          scanBehavior = "NonBlocking";
          tileHeight = 180;
          tileWidth = 320;
          widthResolutions = [320 640];
        };
        uiCulture = "en-US";
      };
      users = [
        {
          name = "test-jellarr-1";
          password = "test";
          policy = {
            isAdministrator = true;
            loginAttemptsBeforeLockout = 3;
          };
        }
        {
          name = "test-jellarr-2";
          passwordFile = "/tmp/test-pass-file";
          policy = {
            isAdministrator = false;
            loginAttemptsBeforeLockout = 5;
          };
        }
      ];
      version = 1;
    };
  };

  testScript =
    # py
    ''
      ${builtins.readFile ./sanity.py}
      run_sanity_test(server)
    '';
}
