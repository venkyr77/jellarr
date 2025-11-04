# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when
working with code in this repository. **Read this entire file carefully before
any work.**

## 🚀 Current State (As of Nov 2024)

**MAJOR REFACTOR COMPLETED**: We just finished a massive architectural overhaul
moving from monolithic validation to clean modular structure. The codebase is
now perfectly organized for rapid feature development.

### Key Achievement

- ✅ **64 tests passing** (increased from 42)
- ✅ **Perfect TypeScript compilation**
- ✅ **Clean ESLint validation**
- ✅ **Successful integration tests**
- ✅ **Copy-paste ready architecture** for new features

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

### Essential Commands

- **Build**: `npm run build` - Compiles TypeScript using esbuild
- **Development**: `npm run dev` - Runs the CLI directly with tsx
- **Test**: `npm run test` - Runs Vitest test suite (**64 tests total**)
- **Type checking**: `npm run typecheck` - Runs TypeScript compiler in check
  mode
- **Generate types**: `npm run typegen` - Generates TypeScript types from
  Jellyfin OpenAPI spec

### Standard Quality Check Pipeline

```bash
npm run build && tsc --noEmit && pnpm eslint && pnpm test && nix fmt
```

Run this sequence before any commits to ensure quality.

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

Expected result: "✓ system config already up to date ✓ encoding config already
up to date ✅ jellarr apply complete"

## 🏗️ Project Architecture (NEWLY REFACTORED)

**Jellarr** is a declarative configuration tool for Jellyfin servers built in
TypeScript using a strict pipeline pattern.

### Pipeline Flow

1. **CLI** (`src/cli/index.ts`) - Commander.js entry point
2. **Pipeline** (`src/pipeline/index.ts`) - Main orchestration:
   - Reads YAML config file
   - Validates with strict Zod schemas from `types/config/`
   - Creates authenticated Jellyfin API client
   - Fetches current server configuration
   - Applies ONLY specified changes idempotently
   - Compares JSON to detect changes before applying
3. **Apply Modules** (`src/apply/`) - Handle configuration updates per feature

### 🎯 NEW Directory Structure (Post-Refactor)

```
src/
├── api/                    # Jellyfin API client using openapi-fetch
├── types/
│   ├── config/            # 🆕 User-facing config types (Zod-based)
│   │   ├── root.ts                    # Root config
│   │   ├── system.ts                  # System config
│   │   ├── encoding-options.ts        # Encoding config
│   │   ├── plugin-repository.ts       # Plugin repository config
│   │   └── trickplay-options.ts       # Trickplay config
│   └── schema/            # Server API schema types
│       ├── system.ts              # System server schema
│       └── encoding-options.ts    # Encoding server schema
├── apply/                 # Idempotent configuration application logic
│   ├── system.ts               # System config application
│   └── encoding-options.ts     # Encoding config application
├── mappers/               # Data transformation utilities
│   ├── system.ts               # System config mapper
│   └── encoding-options.ts     # Encoding config mapper
└── pipeline/              # Main orchestration

tests/
├── types/config/          # 🆕 Config validation tests
│   ├── root.spec.ts
│   ├── system.spec.ts
│   ├── encoding-options.spec.ts
│   ├── plugin-repository.spec.ts
│   └── trickplay-options.spec.ts
├── apply/                 # Apply logic tests
├── mappers/              # Mapper tests
└── api/                  # API tests

generated/                # Auto-generated types from Jellyfin OpenAPI spec
```

### 🔥 Perfect Naming Convention Pattern

**CRITICAL**: We established this exact pattern during the refactor. Every file
follows this:

For OpenAPI schema `components["schemas"]["XyzAbc"]`:

1. **Server Schema Type** (`types/schema/xyz-abc.ts`):

   ```typescript
   export type XyzAbcSchema = components["schemas"]["XyzAbc"];
   ```

2. **Config Type** (`types/config/xyz-abc.ts`):

   ```typescript
   export const XyzAbcConfigType: z.ZodObject<{...}> = z.object({...}).strict();
   export type XyzAbcConfig = z.infer<typeof XyzAbcConfigType>;
   ```

3. **Mapper** (`mappers/xyz-abc.ts`):

   ```typescript
   export function mapXyzAbcConfigToSchema(
     desired: XyzAbcConfig,
   ): Partial<XyzAbcSchema> { ... }
   ```

4. **Apply Logic** (`apply/xyz-abc.ts`):

   ```typescript
   export async function applyXyzAbc(
     client: JellyfinClient,
     desired: XyzAbcConfig | undefined,
   ): Promise<void> { ... }
   ```

5. **Variable Naming**:
   ```typescript
   const currentXyzAbcSchema: XyzAbcSchema = ...;
   const updatedXyzAbcSchema: XyzAbcSchema = ...;
   ```

### ✨ Copy-Paste Ready Feature Addition

Adding a new config feature is now trivial:

```bash
# 1. Create config type
touch src/types/config/new-feature.ts
touch tests/types/config/new-feature.spec.ts

# 2. Create server schema (if needed)
touch src/types/schema/new-feature.ts

# 3. Create mapper
touch src/mappers/new-feature.ts
touch tests/mappers/new-feature.spec.ts

# 4. Create apply logic
touch src/apply/new-feature.ts
touch tests/apply/new-feature.spec.ts

# 5. Wire into pipeline (src/pipeline/index.ts)
```

Follow the established patterns in existing files!

## API Integration

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

| Test | Field Type | Scenario                               | Status |
| ---- | ---------- | -------------------------------------- | ------ |
| it1  | Scalar     | Preserve true enableMetrics            | ✅     |
| it2  | Scalar     | Preserve false enableMetrics           | ✅     |
| it3  | List       | Preserve pluginRepositories list       | ✅     |
| it4  | List       | Replace pluginRepositories list        | ✅     |
| it5  | Object     | Preserve trickplayOptions (both true)  | ✅     |
| it6  | Object     | Preserve trickplayOptions (both false) | ✅     |
| it7  | Object     | Partial trickplayOptions update        | ✅     |
| it8  | Object     | Partial trickplayOptions update        | ✅     |
| it9  | Object     | Full trickplayOptions update           | ✅     |
| it10 | Scalar     | Preserve encoding config               | ✅     |

**Core Validation**: All tests confirm jellarr implements true declarative
behavior - only explicitly configured fields are modified.

## Build System

### Nix Integration

- Main derivation: `nix/package.nix`
- **Critical**: Line 47 contains pnpm dependency hash - must be updated when
  dependencies change
- Current hash: `"sha256-EFshNgnzsgnJnXuhdbyZKsMQ2W7LWA58jNQEzJ7TTwU="`
- Build command: `nix build .#`
- Run command: `JELLARR_API_KEY=<key> nix run .# -- --configFile <path>`

### Testing Strategy

- **Unit tests**: `pnpm test` (Vitest, **64 tests**)
- **Type checking**: `pnpm typecheck`
- **Linting**: `pnpm eslint`
- **Integration**: Full server interaction tests (it1-it10)

## When User Says "/init"

1. **Understand the context**: This is a declarative Jellyfin configuration tool
   with strict validation
2. **Remember the core principle**: Only modify explicitly specified fields
3. **Know the NEW architecture**: Clean modular structure in `types/config/`
   with perfect naming conventions
4. **Be ready for rapid development**: Use established copy-paste patterns for
   new features
5. **Follow build practices**: Use "buildfull" for clean builds, always validate
   with standard pipeline
6. **Respect authentication**: Always ask for API key, never store it

## 🎯 Development Workflow

### For New Config Features

1. **Create config type** in `types/config/new-feature.ts` following
   `XyzAbcConfigType` pattern
2. **Create tests** in `tests/types/config/new-feature.spec.ts`
3. **Create mapper** in `mappers/new-feature.ts` following
   `mapXyzAbcConfigToSchema` pattern
4. **Create apply logic** in `apply/new-feature.ts` following `applyXyzAbc`
   pattern
5. **Wire into pipeline** in `src/pipeline/index.ts`
6. **Run standard quality pipeline**:
   `npm run build && tsc --noEmit && pnpm eslint && pnpm test && nix fmt`
7. **Integration test** with real server using established it1-it10 pattern

### Quality Gates

- ✅ All 64 tests must pass
- ✅ TypeScript compilation clean
- ✅ ESLint validation passing
- ✅ Integration test successful
- ✅ buildfull process complete

## Important Reminders

- **Perfect architecture**: We just completed major refactor - everything is now
  clean and modular
- **Copy-paste ready**: New features follow established patterns exactly
- **64 tests passing**: Comprehensive validation ensures quality
- **Integration tested**: Real server validation with it1-it10 pattern
- **Never deviate from naming conventions**: `XyzAbcConfigType` → `XyzAbcConfig`
  pattern is law
- **Always run standard pipeline**:
  `npm run build && tsc --noEmit && pnpm eslint && pnpm test && nix fmt`
- **buildfull is comprehensive**: Full clean environment + build + validation +
  integration test
- **Integration test any changes**: Use curl + jellarr + verification pattern
  established

## 🔥 Ready for Tomorrow

The codebase is now in perfect state for rapid feature development. When you say
`/init` tomorrow, we'll have 0% context loss and can immediately start building
new features using the established patterns. GGWP! 🚀
