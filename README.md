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
  inputs.jellarr.url = "github:venkyr77/jellarr/v0.0.1";

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

### Binary Download

Download from [releases](https://github.com/venkyr77/jellarr/releases):

```bash
curl -LO https://github.com/venkyr77/jellarr/releases/download/v0.0.1/jellarr-v0.0.1
chmod +x jellarr-v0.0.1
JELLARR_API_KEY=your_api_key ./jellarr-v0.0.1
```

**Note:** Requires Node.js 24+ installed on your system.

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
  loginDisclaimer: "Welcome to Jellarr Test Server"
  customCss: '@import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");'
  splashscreenEnabled: true
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
    - name: "test-jellarr"
      collectionType: "movies"
      libraryOptions:
        pathInfos:
          - path: "/mnt/movies/English"
branding:
  loginDisclaimer: "Welcome to Jellarr Test Server"
  customCss: '@import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");'
  splashscreenEnabled: true
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
