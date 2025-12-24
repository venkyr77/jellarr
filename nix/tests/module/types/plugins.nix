{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.plugins) mkPluginsConfig;
in [
  (assertEq "valid name only" (mkPluginsConfig [
      {
        name = "Trakt";
        configuration = null;
      }
    ]) [
      {name = "Trakt";}
    ])

  (assertEq "with configuration" (mkPluginsConfig [
      {
        name = "Trakt";
        configuration = {TraktUsers = [{ExtraLogging = true;}];};
      }
    ]) [
      {
        name = "Trakt";
        configuration = {TraktUsers = [{ExtraLogging = true;}];};
      }
    ])

  (assertEq "configuration with various types" (mkPluginsConfig [
      {
        name = "SomePlugin";
        configuration = {
          stringValue = "test";
          numberValue = 123;
          booleanValue = true;
          nestedObject = {key = "value";};
          arrayValue = [1 2 3];
        };
      }
    ]) [
      {
        name = "SomePlugin";
        configuration = {
          stringValue = "test";
          numberValue = 123;
          booleanValue = true;
          nestedObject = {key = "value";};
          arrayValue = [1 2 3];
        };
      }
    ])

  (assertEq "multiple plugins" (mkPluginsConfig [
      {
        name = "Trakt";
        configuration = null;
      }
      {
        name = "Playback Reporting";
        configuration = null;
      }
    ]) [
      {name = "Trakt";}
      {name = "Playback Reporting";}
    ])

  (assertEq "mixed with/without config" (mkPluginsConfig [
      {
        name = "Trakt";
        configuration = {TraktUsers = [{ExtraLogging = true;}];};
      }
      {
        name = "Playback Reporting";
        configuration = null;
      }
    ]) [
      {
        name = "Trakt";
        configuration = {TraktUsers = [{ExtraLogging = true;}];};
      }
      {name = "Playback Reporting";}
    ])

  (assertThrows "reject empty name" (mkPluginsConfig [
    {
      name = "";
      configuration = null;
    }
  ]))

  (assertThrows "reject empty name in array" (mkPluginsConfig [
    {
      name = "Trakt";
      configuration = null;
    }
    {
      name = "";
      configuration = null;
    }
  ]))
]
