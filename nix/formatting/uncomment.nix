{
  lib,
  pkgs,
  system,
}: let
  systemMap = {
    "aarch64-darwin" = {
      assetSuffix = "aarch64-apple-darwin";
      sha256 = "sha256-Tpl7r1+f45rBQ3Kk3qWChhe2ZkdMxjwUodOqXjpAHLA=";
    };
    "aarch64-linux" = {
      assetSuffix = "aarch64-unknown-linux-gnu";
      sha256 = "sha256-7CJZ6osUg7k3HgdPDmBu9Jgyt5hjPkIMgBK9kd9s04c=";
    };
    "x86_64-darwin" = {
      assetSuffix = "x86_64-apple-darwin";
      sha256 = "sha256-RCsUhGRN9VRqygKLWhRv64RIDI/oVBtu5m7W5GJ9KBc=";
    };
    "x86_64-linux" = {
      assetSuffix = "x86_64-unknown-linux-gnu";
      sha256 = "sha256-mwXwExrvJZ7UkgRMbvagkANLyInvAYmHmiPmhePm6/0=";
    };
  };

  info = systemMap.${system};

  url = "https://github.com/Goldziher/uncomment/releases/download/v2.8.1/uncomment-${info.assetSuffix}.tar.gz";
in
  pkgs.stdenv.mkDerivation {
    buildInputs =
      lib.optionals pkgs.stdenv.isLinux [pkgs.stdenv.cc.cc.lib];

    installPhase = ''
      runHook preInstall
      mkdir -p $out/bin
      cp uncomment $out/bin/uncomment
      runHook postInstall
    '';

    meta = with pkgs.lib; {
      description = "Tree-sitter based comment removal tool";
      homepage = "https://github.com/Goldziher/uncomment";
      license = licenses.mit;
      mainProgram = "uncomment";
      platforms = builtins.attrNames systemMap;
    };

    nativeBuildInputs =
      lib.optionals pkgs.stdenv.isLinux [pkgs.autoPatchelfHook];

    pname = "uncomment";

    sourceRoot = ".";

    src = pkgs.fetchurl {
      inherit url;
      inherit (info) sha256;
    };

    version = "2.8.1";
  }
