# Contributing to Jellarr

Thanks for your interest in contributing. This document covers everything you
need to get a change from your machine into a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Layout](#project-layout)
- [Running the Checks](#running-the-checks)
- [Making a Change](#making-a-change)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

Be kind. Assume good faith. Disagreements about technical direction are fine;
personal attacks are not.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/jellarr.git
   cd jellarr
   ```
3. Add the upstream remote so you can pull in changes from the main repo:
   ```bash
   git remote add upstream https://github.com/venkyr77/jellarr.git
   ```

## Development Setup

Jellarr is a TypeScript project targeting Node.js 24+. The repository ships a
Nix flake that pins every tool to a known-good version, which is also what CI
uses. The Nix path is recommended.

### With Nix (recommended)

```bash
nix develop
pnpm install
```

The dev shell gives you Node.js 24, pnpm, and every other tool CI uses.

### Without Nix

You will need to provide these yourself:

- Node.js 24 or newer
- pnpm 9 or newer

Then:

```bash
pnpm install
```

### Running Jellarr locally

```bash
JELLARR_API_KEY=your_api_key pnpm tsx src/cli/index.ts apply --configFile path/to/config.yml
```

Or run the built bundle:

```bash
pnpm build
JELLARR_API_KEY=your_api_key node bundle.cjs apply --configFile path/to/config.yml
```

You will need a running Jellyfin instance to point at. A disposable one in
Docker works well for iteration:

```bash
docker run -d --name jellyfin-dev -p 8096:8096 jellyfin/jellyfin
```

## Project Layout

```
src/
  api/          Jellyfin REST client (openapi-fetch wrapper)
  apply/        Per-resource apply logic (system, encoding, users, plugins, ...)
  cli/          Command-line entry point
  dump/         Export-existing-config feature
  lib/          Shared utilities (changeset builder, logger)
  mappers/      Config-object to API-schema translation
  pipeline/     Orchestrator that wires everything together
  types/
    config/     Zod schemas for the user-facing YAML config
    schema/     Types re-exported from the generated Jellyfin OpenAPI schema
generated/      Output of `pnpm typegen`; do not hand-edit
tests/          Vitest unit and integration tests (mirrors src/ layout)
nix/            Nix module, integration tests, and packaging
```

The flow for a typical declarative field is:

1. Add a zod type in `src/types/config/<resource>.ts`.
2. Wire it into `src/types/config/root.ts`.
3. Add diff and apply logic in `src/apply/<resource>.ts`.
4. If the Jellyfin API shape differs from the config shape, add a mapper in
   `src/mappers/<resource>.ts`.
5. Add a step to `src/pipeline/index.ts` that reads the current state, diffs,
   and applies.
6. Add tests under `tests/` mirroring the source path.

## Running the Checks

CI runs these exact commands, so run them locally before opening a PR.

```bash
pnpm build          # esbuild bundle
pnpm typecheck      # tsc --noEmit
pnpm eslint         # strict type-aware lint
pnpm test           # vitest
```

If you changed anything touched by the Nix module or flake:

```bash
nix build .#
nix flake check --all-systems
```

### Updating the Jellyfin schema

The Jellyfin API types are generated from the upstream OpenAPI spec. To refresh
them:

```bash
pnpm typegen
```

Commit the regenerated `generated/schema.d.ts` alongside any code that relies
on new fields.

## Making a Change

1. Create a branch off `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
   Common prefixes mirror the commit types below: `feat/`, `fix/`, `docs/`,
   `refactor/`, `chore/`, `test/`.
2. Make your change. Keep the scope narrow; unrelated cleanups belong in a
   separate PR.
3. Add or update tests. Every PR that touches behavior should add at least one
   test that would fail without the change.
4. Update `README.md` if you added, removed, or changed a user-facing config
   field, CLI flag, or environment variable.
5. Add an entry under an `## [Unreleased]` heading in `CHANGELOG.md` using the
   same structure as existing releases.
6. Run the full check suite (see above) until it passes.

### Coding style

- TypeScript strict mode is on; `any` is not welcome.
- ESLint runs with `strictTypeChecked` and `stylisticTypeChecked`. Fix lints
  at the source; do not add inline disables unless you are documenting a
  genuine false positive and can explain it in a comment.
- Prefer explicit return types on exported functions.
- Schema definitions live next to their zod types; API schema types come from
  `generated/` and should be re-exported through `src/types/schema/`.

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).
The prefix determines how the change is categorized in the changelog:

- `feat:` new user-facing capability
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` internal change with no behavior change
- `test:` adding or refactoring tests
- `chore:` tooling, dependencies, CI
- `perf:` performance improvement

Examples pulled from recent history:

```
feat: add experimental dump command to export Jellyfin config
fix: only dump encoding fields that exist in config
docs: Update jellarr input version in example
```

One logical change per commit. If you need to clean up a branch before
submitting, do so with `git rebase -i` on your fork.

## Pull Requests

1. Push your branch to your fork and open a PR against `venkyr77/jellarr:main`.
2. The PR description should answer three questions:
   - **What** does this change?
   - **Why** is it needed? (Link the issue if there is one: `Closes #NNN`.)
   - **How** was it tested? (Which checks did you run? Did you exercise it
     against a real Jellyfin instance?)
3. CI must be green. If it fails on something unrelated to your change, flag it
   in a comment rather than force-pushing over it.
4. Keep the PR focused. If reviewer feedback grows the scope, consider
   splitting into follow-up PRs.
5. Address review comments with new commits rather than force-pushing, so
   reviewers can see what changed. A final squash happens at merge time.

### When your PR touches the Jellyfin API

Jellarr deliberately avoids touching Jellyfin internals. If you are adding a
new configuration surface:

- Use an official Jellyfin REST endpoint from the generated schema.
- Do not read, write, or parse Jellyfin's SQLite database or XML config files
  from the apply path. The one exception is the opt-in NixOS bootstrap
  service, which is scoped to initial API-key provisioning.
- Handle the case where Jellyfin rejects the request (for example, a field the
  server version does not support) with a clear error message.

## Reporting Issues

For bugs and feature requests, use the issue templates in
[`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE). Useful things to include:

- Jellarr version (release tag, image tag, or commit SHA)
- Jellyfin version
- Deployment method (Nix, Docker, bare binary)
- Minimal `config.yml` that reproduces the problem
- Relevant log output from a failing run

## License

By contributing, you agree that your contributions will be licensed under the
[AGPL-3.0](LICENSE) license that covers this project.
