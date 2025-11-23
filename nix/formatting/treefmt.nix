{
  lib,
  pkgs,
  system,
  ...
}: {
  projectRootFile = "flake.nix";

  programs = {
    alejandra = {
      enable = true;
      priority = 30;
    };

    black = {
      enable = true;
      includes = [
        "*.py"
      ];
      priority = 80;
    };

    deadnix = {
      enable = true;
      priority = 10;
    };

    deno = {
      enable = true;
      includes = [
        "*.md"
      ];
      priority = 60;
    };

    isort = {
      enable = true;
      includes = [
        "*.py"
      ];
      priority = 70;
      profile = "black";
    };

    prettier = {
      enable = true;
      priority = 50;
      settings.editorconfig = true;
    };

    statix = {
      enable = true;
      priority = 20;
    };
  };

  settings.formatter = {
    "uncomment" = {
      command = let
        uncomment = import ./uncomment.nix {
          inherit lib pkgs;
          inherit (pkgs.stdenv.hostPlatform) system;
        };
      in "${uncomment}/bin/uncomment";
      includes = [
        "src/**/*.ts"
        "src/**/*.js"
        "tests/**/*.ts"
        "tests/**/*.js"
      ];
      priority = 40;
    };
  };
}
