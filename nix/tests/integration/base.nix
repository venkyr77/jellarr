{pkgs, ...}: {
  imports = [
    (import ../../module {
      inherit pkgs;
      inherit (pkgs) lib;
    })
  ];

  environment.systemPackages = [
    pkgs.curl
    pkgs.dig
    pkgs.jq
    pkgs.sqlite
  ];

  networking.useDHCP = true;

  services = {
    jellarr = {
      enable = true;
      environmentFile = "/tmp/jellarr-env";
    };

    jellyfin = {
      enable = true;
      openFirewall = true;
    };
  };

  virtualisation.diskSize = 4096;
}
