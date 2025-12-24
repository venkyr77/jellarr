{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  brandingOptionsConfigType = types.submodule {
    options = {
      loginDisclaimer = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Custom login disclaimer text (supports HTML).";
      };
      customCss = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Custom CSS to apply to the Jellyfin web interface.";
      };
      splashscreenEnabled = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Enable or disable the splashscreen.";
      };
    };
  };

  mkBrandingOptionsConfig = cfg:
    {}
    // optionalAttrs (cfg.loginDisclaimer != null) {inherit (cfg) loginDisclaimer;}
    // optionalAttrs (cfg.customCss != null) {inherit (cfg) customCss;}
    // optionalAttrs (cfg.splashscreenEnabled != null) {inherit (cfg) splashscreenEnabled;};
in {
  inherit brandingOptionsConfigType mkBrandingOptionsConfig;
}
