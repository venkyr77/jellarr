{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.system) mkSystemConfig;

  nullConfig = {
    serverName = null;
    enableMetrics = null;
    pluginRepositories = null;
    trickplayOptions = null;
  };

  nullTrickplayConfig = {
    enableHwAcceleration = null;
    enableHwEncoding = null;
    processThreads = null;
    enableKeyFrameOnlyExtraction = null;
    scanBehavior = null;
    processPriority = null;
    interval = null;
    widthResolutions = null;
    tileWidth = null;
    tileHeight = null;
    qscale = null;
    jpegQuality = null;
  };
in [
  (assertEq "empty config" (mkSystemConfig nullConfig) {})

  (assertEq "serverName only" (mkSystemConfig (nullConfig // {serverName = "MyServer";})) {
    serverName = "MyServer";
  })

  (assertEq "enableMetrics true" (mkSystemConfig (nullConfig // {enableMetrics = true;})) {
    enableMetrics = true;
  })

  (assertEq "enableMetrics false" (mkSystemConfig (nullConfig // {enableMetrics = false;})) {
    enableMetrics = false;
  })

  (assertEq "full config" (mkSystemConfig {
      enableMetrics = true;
      pluginRepositories = [
        {
          name = "Jellyfin Official";
          url = "https://repo.jellyfin.org/releases/plugin/manifest.json";
          enabled = true;
        }
      ];
      trickplayOptions =
        nullTrickplayConfig
        // {
          enableHwAcceleration = true;
          enableHwEncoding = false;
          processThreads = 2;
          enableKeyFrameOnlyExtraction = false;
          scanBehavior = "NonBlocking";
          processPriority = "Normal";
          interval = 10000;
          widthResolutions = [320 480 720];
          tileWidth = 10;
          tileHeight = 10;
          qscale = 4;
          jpegQuality = 90;
        };
    }) {
      enableMetrics = true;
      pluginRepositories = [
        {
          name = "Jellyfin Official";
          url = "https://repo.jellyfin.org/releases/plugin/manifest.json";
          enabled = true;
        }
      ];
      trickplayOptions = {
        enableHwAcceleration = true;
        enableHwEncoding = false;
        processThreads = 2;
        enableKeyFrameOnlyExtraction = false;
        scanBehavior = "NonBlocking";
        processPriority = "Normal";
        interval = 10000;
        widthResolutions = [320 480 720];
        tileWidth = 10;
        tileHeight = 10;
        qscale = 4;
        jpegQuality = 90;
      };
    })

  (assertEq "valid plugin repository" (mkSystemConfig (nullConfig
    // {
      pluginRepositories = [
        {
          name = "Test Repository";
          url = "https://example.com/manifest.json";
          enabled = true;
        }
      ];
    })) {
    pluginRepositories = [
      {
        name = "Test Repository";
        url = "https://example.com/manifest.json";
        enabled = true;
      }
    ];
  })

  (assertEq "multiple plugin repositories" (mkSystemConfig (nullConfig
    // {
      pluginRepositories = [
        {
          name = "Repo1";
          url = "https://example1.com";
          enabled = true;
        }
        {
          name = "Repo2";
          url = "https://example2.com";
          enabled = false;
        }
      ];
    })) {
    pluginRepositories = [
      {
        name = "Repo1";
        url = "https://example1.com";
        enabled = true;
      }
      {
        name = "Repo2";
        url = "https://example2.com";
        enabled = false;
      }
    ];
  })

  (assertThrows "reject empty repo name" (mkSystemConfig (nullConfig
    // {
      pluginRepositories = [
        {
          name = "";
          url = "https://example.com";
          enabled = true;
        }
      ];
    })))

  (assertEq "empty trickplay options" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig;
    })) {
    trickplayOptions = {};
  })

  (assertEq "trickplay enableHwAcceleration only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = true;
        enableHwEncoding = null;
      };
    })) {
    trickplayOptions = {enableHwAcceleration = true;};
  })

  (assertEq "trickplay enableHwEncoding only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = null;
        enableHwEncoding = false;
      };
    })) {
    trickplayOptions = {enableHwEncoding = false;};
  })

  (assertEq "trickplay both options" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = false;
        enableHwEncoding = true;
      };
    })) {
    trickplayOptions = {
      enableHwAcceleration = false;
      enableHwEncoding = true;
    };
  })

  (assertEq "trickplay processThreads only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = {
        enableHwAcceleration = null;
        enableHwEncoding = null;
        processThreads = 3;
      };
    })) {
    trickplayOptions = {processThreads = 3;};
  })

  (assertEq "trickplay enableKeyFrameOnlyExtraction only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {enableKeyFrameOnlyExtraction = true;};
    })) {
    trickplayOptions = {enableKeyFrameOnlyExtraction = true;};
  })

  (assertEq "trickplay scanBehavior Blocking" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {scanBehavior = "Blocking";};
    })) {
    trickplayOptions = {scanBehavior = "Blocking";};
  })

  (assertEq "trickplay processPriority High" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {processPriority = "High";};
    })) {
    trickplayOptions = {processPriority = "High";};
  })

  (assertEq "trickplay tileWidth only" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {tileWidth = 320;};
    })) {
    trickplayOptions = {tileWidth = 320;};
  })

  (assertEq "trickplay widthResolutions list" (mkSystemConfig (nullConfig
    // {
      trickplayOptions = nullTrickplayConfig // {widthResolutions = [320 480];};
    })) {
    trickplayOptions = {widthResolutions = [320 480];};
  })
]
