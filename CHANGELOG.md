# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.0.3]: https://github.com/venkyr77/jellarr/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/venkyr77/jellarr/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/venkyr77/jellarr/releases/tag/v0.0.1
