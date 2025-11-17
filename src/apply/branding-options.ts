import type { BrandingOptionsConfig } from "../types/config/branding-options";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";
import { mapBrandingOptionsConfigToSchema } from "../mappers/branding-options";
import type { JellyfinClient } from "../api/jellyfin.types";
import { logger } from "../lib/logger";

function hasLoginDisclaimerChanged(
  current: BrandingOptionsDtoSchema,
  desired: BrandingOptionsConfig,
): boolean {
  if (desired.loginDisclaimer === undefined) return false;
  const currentValue: string = current.LoginDisclaimer ?? "";
  const desiredValue: string = desired.loginDisclaimer ?? "";
  return currentValue !== desiredValue;
}

function hasCustomCssChanged(
  current: BrandingOptionsDtoSchema,
  desired: BrandingOptionsConfig,
): boolean {
  if (desired.customCss === undefined) return false;
  const currentValue: string = current.CustomCss ?? "";
  const desiredValue: string = desired.customCss ?? "";
  return currentValue !== desiredValue;
}

function hasSplashscreenEnabledChanged(
  current: BrandingOptionsDtoSchema,
  desired: BrandingOptionsConfig,
): boolean {
  if (desired.splashscreenEnabled === undefined) return false;
  const currentValue: boolean = current.SplashscreenEnabled ?? false;
  return currentValue !== desired.splashscreenEnabled;
}

export function calculateBrandingOptionsDiff(
  current: BrandingOptionsDtoSchema,
  desired: BrandingOptionsConfig,
): BrandingOptionsDtoSchema | undefined {
  const hasChanges: boolean =
    hasLoginDisclaimerChanged(current, desired) ||
    hasCustomCssChanged(current, desired) ||
    hasSplashscreenEnabledChanged(current, desired);

  if (!hasChanges) return undefined;

  if (hasLoginDisclaimerChanged(current, desired)) {
    logger.info(
      `LoginDisclaimer changed: ${String(current.LoginDisclaimer)} → ${String(desired.loginDisclaimer)}`,
    );
  }

  if (hasCustomCssChanged(current, desired)) {
    logger.info(
      `CustomCss changed: ${String(current.CustomCss)} → ${String(desired.customCss)}`,
    );
  }

  if (hasSplashscreenEnabledChanged(current, desired)) {
    logger.info(
      `SplashscreenEnabled changed: ${String(current.SplashscreenEnabled)} → ${String(desired.splashscreenEnabled)}`,
    );
  }

  const patch: Partial<BrandingOptionsDtoSchema> =
    mapBrandingOptionsConfigToSchema(desired);
  const out: BrandingOptionsDtoSchema = { ...current };

  if ("LoginDisclaimer" in patch) {
    out.LoginDisclaimer = patch.LoginDisclaimer;
  }

  if ("CustomCss" in patch) {
    out.CustomCss = patch.CustomCss;
  }

  if ("SplashscreenEnabled" in patch) {
    out.SplashscreenEnabled = patch.SplashscreenEnabled;
  }

  return out;
}

export async function applyBrandingOptions(
  client: JellyfinClient,
  updatedSchema: BrandingOptionsDtoSchema | undefined,
): Promise<void> {
  if (!updatedSchema) return;
  await client.updateBrandingConfiguration(updatedSchema);
}
