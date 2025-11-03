import { promises as fs } from "fs";
import YAML from "yaml";
import { applySystem } from "../apply/system";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { createJellyfinClient } from "../api/jellyfin_client";
import { type JellyfinClient } from "../api/jellyfin.types";
import {
  RootConfigSchema,
  type ValidatedRootConfig,
} from "../validation/config";
import { type ZodSafeParseResult } from "zod";

export async function runPipeline(path: string): Promise<void> {
  const raw: string = await fs.readFile(path, "utf8");

  const validationResult: ZodSafeParseResult<ValidatedRootConfig> =
    RootConfigSchema.safeParse(YAML.parse(raw));
  if (!validationResult.success) {
    const errorMessages: string = validationResult.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }

  const cfg: ValidatedRootConfig = validationResult.data;

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
