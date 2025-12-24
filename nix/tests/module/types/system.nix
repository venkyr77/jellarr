{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.system) mkSystemConfig;

  nullConfig = {
    enableMetrics = null;
    pluginRepositories = null;
    trickplayOptions = null;
  };
in [
  (assertEq "empty config" (mkSystemConfig nullConfig) {})

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
      trickplayOptions = {
        enableHwAcceleration = true;
        enableHwEncoding = false;
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
      trickplayOptions = {
        enableHwAcceleration = null;
        enableHwEncoding = null;
      };
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
]
