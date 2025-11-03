import { logger } from "../lib/logger";
import { mapEncodingConfigurationConfigToSchema } from "../mappers/encoding";
import { type EncodingConfig } from "../types/config/encoding";
import { type EncodingConfigurationSchema } from "../types/schema/encoding";

function hasEnableHardwareEncodingChanged(
  current: EncodingConfigurationSchema,
  desired: EncodingConfig,
): boolean {
  if (desired.enableHardwareEncoding === undefined) return false;

  const cur: boolean = Boolean(current.EnableHardwareEncoding);
  const next: boolean = desired.enableHardwareEncoding;

  return cur !== next;
}

export function applyEncoding(
  current: EncodingConfigurationSchema,
  desired: EncodingConfig,
): EncodingConfigurationSchema {
  const patch: Partial<EncodingConfigurationSchema> =
    mapEncodingConfigurationConfigToSchema(desired);

  if (hasEnableHardwareEncodingChanged(current, desired)) {
    logger.info(
      `EnableHardwareEncoding changed: ${String(current.EnableHardwareEncoding)} → ${String(desired.enableHardwareEncoding)}`,
    );
  }

  const out: EncodingConfigurationSchema = { ...current };

  if ("EnableHardwareEncoding" in patch) {
    out.EnableHardwareEncoding = patch.EnableHardwareEncoding;
  }

  return out;
}
