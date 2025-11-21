import time


def setup_jellyfin_with_api_key(server):
    print("=== Starting the VM / Server ===")
    server.start()
    server.wait_for_unit("jellyfin.service")
    server.wait_for_open_port(8096)

    print("=== Setting up API key ===")
    time.sleep(15)
    server.succeed("test -f /var/lib/jellyfin/data/jellyfin.db")
    server.succeed("systemctl stop jellyfin.service")
    time.sleep(3)
    server.succeed(
        "sqlite3 /var/lib/jellyfin/data/jellyfin.db \"INSERT OR IGNORE INTO ApiKeys (AccessToken, Name, DateCreated, DateLastActivity) VALUES ('test', 'jellarr-test', datetime('now'), datetime('now'));\""
    )
    server.succeed("echo 'JELLARR_API_KEY=test' > /tmp/jellarr-env")
    server.succeed("systemctl start jellyfin.service")
    server.wait_for_unit("jellyfin.service")
    server.wait_for_open_port(8096)

    print("=== Waiting for Jellyfin API ===")
    for i in range(30):
        try:
            server.succeed("curl -sf 'http://localhost:8096/System/Info/Public'")
            print("✓ Jellyfin public API ready")
            break
        except:
            time.sleep(2)
    else:
        raise Exception("Jellyfin public API never became ready")

    print("=== Waiting for authenticated API ===")
    for i in range(30):
        try:
            server.succeed(
                "curl -sf 'http://localhost:8096/System/Configuration' -H 'X-Emby-Token: test'"
            )
            print("✓ Jellyfin authenticated API ready")
            break
        except:
            time.sleep(2)
    else:
        raise Exception("Jellyfin authenticated API never became ready")
