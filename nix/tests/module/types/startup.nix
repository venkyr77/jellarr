{
  lib,
  assertEq,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.startup) mkStartupConfig;
in [
  (assertEq "completeStartupWizard true" (mkStartupConfig {completeStartupWizard = true;}) {
    completeStartupWizard = true;
  })

  (assertEq "completeStartupWizard false" (mkStartupConfig {completeStartupWizard = false;}) {
    completeStartupWizard = false;
  })

  (assertEq "empty config" (mkStartupConfig {completeStartupWizard = null;}) {})
]
