import { z } from "zod";
import { SystemConfigType } from "./system";
import { EncodingOptionsConfigType } from "./encoding-options";
import { LibraryConfigType } from "./library";
import { BrandingOptionsConfigType } from "./branding-options";

export const RootConfigType: z.ZodObject<{
  version: z.ZodNumber;
  base_url: z.ZodURL;
  system: typeof SystemConfigType;
  encoding: z.ZodOptional<typeof EncodingOptionsConfigType>;
  library: z.ZodOptional<typeof LibraryConfigType>;
  branding: z.ZodOptional<typeof BrandingOptionsConfigType>;
}> = z
  .object({
    version: z.number().int().positive("Version must be a positive integer"),
    base_url: z.url({ message: "Base URL must be a valid URL" }),
    system: SystemConfigType,
    encoding: EncodingOptionsConfigType.optional(),
    library: LibraryConfigType.optional(),
    branding: BrandingOptionsConfigType.optional(),
  })
  .strict();

export type RootConfig = z.infer<typeof RootConfigType>;
