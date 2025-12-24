{
  description = "Jellarr flake";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    treefmt-nix = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/treefmt-nix";
    };
  };

  outputs = {
    flake-parts,
    nixpkgs,
    treefmt-nix,
    ...
  } @ inputs:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      flake = {
        nixosModules.default = ./nix/module;
      };

      perSystem = {system, ...}: let
        pkgs = nixpkgs.legacyPackages.${system};
        treefmtFormatEval = treefmt-nix.lib.evalModule pkgs ./nix/formatting/treefmt-format.nix;
        treefmtLintEval = treefmt-nix.lib.evalModule pkgs ./nix/formatting/treefmt-lint.nix;
      in {
        checks =
          {
            formatting = treefmtFormatEval.config.build.check inputs.self;
            linting = treefmtLintEval.config.build.check inputs.self;
            module-types = import ./nix/tests/module/types {inherit pkgs;};
          }
          // import ./nix/tests/integration {inherit pkgs;};

        formatter = treefmtFormatEval.config.build.wrapper;

        packages = let
          package = import ./nix/package.nix {
            inherit pkgs;
            inherit (pkgs) lib;
          };
        in {
          default = package;

          docker-image = import ./nix/docker-image.nix {
            inherit package pkgs;
          };
        };
      };
    };
}
