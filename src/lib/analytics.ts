// Browser product analytics (PostHog, EU cloud).
// The project key is a public write-only ingestion key, safe to ship in the frontend.
// Override per environment with VITE_POSTHOG_KEY / VITE_POSTHOG_HOST.
const POSTHOG_KEY =
  import.meta.env.VITE_POSTHOG_KEY ?? "phc_whgKdZAXH52sWn4gAvLR44tUskp2w7CULPJLfMnUd5jF";
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST ?? "https://eu.i.posthog.com";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

// Analytics run only on a deployed site: never in local dev/preview or automated browsers,
// so `npm run dev` and the e2e "no external requests" checks stay offline.
export function shouldEnableAnalytics(hostname: string, automated: boolean): boolean {
  return Boolean(POSTHOG_KEY) && !automated && !LOCAL_HOSTS.has(hostname);
}

export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!shouldEnableAnalytics(window.location.hostname, navigator.webdriver)) return;
  // Loaded lazily so the library stays out of the main bundle.
  void import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        // Pageviews on history changes (covers HashRouter navigation) and click autocapture.
        defaults: "2025-05-24",
        person_profiles: "identified_only",
        // Session replay (also needs "Record user sessions" in the PostHog project settings).
        // All inputs are masked; elements with the `ph-no-capture` class (CVs, candidate data,
        // notes, profile) are blocked in replays and ignored by autocapture.
        session_recording: { maskAllInputs: true },
      });
    })
    .catch(() => {
      // Analytics are optional; a blocked or failed load must never affect the app.
    });
}
