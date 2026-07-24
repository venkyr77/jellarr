import { describe, it, expect } from "vitest";
import { substituteEnvVars } from "../../src/lib/env-substitution";

describe("lib/env-substitution", () => {
  it("replaces a single ${VAR} with its value", () => {
    const env: Record<string, string> = { SECRET: "s3cr3t" };
    const out: string = substituteEnvVars("OidSecret: ${SECRET}", env);
    expect(out).toBe("OidSecret: s3cr3t");
  });

  it("replaces multiple and repeated vars", () => {
    const env: Record<string, string> = { A: "1", B: "2" };
    expect(substituteEnvVars("${A}-${B}-${A}", env)).toBe("1-2-1");
  });

  it("expands $$ to a literal $", () => {
    expect(substituteEnvVars("price is 5$$", {})).toBe("price is 5$");
  });

  it("treats $${VAR} as a literal ${VAR} (no expansion)", () => {
    const env: Record<string, string> = { VAR: "expanded" };
    expect(substituteEnvVars("$${VAR}", env)).toBe("${VAR}");
  });

  it("handles an expanded var adjacent to an escaped one", () => {
    const env: Record<string, string> = { A: "1", B: "2" };
    expect(substituteEnvVars("${A}$${B}", env)).toBe("1${B}");
  });

  it("throws naming the variable when undefined", () => {
    expect(() => substituteEnvVars("${MISSING}", {})).toThrowError(/MISSING/);
  });

  it("returns input unchanged when there is nothing to substitute", () => {
    expect(substituteEnvVars("plain: value with a lone $ sign", {})).toBe(
      "plain: value with a lone $ sign",
    );
  });

  it("defaults to process.env when env not provided", () => {
    process.env.JELLARR_TEST_VAR = "fromProcess";
    try {
      expect(substituteEnvVars("${JELLARR_TEST_VAR}")).toBe("fromProcess");
    } finally {
      delete process.env.JELLARR_TEST_VAR;
    }
  });
});
