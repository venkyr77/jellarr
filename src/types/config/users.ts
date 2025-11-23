import { z } from "zod";

export const UserPolicyConfigType: z.ZodObject<{
  isAdministrator: z.ZodOptional<z.ZodBoolean>;
  loginAttemptsBeforeLockout: z.ZodOptional<z.ZodNumber>;
}> = z.object({
  isAdministrator: z.boolean().optional(),
  loginAttemptsBeforeLockout: z.number().int().min(1).optional(),
});

export type UserPolicyConfig = z.infer<typeof UserPolicyConfigType>;

export const UserConfigType: z.ZodObject<{
  name: z.ZodString;
  password: z.ZodOptional<z.ZodString>;
  passwordFile: z.ZodOptional<z.ZodString>;
  policy: z.ZodOptional<typeof UserPolicyConfigType>;
}> = z
  .object({
    name: z.string().min(1, "User name is required"),
    password: z.string().optional(),
    passwordFile: z.string().optional(),
    policy: UserPolicyConfigType.optional(),
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

export type UserConfig = z.infer<typeof UserConfigType>;

export const UserConfigListType: z.ZodArray<typeof UserConfigType> =
  z.array(UserConfigType);

export type UserConfigList = z.infer<typeof UserConfigListType>;
