{pkgs ? import <nixpkgs> {}}: let
  base = import ../../base.nix {inherit pkgs;};
  inherit (base) lib assertEq assertThrows assertSucceeds runTests;

  testArgs = {inherit lib assertEq assertThrows assertSucceeds;};

  allTests =
    (import ./branding-options.nix testArgs)
    ++ (import ./encoding-options.nix testArgs)
    ++ (import ./library.nix testArgs)
    ++ (import ./plugins.nix testArgs)
    ++ (import ./root.nix testArgs)
    ++ (import ./startup.nix testArgs)
    ++ (import ./system.nix testArgs)
    ++ (import ./users.nix testArgs);

  result = runTests allTests;
in
  pkgs.runCommand "module-types-tests" {
    passthru = result;
  } ''
    echo "${result.summary}"
    ${lib.optionalString (!result.allPassed) "exit 1"}
    touch $out
  ''
