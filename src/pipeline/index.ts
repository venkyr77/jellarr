import { promises as fs } from "fs";
import YAML from "yaml";
import type createClient from "openapi-fetch";
import type { paths } from "../../generated/schema";
import { makeClient } from "../api/client";
import type { RootConfig, ServerConfiguration } from "../domain/system/types";
import { apply } from "../services/system/apply";

type JFClient = ReturnType<typeof createClient<paths>>;

export async function runPipeline(path: string): Promise<void> {
  const raw: string = await fs.readFile(path, "utf8");
  const cfg: RootConfig = YAML.parse(raw) as RootConfig;

  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) throw new Error("JELLARR_API_KEY required");

  const jf: JFClient = makeClient(cfg.base_url, apiKey);

  // eslint-disable-next-line @typescript-eslint/typedef
  const read = await jf.GET("/System/Configuration");
  if (read.error) {
    throw new Error(`Failed to get config: ${read.response.status.toString()}`);
  }
  const current: ServerConfiguration = read.data as ServerConfiguration;

  const updated: ServerConfiguration = apply(current, cfg.system);

  const isSame: boolean = JSON.stringify(updated) === JSON.stringify(current);
  if (isSame) {
    console.log("✓ system config already up to date");
    return;
  }

  console.log("→ updating system config");

  // eslint-disable-next-line @typescript-eslint/typedef
  const write = await jf.POST("/System/Configuration", { body: updated });
  if (write.error) {
    throw new Error(`Update failed: ${write.response.status.toString()}`);
  }
  console.log("✓ updated system config");
}
