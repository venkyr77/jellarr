import { logger } from "../lib/logger";
import { mapEncodingOptionsConfigToSchema } from "../mappers/encoding-options";
import { type EncodingOptionsConfig } from "../types/config/encoding-options";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";

function hasEnableHardwareEncodingChanged(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): boolean {
  if (desired.enableHardwareEncoding === undefined) return false;

  const cur: boolean = Boolean(current.EnableHardwareEncoding);
  const next: boolean = desired.enableHardwareEncoding;

  return cur !== next;
}

export function applyEncoding(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): EncodingOptionsSchema {
  const patch: Partial<EncodingOptionsSchema> =
    mapEncodingOptionsConfigToSchema(desired);

  if (hasEnableHardwareEncodingChanged(current, desired)) {
    logger.info(
      `EnableHardwareEncoding changed: ${String(current.EnableHardwareEncoding)} → ${String(desired.enableHardwareEncoding)}`,
    );
  }

  const out: EncodingOptionsSchema = { ...current };

  if ("EnableHardwareEncoding" in patch) {
    out.EnableHardwareEncoding = patch.EnableHardwareEncoding;
  }

  return out;
}
