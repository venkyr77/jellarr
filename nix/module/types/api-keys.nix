{lib}: let
  inherit (lib) types mkOption;

  apiKeyConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "Name (AppName) of the API key to create.";
      };
    };
  };

  apiKeysConfigType = types.listOf apiKeyConfigType;

  mkApiKeysConfig = cfg: map (k: {inherit (k) name;}) cfg;
in {
  inherit apiKeysConfigType mkApiKeysConfig;
}
