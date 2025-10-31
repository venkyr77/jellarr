#!/usr/bin/env node
import { Command } from "commander";
import { applySystem } from "./system";

type Options = {
  config: string;
};

const program: Command = new Command();

program
  .name("jellarr-ts")
  .description("Minimal Jellyfin config applier")
  .option("-c, --config <path>", "YAML config file", "config.yml")
  .action(async (opts: Options) => {
    await applySystem(opts.config);
  });

program.parseAsync().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
