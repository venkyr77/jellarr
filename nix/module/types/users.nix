{lib}: let
  inherit (lib) types mkOption optionalAttrs;

  inherit (types) nullOr;

  userPolicyConfigType = types.submodule {
    options = {
      isAdministrator = mkOption {
        type = nullOr types.bool;
        default = null;
        description = "Whether the user is an administrator.";
      };
      loginAttemptsBeforeLockout = mkOption {
        type = nullOr types.int;
        default = null;
        description = "Number of login attempts before lockout (minimum 1).";
      };
    };
  };

  userConfigType = types.submodule {
    options = {
      name = mkOption {
        type = types.str;
        description = "User name.";
      };
      password = mkOption {
        type = nullOr types.str;
        default = null;
        description = "User password (plaintext, for development only).";
      };
      passwordFile = mkOption {
        type = nullOr types.str;
        default = null;
        description = "Path to file containing user password.";
      };
      policy = mkOption {
        type = nullOr userPolicyConfigType;
        default = null;
        description = "User policy configuration.";
      };
    };
  };

  usersConfigType = nullOr (types.listOf userConfigType);

  mkUserPolicyConfig = cfg:
    {}
    // optionalAttrs (cfg.isAdministrator != null) {inherit (cfg) isAdministrator;}
    // optionalAttrs (cfg.loginAttemptsBeforeLockout != null) (
      assert cfg.loginAttemptsBeforeLockout
      >= 1
      || throw "loginAttemptsBeforeLockout must be at least 1"; {inherit (cfg) loginAttemptsBeforeLockout;}
    );

  mkUsersConfig = cfg:
    map (user:
      assert user.name != "" || throw "User name cannot be empty";
      assert (user.password != null)
      != (user.passwordFile != null)
      || throw "User '${user.name}' must specify exactly one of 'password' or 'passwordFile'";
        {}
        // {inherit (user) name;}
        // optionalAttrs (user.password != null) {inherit (user) password;}
        // optionalAttrs (user.passwordFile != null) {inherit (user) passwordFile;}
        // optionalAttrs (user.policy != null) {policy = mkUserPolicyConfig user.policy;})
    cfg;
in {
  inherit usersConfigType mkUsersConfig;
}
