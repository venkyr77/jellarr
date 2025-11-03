import { describe, it, expect, vi, type Mock } from "vitest";
import { makeClient } from "../../src/api/client";
import { type paths } from "../../generated/schema";
import type createClient from "openapi-fetch";

describe("api/client", () => {
  it("whenClientCreated_thenHeadersInjectedOnEachRequest()", async () => {
    // Arrange
    const spy: Mock = vi
      .spyOn(globalThis as unknown as { fetch: typeof fetch }, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

    try {
      // Act
      const jf: ReturnType<typeof createClient<paths>> = makeClient(
        "http://example:8096",
        "XYZ",
      );

      await jf.GET("/System/Info/Public");

      // Assert
      expect(spy).toHaveBeenCalledTimes(1);

      const req: Request = spy.mock.calls[0]?.[0] as Request;
      expect(req).toBeInstanceOf(Request);

      const h: Headers = req.headers;
      expect(h.get("X-Emby-Token")).toBe("XYZ");
      expect(h.get("X-Emby-Authorization")).toContain("jellarr");
    } finally {
      spy.mockRestore();
    }
  });
});
