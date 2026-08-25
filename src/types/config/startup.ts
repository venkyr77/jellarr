import { z } from "zod";

export const StartupRemoteAccessConfigType = z
  .object({
    enableRemoteAccess: z.boolean(),
    enableAutomaticPortMapping: z.boolean(),
  })
  .strict();

export type StartupRemoteAccessConfig = z.infer<
  typeof StartupRemoteAccessConfigType
>;

export const StartupUserConfigType = z
  .object({
    name: z.string().min(1, "User name is required"),
    password: z.string().optional(),
    passwordFile: z.string().optional(),
  })
  .strict()
  .refine(
    (data: { password?: string; passwordFile?: string }) => {
      const hasPassword: boolean =
        data.password !== undefined && data.password.trim() !== "";
      const hasPasswordFile: boolean =
        data.passwordFile !== undefined && data.passwordFile.trim() !== "";
      return hasPassword !== hasPasswordFile;
    },
    {
      message: "Must specify exactly one of 'password' or 'passwordFile'",
      path: [],
    },
  );

export type StartupUserConfig = z.infer<typeof StartupUserConfigType>;

export const StartupConfigType = z
  .object({
    serverName: z.string().optional(),
    preferredMetadataLanguage: z.string().optional(),
    metadataCountryCode: z.string().optional(),
    uiCulture: z.string().optional(),
    remoteAccess: StartupRemoteAccessConfigType.optional(),
    user: StartupUserConfigType.optional(),
    apiKeyApp: z.string().optional(),
    apiKeyFile: z.string().optional(),
    completeStartupWizard: z.boolean().optional(),
  })
  .strict();

export type StartupConfig = z.infer<typeof StartupConfigType>;
