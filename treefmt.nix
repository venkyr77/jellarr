_: {
  projectRootFile = "flake.nix";

  programs = {
    deadnix = {
      enable = true;
      priority = 10;
    };

    statix = {
      enable = true;
      priority = 20;
    };

    alejandra = {
      enable = true;
      priority = 30;
    };

    prettier = {
      enable = true;
      priority = 40;
      settings.editorconfig = true;
    };

    deno = {
      enable = true;
      includes = [
        "*.md"
      ];
      priority = 50;
    };
  };
}
