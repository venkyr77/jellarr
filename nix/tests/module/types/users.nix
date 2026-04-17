{
  lib,
  assertEq,
  assertThrows,
  ...
}: let
  types = import ../../../module/types {inherit lib;};
  inherit (types.users) mkUsersConfig;
in [
  (assertEq "valid with password" (mkUsersConfig [
      {
        name = "test-jellarr";
        password = "test";
        passwordFile = null;
        policy = null;
      }
    ]) [
      {
        name = "test-jellarr";
        password = "test";
      }
    ])

  (assertEq "valid with passwordFile" (mkUsersConfig [
      {
        name = "test-jellarr";
        password = null;
        passwordFile = "/run/secrets/user-password";
        policy = null;
      }
    ]) [
      {
        name = "test-jellarr";
        passwordFile = "/run/secrets/user-password";
      }
    ])

  (assertEq "multiple users" (mkUsersConfig [
      {
        name = "user1";
        password = "password1";
        passwordFile = null;
        policy = null;
      }
      {
        name = "user2";
        password = null;
        passwordFile = "/run/secrets/user2-password";
        policy = null;
      }
      {
        name = "test-jellarr";
        password = "test";
        passwordFile = null;
        policy = null;
      }
    ]) [
      {
        name = "user1";
        password = "password1";
      }
      {
        name = "user2";
        passwordFile = "/run/secrets/user2-password";
      }
      {
        name = "test-jellarr";
        password = "test";
      }
    ])

  (assertThrows "reject empty name" (mkUsersConfig [
    {
      name = "";
      password = "test";
      passwordFile = null;
      policy = null;
    }
  ]))

  (assertThrows "reject both password sources" (mkUsersConfig [
    {
      name = "test-user";
      password = "test";
      passwordFile = "/run/secrets/user-password";
      policy = null;
    }
  ]))

  (assertThrows "reject neither password source" (mkUsersConfig [
    {
      name = "test-user";
      password = null;
      passwordFile = null;
      policy = null;
    }
  ]))

  (assertEq "user with policy" (mkUsersConfig [
      {
        name = "admin-user";
        password = "password";
        passwordFile = null;
        policy = {
          isAdministrator = true;
          loginAttemptsBeforeLockout = 3;
        };
      }
    ]) [
      {
        name = "admin-user";
        password = "password";
        policy = {
          isAdministrator = true;
          loginAttemptsBeforeLockout = 3;
        };
      }
    ])

  (assertEq "policy isAdministrator only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          isAdministrator = true;
          loginAttemptsBeforeLockout = null;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {isAdministrator = true;};
      }
    ])

  (assertEq "policy loginAttemptsBeforeLockout only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          isAdministrator = null;
          loginAttemptsBeforeLockout = 5;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {loginAttemptsBeforeLockout = 5;};
      }
    ])

  (assertEq "policy maxActiveSessions only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          maxActiveSessions = 2;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {maxActiveSessions = 2;};
      }
    ])

  (assertEq "policy enableAllFolders only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          enableAllFolders = true;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {enableAllFolders = true;};
      }
    ])

  (assertEq "policy enableCollectionManagement only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          enableCollectionManagement = true;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {enableCollectionManagement = true;};
      }
    ])

  (assertEq "displayMissingEpisodes only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = null;
        displayMissingEpisodes = true;
      }
    ]) [
      {
        name = "user";
        password = "pass";
        displayMissingEpisodes = true;
      }
    ])

  (assertEq "subtitleLanguagePreference only" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = null;
        subtitleLanguagePreference = "eng";
      }
    ]) [
      {
        name = "user";
        password = "pass";
        subtitleLanguagePreference = "eng";
      }
    ])

  (assertEq "empty policy" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          isAdministrator = null;
          loginAttemptsBeforeLockout = null;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {};
      }
    ])

  (assertThrows "reject negative loginAttemptsBeforeLockout" (mkUsersConfig [
    {
      name = "user";
      password = "pass";
      passwordFile = null;
      policy = {
        isAdministrator = null;
        loginAttemptsBeforeLockout = -1;
      };
    }
  ]))

  (assertThrows "reject zero loginAttemptsBeforeLockout" (mkUsersConfig [
    {
      name = "user";
      password = "pass";
      passwordFile = null;
      policy = {
        isAdministrator = null;
        loginAttemptsBeforeLockout = 0;
      };
    }
  ]))

  (assertEq "loginAttemptsBeforeLockout boundary value 1" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          isAdministrator = null;
          loginAttemptsBeforeLockout = 1;
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {loginAttemptsBeforeLockout = 1;};
      }
    ])

  (assertEq "policy with enabledLibraries" (mkUsersConfig [
      {
        name = "user";
        password = "pass";
        passwordFile = null;
        policy = {
          enabledLibraries = ["Movies" "Shows"];
        };
      }
    ]) [
      {
        name = "user";
        password = "pass";
        policy = {
          enabledLibraries = ["Movies" "Shows"];
        };
      }
    ])

  (assertEq "list with users having policies" (mkUsersConfig [
      {
        name = "admin";
        password = "admin-pass";
        passwordFile = null;
        policy = {
          isAdministrator = true;
          loginAttemptsBeforeLockout = null;
        };
      }
      {
        name = "viewer";
        password = null;
        passwordFile = "/secrets/viewer";
        policy = {
          isAdministrator = false;
          loginAttemptsBeforeLockout = 5;
        };
      }
    ]) [
      {
        name = "admin";
        password = "admin-pass";
        policy = {isAdministrator = true;};
      }
      {
        name = "viewer";
        passwordFile = "/secrets/viewer";
        policy = {
          isAdministrator = false;
          loginAttemptsBeforeLockout = 5;
        };
      }
    ])

  (assertThrows "reject empty enabledLibraries entry" (mkUsersConfig [
    {
      name = "user";
      password = "pass";
      passwordFile = null;
      policy = {
        enabledLibraries = [""];
      };
    }
  ]))

  (assertThrows "reject list with invalid policy" (mkUsersConfig [
    {
      name = "valid-user";
      password = "password";
      passwordFile = null;
      policy = null;
    }
    {
      name = "invalid-user";
      password = "password";
      passwordFile = null;
      policy = {
        isAdministrator = null;
        loginAttemptsBeforeLockout = -5;
      };
    }
  ]))
]
