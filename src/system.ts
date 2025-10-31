import { promises as fs } from "fs";
import createClient from "openapi-fetch";
import YAML from "yaml";
import { makeClient } from "./client";
import type { components, paths } from "../generated/schema";

type ServerConfiguration = components["schemas"]["ServerConfiguration"];

interface Config {
  version: number;
  base_url: string;
  system: { enableMetrics: boolean };
}

export async function applySystem(path: string) {
  const cfg: Config = YAML.parse(await fs.readFile(path, "utf8")) as Config;
  const { base_url, system } = cfg;

  const apiKey: string | undefined = process.env.JELLYFIN_API_KEY;
  if (!apiKey) throw new Error("JELLYFIN_API_KEY required");

  const jf: ReturnType<typeof createClient<paths>> = makeClient(
    base_url,
    apiKey,
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  const read = await jf.GET("/System/Configuration");
  if (read.error) {
    throw new Error(`Failed to get config: ${read.response.status.toString()}`);
  }
  const current: ServerConfiguration = read.data as ServerConfiguration;

  if (current.EnableMetrics === system.enableMetrics) {
    console.log("✓ Already up to date");
    return;
  }

  console.log("→ Updating EnableMetrics...");

  const body: ServerConfiguration = {
    ...current,
    EnableMetrics: system.enableMetrics,
  };

  // eslint-disable-next-line @typescript-eslint/typedef
  const write = await jf.POST("/System/Configuration", { body });
  if (write.error) {
    throw new Error(`Update failed: ${write.response.status.toString()}`);
  }

  console.log("✓ Updated");
}
