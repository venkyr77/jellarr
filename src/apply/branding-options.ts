import type { BrandingOptionsConfig } from "../types/config/branding-options";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import { mapBrandingOptionsConfigToSchema } from "../mappers/branding-options";
import type { JellyfinClient } from "../api/jellyfin.types";
import { logger } from "../lib/logger";
import { diff, applyChangeset, type IChange } from "json-diff-ts";
import { ChangeSetBuilder } from "../lib/changeset";

export function calculateBrandingOptionsDiff(
  current: BrandingOptionsDtoSchema,
  desired: BrandingOptionsConfig,
): BrandingOptionsDtoSchema | undefined {
  const next: BrandingOptionsDtoSchema =
    mapBrandingOptionsConfigToSchema(desired);

  const patch: IChange[] = new ChangeSetBuilder(
    diff(current, next, {
      treatTypeChangeAsReplace: false,
    }),
  )
    .withoutRemoves()
    .toArray();

  if (patch.length != 0) {
    logger.info(JSON.stringify(patch));
    return applyChangeset(current, patch) as BrandingOptionsDtoSchema;
  }

  return undefined;
}

export async function applyBrandingOptions(
  client: JellyfinClient,
  updatedSchema: BrandingOptionsDtoSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;

  await client.updateBrandingConfiguration(updatedSchema);
}
