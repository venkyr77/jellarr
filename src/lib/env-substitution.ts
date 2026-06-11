/**
 * Expand `${VAR}` references in a raw config string from the given environment.
 *
 * Runs on the raw text before YAML parsing, so it applies to any value at any
 * nesting depth. `$$` is an escape for a literal `$`; therefore `$${VAR}`
 * produces the literal `${VAR}` rather than expanding it. An undefined variable
 * is a hard error so missing secrets fail loudly instead of silently emptying.
 */
export function substituteEnvVars(
  raw: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return raw.replace(/\$\$|\$\{(\w+)\}/g, (match: string, name?: string) => {
    if (match === "$$") return "$";
    const varName: string = name as string;
    const value: string | undefined = env[varName];
    if (value === undefined) {
      throw new Error(`Undefined environment variable in config: ${varName}`);
    }
    return value;
  });
}
