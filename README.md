# Jellarr

**Jellarr** is a declarative configuration tool for
[Jellyfin](https://jellyfin.org). It applies configuration to a Jellyfin server
using its public API — safely, idempotently, and version-controlled via YAML.

---

## ✨ Overview

Jellarr lets you define Jellyfin settings in a simple YAML file and apply them
automatically.

Instead of editing XML or clicking through the web UI, you describe the desired
state and run:

```bash
jellarr ./config.yml
```

Jellarr compares the current server configuration with your YAML and updates
only what’s needed.

---

## 📦 Example

**`sample-config.yml`**

```yaml
version: 1
system:
  enableMetrics: true
```

This enables Prometheus metrics (`/metrics`) on your Jellyfin server.

---

## 🚀 Usage

1. **Set your Jellyfin API key and URL**

   ```bash
   export JELLARR_BASE_URL=http://localhost:8096
   export JELLARR_API_KEY=<your_api_key>
   ```

2. **Run Jellarr**

   ```bash
   go run ./cmd/jellarr ./sample-config.yml
   ```

   You’ll see output such as:

   ```
   → updating system config
   🛡️ jellarr apply complete
   ```

   or

   ```
   ✓ system config up to date
   🛡️ jellarr apply complete
   ```

---

## ❄️ Using via Nix Flake

You can consume **Jellarr** directly from its flake:

```nix
{
  inputs.jellarr.url = "github:venkyr77/jellarr";

  outputs = { self, nixpkgs, jellarr, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        jellarr.nixosModules.default
        ({ config, pkgs, ... }: {
          services.jellarr = {
            enable = true;
            user = "jellyfin";
            group = "jellyfin";
            config = {
              base_url = "http://localhost:8096";
            };
          };
        })
      ];
    };
  };
}
```

Or run it directly (make sure to create `/config/config.yml` inside the
container or host):

```bash
mkdir -p ./config
cat > ./config/config.yml <<'EOF'
base_url: "http://localhost:8096"
EOF

JELLARR_API_KEY=xyz nix run github:venkyr77/jellarr
```

---

## 🧠 Design

- **Typed client:** built on
  [`sj14/jellyfin-go`](https://github.com/sj14/jellyfin-go)
- **Declarative config:** YAML → Go structs → Jellyfin API
- **Idempotent apply:** compares current and desired state before updating
- **Extensible:** future support for libraries, users, and plugins

---

## 🧪 Development

Run tests locally:

```bash
go test ./...
```

Format code:

```bash
gofmt -s -w .
```

---

## 🗺️ Roadmap

- [x] System configuration (`EnableMetrics`)
- [ ] Libraries (create/update/delete)
- [ ] Users
- [ ] Plugin configuration
- [ ] Release automation and Docker image
- [ ] Nix and CI integration

---

**License:** [GNU AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)

© 2025 Jellarr contributors
