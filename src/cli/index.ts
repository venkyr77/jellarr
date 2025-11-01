#!/usr/bin/env node
import { Command, Option } from "commander";
import { runPipeline } from "../pipeline";

interface Options {
  configFile: string;
}

const program: Command = new Command();

program
  .name("jellarr")
  .description("Declarative Jellyfin configuration applier")
  .addOption(
    new Option("--configFile <path>", "path to config file").default(
      "config/config.yml",
    ),
  )
  .action(async (opts: Options): Promise<void> => {
    await runPipeline(opts.configFile);
    console.log("✅ jellarr apply complete");
  });

program.parseAsync().catch((err: unknown): void => {
  console.error(err);
  process.exit(1);
});
