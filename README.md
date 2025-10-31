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
JELLARR_API_KEY=your_api_key jellarr --configFile ./config.yml
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
   export JELLARR_API_KEY=your_api_key
   ```

2. **Run Jellarr**

   ```bash
   go run ./src/cmd/jellarr --configFile ./config.yml
   ```

   You’ll see output such as:

   ```
   ✓ system config already up to date
   ✅ jellarr apply complete
   ```

   or

   ```
   → updating system config
   ✓ updated system config
   ✅ jellarr apply complete
   ```

---

## ❄️ Using via Nix Flake

> ⚠️ **Important:** Make sure `JELLARR_API_KEY` is provided (e.g., via an
> environment variable, SOPS template, or systemd environment file). See
> [🔐 Secret Management (API Key)](#-secret-management-api-key) below for secure
> options.

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

Or run it directly:

```bash
JELLARR_API_KEY=your_api_key nix run github:venkyr77/jellarr --configFile ./config.yml
```

---

## 🔐 Secret Management (API Key)

You can securely provide the `JELLARR_API_KEY` using **sops-nix**.

### Option 1: Using sops-nix environmentFile (recommended)

```nix
{
  sops = {
    secrets.jellarr-api-key.sopsFile = "path to jellyfin api key environment file";

    templates.jellarr-ev = {
      content = ''
        JELLARR_API_KEY=${config.sops.placeholder.jellarr-api-key}
      '';
      inherit (config.services.jellarr) group;
      owner = config.services.jellarr.user;
    };
  };

  services.jellarr = {
    enable = true;
    user = "jellyfin";
    group = "jellyfin";
    config.base_url = "http://localhost:8096";
    environmentFile = config.sops.templates.jellarr-ev.path;
  };
}
```

This setup:

- Stores your API key in an encrypted file managed by **sops**.
- Renders a secure environment file owned by the Jellarr service user.
- Keeps your API key out of your Git history.

### Option 2: Inline systemd Environment (simple, less secure)

If you’re testing locally and prefer not to use sops yet:

```nix
{
  services.jellarr = {
    enable = true;
    user = "jellyfin";
    group = "jellyfin";
    config.base_url = "http://localhost:8096";
  };

  systemd.services.jellarr.environment = {
    JELLARR_API_KEY = "paste-your-api-key-here";
  };
}
```

⚠️ Avoid committing plaintext secrets — prefer sops for production use.

---

### CLI Flag

If you need to point Jellarr to a different config file; for example
`/etc/jellarr/config.yml`:

```bash
JELLARR_API_KEY=your_api_key jellarr --configFile /etc/jellarr/config.yml
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
go test ./src/cmd/jellarr/... ./src/tests/...

# or via nix

nix flake check --all-systems
```

Format code:

```bash
gofmt -w .

# or via nix

nix fmt
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
