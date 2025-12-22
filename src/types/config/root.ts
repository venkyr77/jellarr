import { z } from "zod";
import { SystemConfigType } from "./system";
import { EncodingOptionsConfigType } from "./encoding-options";
import { LibraryConfigType } from "./library";
import { BrandingOptionsConfigType } from "./branding-options";
import { UserConfigListType } from "./users";
import { StartupConfigType } from "./startup";
import { PluginConfigListType } from "./plugins";

export const RootConfigType: z.ZodObject<{
  version: z.ZodNumber;
  base_url: z.ZodURL;
  system: typeof SystemConfigType;
  encoding: z.ZodOptional<typeof EncodingOptionsConfigType>;
  library: z.ZodOptional<typeof LibraryConfigType>;
  branding: z.ZodOptional<typeof BrandingOptionsConfigType>;
  users: z.ZodOptional<typeof UserConfigListType>;
  plugins: z.ZodOptional<typeof PluginConfigListType>;
  startup: z.ZodOptional<typeof StartupConfigType>;
}> = z
  .object({
    version: z.number().int().positive("Version must be a positive integer"),
    base_url: z.url({ message: "Base URL must be a valid URL" }),
    system: SystemConfigType,
    encoding: EncodingOptionsConfigType.optional(),
    library: LibraryConfigType.optional(),
    branding: BrandingOptionsConfigType.optional(),
    users: UserConfigListType.optional(),
    plugins: PluginConfigListType.optional(),
    startup: StartupConfigType.optional(),
  })
  .strict();

export type RootConfig = z.infer<typeof RootConfigType>;
