import YAML from "yaml";
import { promises as fs } from "fs";
import { makeClient } from "./client";

interface Config {
  version: number;
  base_url: string;
  system: { enableMetrics: boolean };
}

export async function applySystem(path: string) {
  const cfg = YAML.parse(await fs.readFile(path, "utf8")) as Config;
  const { base_url, system } = cfg;

  const apiKey = process.env.JELLYFIN_API_KEY;
  if (!apiKey) throw new Error("JELLYFIN_API_KEY required");

  const jf = makeClient(base_url, apiKey);

  const read = await jf.GET("/System/Configuration");
  if (read.error) {
    throw new Error(
      `Failed to get config: ${read.response?.status ?? "unknown"}`,
    );
  }
  const current = read.data;

  if (current?.EnableMetrics === system.enableMetrics) {
    console.log("✓ Already up to date");
    return;
  }

  console.log("→ Updating EnableMetrics...");

  const body = { ...(current as any), EnableMetrics: system.enableMetrics };

  const write = await jf.POST("/System/Configuration", { body });
  if (write.error) {
    throw new Error(`Update failed: ${write.response?.status ?? "unknown"}`);
  }

  console.log("✓ Updated");
}
