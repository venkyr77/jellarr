_: {
  projectRootFile = "flake.nix";

  programs = {
    nixf-diagnose = {
      enable = true;
      priority = 10;
    };
  };
}
