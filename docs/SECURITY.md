# Prototype data boundary

This static frontend has no trusted server or real authentication. Role-specific UI and local transition checks organize the scenario; anyone using the browser can inspect all stored data. Use synthetic data only.

No API keys, credentials, real CVs or private material belong in frontend source, JSON, localStorage or exports. Exports include private-in-the-UI source/recruiter notes.

Render imported text through React text nodes, validate imports with shared Zod schemas, reject unsupported versions, duplicate IDs, broken references and oversized files. Never overwrite an unreadable save automatically.

## Approved exception: E5 study texts

`src/features/prototype/data/e5-study.json` contains 12 anonymized candidate texts from June 2026 applications (study E5), shipped in the public static build. Dagmara Knesz approved their publication on 2026-11-19 for the duration of the AIPH3 course. Purpose: the E5 recruiter test of the own-work card. Retention: remove the file and its fixture wiring when the course ends, then release a new version ([RELEASE.md](RELEASE.md), section 7). Any other real data still requires a separate decision.
