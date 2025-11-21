{pkgs}: let
  tests = ["it1"];
in
  builtins.listToAttrs (map (name: {
      inherit name;
      value = import ./${name}.nix {inherit pkgs;};
    })
    tests)
