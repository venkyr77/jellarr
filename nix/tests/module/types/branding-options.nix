{
  lib,
  assertEq,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.brandingOptions) mkBrandingOptionsConfig;
in [
  (assertEq "valid full config" (mkBrandingOptionsConfig {
      loginDisclaimer = "Welcome to my server";
      customCss = "@import url('https://example.com/style.css');";
      splashscreenEnabled = true;
    }) {
      loginDisclaimer = "Welcome to my server";
      customCss = "@import url('https://example.com/style.css');";
      splashscreenEnabled = true;
    })

  (assertEq "only loginDisclaimer" (mkBrandingOptionsConfig {
      loginDisclaimer = "Server notice";
      customCss = null;
      splashscreenEnabled = null;
    }) {
      loginDisclaimer = "Server notice";
    })

  (assertEq "only customCss" (mkBrandingOptionsConfig {
      loginDisclaimer = null;
      customCss = "body { background: black; }";
      splashscreenEnabled = null;
    }) {
      customCss = "body { background: black; }";
    })

  (assertEq "only splashscreenEnabled false" (mkBrandingOptionsConfig {
      loginDisclaimer = null;
      customCss = null;
      splashscreenEnabled = false;
    }) {
      splashscreenEnabled = false;
    })

  (assertEq "empty config" (mkBrandingOptionsConfig {
    loginDisclaimer = null;
    customCss = null;
    splashscreenEnabled = null;
  }) {})

  (assertEq "long loginDisclaimer" (mkBrandingOptionsConfig {
      loginDisclaimer = lib.concatStrings (lib.genList (_: "a") 10000);
      customCss = null;
      splashscreenEnabled = null;
    }) {
      loginDisclaimer = lib.concatStrings (lib.genList (_: "a") 10000);
    })

  (assertEq "multi-line CSS" (mkBrandingOptionsConfig {
      loginDisclaimer = null;
      customCss = ''
        @import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");
        body {
          background: #000;
          color: #fff;
        }
      '';
      splashscreenEnabled = null;
    }) {
      customCss = ''
        @import url("https://cdn.jsdelivr.net/npm/jellyskin@latest/dist/main.css");
        body {
          background: #000;
          color: #fff;
        }
      '';
    })

  (assertEq "two fields" (mkBrandingOptionsConfig {
      loginDisclaimer = "Notice";
      customCss = null;
      splashscreenEnabled = true;
    }) {
      loginDisclaimer = "Notice";
      splashscreenEnabled = true;
    })
]
