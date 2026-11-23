# E5 — candidate own-work card on the employer candidate list

## Intent

Week-3 AIPH3 prototype for Dagmara's Supersprint decision D1 (confirmed 2026-11-18): opportunity O1 → idea I7 → test E5.

- **Problem (O1):** a recruiter without technical background cannot tell, before an interview, what a candidate did personally in an AI project and with what result, so she invites people who merely described themselves well.
- **Signal:** June 2026 cohort — candidates whose material shows the result of their own work continue after the first conversation in 40% of cases vs 14% for conceptual material (observation, S6); Match Score correlation with continuation fell to −0.04 (K3, R1). Recruiters F1, F3, F4 say they cannot check this (declarations).
- **User:** employer recruiter (persona Karolina Wiśniewska, BrightLabs).
- **Task under test:** from 12 applications to one job, choose 4 to invite to a first conversation; defer the rest.
- **Prototype works when:** with the card, more chosen people are ones who continued in the data than without it; the recruiter justifies choices by own contribution and result rather than the score; the task is completed without asking what the card means. No numeric thresholds — evaluation belongs to Dagmara.

## Scope

1. Fixture: 12 hidden candidate persons and their submitted applications (Apply set A01–A12 from the E2 prototype) to BrightLabs “AI Operations Specialist”. Each application carries an optional `ownWork` card: area, what I did myself, what others did, result and how I know, material type and availability note.
2. Employer list `/#/app/kandydaci`: job filter, decision counters, own-work card on each row, one-click **Zaproś na rozmowę** and **Odłóż** actions; list order stays stable.
3. New recruiting stage `deferred` (“Odłożony”): non-terminal; employer can invite or reject later. Employers may invite directly from submitted/reviewed.
4. Employer detail shows the same card above the answer.
5. Settings: moderator switch “Karta własnej pracy” (on/off) persisted in local state, for the two E5 arms.
6. Hidden fixture persons are not offered in the person picker.

Out of scope: candidate-side form for the card (idea I7 step 1), assistant-scope highlighting, ranking (I8), any claim about repeat purchase (E4).

## Card content rule (prepared, not AI-generated live)

Card sentences are copied verbatim from each candidate's own profile/portfolio text in the E2 prototype (`experiments/E2/prototyp-lista-kandydatow.html`, anonymized June applications). Nothing is added: when a candidate did not describe others' work or a result, the card says so (“Nie opisano w zgłoszeniu”). The E2 material label (“Pokazuje rezultat…”) and the continuation key are not shown. Material links were removed during anonymization and are shown as such.

Deviation from D1's first step: D1 proposed building cards from `application_answer_raw` and `portfolio_raw` in `applications.csv`. E2 candidates carry no source application IDs, so the cards use E2's profile/portfolio texts instead. Record this in the course write-up.

## Design and reuse

Compose existing roles: `prototype-panel` outlined surface, Geist Serif headings, MatchScore, shared Button variants, FormSelect, Notice. The card is a definition list inside the row (no nested card family), labelled with sans small caps-free 14px labels per workspace typography. No new colors.

## Acceptance criteria

- Karolina sees 12 E5 applications after reset; filtering to AI Operations Specialist shows exactly those 12 in A01–A12 order.
- Each row shows name, stage, Match Score and (when enabled) the three card statements plus material; missing statements are explicit.
- Zaproś moves to “Zaproszenie na rozmowę”; Odłóż moves to “Odłożony” and the row keeps its place (changed 2026-11-18 after Dagmara's dry run: re-sorting moved the page away from the reading position); deferred rows still offer Zaproś. Counters update; focus moves to the row status; a live region announces the change.
- Switch off → no card on list or detail; everything else unchanged.
- Existing saves without the new fields still load; import/export round-trips.
- Hidden persons are absent from the person picker. Existing journeys pass.
- `./scripts/verify` runs; FEATURES.md updated.

## Validation and review

- `./scripts/verify` passed under Node 24.22.3 (cloud workspace): formatting, design-system kit check, lint, types, 30 unit tests (3 new: E5 fixture/verbatim card statements, invite/defer transitions incl. other-company rejection, setting toggle and legacy-save default), participant packet, static build, 35 Chromium journeys (1 new E5 journey: filter, 12 cards, defer keeps position, invite from deferred, status focus, switch hides card on detail, hidden persons absent from picker).
- Browser inspection at 1280px and 390px: no horizontal overflow, no console errors; card reads as one divided block inside the existing outlined row; detail shows the card above the answer and omits the empty summary section.
- Review notes: a deferred stage is visible to the candidate as “Odłożony” in candidate views (only relevant for Anna/Marek; study candidates are not selectable). Direct invite from “submitted” is an intentional shortcut for the test task. Human sessions (E5) have not been run; no results.
