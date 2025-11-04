import { promises as fs } from "fs";
import YAML from "yaml";
import { deepEqual } from "fast-equals";
import { applySystem } from "../apply/system";
import { applyEncoding } from "../apply/encoding-options";
import { type ServerConfigurationSchema } from "../types/schema/system";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";
import { createJellyfinClient } from "../api/jellyfin_client";
import { type JellyfinClient } from "../api/jellyfin.types";
import { RootConfigType, type RootConfig } from "../types/config/root";
import { type ZodSafeParseResult } from "zod";

export async function runPipeline(path: string): Promise<void> {
  const raw: string = await fs.readFile(path, "utf8");

  const validationResult: ZodSafeParseResult<RootConfig> =
    RootConfigType.safeParse(YAML.parse(raw));
  if (!validationResult.success) {
    const errorMessages: string = validationResult.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }

  const cfg: RootConfig = validationResult.data;

  const apiKey: string | undefined = process.env.JELLARR_API_KEY;
  if (!apiKey) throw new Error("JELLARR_API_KEY required");

  const jellyfinClient: JellyfinClient = createJellyfinClient(
    cfg.base_url,
    apiKey,
  );

  // Handle system configuration
  const currentServerConfigurationSchema: ServerConfigurationSchema =
    await jellyfinClient.getSystemConfiguration();

  const updatedServerConfigurationSchema: ServerConfigurationSchema =
    applySystem(currentServerConfigurationSchema, cfg.system);

  const isSystemSame: boolean = deepEqual(
    updatedServerConfigurationSchema,
    currentServerConfigurationSchema,
  );
  if (!isSystemSame) {
    console.log("→ updating system config");
    await jellyfinClient.updateSystemConfiguration(
      updatedServerConfigurationSchema,
    );
    console.log("✓ updated system config");
  } else {
    console.log("✓ system config already up to date");
  }

  // Handle encoding configuration if provided
  if (cfg.encoding) {
    const currentEncodingOptionsSchema: EncodingOptionsSchema =
      await jellyfinClient.getEncodingConfiguration();

    const updatedEncodingOptionsSchema: EncodingOptionsSchema = applyEncoding(
      currentEncodingOptionsSchema,
      cfg.encoding,
    );

    const isEncodingSame: boolean = deepEqual(
      updatedEncodingOptionsSchema,
      currentEncodingOptionsSchema,
    );
    if (!isEncodingSame) {
      console.log("→ updating encoding config");
      await jellyfinClient.updateEncodingConfiguration(
        updatedEncodingOptionsSchema,
      );
      console.log("✓ updated encoding config");
    } else {
      console.log("✓ encoding config already up to date");
    }
  }
}
