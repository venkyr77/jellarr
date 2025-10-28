{
  config,
  lib,
  pkgs,
  ...
}: let
  cfg = config.services.jellarr;

  pkg = import ../package.nix {inherit pkgs;};
in {
  config = lib.mkIf cfg.enable {
    systemd = {
      services.jellarr = {
        after = [
          "network-online.target"
          "systemd-tmpfiles-setup.service"
        ];
        description = "Run jellarr (packaged) once";
        preStart = let
          configFile = pkgs.writeText "jellarr-config.yml" cfg.config;
        in ''
          install -D -m 0644 ${configFile} ${cfg.dataDir}/config/config.yml
          chown ${cfg.user}:${cfg.group} ${cfg.dataDir}/config/config.yml
        '';
        serviceConfig = {
          EnvironmentFile = lib.optional (cfg.environmentFile != null) cfg.environmentFile;
          ExecStart = lib.getExe pkg;
          Group = cfg.group;
          Type = "oneshot";
          User = cfg.user;
          WorkingDirectory = cfg.dataDir;
        };
        wants = ["network-online.target"];
      };

      timers.jellarr = {
        description = "Schedule jellarr run";
        partOf = ["jellarr.service"];
        timerConfig = {
          OnCalendar = cfg.schedule;
          Persistent = true;
          RandomizedDelaySec = "5m";
        };
        wantedBy = ["timers.target"];
      };

      tmpfiles.rules = [
        "d ${cfg.dataDir} 0755 ${cfg.user} ${cfg.group} -"
        "d ${cfg.dataDir}/config 0755 ${cfg.user} ${cfg.group} -"
      ];
    };

    users = {
      groups = lib.mkIf (cfg.group == "jellarr") {
        ${cfg.group} = {};
      };

      users = lib.mkIf (cfg.user == "jellarr") {
        jellarr = {
          description = "jellarr user";
          inherit (cfg) group;
          home = cfg.dataDir;
          isSystemUser = true;
        };
      };
    };
  };
}
