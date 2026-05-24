{
  lib,
  makeBinaryWrapper,
  nodejs_24,
  pnpm,
  pnpmConfigHook ? pnpm.configHook,
  fetchPnpmDeps ? pnpm.fetchDeps,
  stdenvNoCC,
  ...
}:
stdenvNoCC.mkDerivation (finalAttrs: {
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
    makeWrapper ${lib.getExe nodejs_24} $out/bin/jellarr \
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
    makeBinaryWrapper
    nodejs_24
    pnpm
    pnpmConfigHook
  ];

  pname = "jellarr";

  pnpmDeps = fetchPnpmDeps {
    fetcherVersion = 3;
    hash = "sha256-n0Msdv5pdnM6KVG/j3ixzZM81LK3gKHsdKLH7A1EqHQ=";
    inherit (finalAttrs) pname src version;
  };

  src = ../.;

  version = "0.1.0";
})
