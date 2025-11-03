import { promises as fs } from "fs";
import YAML from "yaml";
import { applySystem } from "../apply/system";
import { RootConfig } from "../types/config/root";
import { ServerConfigurationSchema } from "../types/schema/system";
import { makeJF } from "../api/jf";
import { JF } from "../api/iface";

export async function runPipeline(path: string): Promise<void> {
  const raw: string = await fs.readFile(path, "utf8");
  const cfg: RootConfig = YAML.parse(raw) as RootConfig;

  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) throw new Error("JELLARR_API_KEY required");

  const jf: JF = makeJF(cfg.base_url, apiKey);

  const current: ServerConfigurationSchema = await jf.getSystem();

  const updated: ServerConfigurationSchema = applySystem(current, cfg.system);

  const isSame: boolean = JSON.stringify(updated) === JSON.stringify(current);
  if (isSame) {
    console.log("✓ system config already up to date");
    return;
  }

  console.log("→ updating system config");

  await jf.updateSystem(updated);

  console.log("✓ updated system config");
}
