{pkgs}:
pkgs.testers.runNixOSTest {
  globalTimeout = 600;

  name = "jellarr-it1-preserve-enableMetrics";

  nodes.server = {
    imports = [
      ./base.nix
    ];

    services.jellarr.config = {
      base_url = "http://localhost:8096";
      system = {};
      version = 1;
    };
  };

  testScript =
    # py
    ''
      # Arrange
      print("=== IT1: Testing enableMetrics preservation ===")
      ${builtins.readFile ./setup.py}
      setup_jellyfin_with_api_key(server)

      # Act
      server.succeed("curl -sf -X POST 'http://localhost:8096/System/Configuration' -H 'X-Emby-Token: test' -H 'Content-Type: application/json' -d '{\"EnableMetrics\": true}'")
      server.succeed("curl -sf 'http://localhost:8096/System/Configuration' -H 'X-Emby-Token: test' | jq -e '.EnableMetrics == true'")
      print("✓ EnableMetrics set to true")

      print("=== Running jellarr service with config that omits enableMetrics ===")
      server.succeed("systemctl start jellarr.service")
      time.sleep(5)
      server.succeed("systemctl show jellarr.service --property=ExecMainStatus | grep -q 'ExecMainStatus=0'")

      # Assert
      server.succeed("curl -sf 'http://localhost:8096/System/Configuration' -H 'X-Emby-Token: test' | jq -e '.EnableMetrics == true'")
      print("✓ EnableMetrics preserved (still true)")

      print("✅ IT1 test passed: enableMetrics preserved when omitted from config")
    '';
}
