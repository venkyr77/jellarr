{lib}: {
  brandingOptions = import ./branding-options.nix {inherit lib;};
  encodingOptions = import ./encoding-options.nix {inherit lib;};
  library = import ./library.nix {inherit lib;};
  plugins = import ./plugins.nix {inherit lib;};
  root = import ./root.nix {inherit lib;};
  startup = import ./startup.nix {inherit lib;};
  system = import ./system.nix {inherit lib;};
  users = import ./users.nix {inherit lib;};
}
