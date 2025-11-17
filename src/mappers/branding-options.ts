import type { BrandingOptionsConfig } from "../types/config/branding-options";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";

export function mapBrandingOptionsConfigToSchema(
  desired: BrandingOptionsConfig,
): Partial<BrandingOptionsDtoSchema> {
  const out: Partial<BrandingOptionsDtoSchema> = {};

  if (desired.loginDisclaimer !== undefined) {
    out.LoginDisclaimer = desired.loginDisclaimer;
  }

  if (desired.customCss !== undefined) {
    out.CustomCss = desired.customCss;
  }

  if (desired.splashscreenEnabled !== undefined) {
    out.SplashscreenEnabled = desired.splashscreenEnabled;
  }

  return out;
}
