# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-24

### Added

#### Plugin Management

- **New Feature**: Full support for declarative plugin installation and
  configuration
- **Configuration Fields**:
  - `plugins[].name`: Plugin name (must match repository exactly,
    case-sensitive)
  - `plugins[].configuration`: Arbitrary key-value pairs for plugin-specific
    settings
- **API Integration**: Uses Jellyfin's `POST /Packages/Installed/{name}` for
  installation and `/Plugins/{pluginId}/Configuration` for configuration
- **Idempotent**: Skips already-installed plugins; only updates specified
  configuration fields while preserving unspecified settings
- **Workflow**: Newly installed plugins can be configured in the same run

#### Export Existing Configuration (Experimental)

- **New Feature**: `dump` command to export current Jellyfin server
  configuration as YAML
- **Usage**: `jellarr dump --baseUrl http://localhost:8096 > config.yml`
- **Exports**: System settings, encoding options, libraries, branding, users
  (without passwords), and plugin configurations
- **Use Case**: Bootstrap a new Jellarr config from an existing Jellyfin server
- **Note**: User passwords cannot be exported and must be added manually

#### API Key Bootstrap (NixOS)

- **New Feature**: Automatic API key provisioning for NixOS deployments
- **Problem Solved**: Eliminates manual API key creation for "from scratch"
  setups and disaster recovery scenarios
- **Configuration Options**:
  - `bootstrap.enable`: Toggle bootstrap on/off
  - `bootstrap.apiKeyFile`: Path to file containing the API key (works with
    sops-nix)
  - `bootstrap.apiKeyName`: Name for the key (defaults to "jellarr")
  - `bootstrap.jellyfinDataDir`: Path to Jellyfin data directory
  - `bootstrap.jellyfinService`: Systemd service name for Jellyfin
- **How It Works**: `jellarr-api-key-bootstrap` systemd oneshot service inserts
  the API key directly into Jellyfin's SQLite database before Jellarr runs
- **Idempotent**: Uses "insert if not present" SQL to prevent duplicate entries
- **Limitation**: Requires Jellarr and Jellyfin to be on the same host

#### Typed NixOS Module

- **New Feature**: Strongly-typed Nix module configuration with schema
  validation
- **Benefits**:
  - Catches configuration errors at Nix evaluation time
  - Better IDE support with proper NixOS option types
  - Validates all fields match expected types and constraints
- **Implementation**: Nix-native type definitions mirroring TypeScript Zod
  schemas

### Infrastructure

- **Cachix Integration**: Added Cachix caching for Nix builds in CI pipeline

### Changed

#### NixOS Module Improvements

- **Config Format**: Changed config type to `pkgs.formats.yaml` for better Nix
  integration and type coercion

#### Internal Architecture Refactor

- **Major Refactor**: Complete rewrite of apply/diff logic using `json-diff-ts`
  library
- **Problem Solved**: Eliminated ~1000 lines of redundant "deepEqual" comparison
  logic scattered across apply modules
- **New Pattern**: Fluent `ChangeSetBuilder` API for consistent diff handling
  - `atomize()` / `unatomize()`: Control change granularity
  - `withoutRemoves()` / `withoutUpdates()`: Filter change types
  - `withKey()`: Target specific configuration keys
- **Benefits**:
  - Consistent pattern across all apply modules
  - Cleaner separation between mappers and apply logic
  - More maintainable codebase
- **Modules Updated**: branding, encoding-options, library, system, users,
  plugins

### Configuration Example

```yaml
version: 1
base_url: "http://localhost:8096"
system:
    enableMetrics: true
    pluginRepositories:
        - name: "Jellyfin Official"
          url: "https://repo.jellyfin.org/releases/plugin/manifest.json"
          enabled: true
plugins:
    - name: "Trakt"
      configuration:
          TraktUsers:
              - ExtraLogging: true
    - name: "Playback Reporting"
```

### Breaking Changes

- **Potential Breaking**: This release is a significant internal rewrite. While
  the configuration format remains fully backward compatible, the underlying
  diff/apply logic has been completely reimplemented. Please test thoroughly
  before upgrading production systems.

---

## [0.0.3] - 2025-11-30

### Added

#### Startup Wizard Configuration

- **New Feature**: Support for completing Jellyfin's startup wizard via config
- **Configuration Fields**:
  - `startup.completeStartupWizard`: When `true`, marks the startup wizard as
    complete
- **API Integration**: Uses Jellyfin's `POST /Startup/Complete` endpoint
- **Use Case**: Useful for automated/declarative deployments where you want to
  skip the interactive startup wizard

#### User Management

- **New Feature**: Full support for declarative user creation and management
- **Configuration Fields**:
  - `users[].name`: Username for the account
  - `users[].password`: Plaintext password (development only)
  - `users[].passwordFile`: Path to file containing password (production
    recommended)
- **Security**: Supports secure password handling via file references for
  sops-nix integration
- **Idempotent**: Only creates users that don't already exist

#### User Policy Configuration

- **New Feature**: Configure user permissions and policies declaratively
- **Configuration Fields**:
  - `users[].policy.isAdministrator`: Grant admin privileges
  - `users[].policy.loginAttemptsBeforeLockout`: Set lockout threshold
- **API Integration**: Uses Jellyfin's `/Users/{userId}/Policy` endpoint
- **Comprehensive Testing**: Unit tests for types, API, mappers, and apply
  modules

### Infrastructure

#### CI Pipeline

- **New Feature**: Automated CI pipeline for quality validation
- **Checks**: Build, typecheck, ESLint, unit tests, Nix package build, flake
  check
- **Integration**: Runs on push to main and pull requests

#### NixOS VM Integration Tests

- **New Feature**: VM-based integration testing framework
- **Coverage**: Full end-to-end testing with real Jellyfin server

#### Code Quality Improvements

- **ESLint Enhancements**:
  - Added `stylisticTypeChecked` preset with targeted overrides
  - Added naming convention rules for consistent code style
  - Implemented maximum typedef strictness for explicit type annotations
  - Added comment policy automation via uncomment tool
- **Treefmt Refactor**: Split into separate format and lint modules for
  independent control

### Configuration Example

```yaml
version: 1
base_url: "http://localhost:8096"
system: {}
users:
    - name: "admin-user"
      passwordFile: "/run/secrets/admin-password"
      policy:
          isAdministrator: true
          loginAttemptsBeforeLockout: 3
    - name: "viewer-user"
      passwordFile: "/run/secrets/viewer-password"
startup:
    completeStartupWizard: true
```

### Breaking Changes

- None - All features are additive with full backward compatibility

---

## [0.0.2] - 2025-11-17

### Added

#### Branding Configuration Support

- **New Feature**: Full support for Jellyfin branding configuration options
- **Configuration Fields**:
  - `loginDisclaimer`: Custom text displayed on the login page (supports HTML)
  - `customCss`: Custom CSS to modify Jellyfin's appearance (supports @import
    rules)
  - `splashscreenEnabled`: Toggle the Jellyfin splash screen on/off
- **API Integration**: Uses Jellyfin's `/System/Configuration/Branding` endpoint
- **Idempotent Operations**: Only applies changes when configuration differs
  from server state
- **Null/Empty String Handling**: Properly handles server responses with null
  values

#### Documentation Improvements

- **Updated README**: Added complete branding configuration section with
  examples
- **Configuration Examples**:
  - Basic branding setup
  - HTML-enabled login disclaimers with hyperlinks
  - CSS theming with external stylesheets (Jellyskin theme example)
- **API Documentation**: Documented branding endpoints and expected schemas

### Technical Implementation

#### Architecture Adherence

- **Calculate/Apply Pattern**: Follows established pattern for clean separation
  of concerns
  - `calculateBrandingOptionsDiff()`: Pure calculation logic, returns schema or
    undefined
  - `applyBrandingOptions()`: Side effects only, handles API calls
- **Type Safety**: Full TypeScript integration with Zod validation
- **Naming Conventions**: Consistent with established `XyzAbcConfigType`
  patterns

#### Files Added/Modified

- `src/types/config/branding-options.ts` - Configuration type definitions
- `src/types/schema/branding-options.ts` - Server API schema types
- `src/mappers/branding-options.ts` - Config-to-schema transformation
- `src/apply/branding-options.ts` - Application logic with calculate/apply
  pattern
- `src/api/jellyfin_client.ts` - API client methods for branding endpoints
- `src/pipeline/index.ts` - Pipeline integration for branding configuration
- `tests/**/*branding-options.spec.ts` - Comprehensive test suites

### Configuration Example

```yaml
version: 1
base_url: "https://jellyfin.example.com"
system:
# ... system config
branding:
    loginDisclaimer: |
        Welcome! Configured by <a href="https://github.com/venkyr77/jellarr">Jellarr</a>
    customCss: |
        @import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");
    splashscreenEnabled: false
```

### Breaking Changes

- None - This is an additive feature with full backward compatibility

---

## [0.0.1] - Initial Release

### Added

- Initial implementation of declarative Jellyfin configuration management
- Support for system configuration (metrics, plugin repositories, trickplay
  options)
- Support for encoding configuration (hardware encoding settings)
- Support for library configuration (content scanning and metadata options)
- TypeScript implementation with strict type safety
- Comprehensive test suite with integration testing
- Nix flakes support for reproducible builds
- Docker integration with distroless images
- CLI interface with YAML configuration files

### Technical Features

- **Calculate/Apply Pattern**: Clean separation between configuration
  calculation and application
- **Idempotent Operations**: Only modifies explicitly specified configuration
  fields
- **API Integration**: Uses Jellyfin's OpenAPI specification with generated
  types
- **Validation**: Zod-based configuration validation with detailed error
  messages
- **Authentication**: Secure API key-based authentication with environment
  variables

### Supported Configuration Areas

- **System Configuration**: Server metrics, plugin repositories, trickplay
  options
- **Encoding Configuration**: Hardware encoding, codec preferences, quality
  settings
- **Library Configuration**: Content scanning intervals, metadata providers,
  subtitle preferences

[0.1.0]: https://github.com/venkyr77/jellarr/compare/v0.0.3...v0.1.0
[0.0.3]: https://github.com/venkyr77/jellarr/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/venkyr77/jellarr/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/venkyr77/jellarr/releases/tag/v0.0.1
