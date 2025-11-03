# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when
working with code in this repository. **Read this entire file carefully before
any work.**

## Critical Context

### Core Principle

**JELLARR ONLY MODIFIES EXPLICITLY SPECIFIED CONFIGURATION FIELDS.** If a field
is not in the config file, jellarr must NEVER touch it. This is the fundamental
design principle validated through comprehensive integration testing.

### Field Behavior by Type

- **Scalar Fields** (e.g., `enableMetrics`): Omitted → preserved unchanged;
  Specified → updated to value
- **List Fields** (e.g., `pluginRepositories`): Omitted → entire list preserved;
  Specified → complete replacement (no merging)
- **Nested Objects** (e.g., `trickplayOptions`): Omitted → entire object
  preserved; Partially specified → only specified sub-fields updated

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript using esbuild
- **Development**: `npm run dev` - Runs the CLI directly with tsx
- **Test**: `npm run test` - Runs Vitest test suite (64 tests total)
- **Type checking**: `npm run typecheck` - Runs TypeScript compiler in check
  mode
- **Generate types**: `npm run typegen` - Generates TypeScript types from
  Jellyfin OpenAPI spec
- **Quality checks**: `nix fmt && pnpm eslint && pnpm test` - Run before any
  commits

### Full Build Process ("buildfull")

When user says "buildfull", execute this complete build and validation sequence:

1. **Clean environment**:

   ```bash
   rm -rf node_modules ./result
   nix-collect-garbage -d
   ```

2. **Build and validate**:

   ```bash
   pnpm install && pnpm build && tsc --noEmit && pnpm eslint && pnpm test
   nix fmt && git add -A
   ```

3. **Update Nix hash** (line 47 in `nix/package.nix`):

   ```bash
   # Replace current hash with hash = ""
   nix build .#
   # Copy the new hash from error message back to file
   nix build .#  # Should succeed now
   ```

4. **Integration test**:
   ```bash
   JELLARR_API_KEY=<ask_user_for_key> nix run .# -- --configFile ./config.yml
   ```

Expected result: "✓ system config already up to date ✅ jellarr apply complete"

## Project Architecture

**Jellarr** is a declarative configuration tool for Jellyfin servers built in
TypeScript using a strict pipeline pattern.

### Pipeline Flow

1. **CLI** (`src/cli/index.ts`) - Commander.js entry point
2. **Pipeline** (`src/pipeline/index.ts`) - Main orchestration:
   - Reads YAML config file
   - Validates with strict Zod schemas (rejects unknown fields)
   - Creates authenticated Jellyfin API client
   - Fetches current server configuration
   - Applies ONLY specified changes idempotently
   - Compares JSON to detect changes before applying
3. **Apply System** (`src/apply/system.ts`) - Handles configuration updates

### Key Directories

- `src/api/` - Jellyfin API client using openapi-fetch with generated types
- `src/validation/` - Strict Zod schemas (all use `.strict()` to prevent unknown
  fields)
- `src/apply/` - Idempotent configuration application logic
- `src/mappers/` - Data transformation utilities
- `generated/` - Auto-generated types from Jellyfin OpenAPI spec
- `tests/` - Comprehensive test suite mirroring source structure

### Validation Architecture

- **RootConfigSchema**: Requires `version` (positive int), `base_url` (valid
  URL), `system` object
- **SystemConfigSchema**: Optional `enableMetrics`, `pluginRepositories`,
  `trickplayOptions`
- **PluginRepositoryConfigSchema**: Required `name` (non-empty), `url` (valid),
  `enabled` (boolean)
- **TrickplayOptionsConfigSchema**: Optional `enableHwAcceleration`,
  `enableHwEncoding` booleans
- All schemas use `.strict()` to reject unknown fields

### API Integration

- Uses `openapi-fetch` with types generated from Jellyfin's OpenAPI
  specification
- Client pattern with typed methods for system configuration endpoints
- Requires `JELLARR_API_KEY` environment variable for authentication
- Error handling for HTTP failures with descriptive validation messages

## Integration Testing Framework

### Test Environment Setup

- **Server**: `http://10.0.0.76:8096` (fixed test server)
- **Authentication**: `JELLARR_API_KEY` (always ask user, never store in files)
- **Command Template**:
  `JELLARR_API_KEY=<key> nix run .# -- --configFile ./tmp_config_itN.yml`

### Field Mappings (Config → Server)

```
enableMetrics                         → EnableMetrics
pluginRepositories                    → PluginRepositories
trickplayOptions.enableHwAcceleration → TrickplayOptions.EnableHwAcceleration
trickplayOptions.enableHwEncoding     → TrickplayOptions.EnableHwEncoding
encoding.enableHardwareEncoding       → EnableHardwareEncoding
```

### Test Execution Pattern

1. **Setup server state** via curl:

   ```bash
   curl -X POST "http://10.0.0.76:8096/System/Configuration" \
     -H "X-Emby-Token: <key>" -H "Content-Type: application/json" \
     -d '{"FieldName": value}'
   ```

2. **Verify current state**:

   ```bash
   curl -X GET "http://10.0.0.76:8096/System/Configuration" \
     -H "X-Emby-Token: <key>" | jq '.FieldName'
   ```

3. **Create test config** (`tmp_config_itN.yml`):

   ```yaml
   version: 1
   base_url: "http://10.0.0.76:8096"
   system:
   # Only include fields being tested
   ```

4. **Run jellarr** and verify results unchanged for omitted fields
5. **Clean up** temp files: `rm tmp_config_itN.yml`

### Validated Integration Tests (it1-it10)

| Test | Field Type | Scenario                                    | Server State                                                             | Config                                                                 | Expected Result                                                  | Status |
| ---- | ---------- | ------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------- | ------ |
| it1  | Scalar     | Preserve true                               | EnableMetrics: true                                                      | system: {}                                                             | EnableMetrics: true                                              | ✅     |
| it2  | Scalar     | Preserve false                              | EnableMetrics: false                                                     | system: {}                                                             | EnableMetrics: false                                             | ✅     |
| it3  | List       | Preserve list                               | PluginRepositories: [repo]                                               | system: {}                                                             | PluginRepositories: [repo]                                       | ✅     |
| it4  | List       | Replace list                                | PluginRepositories: [old]                                                | pluginRepositories: [new]                                              | PluginRepositories: [new]                                        | ✅     |
| it5  | Object     | Preserve object (both true)                 | TrickplayOptions: {EnableHwAcceleration: true, EnableHwEncoding: true}   | system: {}                                                             | Both fields: true                                                | ✅     |
| it6  | Object     | Preserve object (both false)                | TrickplayOptions: {EnableHwAcceleration: false, EnableHwEncoding: false} | system: {}                                                             | Both fields: false                                               | ✅     |
| it7  | Object     | Partial update (true,false→false,undefined) | TrickplayOptions: {EnableHwAcceleration: true, EnableHwEncoding: false}  | trickplayOptions: {enableHwAcceleration: false}                        | EnableHwAcceleration: false, EnableHwEncoding: false (preserved) | ✅     |
| it8  | Object     | Partial update (false,true→undefined,false) | TrickplayOptions: {EnableHwAcceleration: false, EnableHwEncoding: true}  | trickplayOptions: {enableHwEncoding: false}                            | EnableHwAcceleration: false (preserved), EnableHwEncoding: false | ✅     |
| it9  | Object     | Full update (false,false→true,true)         | TrickplayOptions: {EnableHwAcceleration: false, EnableHwEncoding: false} | trickplayOptions: {enableHwAcceleration: true, enableHwEncoding: true} | Both fields: true                                                | ✅     |
| it10 | Scalar     | Preserve false (encoding)                   | EnableHardwareEncoding: false                                            | encoding: {}                                                           | EnableHardwareEncoding: false                                    | ✅     |

**Core Validation**: All tests confirm jellarr implements true declarative
behavior - only explicitly configured fields are modified, ensuring safe
operation alongside other management tools.

## TypeScript Migration Context

**Current State**: Active TypeScript migration on `ts-migration` branch

- Added strict Zod validation schemas (`src/validation/config.ts`)
- Comprehensive test suite (`tests/validation/config.spec.ts`)
- Updated pipeline to use validated types (`src/pipeline/index.ts`)
- Nix build system with proper dependency management

**Key Files Modified**:

- `src/pipeline/index.ts`: Added Zod validation with detailed error messages
- `src/validation/config.ts`: Complete schema definitions with strict validation
- `tests/validation/config.spec.ts`: 42 tests covering all validation scenarios
- `nix/package.nix`: Proper pnpm dependency hash management

## Build System

**Nix Integration**:

- Main derivation: `nix/package.nix`
- Critical: Line 47 contains pnpm dependency hash - must be updated when
  dependencies change
- Current hash: `"sha256-LjdZDFenfylIpKxRpVmPUten/1IyL/cmI6QjDfcmfDc="`
- Build command: `nix build .#`
- Run command: `JELLARR_API_KEY=<key> nix run .# -- --configFile <path>`

**Testing Strategy**:

- Unit tests: `pnpm test` (Vitest, 42 tests)
- Type checking: `pnpm typecheck`
- Linting: `pnpm eslint`
- Integration: Full server interaction tests (it1-it9)

## When User Says "/init"

1. **Understand the context**: This is a declarative Jellyfin configuration tool
   with strict validation
2. **Remember the core principle**: Only modify explicitly specified fields
3. **Know the architecture**: TypeScript pipeline with Zod validation and
   openapi-fetch
4. **Be ready for integration testing**: Use the established it1-it9 pattern for
   any new features
5. **Follow build practices**: Use "buildfull" for clean builds, always validate
   with tests
6. **Respect authentication**: Always ask for API key, never store it

## Naming Convention Rules

**CRITICAL**: Follow this exact naming pattern for all OpenAPI schema
integrations.

For any OpenAPI schema `components["schemas"]["XyzAbc"]`, create:

1. **`XyzAbcSchema`** - Direct type mapping from OpenAPI schema

   ```typescript
   export type XyzAbcSchema = components["schemas"]["XyzAbc"];
   ```

2. **`XyzAbcConfig`** - User-facing config interface

   ```typescript
   export interface XyzAbcConfig {
     someField?: boolean;
   }
   ```

3. **`XyzAbcConfigSchema`** - Zod validation schema for config

   ```typescript
   export const XyzAbcConfigSchema = z
     .object({
       someField: z.boolean().optional(),
     })
     .strict();
   ```

4. **`mapXyzAbcConfigToSchema`** - Mapper function from config to schema

   ```typescript
   export function mapXyzAbcConfigToSchema(
     desired: XyzAbcConfig,
   ): Partial<XyzAbcSchema> { ... }
   ```

5. **Variable names** - Must match the type name
   ```typescript
   const currentXyzAbcSchema: XyzAbcSchema = ...;
   const updatedXyzAbcSchema: XyzAbcSchema = ...;
   ```

**Example**: For `components["schemas"]["EncodingOptions"]`:

- ✅ `EncodingOptionsSchema`, `EncodingOptionsConfig`,
  `EncodingOptionsConfigSchema`
- ✅ `mapEncodingOptionsConfigToSchema`
- ✅ `currentEncodingOptionsSchema`, `updatedEncodingOptionsSchema`

**Never deviate from this pattern** - it ensures consistent, predictable naming
across the entire codebase.

## Important Reminders

- **Never create files unless absolutely necessary** - prefer editing existing
  files
- **Never proactively create documentation** - only when explicitly requested
- **Always run quality checks** before significant changes:
  `nix fmt && pnpm eslint && pnpm test`
- **Integration test any behavior changes** using the established curl +
  jellarr + verification pattern
- **Maintain strict Zod validation** - all schemas should use `.strict()` to
  prevent unknown fields
- **Update Nix hash** when dependencies change during buildfull process
