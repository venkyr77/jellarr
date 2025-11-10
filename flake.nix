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

      perSystem = {
        config,
        system,
        ...
      }: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        checks.package-can-build = config.packages.default;

        formatter = (treefmt-nix.lib.evalModule pkgs ./treefmt.nix).config.build.wrapper;

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
