import { promises as fs } from "fs";
import YAML from "yaml";
import { applySystem } from "../apply/system";
import { type RootConfig } from "../types/config/root";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { createJellyfinClient } from "../api/jellyfin_client";
import { type JellyfinClient } from "../api/jellyfin.types";

export async function runPipeline(path: string): Promise<void> {
  const raw: string = await fs.readFile(path, "utf8");
  const cfg: RootConfig = YAML.parse(raw) as RootConfig;

  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) throw new Error("JELLARR_API_KEY required");

  const jellyfinClient: JellyfinClient = createJellyfinClient(
    cfg.base_url,
    apiKey,
  );

  const current: ServerConfigurationSchema =
    await jellyfinClient.getSystemConfiguration();

  const updated: ServerConfigurationSchema = applySystem(current, cfg.system);

  const isSame: boolean = JSON.stringify(updated) === JSON.stringify(current);
  if (isSame) {
    console.log("✓ system config already up to date");
    return;
  }

  console.log("→ updating system config");

  await jellyfinClient.updateSystemConfiguration(updated);

  console.log("✓ updated system config");
}
