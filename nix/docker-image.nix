{
  pkgs,
  package,
}:
pkgs.dockerTools.buildLayeredImage {
  name = "jellarr";
  tag = "latest";

  contents = [
    pkgs.coreutils
    pkgs.nodejs_24
    package
  ];

  config = {
    Cmd = ["${pkgs.lib.getExe package}"];
    Env = ["NODE_ENV=production"];
  };
}
