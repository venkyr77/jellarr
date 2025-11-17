# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.0.2]: https://github.com/venkyr77/jellarr/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/venkyr77/jellarr/releases/tag/v0.0.1
