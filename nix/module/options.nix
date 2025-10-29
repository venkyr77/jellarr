{lib, ...}: {
  options.services.jellarr = {
    config = lib.mkOption {
      default = {};
      description = "configuration as attrset which will be converted to YAML.";
      type = lib.types.attrs;
    };

    dataDir = lib.mkOption {
      default = "/var/lib/jellarr";
      description = "Working directory for jellarr (repos/, config/, etc.).";
      type = lib.types.path;
    };

    enable = lib.mkEnableOption "jellarr synchronization service";

    environmentFile = lib.mkOption {
      default = null;
      description = ''
        Environment file as defined in {manpage}`systemd.exec(5)`.
      '';
      type = lib.types.nullOr lib.types.path;
    };

    group = lib.mkOption {
      default = "jellarr";
      description = "Group for the jellarr service.";
      type = lib.types.str;
    };

    schedule = lib.mkOption {
      default = "daily";
      description = "Run interval for the timer.";
      type = lib.types.str;
    };

    user = lib.mkOption {
      default = "jellarr";
      description = "User to run the jellarr service as.";
      type = lib.types.str;
    };
  };
}
