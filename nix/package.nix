{pkgs}:
pkgs.buildGoModule {
  checkPhase = ''
    runHook preCheck
    export HOME="$TMPDIR"
    export GOCACHE="$TMPDIR/go-cache"
    go test ./src/cmd/jellarr/... ./src/tests/...
    runHook postCheck
  '';
  doCheck = true;
  ldflags = ["-s" "-w"];
  meta = with pkgs.lib; {
    description = "Declarative Jellyfin configuration engine (typed Go client)";
    homepage = "https://github.com/venkyr77/jellarr";
    license = licenses.agpl3Only;
    mainProgram = "jellarr";
    platforms = platforms.linux ++ platforms.darwin;
  };
  pname = "jellarr";
  src = ../.;
  subPackages = ["src/cmd/jellarr"];
  vendorHash = "sha256-aIUKXAmLtq3bXesEVndQxLAFKmDmIWiEYhM1P6+IMKg=";
  version = "0.1.0";
}
