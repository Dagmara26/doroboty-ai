# Readiness fixes: Windows line endings, error screen, incident plan

Production-readiness items `windows-line-endings`, `observability-preparation` and `recovery-plan` (see docs/production-readiness.html).

## 1. Windows line endings

- Problem: no `.gitattributes`; Git for Windows (`core.autocrlf=true`) checked files out with CRLF. `format:check`, `design-system:check` (kit hashes) and `verify:packet` failed locally; CI on Linux passed.
- Change: `.gitattributes` with `* text=auto eol=lf`. The 194 text files in the Windows working copy were rewritten to LF in place (content otherwise unchanged; `git add -A` then shows only real changes). `docs/production-readiness.html` is generated, so it is listed in `.prettierignore`.
- Acceptance: on the working copy, all three checks pass; new clones get LF on every OS.

## 2. Unexpected rendering error

- Problem: an exception during rendering left a blank page; no recovery path.
- Change: `AppErrorBoundary` (src/features/prototype/error-boundary.tsx) wraps the whole app. Composition reuses the NotFound/Settings recipes: `prototype-section`, serif H1, existing Button variants, `flex flex-wrap gap-3` action row; no new tokens or styles. Heading receives focus (`outline-none`, as the shell's focus targets). Actions: reload, return home, download the raw browser save (only when present). Report guidance names the course lead; no data is sent or logged. FEATURES.md SYS-12 added.
- Acceptance: e2e „unexpected rendering error shows recovery steps…” simulates a throw in salary formatting, checks heading/focus/actions, no serious axe violations, download equals the stored save, save unchanged, no overflow at 390px, no external requests.

## 3. Incident plan

- Change: `docs/RELEASE.md` section 6 — 2-minute diagnosis (one browser / bad deployment / provider outage), steps for each, participant message in Polish, follow-up record. Owner named at the top.
- Open: provider-specific rollback clicks and a rollback trial depend on the provider choice (item `rollback`).

## Validation

Recorded in the readiness report evidence for this audit (format/design-system/packet/lint/types/unit/build/e2e under Node 24.22.3).

## 4. Decisions 2026-11-19 (Dagmara)

- E5 texts may be published for the duration of the AIPH3 course; exception recorded in docs/SECURITY.md, removal scheduled in docs/RELEASE.md section 7.
- Provider: Netlify (free plan). Added `netlify.toml`; RELEASE.md now has Netlify credit budget (≈10 production deploys/month for ≤50 participants) and exact rollback clicks (Lock auto publishing → Publish Deploy).
- Problem reports go to the AIPH3 course channel: wording on the error screen, a note in Settings → „O prototypie” (FEATURES SYS-05/SYS-12 updated).
