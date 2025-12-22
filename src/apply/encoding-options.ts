import { logger } from "../lib/logger";
import type { JellyfinClient } from "../api/jellyfin.types";
import { mapEncodingOptionsConfigToSchema } from "../mappers/encoding-options";
import { type EncodingOptionsConfig } from "../types/config/encoding-options";
import { type EncodingOptionsSchema } from "../types/schema/encoding-options";
import { applyChangeset, diff, type IChange } from "json-diff-ts";
import { ChangeSetBuilder } from "../lib/changeset";

export function calculateEncodingDiff(
  current: EncodingOptionsSchema,
  desired: EncodingOptionsConfig,
): EncodingOptionsSchema | undefined {
  const next: EncodingOptionsSchema = mapEncodingOptionsConfigToSchema(desired);

  const patch: IChange[] = [
    ...new ChangeSetBuilder(
      diff(current, next, {
        keysToSkip: ["HardwareDecodingCodecs"],
        treatTypeChangeAsReplace: false,
      }),
    )
      .withoutRemoves()
      .toArray(),

    ...new ChangeSetBuilder(
      diff(current, next, {
        embeddedObjKeys: { HardwareDecodingCodecs: "$value" },
        treatTypeChangeAsReplace: false,
      }),
    )
      .withKey("HardwareDecodingCodecs")
      .withoutRemoves()
      .toArray(),
  ];

  if (patch.length != 0) {
    logger.info(JSON.stringify(patch));
    return applyChangeset(current, patch) as EncodingOptionsSchema;
  }

  return undefined;
}

export async function applyEncoding(
  client: JellyfinClient,
  updatedSchema: EncodingOptionsSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;

  await client.updateEncodingConfiguration(updatedSchema);
}
