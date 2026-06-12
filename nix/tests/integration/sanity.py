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


def wait_for_bootstrap(server):
    print("=== Starting the VM / Server ===")
    server.start()

    print("=== Waiting for API key bootstrap service ===")
    # wait_until_succeeds handles the case where the oneshot service already completed
    server.wait_until_succeeds(
        "systemctl show jellarr-api-key-bootstrap.service --property=ExecMainStatus | grep -q 'ExecMainStatus=0'"
    )
    print("✓ Bootstrap service completed successfully")

    # Jellyfin was restarted by bootstrap, wait for it
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
                "curl -sf 'http://localhost:8096/System/Configuration' -H 'X-Emby-Token: test-api-key'"
            )
            print("✓ Jellyfin authenticated API ready")
            break
        except:
            time.sleep(2)
    else:
        raise Exception("Jellyfin authenticated API never became ready")


def jellyfin_api_call(server, endpoint, method="GET", data=None):
    url = f"http://localhost:8096{endpoint}"
    cmd = f"curl -sf '{url}' -H 'X-Emby-Token: test-api-key'"

    if method == "POST":
        cmd += " -H 'Content-Type: application/json'"
        if data:
            cmd += f" -d '{data}'"

    result = server.succeed(cmd)
    return json.loads(result)


def get_jellyfin_config(server, endpoint=""):
    return jellyfin_api_call(server, f"/System/Configuration{endpoint}")


def get_jellyfin_data(server, endpoint):
    return jellyfin_api_call(server, endpoint)


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
                    has_entry("EnableKeyFrameOnlyExtraction", True),
                    has_entry("ScanBehavior", "NonBlocking"),
                    has_entry("ProcessPriority", "Normal"),
                    has_entry("Interval", 10000),
                    has_entry("TileWidth", 320),
                    has_entry("TileHeight", 180),
                    has_entry("Qscale", 4),
                    has_entry("JpegQuality", 90),
                    has_entry("WidthResolutions", has_items(320, 640)),
                ),
            ),
            has_entry("CorsHosts", has_item("*")),
            has_entry("ImageSavingConvention", "Legacy"),
            has_entry("EnableFolderView", False),
            has_entry("LibraryMonitorDelay", 60),
            has_entry("SortRemoveWords", has_items("the", "a", "an")),
            has_entry("UICulture", "en-US"),
            has_entry("PreferredMetadataLanguage", "en"),
            has_entry("MetadataCountryCode", "US"),
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
            has_entry("EnableTonemapping", True),
            has_entry("TonemappingAlgorithm", "bt2390"),
            has_entry("TonemappingMode", "auto"),
            has_entry("H264Crf", 23),
            has_entry("H265Crf", 28),
            has_entry("EncoderPreset", "auto"),
            has_entry("DeinterlaceMethod", "yadif"),
            has_entry("EnableSubtitleExtraction", True),
            has_entry("MaxMuxingQueueSize", 2048),
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
                        all_of(
                            has_entry(
                                "PathInfos",
                                all_of(
                                    has_length(1),
                                    has_item(has_entry("Path", "/mnt/movies/English")),
                                ),
                            ),
                            has_entry("EnableAutomaticSeriesGrouping", True),
                            has_entry("PreferredMetadataLanguage", "en"),
                            has_entry("MetadataCountryCode", "US"),
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
                    has_entry(
                        "Policy",
                        all_of(
                            has_entry("IsAdministrator", True),
                            has_entry("LoginAttemptsBeforeLockout", 3),
                        ),
                    ),
                ),
                all_of(
                    has_entry("Name", "test-jellarr-2"),
                    has_key("Id"),
                    has_entry("HasPassword", True),
                    has_entry("HasConfiguredPassword", True),
                    has_entry(
                        "Policy",
                        all_of(
                            has_entry("IsAdministrator", False),
                            has_entry("LoginAttemptsBeforeLockout", 5),
                        ),
                    ),
                ),
            ),
        ),
    )

    print("✓ User management validated (users + policies)")


def validate_user_authentication(server):
    auth_payload_1 = json.dumps({"Username": "test-jellarr-1", "Pw": "test"})
    auth_payload_2 = json.dumps({"Username": "test-jellarr-2", "Pw": "test"})

    auth_response_1 = jellyfin_api_call(
        server, "/Users/AuthenticateByName", "POST", auth_payload_1
    )
    auth_response_2 = jellyfin_api_call(
        server, "/Users/AuthenticateByName", "POST", auth_payload_2
    )

    assert_that(
        auth_response_1,
        all_of(
            has_entry("User", has_entry("Name", "test-jellarr-1")),
            has_key("AccessToken"),
        ),
    )

    assert_that(
        auth_response_2,
        all_of(
            has_entry("User", has_entry("Name", "test-jellarr-2")),
            has_key("AccessToken"),
        ),
    )

    print("✓ User authentication validated (passwords working)")


def validate_networking_configuration(server):
    network_config = get_jellyfin_config(server, "/network")

    assert_that(
        network_config,
        all_of(
            has_entry("EnableIPv6", True),
            has_entry("AutoDiscovery", False),
            has_entry("EnableUPnP", False),
            has_entry("KnownProxies", has_item("10.0.0.1")),
            has_entry(
                "PublishedServerUriBySubnet",
                has_item("all=https://jellyfin.example.com"),
            ),
        ),
    )

    print("✓ Networking configuration validated")


def validate_api_keys(server):
    auth_keys = get_jellyfin_data(server, "/Auth/Keys")

    assert_that(
        auth_keys,
        has_entry(
            "Items",
            has_item(has_entry("AppName", "test-integration")),
        ),
    )

    print("✓ API keys validated")


def probe_readonly_fields(server):
    cfg = get_jellyfin_config(server)

    for field, want in [("IsPortAuthorized", True), ("QuickConnectAvailable", True)]:
        got = cfg.get(field)
        status = "round-trips" if got == want else "read-only/ignored"
        print(f"[probe] {field}: wanted {want}, got {got} -> {status}")


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
    wait_for_bootstrap(server)
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
    validate_user_authentication(server)
    validate_networking_configuration(server)
    validate_api_keys(server)
    probe_readonly_fields(server)
    print(
        "✅ SANITY test passed: Full configuration applied and validated successfully"
    )
