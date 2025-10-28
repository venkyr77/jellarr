{pkgs}:
pkgs.buildGoModule {
  pname = "jellarr";
  version = "0.1.0";
  src = ../.;
  subPackages = ["src/cmd/jellarr"];
  vendorHash = "sha256-aIUKXAmLtq3bXesEVndQxLAFKmDmIWiEYhM1P6+IMKg=";
  ldflags = ["-s" "-w"];
  doCheck = true;
  meta = with pkgs.lib; {
    description = "Declarative Jellyfin configuration engine (typed Go client)";
    license = licenses.agpl3Only;
    homepage = "https://github.com/venkyr77/jellarr";
    mainProgram = "jellarr";
    platforms = platforms.linux ++ platforms.darwin;
  };
}
