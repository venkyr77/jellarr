import type { BrandingOptionsConfig } from "../types/config/branding-options";
import type { BrandingOptionsDtoSchema } from "../types/schema/branding-options";

export function mapBrandingOptionsConfigToSchema(
  desired: BrandingOptionsConfig,
): Partial<BrandingOptionsDtoSchema> {
  const out: Partial<BrandingOptionsDtoSchema> = {};
  out.LoginDisclaimer = desired.loginDisclaimer;
  out.CustomCss = desired.customCss;
  out.SplashscreenEnabled = desired.splashscreenEnabled;
  return out;
}
