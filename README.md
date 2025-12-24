# Jellarr

**Jellarr** is an open-source tool designed to simplify declarative
configuration management for [Jellyfin](https://jellyfin.org) media servers.
Inspired by [Configarr](https://github.com/raydak-labs/configarr)'s approach to
\*arr stack automation, Jellarr uses Jellyfin's official REST API to safely
apply configuration changes through version-controlled YAML files.

By streamlining server configuration, Jellarr saves time, enhances consistency
across environments, and reduces manual intervention.

---

## Why Jellarr?

Managing Jellyfin configuration becomes painful at scale:

- **Configuration drift** across dev/staging/prod environments
- **No version control** for settings changes
- **Manual clicking** through web UI doesn't scale to multiple servers
- **No automation** for configuration-as-code workflows

Existing solutions have limitations. While
[declarative-jellyfin](https://github.com/Sveske-Juice/declarative-jellyfin)
pioneered declarative Jellyfin configuration, it takes a risky approach:

- Directly manipulates XML files and SQLite databases
- Stops/starts Jellyfin service multiple times during configuration
- Reimplements Jellyfin's internal UUID generation in bash
- NixOS-only with hardcoded systemd and path dependencies
- Breaks when Jellyfin changes internals
  ([example issue](https://github.com/Sveske-Juice/declarative-jellyfin/issues/13))

**Jellarr takes a different approach:**

- ✅ **API-based** — Uses Jellyfin's official REST API, never touches internal
  files or databases
- ✅ **Zero service interruption** — Jellyfin keeps running, no restarts
  required
- ✅ **Cross-platform** — Works on Docker, bare metal, any OS (not just NixOS)
- ✅ **Type-safe** — OpenAPI-generated types catch errors at build time
- ✅ **Future-proof** — Relies on stable API contracts, not reverse-engineered
  internals
- ✅ **Production-ready** — Idempotent, safe to run anytime via cron/systemd
  timers

---

## Quick Start

```bash
# With Nix
nix run github:venkyr77/jellarr/v0.0.1

# With Docker
docker pull ghcr.io/venkyr77/jellarr:v0.0.1

# Download binary (requires Node.js 24+)
./jellarr-v0.0.1
```

**Example config** (`config/config.yml`):

```yaml
version: 1
base_url: "http://localhost:8096"
system:
  enableMetrics: true
  pluginRepositories:
    - name: "Jellyfin Official"
      url: "https://repo.jellyfin.org/releases/plugin/manifest.json"
      enabled: true
encoding:
  enableHardwareEncoding: true
  hardwareAccelerationType: "vaapi"
  vaapiDevice: "/dev/dri/renderD128"
```

---

## Installation

### Nix Flake (Recommended)

Add to your `flake.nix`:

```nix
{
  inputs.jellarr.url = "github:venkyr77/jellarr";

  outputs = { self, nixpkgs, jellarr, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      modules = [
        jellarr.nixosModules.default
        ({ config, ... }: {
          services.jellarr = {
            enable = true;
            user = "jellyfin";
            group = "jellyfin";
            environmentFile = config.sops.templates.jellarr-env.path;
            config = {
              base_url = "http://localhost:8096";
              system.enableMetrics = true;
            };
          };
        })
      ];
    };
  };
}
```

Or run directly:

```bash
JELLARR_API_KEY=your_api_key nix run github:venkyr77/jellarr/v0.0.1
```

### Docker (Recommended)

```bash
docker pull ghcr.io/venkyr77/jellarr:v0.0.1
```

**With docker-compose:**

```yaml
services:
  jellarr:
    image: ghcr.io/venkyr77/jellarr:v0.0.1
    container_name: jellarr
    environment:
      - JELLARR_API_KEY=${JELLARR_API_KEY}
      - TZ=Etc/UTC
    volumes:
      - ./config:/config
    restart: "no"
```

### Bundle Download

Download from [releases](https://github.com/venkyr77/jellarr/releases) (requires
Node.js 24+):

```bash
curl -LO https://github.com/venkyr77/jellarr/releases/download/v0.0.2/jellarr-v0.0.2.cjs
JELLARR_API_KEY=your_api_key node jellarr-v0.0.2.cjs --configFile path/to/config.yml
```

**Note:** Requires Node.js 24+ installed on your system.

---

## Export Existing Configuration (Experimental)

Already have a configured Jellyfin server? Use `dump` to export its current
configuration as a starting point:

```bash
JELLARR_API_KEY=your_api_key jellarr dump --baseUrl http://localhost:8096 > config.yml
```

This exports system settings, encoding options, libraries, branding, users
(without passwords), and plugin configurations. Edit the output to:

- Remove fields you don't want to manage
- Add `password` or `passwordFile` to users
- Remove any default values you don't need

See [`dumped-example.yml`](./dumped-example.yml) for sample output.

---

## Configuration

Jellarr uses a YAML configuration file (default: `config/config.yml`).

### System Configuration

```yaml
version: 1
base_url: "http://localhost:8096"
system:
  enableMetrics: true # Enable Prometheus metrics endpoint
  pluginRepositories:
    - name: "Jellyfin Official"
      url: "https://repo.jellyfin.org/releases/plugin/manifest.json"
      enabled: true
  trickplayOptions:
    enableHwAcceleration: true
    enableHwEncoding: true
```

### Encoding Configuration

```yaml
version: 1
base_url: "http://localhost:8096"
encoding:
  enableHardwareEncoding: true
  hardwareAccelerationType: "vaapi" # none, amf, qsv, nvenc, v4l2m2m, vaapi, videotoolbox, rkmpp
  vaapiDevice: "/dev/dri/renderD128"
  # or qsv device
  qsvDevice: "/dev/dri/renderD128"
  hardwareDecodingCodecs:
    - h264
    - hevc
    - mpeg2video
    - vc1
    - vp8
    - vp9
    - av1
  enableDecodingColorDepth10Hevc: true
  enableDecodingColorDepth10HevcRext: true
  enableDecodingColorDepth12HevcRext: true
  enableDecodingColorDepth10Vp9: true
  allowHevcEncoding: false
  allowAv1Encoding: false
```

### Library Configuration

```yaml
version: 1
base_url: "http://localhost:8096"
library:
  virtualFolders:
    - name: "Movies"
      collectionType: "movies"
      libraryOptions:
        pathInfos:
          - path: "/data/movies"
    - name: "TV Shows"
      collectionType: "tvshows"
      libraryOptions:
        pathInfos:
          - path: "/data/tv"
```

### Branding Configuration

```yaml
version: 1
base_url: "http://localhost:8096"
branding:
  loginDisclaimer: |
    Configured by <a href="https://github.com/venkyr77/jellarr">Jellarr</a>
  customCss: |
    @import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");
  splashscreenEnabled: false
```

### User Management

```yaml
version: 1
base_url: "http://localhost:8096"
users:
  # Regular user with plaintext password (development only)
  - name: "regular-user"
    password: "secure-password"

  # Regular user with password file (production recommended)
  - name: "viewer-user"
    passwordFile: "/run/secrets/viewer-password"

  # Admin user with policy configuration
  - name: "admin-user"
    passwordFile: "/run/secrets/admin-password"
    policy:
      isAdministrator: true
      loginAttemptsBeforeLockout: 3
```

**Password Security:**

- **plaintext password**: Use `password` field for development/testing only
- **password file**: Use `passwordFile` for production - file contains only the
  plaintext password (whitespace is trimmed)
- **Exactly one required**: Each user must specify either `password` or
  `passwordFile` (not both)

**sops-nix Integration:**

```nix
{
  sops.secrets = {
    jellarr-api-key.sopsFile = ../../../../secrets/jellarr-api-key;
    viewer-user-password.sopsFile = ../../../../secrets/viewer-user-password;
    admin-user-password.sopsFile = ../../../../secrets/admin-user-password;
  };

  services.jellarr = {
    enable = true;
    environmentFile = config.sops.templates.jellarr-env.path;
    config = {
      base_url = "http://localhost:8096";
      users = [
        {
          name = "viewer-user";
          passwordFile = config.sops.secrets.viewer-user-password.path;
        }
        {
          name = "admin-user";
          passwordFile = config.sops.secrets.admin-user-password.path;
        }
      ];
    };
  };
}
```

### Startup Configuration

```yaml
version: 1
base_url: "http://localhost:8096"
system: {}
startup:
  completeStartupWizard: true # Mark startup wizard as complete
```

Useful for automated deployments where you want to skip the interactive startup
wizard.

### Plugin Management

```yaml
version: 1
base_url: "http://localhost:8096"
plugins:
  # Install plugin by name (from configured repositories)
  - name: "Trakt"

  # Install and configure plugin
  - name: "Trakt"
    configuration:
      TraktUsers:
        - ExtraLogging: true

  # Multiple plugins
  - name: "Playback Reporting"
  - name: "Fanart"
    configuration:
      EnableImages: true
```

**How it works:**

- Plugins are installed from repositories configured in
  `system.pluginRepositories`
- Plugin names must match exactly (case-sensitive)
- The `configuration` field accepts arbitrary key-value pairs specific to each
  plugin
- Only specified configuration fields are updated; unspecified fields are
  preserved
- Plugin configurations are applied after installation, allowing newly installed
  plugins to be configured in the same run

**Finding plugin configuration keys:**

To discover available configuration options for a plugin, you can query the
Jellyfin API:

```bash
# Get plugin ID
curl -s -H "X-Emby-Token: $API_KEY" \
  "http://localhost:8096/Plugins" | jq '.[] | select(.Name == "Trakt")'

# Get plugin configuration
curl -s -H "X-Emby-Token: $API_KEY" \
  "http://localhost:8096/Plugins/{pluginId}/Configuration"
```

---

## Secret Management

### With sops-nix (nix only)

```nix
{
  sops = {
    secrets.jellarr-api-key.sopsFile = ./secrets/jellarr.env;
    templates.jellarr-env = {
      content = ''
        JELLARR_API_KEY=${config.sops.placeholder.jellarr-api-key}
      '';
      owner = config.services.jellarr.user;
      group = config.services.jellarr.group;
    };
  };

  services.jellarr = {
    enable = true;
    environmentFile = config.sops.templates.jellarr-env.path;
    config = { /* ... */ };
  };
}
```

### With Environment Variable

```bash
export JELLARR_API_KEY=your_api_key
jellarr
```

### With Docker

```bash
docker run -e JELLARR_API_KEY=your_api_key \
  -v ./config:/config:ro \
  ghcr.io/venkyr77/jellarr:v0.0.1
```

### API Key Bootstrap (NixOS, Same Host Only)

For NixOS deployments where Jellarr runs on the **same host** as Jellyfin, you
can use the bootstrap feature to automatically provision the API key into
Jellyfin's database:

```nix
{
  sops.secrets.jellarr-api-key.sopsFile = ./secrets/jellarr-api-key;

  services.jellarr = {
    enable = true;
    config = {
      base_url = "http://localhost:8096";
      # ... your config ...
    };

    # Bootstrap: automatically inserts API key into Jellyfin's database
    bootstrap = {
      enable = true;
      apiKeyFile = config.sops.secrets.jellarr-api-key.path;
      # Optional settings (showing defaults):
      # apiKeyName = "jellarr";
      # jellyfinDataDir = "/var/lib/jellyfin";
      # jellyfinService = "jellyfin.service";
    };
  };
}
```

**How it works:**

1. The `jellarr-api-key-bootstrap` systemd service runs after Jellyfin starts
2. It waits for Jellyfin's database to exist
3. If the API key doesn't already exist, it stops Jellyfin, inserts the key into
   the SQLite database, and restarts Jellyfin
4. The `jellarr` service has `After=jellarr-api-key-bootstrap.service`, ensuring
   proper ordering

**Important notes:**

- This **only works when Jellarr and Jellyfin are on the same host** - it
  requires direct access to Jellyfin's database file
- The bootstrap service runs as `root` (required for stopping/starting Jellyfin
  and writing to the database)
- The insertion is idempotent - if a key with the same name exists, it skips
- For deployments where Jellarr runs on a **different host** than Jellyfin, you
  must provision the API key manually (via Jellyfin's web UI or a separate
  script) and provide it via `environmentFile`

---

## Full Configuration Example

Full configuration example with VAAPI hardware acceleration:

```yaml
version: 1
base_url: "http://localhost:8096"
system:
  enableMetrics: true
  pluginRepositories:
    - name: "Jellyfin Official"
      url: "https://repo.jellyfin.org/releases/plugin/manifest.json"
      enabled: true
  trickplayOptions:
    enableHwAcceleration: true
    enableHwEncoding: true
encoding:
  enableHardwareEncoding: true
  hardwareAccelerationType: "vaapi"
  vaapiDevice: "/dev/dri/renderD128"
  hardwareDecodingCodecs:
    ["h264", "hevc", "mpeg2video", "vc1", "vp8", "vp9", "av1"]
  enableDecodingColorDepth10Hevc: true
  enableDecodingColorDepth10Vp9: true
  enableDecodingColorDepth10HevcRext: true
  enableDecodingColorDepth12HevcRext: true
  allowHevcEncoding: false
  allowAv1Encoding: false
library:
  virtualFolders:
    - name: "Movies"
      collectionType: "movies"
      libraryOptions:
        pathInfos:
          - path: "/mnt/movies/English"
branding:
  loginDisclaimer: |
    Configured by <a href="https://github.com/venkyr77/jellarr">Jellarr</a>
  customCss: |
    @import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");
  splashscreenEnabled: false
users:
  - name: "regular-user"
    password: "secure-password"
  - name: "viewer-user"
    passwordFile: "/run/secrets/viewer-password"
  - name: "admin-user"
    passwordFile: "/run/secrets/admin-password"
    policy:
      isAdministrator: true
      loginAttemptsBeforeLockout: 3
plugins:
  - name: "Trakt"
    configuration:
      TraktUsers:
        - ExtraLogging: true
  - name: "Playback Reporting"
startup:
  completeStartupWizard: true
```

---

## Architecture

**Jellarr** is built in TypeScript with a strict pipeline pattern:

1. **CLI** (`src/cli/index.ts`) - Commander.js entry point
2. **Pipeline** (`src/pipeline/index.ts`) - Main orchestration:
   - Reads YAML config file
   - Validates with strict Zod schemas
   - Creates authenticated Jellyfin API client
   - Fetches current server configuration
   - Applies ONLY specified changes idempotently
3. **Apply Modules** (`src/apply/`) - Handle configuration updates per feature:
   - `calculateDiff()` - Pure calculation, returns schema or undefined
   - `apply()` - Side effects, calls Jellyfin API

**Key Design Principles:**

- **Selective updates:** Only modifies explicitly configured fields
- **Idempotent:** Safe to run multiple times
- **Type-safe:** OpenAPI-generated types + Zod validation
- **Calculate/Apply pattern:** Separation of pure logic from side effects
- **Comprehensive test coverage**

---

## Development

```bash
pnpm test        # Tests with Vitest
pnpm typecheck   # TypeScript validation
pnpm eslint      # Code linting
pnpm build       # Build with esbuild

# Full validation pipeline
npm run build && tsc --noEmit && pnpm eslint && pnpm test && nix fmt
```

### Nix Development

```bash
nix build .#default      # Build CLI package
nix build .#docker-image # Build Docker image
nix flake check          # Run checks
nix fmt                  # Format project files
```

---

## Comparison: Jellarr vs declarative-jellyfin

| Feature            | Jellarr                         | declarative-jellyfin                           |
| ------------------ | ------------------------------- | ---------------------------------------------- |
| **Method**         | Official REST API               | Direct XML/DB manipulation                     |
| **Service Impact** | Zero (never stops Jellyfin)     | Stops/starts multiple times                    |
| **Platform**       | Cross-platform (Docker, any OS) | NixOS-only                                     |
| **Dependencies**   | Node.js 24+                     | systemd, sqlite, jellyfin running on same host |
| **Safety**         | API validates all changes       | Direct file/DB writes                          |
| **Future-proof**   | API contract stability          | Breaks on internal changes                     |
| **Type Safety**    | TypeScript + Zod + OpenAPI      | Bash scripts                                   |
| **Testing**        | Comprehensive unit tests        | Complex NixOS VM tests                         |

**declarative-jellyfin's approach:**

- Writes `~/.config/jellyfin/encoding.xml` directly
- Manipulates SQLite database with hardcoded schema
- Reimplements Jellyfin's UUID algorithm in bash
- Requires stopping Jellyfin service during configuration
- [Known issues with timing/conflicts](https://github.com/Sveske-Juice/declarative-jellyfin/issues/13)

**Jellarr's approach:**

- Uses `/System/Configuration` and similar API endpoints
- Never touches internal files or databases
- Jellyfin validates all changes
- Zero service interruption
- Works on any platform where Jellyfin runs

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[GNU AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)

© 2025 Jellarr contributors
