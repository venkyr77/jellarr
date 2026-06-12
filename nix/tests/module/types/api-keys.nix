{
  lib,
  assertEq,
  ...
}: let
  inherit (import ../../../module/types/api-keys.nix {inherit lib;}) mkApiKeysConfig;
in [
  (assertEq "mkApiKeysConfig empty list" (mkApiKeysConfig []) [])

  (assertEq "mkApiKeysConfig single key" (mkApiKeysConfig [{name = "foo";}]) [{name = "foo";}])

  (assertEq "mkApiKeysConfig multiple keys" (mkApiKeysConfig [{name = "a";} {name = "b";}]) [{name = "a";} {name = "b";}])
]
