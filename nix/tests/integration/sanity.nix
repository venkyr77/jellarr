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
      base_url = "http://localhost:8096";
      branding = {
        customCss = "@import url(\"https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css\");";
        loginDisclaimer = "Configured by <a href=\"https://github.com/venkyr77/jellarr\">Jellarr</a>";
        splashscreenEnabled = false;
      };
      encoding = {
        allowAv1Encoding = false;
        allowHevcEncoding = false;
        enableDecodingColorDepth10Hevc = true;
        enableDecodingColorDepth10HevcRext = true;
        enableDecodingColorDepth12HevcRext = true;
        enableDecodingColorDepth10Vp9 = true;
        enableHardwareEncoding = true;
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
        vaapiDevice = "/dev/dri/renderD128";
      };
      library = {
        virtualFolders = [
          {
            collectionType = "movies";
            libraryOptions = {
              pathInfos = [
                {path = "/mnt/movies/English";}
              ];
            };
            name = "test-jellarr";
          }
        ];
      };
      system = {
        enableMetrics = true;
        pluginRepositories = [
          {
            enabled = true;
            name = "Jellyfin Official";
            url = "https://repo.jellyfin.org/releases/plugin/manifest.json";
          }
        ];
        trickplayOptions = {
          enableHwAcceleration = true;
          enableHwEncoding = true;
        };
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
