{pkgs ? import <nixpkgs> {}}: let
  assertEq = name: actual: expected:
    if actual == expected
    then {
      inherit name;
      passed = true;
    }
    else {
      inherit name;
      passed = false;
      error = "Expected ${builtins.toJSON expected}, got ${builtins.toJSON actual}";
    };

  assertThrows = name: expr: let
    result = builtins.tryEval (builtins.deepSeq expr expr);
  in
    if !result.success
    then {
      inherit name;
      passed = true;
    }
    else {
      inherit name;
      passed = false;
      error = "Expected expression to throw, but it evaluated to: ${builtins.toJSON result.value}";
    };

  assertSucceeds = name: expr: let
    result = builtins.tryEval (builtins.deepSeq expr expr);
  in
    if result.success
    then {
      inherit name;
      passed = true;
    }
    else {
      inherit name;
      passed = false;
      error = "Expected expression to succeed, but it threw an error";
    };

  runTests = tests: let
    failedTests = builtins.filter (t: !t.passed) tests;
    allPassed = builtins.length failedTests == 0;
  in {
    inherit tests failedTests allPassed;
    summary =
      if allPassed
      then "All ${toString (builtins.length tests)} tests passed"
      else "Failed ${toString (builtins.length failedTests)}/${toString (builtins.length tests)} tests: ${builtins.toJSON failedTests}";
  };
in {
  inherit (pkgs) lib;
  inherit assertEq assertThrows assertSucceeds runTests;
}
