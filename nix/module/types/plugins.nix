{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  pluginConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "Plugin name.";
      };
      configuration = mkOption {
        type = nullOr types.attrs;
        default = null;
        description = "Plugin configuration (arbitrary key-value pairs).";
      };
    };
  };

  pluginsConfigType = nullOr (types.listOf pluginConfigType);

  mkPluginsConfig = cfg:
    map (plugin:
      assert plugin.name != "" || throw "Plugin name cannot be empty";
        {}
        // {inherit (plugin) name;}
        // optionalAttrs (plugin.configuration != null) {inherit (plugin) configuration;})
    cfg;
in {
  inherit pluginsConfigType mkPluginsConfig;
}
