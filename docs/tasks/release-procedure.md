# Release procedure for a specific version

## Intent

Production-readiness item `repeatable-release` failed: CI verified the code but nothing described how to publish a specific commit, which build settings to use or how to identify and republish a version. Hosting will be a static provider (Netlify, Vercel or Cloudflare Pages; not chosen yet).

## Scope

- Add `docs/RELEASE.md`: version selection (pushed commit on `main` + green CI), provider-neutral build settings, provider-specific Node.js notes, deployment confirmation by commit ID, republishing an earlier version and a release log.
- Out of scope: post-release smoke check, rollback trial, incident plan, line-ending normalization, provider configuration files — separate readiness items.

## Acceptance criteria

- A person can publish a chosen commit with the documented settings and later tell which commit is live.
- Build settings match the scripts (`npm ci`, `npm run build`, `dist`, Node 24 from `.nvmrc`).
- Provider notes reflect current provider documentation (checked 2026-11-18).

## Validation

- Two clean `npm run build` runs (Node 24.22.3) of the same working tree produced identical `dist/` hashes; a CRLF (Windows) and LF checkout of the same content differ only in copied text assets (`index.html`, `case/baseline.csv`, `cv/README.md`, `icon.svg`), not in the JavaScript bundle — hence "never upload a local dist/".
- FEATURES.md reviewed: no product behavior change, no update needed.

## Follow-up: post-release check (2026-11-18)

Readiness item `smoke-plan` failed: no post-release check or rollback condition existed. Added section 5 to `docs/RELEASE.md` (8 steps in a private window: commit ID, HTTPS, deep link, candidate submission + reload, PDF asset, employer stage + reload, console/network, phone) with explicit rollback conditions and a check column in the release log. Rollback steps themselves remain a separate item.

Validation: the steps were dry-run with Playwright against `vite preview` of the current build — every quoted label exists, the application and stage survive reload, the CV PDF returns `application/pdf`, no console errors or external requests, no horizontal overflow at 390px. FEATURES.md reviewed: no behavior change.
