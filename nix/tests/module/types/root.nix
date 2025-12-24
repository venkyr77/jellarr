{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.root) mkConfig;

  nullConfig = {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = null;
    encoding = null;
    library = null;
    branding = null;
    users = null;
    plugins = null;
    startup = null;
  };

  nullSystemConfig = {
    enableMetrics = null;
    pluginRepositories = null;
    trickplayOptions = null;
  };

  nullEncodingConfig = {
    enableHardwareEncoding = null;
    hardwareAccelerationType = null;
    vaapiDevice = null;
    qsvDevice = null;
    hardwareDecodingCodecs = null;
    enableDecodingColorDepth10Hevc = null;
    enableDecodingColorDepth10Vp9 = null;
    enableDecodingColorDepth10HevcRext = null;
    enableDecodingColorDepth12HevcRext = null;
    allowHevcEncoding = null;
    allowAv1Encoding = null;
  };

  nullLibraryConfig = {virtualFolders = null;};

  nullBrandingConfig = {
    loginDisclaimer = null;
    customCss = null;
    splashscreenEnabled = null;
  };

  nullStartupConfig = {completeStartupWizard = null;};
in [
  (assertEq "minimal config" (mkConfig nullConfig) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
  })

  (assertEq "complete root config with system" (mkConfig (nullConfig
    // {
      system =
        nullSystemConfig
        // {
          enableMetrics = true;
          pluginRepositories = [
            {
              name = "Test Repository";
              url = "https://test.example.com/manifest.json";
              enabled = true;
            }
          ];
          trickplayOptions = {
            enableHwAcceleration = true;
            enableHwEncoding = null;
          };
        };
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {
      enableMetrics = true;
      pluginRepositories = [
        {
          name = "Test Repository";
          url = "https://test.example.com/manifest.json";
          enabled = true;
        }
      ];
      trickplayOptions = {enableHwAcceleration = true;};
    };
  })

  (assertEq "with encoding section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      encoding = nullEncodingConfig // {enableHardwareEncoding = true;};
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    encoding = {enableHardwareEncoding = true;};
  })

  (assertEq "without encoding section" (mkConfig (nullConfig // {system = nullSystemConfig;})) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
  })

  (assertEq "with library section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      library = {
        virtualFolders = [
          {
            name = "Movies";
            collectionType = "movies";
            libraryOptions = {pathInfos = [{path = "/mnt/movies";}];};
          }
        ];
      };
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    library = {
      virtualFolders = [
        {
          name = "Movies";
          collectionType = "movies";
          libraryOptions = {pathInfos = [{path = "/mnt/movies";}];};
        }
      ];
    };
  })

  (assertEq "empty library section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      library = nullLibraryConfig;
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    library = {};
  })

  (assertEq "without library section" (mkConfig (nullConfig // {system = nullSystemConfig;})) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
  })

  (assertThrows "reject invalid version" (mkConfig (nullConfig // {version = -1;})))

  (assertThrows "reject zero version" (mkConfig (nullConfig // {version = 0;})))

  (assertThrows "reject empty base_url" (mkConfig (nullConfig // {base_url = "";})))

  (assertEq "with branding section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      branding =
        nullBrandingConfig
        // {
          loginDisclaimer = "Custom login message";
          customCss = "body { background: black; }";
        };
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    branding = {
      loginDisclaimer = "Custom login message";
      customCss = "body { background: black; }";
    };
  })

  (assertEq "empty branding section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      branding = nullBrandingConfig;
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    branding = {};
  })

  (assertEq "without branding section" (mkConfig (nullConfig // {system = nullSystemConfig;})) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
  })

  (assertEq "with users section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      users = [
        {
          name = "testuser";
          password = "testpass123";
          passwordFile = null;
          policy = null;
        }
        {
          name = "fileuser";
          password = null;
          passwordFile = "/secrets/password";
          policy = null;
        }
      ];
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    users = [
      {
        name = "testuser";
        password = "testpass123";
      }
      {
        name = "fileuser";
        passwordFile = "/secrets/password";
      }
    ];
  })

  (assertEq "empty users section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      users = [];
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    users = [];
  })

  (assertEq "without users section" (mkConfig (nullConfig // {system = nullSystemConfig;})) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
  })

  (assertThrows "reject invalid users (no password)" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      users = [
        {
          name = "invaliduser";
          password = null;
          passwordFile = null;
          policy = null;
        }
      ];
    })))

  (assertEq "empty encoding section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      encoding = nullEncodingConfig;
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    encoding = {};
  })

  (assertEq "with startup section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      startup = {completeStartupWizard = true;};
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    startup = {completeStartupWizard = true;};
  })

  (assertEq "empty startup section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      startup = nullStartupConfig;
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    startup = {};
  })

  (assertEq "without startup section" (mkConfig (nullConfig // {system = nullSystemConfig;})) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
  })

  (assertEq "with plugins section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      plugins = [
        {
          name = "Trakt";
          configuration = null;
        }
        {
          name = "Playback Reporting";
          configuration = null;
        }
      ];
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    plugins = [
      {name = "Trakt";}
      {name = "Playback Reporting";}
    ];
  })

  (assertEq "plugins with configuration" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      plugins = [
        {
          name = "Trakt";
          configuration = {TraktUsers = [{ExtraLogging = true;}];};
        }
        {
          name = "Playback Reporting";
          configuration = null;
        }
      ];
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    plugins = [
      {
        name = "Trakt";
        configuration = {TraktUsers = [{ExtraLogging = true;}];};
      }
      {name = "Playback Reporting";}
    ];
  })

  (assertEq "empty plugins section" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      plugins = [];
    })) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
    plugins = [];
  })

  (assertEq "without plugins section" (mkConfig (nullConfig // {system = nullSystemConfig;})) {
    version = 1;
    base_url = "http://10.0.0.76:8096";
    system = {};
  })

  (assertThrows "reject invalid plugins (empty name)" (mkConfig (nullConfig
    // {
      system = nullSystemConfig;
      plugins = [
        {
          name = "";
          configuration = null;
        }
      ];
    })))

  (assertEq "all fields" (mkConfig {
      version = 1;
      base_url = "http://10.0.0.76:8096";
      system =
        nullSystemConfig
        // {
          enableMetrics = true;
          pluginRepositories = [
            {
              name = "Test Repository";
              url = "https://test.example.com/manifest.json";
              enabled = true;
            }
          ];
          trickplayOptions = {
            enableHwAcceleration = true;
            enableHwEncoding = null;
          };
        };
      encoding = nullEncodingConfig // {enableHardwareEncoding = true;};
      library = {
        virtualFolders = [
          {
            name = "movies";
            collectionType = "movies";
            libraryOptions = {pathInfos = [{path = "/media/movies";}];};
          }
        ];
      };
      branding =
        nullBrandingConfig
        // {
          loginDisclaimer = "Welcome to our media server";
          customCss = "body { font-family: Arial; }";
        };
      users = [
        {
          name = "admin";
          password = "adminpass123";
          passwordFile = null;
          policy = null;
        }
        {
          name = "viewer";
          password = null;
          passwordFile = "/secrets/viewer_password";
          policy = null;
        }
      ];
      plugins = [
        {
          name = "Trakt";
          configuration = {TraktUsers = [{ExtraLogging = true;}];};
        }
      ];
      startup = {completeStartupWizard = true;};
    }) {
      version = 1;
      base_url = "http://10.0.0.76:8096";
      system = {
        enableMetrics = true;
        pluginRepositories = [
          {
            name = "Test Repository";
            url = "https://test.example.com/manifest.json";
            enabled = true;
          }
        ];
        trickplayOptions = {enableHwAcceleration = true;};
      };
      encoding = {enableHardwareEncoding = true;};
      library = {
        virtualFolders = [
          {
            name = "movies";
            collectionType = "movies";
            libraryOptions = {pathInfos = [{path = "/media/movies";}];};
          }
        ];
      };
      branding = {
        loginDisclaimer = "Welcome to our media server";
        customCss = "body { font-family: Arial; }";
      };
      users = [
        {
          name = "admin";
          password = "adminpass123";
        }
        {
          name = "viewer";
          passwordFile = "/secrets/viewer_password";
        }
      ];
      plugins = [
        {
          name = "Trakt";
          configuration = {TraktUsers = [{ExtraLogging = true;}];};
        }
      ];
      startup = {completeStartupWizard = true;};
    })
]
