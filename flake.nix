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

      perSystem = {system, ...}: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        formatter = (treefmt-nix.lib.evalModule pkgs ./treefmt.nix).config.build.wrapper;

        packages.default = pkgs.buildGoModule {
          pname = "jellarr";
          version = "0.1.0";
          src = ./.;
          subPackages = ["cmd/jellarr"];
          vendorHash = "sha256-m6zzY4lhxmfMxkmaF09/7Hiiwx0MSYO+Rbuj6bW7H4s=";
          ldflags = ["-s" "-w"];
          doCheck = true;
          meta = with pkgs.lib; {
            description = "Declarative Jellyfin configuration engine (typed Go client)";
            license = licenses.agpl3Only;
            homepage = "https://github.com/venkyr77/jellarr";
            mainProgram = "jellarr";
            platforms = platforms.linux ++ platforms.darwin;
          };
        };
      };
    };
}
