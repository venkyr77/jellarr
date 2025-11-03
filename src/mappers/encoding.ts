import { type EncodingOptionsConfig } from "../types/config/encoding";
import { type EncodingOptionsSchema } from "../types/schema/encoding";

export function mapEncodingOptionsConfigToSchema(
  desired: EncodingOptionsConfig,
): Partial<EncodingOptionsSchema> {
  const out: Partial<EncodingOptionsSchema> = {};

  if (typeof desired.enableHardwareEncoding !== "undefined") {
    out.EnableHardwareEncoding = desired.enableHardwareEncoding;
  }

  return out;
}
