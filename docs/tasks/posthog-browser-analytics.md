# PostHog browser analytics

## Intent

Collect browser events (pageviews, clicks) from the deployed prototype in PostHog (EU cloud, project 365126) to observe how participants use it.

## Change

- Dependency `posthog-js` added (package.json, package-lock.json regenerated with npm 11 so `npm ci` on Netlify stays in sync).
- `src/lib/analytics.ts`: `initAnalytics()` called once from `src/main.tsx` before render. Library is loaded via dynamic import (separate chunk). Config: `api_host` https://eu.i.posthog.com, `defaults: "2025-05-24"` (pageviews on history change, so HashRouter navigation is tracked; click autocapture), `person_profiles: "identified_only"`, session replay with `maskAllInputs: true` (initially disabled; enabled in the follow-up below).
- Key and host can be overridden with `VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST`; the default is the public project ingestion key (not a secret).
- Disabled on localhost/127.0.0.1/[::1] and when `navigator.webdriver` is true, so `npm run dev`, `npm run preview` and the e2e "no external requests" assertions are unaffected.
- FEATURES.md SYS-03, OPS-11 and the limits paragraph updated.

## Acceptance

- Unit test `src/lib/analytics.test.ts` covers the enable/disable rule.
- After a Netlify deploy, visiting https://doroboty-ai-b2f3.netlify.app produces `$pageview` events in PostHog Activity; navigating between hash routes produces further pageviews.

## Open

- The privacy page (`/#/polityka-prywatnosci`, PUB-09) still says there is no real data processing; its Polish wording should mention anonymous usage analytics before participants use the deployed site.
- Full `./scripts/verify` must be run locally (only the new files were type-checked, unit-tested and formatted in isolation).

## Follow-up: autocapture privacy and session replay

- Autocapture: enabled in code (`defaults`) and in PostHog project settings (Autocapture → web, checked 2026-11-23). Default data attribute `data-attr`.
- Test target: home „Zobacz oferty” link, `data-attr="home-see-offers"`. On the deployed site, click it and look for an `$autocapture` event in PostHog Activity.
- Privacy: `ph-no-capture` (ignored by autocapture, blocked in replays) on the shared Input and Textarea primitives, CvAttachment, RecordSheet attachment/reading panels/children (notes), application record header, candidate list cards, workspace applications list, profile preview and form, applying-as name, welcome name, shell identity block and name link. Persona picker stays capturable (fixed synthetic personas, useful for analysis).
- Session replay: `session_recording: { maskAllInputs: true }` in code; project setting „Record user sessions” must be on.
- Validation (cloud copy, Node 22): `tsc --noEmit`, `eslint --max-warnings=0 src`, `vitest run` (32 tests) and `prettier --check src` pass. Build and e2e were not run (design-system assets not staged); run `./scripts/verify` locally.
