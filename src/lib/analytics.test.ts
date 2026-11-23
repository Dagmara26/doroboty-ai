import { describe, expect, it } from "vitest";
import { shouldEnableAnalytics } from "./analytics";

describe("shouldEnableAnalytics", () => {
  it("is enabled on a deployed host", () => {
    expect(shouldEnableAnalytics("doroboty-ai-b2f3.netlify.app", false)).toBe(true);
  });
  it("is disabled locally and in automated browsers", () => {
    expect(shouldEnableAnalytics("127.0.0.1", false)).toBe(false);
    expect(shouldEnableAnalytics("localhost", false)).toBe(false);
    expect(shouldEnableAnalytics("doroboty-ai-b2f3.netlify.app", true)).toBe(false);
  });
});
