#!/usr/bin/env node
import { Command } from "commander";
import { runPipeline } from "./pipeline";

interface Options {
  config: string;
}

const program: Command = new Command();

program
  .name("jellarr-ts")
  .description("Minimal Jellyfin config applier")
  .option("-c, --config <path>", "YAML config file", "config.yml")
  .action(async (opts: Options): Promise<void> => {
    await runPipeline(opts.config);
  });

program.parseAsync().catch((err: unknown): void => {
  console.error(err);
  process.exit(1);
});
