{
  nixpkgs,
  pkgs,
  system,
}: let
  customPackage = pkgs.writeShellScriptBin "custom-jellarr" ''
    exit 0
  '';
  evaluated = nixpkgs.lib.nixosSystem {
    inherit system;
    modules = [
      ../../module
      {
        services.jellarr = {
          enable = true;
          package = customPackage;
          config = {
            version = 1;
            base_url = "http://localhost:8096";
          };
        };
        system.stateVersion = "26.05";
      }
    ];
  };
  expected = nixpkgs.lib.getExe customPackage;
  actual = evaluated.config.systemd.services.jellarr.serviceConfig.ExecStart;
in
  assert actual == expected;
    pkgs.runCommand "jellarr-module-package-override" {} ''
      touch $out
    ''
