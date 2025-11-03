import { type EncodingConfig } from "../types/config/encoding";
import { type EncodingConfigurationSchema } from "../types/schema/encoding";

export function mapEncodingConfigurationConfigToSchema(
  desired: EncodingConfig,
): Partial<EncodingConfigurationSchema> {
  const out: Partial<EncodingConfigurationSchema> = {};

  if (typeof desired.enableHardwareEncoding !== "undefined") {
    out.EnableHardwareEncoding = desired.enableHardwareEncoding;
  }

  return out;
}
