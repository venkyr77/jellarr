{
  lib,
  pkgs,
  ...
}:
pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
  buildPhase = ''
    runHook preBuild
    pnpm build
    runHook postBuild
  '';

  checkPhase = ''
    runHook preCheck
    pnpm test
    runHook postCheck
  '';

  CI = "true";

  installPhase = ''
    runHook preInstall
    install -Dm644 -t $out/share bundle.cjs
    makeWrapper ${lib.getExe pkgs.nodejs_24} $out/bin/jellarr \
      --add-flags "$out/share/bundle.cjs"
    runHook postInstall
  '';

  meta = {
    description = "Declarative Jellyfin configuration engine (TypeScript, bundled)";
    homepage = "https://github.com/venkyr77/jellarr";
    license = lib.licenses.agpl3Only;
    mainProgram = "jellarr";
    platforms = lib.platforms.all;
  };

  nativeBuildInputs = [
    pkgs.makeBinaryWrapper
    pkgs.nodejs_24
    pkgs.pnpm.configHook
  ];

  pname = "jellarr";

  pnpmDeps = pkgs.pnpm.fetchDeps {
    fetcherVersion = 1;
    hash = "sha256-EFshNgnzsgnJnXuhdbyZKsMQ2W7LWA58jNQEzJ7TTwU=";
    inherit (finalAttrs) pname src version;
  };

  src = ../.;

  version = "0.0.2";
})
