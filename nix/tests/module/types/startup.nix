{
  lib,
  assertEq,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.startup) mkStartupConfig;

  defaultCfg = {
    serverName = null;
    preferredMetadataLanguage = null;
    metadataCountryCode = null;
    uiCulture = null;
    remoteAccess = null;
    user = null;
    apiKeyApp = null;
    apiKeyFile = null;
    completeStartupWizard = null;
  };
in [
  (assertEq "completeStartupWizard true" (mkStartupConfig (defaultCfg // {completeStartupWizard = true;})) {
    completeStartupWizard = true;
  })

  (assertEq "completeStartupWizard false" (mkStartupConfig (defaultCfg // {completeStartupWizard = false;})) {
    completeStartupWizard = false;
  })

  (assertEq "empty config" (mkStartupConfig defaultCfg) {})

  (assertEq "serverName" (mkStartupConfig (defaultCfg // {serverName = "My Jellyfin";})) {
    serverName = "My Jellyfin";
  })

  (assertEq "metadata fields" (mkStartupConfig (defaultCfg
    // {
      preferredMetadataLanguage = "en";
      metadataCountryCode = "US";
      uiCulture = "en-US";
    })) {
    preferredMetadataLanguage = "en";
    metadataCountryCode = "US";
    uiCulture = "en-US";
  })

  (assertEq "remoteAccess" (mkStartupConfig (defaultCfg
    // {
      remoteAccess = {
        enableRemoteAccess = true;
        enableAutomaticPortMapping = false;
      };
    })) {
    remoteAccess = {
      enableRemoteAccess = true;
      enableAutomaticPortMapping = false;
    };
  })

  (assertEq "user with password" (mkStartupConfig (defaultCfg
    // {
      user = {
        name = "admin";
        password = "secret";
        passwordFile = null;
      };
    })) {
    user = {
      name = "admin";
      password = "secret";
    };
  })

  (assertEq "user with passwordFile" (mkStartupConfig (defaultCfg
    // {
      user = {
        name = "admin";
        password = null;
        passwordFile = "/run/secrets/pw";
      };
    })) {
    user = {
      name = "admin";
      passwordFile = "/run/secrets/pw";
    };
  })

  (assertEq "apiKeyApp and apiKeyFile" (mkStartupConfig (defaultCfg
    // {
      apiKeyApp = "jellarr";
      apiKeyFile = "/run/jellarr/api-key";
    })) {
    apiKeyApp = "jellarr";
    apiKeyFile = "/run/jellarr/api-key";
  })

  (assertEq "full config" (mkStartupConfig (defaultCfg
    // {
      serverName = "My Jellyfin";
      preferredMetadataLanguage = "en";
      metadataCountryCode = "US";
      uiCulture = "en-US";
      remoteAccess = {
        enableRemoteAccess = true;
        enableAutomaticPortMapping = false;
      };
      user = {
        name = "admin";
        password = "secret";
        passwordFile = null;
      };
      apiKeyApp = "jellarr";
      apiKeyFile = "/run/jellarr/api-key";
      completeStartupWizard = true;
    })) {
    serverName = "My Jellyfin";
    preferredMetadataLanguage = "en";
    metadataCountryCode = "US";
    uiCulture = "en-US";
    remoteAccess = {
      enableRemoteAccess = true;
      enableAutomaticPortMapping = false;
    };
    user = {
      name = "admin";
      password = "secret";
    };
    apiKeyApp = "jellarr";
    apiKeyFile = "/run/jellarr/api-key";
    completeStartupWizard = true;
  })
]
