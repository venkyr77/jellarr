# Jellarr

**Jellarr** is a declarative configuration tool for [Jellyfin](https://jellyfin.org).
It applies configuration to a Jellyfin server using its public API — safely, idempotently, and version-controlled via YAML.

---

## ✨ Overview

Jellarr lets you define Jellyfin settings in a simple YAML file and apply them automatically.

Instead of editing XML or clicking through the web UI, you describe the desired state and run:

```bash
jellarr ./config.yml
```

Jellarr compares the current server configuration with your YAML and updates only what’s needed.

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

## 🧠 Design

* **Typed client:** built on [`sj14/jellyfin-go`](https://github.com/sj14/jellyfin-go)
* **Declarative config:** YAML → Go structs → Jellyfin API
* **Idempotent apply:** compares current and desired state before updating
* **Extensible:** future support for libraries, users, and plugins

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

* [x] System configuration (`EnableMetrics`)
* [ ] Libraries (create/update/delete)
* [ ] Users
* [ ] Plugin configuration
* [ ] Release automation and Docker image
* [ ] Nix and CI integration

---

**License:** [GNU AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)
© 2025 Jellarr contributors
