import { describe, expect, it } from "vitest";
import { isNexoraBackendUrl } from "../apps/web/src/core/backendOrigin";

describe("Nexora backend URL isolation", () => {
  it("allows only the Nexora remote Supabase origin", () => {
    expect(isNexoraBackendUrl("https://cjqlldrxpiwldekxywwa.supabase.co")).toBe(true);
    expect(isNexoraBackendUrl("https://cjqlldrxpiwldekxywwa.supabase.co/")).toBe(true);
    expect(isNexoraBackendUrl("https://other-company.supabase.co")).toBe(false);
    expect(isNexoraBackendUrl("http://cjqlldrxpiwldekxywwa.supabase.co")).toBe(false);
    expect(isNexoraBackendUrl("https://cjqlldrxpiwldekxywwa.supabase.co.attacker.test")).toBe(false);
  });
  it("allows disposable loopback environments but not LAN/cloud targets", () => {
    expect(isNexoraBackendUrl("http://127.0.0.1:54321")).toBe(true);
    expect(isNexoraBackendUrl("http://localhost:54321/")).toBe(true);
    expect(isNexoraBackendUrl("http://192.168.100.100:54321")).toBe(false);
    expect(isNexoraBackendUrl("https://localhost:54321")).toBe(false);
  });
  it("rejects malformed, credential-bearing, and redirected endpoints", () => {
    expect(isNexoraBackendUrl(undefined)).toBe(false);
    expect(isNexoraBackendUrl("")).toBe(false);
    expect(isNexoraBackendUrl("not a url")).toBe(false);
    expect(isNexoraBackendUrl("https://cjqlldrxpiwldekxywwa.supabase.co/rest/v1")).toBe(false);
    expect(isNexoraBackendUrl("https://cjqlldrxpiwldekxywwa.supabase.co/?url=other")).toBe(false);
    expect(isNexoraBackendUrl("https://name:pass@cjqlldrxpiwldekxywwa.supabase.co")).toBe(false);
  });
});
