import json
import time

from hamcrest import (
    all_of,
    assert_that,
    contains_string,
    empty,
    has_entry,
    has_item,
    has_items,
    has_key,
    has_length,
    not_,
)


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


def get_jellyfin_config(server, endpoint=""):
    """Get configuration from Jellyfin API using curl"""
    url = f"http://localhost:8096/System/Configuration{endpoint}"
    result = server.succeed(f"curl -sf '{url}' -H 'X-Emby-Token: test'")
    return json.loads(result)


def get_jellyfin_data(server, endpoint):
    """Get data from Jellyfin API using curl"""
    url = f"http://localhost:8096{endpoint}"
    result = server.succeed(f"curl -sf '{url}' -H 'X-Emby-Token: test'")
    return json.loads(result)


def validate_initial_state(server):
    branding_config = get_jellyfin_config(server, "/branding")
    encoding_config = get_jellyfin_config(server, "/encoding")
    system_config = get_jellyfin_config(server)
    users = get_jellyfin_data(server, "/Users")
    virtual_folders = get_jellyfin_data(server, "/Library/VirtualFolders")

    assert_that(
        branding_config,
        all_of(
            not_(has_key("CustomCss")),
            not_(has_key("LoginDisclaimer")),
            has_entry("SplashscreenEnabled", False),
        ),
    )

    assert_that(
        encoding_config,
        all_of(
            has_entry("AllowAv1Encoding", False),
            has_entry("AllowHevcEncoding", False),
            has_entry("EnableDecodingColorDepth10Hevc", True),
            has_entry("EnableDecodingColorDepth10HevcRext", False),
            has_entry("EnableDecodingColorDepth12HevcRext", False),
            has_entry("EnableDecodingColorDepth10Vp9", True),
            has_entry("EnableHardwareEncoding", True),
            has_entry("HardwareAccelerationType", "none"),
            has_entry("HardwareDecodingCodecs", all_of(has_items("h264", "vc1"))),
        ),
    )

    assert_that(
        system_config,
        all_of(
            has_entry("EnableMetrics", False),
            has_entry(
                "PluginRepositories",
                all_of(
                    has_length(1),
                    has_item(
                        all_of(
                            has_entry("Name", "Jellyfin Stable"),
                            has_entry(
                                "Url",
                                "https://repo.jellyfin.org/files/plugin/manifest.json",
                            ),
                            has_entry("Enabled", True),
                        )
                    ),
                ),
            ),
            has_entry(
                "TrickplayOptions",
                all_of(
                    has_entry("EnableHwAcceleration", False),
                    has_entry("EnableHwEncoding", False),
                ),
            ),
        ),
    )

    assert_that(users, empty())

    assert_that(virtual_folders, empty())

    print("✓ Initial state validated - Jellyfin at defaults")


def validate_system_configuration(server):
    system_config = get_jellyfin_config(server)

    assert_that(
        system_config,
        all_of(
            has_entry("EnableMetrics", True),
            has_entry(
                "PluginRepositories",
                all_of(
                    has_length(1),
                    has_item(
                        all_of(
                            has_entry("Name", "Jellyfin Official"),
                            has_entry(
                                "Url",
                                "https://repo.jellyfin.org/releases/plugin/manifest.json",
                            ),
                            has_entry("Enabled", True),
                        )
                    ),
                ),
            ),
            has_entry(
                "TrickplayOptions",
                all_of(
                    has_entry("EnableHwAcceleration", True),
                    has_entry("EnableHwEncoding", True),
                ),
            ),
        ),
    )

    print("✓ System configuration validated")


def validate_encoding_configuration(server):
    encoding_config = get_jellyfin_config(server, "/encoding")

    assert_that(
        encoding_config,
        all_of(
            has_entry("AllowAv1Encoding", False),
            has_entry("AllowHevcEncoding", False),
            has_entry("EnableDecodingColorDepth10Hevc", True),
            has_entry("EnableDecodingColorDepth10HevcRext", True),
            has_entry("EnableDecodingColorDepth12HevcRext", True),
            has_entry("EnableDecodingColorDepth10Vp9", True),
            has_entry("EnableHardwareEncoding", True),
            has_entry("HardwareAccelerationType", "vaapi"),
            has_entry(
                "HardwareDecodingCodecs",
                has_items("h264", "hevc", "mpeg2video", "vc1", "vp8", "vp9", "av1"),
            ),
            has_entry("VaapiDevice", "/dev/dri/renderD128"),
        ),
    )

    print("✓ Encoding configuration validated")


def validate_library_configuration(server):
    virtual_folders = get_jellyfin_data(server, "/Library/VirtualFolders")

    assert_that(
        virtual_folders,
        all_of(
            has_length(1),
            has_item(
                all_of(
                    has_entry("CollectionType", "movies"),
                    has_entry("Name", "test-jellarr"),
                    has_entry(
                        "LibraryOptions",
                        has_entry(
                            "PathInfos",
                            all_of(
                                has_length(1),
                                has_item(has_entry("Path", "/mnt/movies/English")),
                            ),
                        ),
                    ),
                )
            ),
        ),
    )

    print("✓ Library configuration validated")


def validate_branding_configuration(server):
    branding_config = get_jellyfin_data(server, "/Branding/Configuration")

    assert_that(
        branding_config,
        all_of(
            has_entry("LoginDisclaimer", contains_string("Configured by")),
            has_entry("CustomCss", contains_string("jellyskin")),
            has_entry("SplashscreenEnabled", False),
        ),
    )

    print("✓ Branding configuration validated")


def validate_user_management(server):
    users = get_jellyfin_data(server, "/Users")

    assert_that(
        users,
        all_of(
            has_length(2),
            has_items(
                all_of(
                    has_entry("Name", "test-jellarr-1"),
                    has_key("Id"),
                    has_entry("HasPassword", True),
                    has_entry("HasConfiguredPassword", True),
                ),
                all_of(
                    has_entry("Name", "test-jellarr-2"),
                    has_key("Id"),
                    has_entry("HasPassword", True),
                    has_entry("HasConfiguredPassword", True),
                ),
            ),
        ),
    )

    print("✓ User management validated")


def setup_files_and_folders(server):
    server.succeed("echo 'test' > /tmp/test-pass-file")
    server.succeed("mkdir -p /mnt/movies/English")
    server.succeed("mkdir -p /dev/dri")
    server.succeed("touch /dev/dri/renderD128")


def wait_for_ready(server):
    server.wait_for_unit("multi-user.target")
    server.wait_until_succeeds("dig +short repo.jellyfin.org")


def run_sanity_test(server):
    # Arrange
    wait_for_ready(server)
    setup_jellyfin_with_api_key(server)
    setup_files_and_folders(server)
    validate_initial_state(server)

    # Act
    server.succeed("systemctl start jellarr.service")
    time.sleep(10)
    server.succeed(
        "systemctl show jellarr.service --property=ExecMainStatus | grep -q 'ExecMainStatus=0'"
    )

    # Assert
    validate_system_configuration(server)
    validate_encoding_configuration(server)
    validate_library_configuration(server)
    validate_branding_configuration(server)
    validate_user_management(server)
    print(
        "✅ SANITY test passed: Full configuration applied and validated successfully"
    )
