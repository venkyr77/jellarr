{pkgs}: let
  tests = ["sanity"];
in
  builtins.listToAttrs (map (name: {
      inherit name;
      value = import ./${name}.nix {inherit pkgs;};
    })
    tests)
