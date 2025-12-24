{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  startupConfigType = types.submodule {
    options = {
      completeStartupWizard = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Mark startup wizard as complete.";
      };
    };
  };

  mkStartupConfig = cfg:
    {}
    // optionalAttrs (cfg.completeStartupWizard != null) {inherit (cfg) completeStartupWizard;};
in {
  inherit startupConfigType mkStartupConfig;
}
