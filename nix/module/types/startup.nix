{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  remoteAccessConfigType = types.submodule {
    options = {
      enableRemoteAccess = mkOption {
        type = types.bool;
        description = "Enable remote access.";
      };
      enableAutomaticPortMapping = mkOption {
        type = types.bool;
        description = "Enable automatic port mapping (UPnP). Deprecated in Jellyfin.";
      };
    };
  };

  startupUserConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "The admin user name.";
      };
      password = mkOption {
        type = nullOr types.str;
        default = null;
        description = "The admin user password. Mutually exclusive with passwordFile.";
      };
      passwordFile = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to a file containing the admin user password. Mutually exclusive with password.";
      };
    };
  };

  startupConfigType = types.submodule {
    options = {
      serverName = mkOption {
        type = nullOr types.str;
        default = null;
        description = "The server name to set during startup.";
      };
      preferredMetadataLanguage = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Preferred metadata language.";
      };
      metadataCountryCode = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Metadata country code.";
      };
      uiCulture = mkOption {
        type = nullOr types.str;
        default = null;
        description = "UI language culture.";
      };
      remoteAccess = mkOption {
        type = nullOr remoteAccessConfigType;
        default = null;
        description = "Remote access settings.";
      };
      user = mkOption {
        type = nullOr startupUserConfigType;
        default = null;
        description = "Initial admin user to create during startup wizard.";
      };
      apiKeyApp = mkOption {
        type = nullOr types.str;
        default = null;
        description = "App name for the API key to create.";
      };
      apiKeyFile = mkOption {
        type = nullOr types.str;
        default = null;
        description = "File path to write the created API key to.";
      };
      completeStartupWizard = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Mark startup wizard as complete.";
      };
    };
  };

  mkStartupConfig = cfg:
    {}
    // optionalAttrs ((cfg ? serverName) && cfg.serverName != null) {inherit (cfg) serverName;}
    // optionalAttrs ((cfg ? preferredMetadataLanguage) && cfg.preferredMetadataLanguage != null) {inherit (cfg) preferredMetadataLanguage;}
    // optionalAttrs ((cfg ? metadataCountryCode) && cfg.metadataCountryCode != null) {inherit (cfg) metadataCountryCode;}
    // optionalAttrs ((cfg ? uiCulture) && cfg.uiCulture != null) {inherit (cfg) uiCulture;}
    // optionalAttrs ((cfg ? remoteAccess) && cfg.remoteAccess != null) {
      remoteAccess = {
        inherit (cfg.remoteAccess) enableRemoteAccess enableAutomaticPortMapping;
      };
    }
    // optionalAttrs ((cfg ? user) && cfg.user != null) {
      user =
        {inherit (cfg.user) name;}
        // optionalAttrs (cfg.user.password != null) {inherit (cfg.user) password;}
        // optionalAttrs (cfg.user.passwordFile != null) {inherit (cfg.user) passwordFile;};
    }
    // optionalAttrs ((cfg ? apiKeyApp) && cfg.apiKeyApp != null) {inherit (cfg) apiKeyApp;}
    // optionalAttrs ((cfg ? apiKeyFile) && cfg.apiKeyFile != null) {inherit (cfg) apiKeyFile;}
    // optionalAttrs ((cfg ? completeStartupWizard) && cfg.completeStartupWizard != null) {inherit (cfg) completeStartupWizard;};
in {
  inherit startupConfigType mkStartupConfig;
}
