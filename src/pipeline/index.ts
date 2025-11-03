import { promises as fs } from "fs";
import YAML from "yaml";
import { applySystem } from "../apply/system";
import { applyEncoding } from "../apply/encoding";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { type EncodingConfigurationSchema } from "../types/schema/encoding";
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

  // Handle system configuration
  const currentSystem: ServerConfigurationSchema =
    await jellyfinClient.getSystemConfiguration();

  const updatedSystem: ServerConfigurationSchema = applySystem(
    currentSystem,
    cfg.system,
  );

  const systemSame: boolean =
    JSON.stringify(updatedSystem) === JSON.stringify(currentSystem);
  if (!systemSame) {
    console.log("→ updating system config");
    await jellyfinClient.updateSystemConfiguration(updatedSystem);
    console.log("✓ updated system config");
  } else {
    console.log("✓ system config already up to date");
  }

  // Handle encoding configuration if provided
  if (cfg.encoding) {
    const currentEncoding: EncodingConfigurationSchema =
      await jellyfinClient.getEncodingConfiguration();

    const updatedEncoding: EncodingConfigurationSchema = applyEncoding(
      currentEncoding,
      cfg.encoding,
    );

    const encodingSame: boolean =
      JSON.stringify(updatedEncoding) === JSON.stringify(currentEncoding);
    if (!encodingSame) {
      console.log("→ updating encoding config");
      await jellyfinClient.updateEncodingConfiguration(updatedEncoding);
      console.log("✓ updated encoding config");
    } else {
      console.log("✓ encoding config already up to date");
    }
  }
}
