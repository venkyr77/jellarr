{pkgs, ...}: {
  imports = [
    (import ../../module {
      inherit pkgs;
      inherit (pkgs) lib;
    })
  ];

  environment = {
    # API key file for bootstrap to insert into Jellyfin DB
    etc."jellarr-api-key".text = "test-api-key";

    # Environment file for Jellarr to authenticate API calls
    etc."jellarr-env".text = "JELLARR_API_KEY=test-api-key";

    systemPackages = [
      pkgs.curl
      pkgs.dig
      pkgs.jq
      pkgs.sqlite
    ];
  };

  networking.useDHCP = true;

  services = {
    jellarr = {
      enable = true;
      environmentFile = "/etc/jellarr-env";

      # Use bootstrap to automatically provision API key into Jellyfin DB
      bootstrap = {
        enable = true;
        apiKeyFile = "/etc/jellarr-api-key";
      };
    };

    jellyfin = {
      enable = true;
      openFirewall = true;
    };
  };

  virtualisation.diskSize = 4096;
}
