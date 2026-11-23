# Release procedure

How to publish a specific version of the prototype and how to publish the same version again later. The release is the static `dist/` folder built from one Git commit on `main`. There is no server, database or environment variable.

Owner of releases and incidents: Dagmara Knesz. Hosting: **Netlify** (free plan), configured by [netlify.toml](../netlify.toml). Participants report problems on the AIPH3 course channel. Open items are tracked in [production-readiness.html](production-readiness.html).

## 1. Choose the version

1. Commit and push every change you want to release to `main`. Uncommitted or unpushed work is never part of a release.
2. Open the repository on GitHub → **Actions** → workflow **CI**. The run for that exact commit must be green (✓ Frontend quality). It runs `./scripts/verify`: formatting, design-system kit, lint, types, unit tests, participant packet, build and browser journeys.
3. Note the short commit ID (7 characters, e.g. `81682a8`). This ID is the version.

Until the repository normalizes line endings, `./scripts/verify` fails on a Windows checkout for formatting/hash reasons only. Use the green CI run as the required check.

## 2. Build settings (identical for every provider)

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| Branch            | `main`                         |
| Root directory    | repository root (empty)        |
| Install + build   | `npm ci && npm run build`      |
| Output directory  | `dist`                         |
| Node.js           | 24 (from `.nvmrc`)             |
| Environment vars  | none                           |
| Redirects/rewrite | none (routes use `/#/` hashes) |

Always let the provider build from the Git commit. Never upload a `dist/` folder built on your computer: it is not tied to a commit, and on Windows its text files differ byte-for-byte from the CI build because of CRLF line endings.

### Netlify (chosen provider)

- `netlify.toml` in the repository sets the build command (`npm ci && npm run build`) and publish directory (`dist`); Netlify reads Node 24 from `.nvmrc`. Do not override them in the Netlify UI.
- Free plan budget: 300 credits per month, hard limit, no charges. A production deploy costs 15 credits, bandwidth 20 credits/GB, requests 2 credits per 10,000. When credits run out the site is **paused** („Site not available”) until the next cycle.
- Estimate for up to 50 participants: a first visit downloads up to ~15 MB (mostly company logos); 50 people × 3 devices ≈ 2.3 GB ≈ 45 credits. Keep production deploys to **about 10 per month** (≈150 credits): every push to `main` deploys, so batch changes before pushing. Check **Team → Usage** before each release.

Other providers (if Netlify is replaced): Cloudflare Pages reads `.nvmrc` (use the same command/output). On Vercel the `engines` range (`>=24 <27`) maps to Node 26, which this project does not test — narrow it to `24.x` first.

## 3. Publish and record

1. Connect the provider to the GitHub repository once, with the settings above.
2. A push to `main` triggers a deployment. Open the provider's deployment list and confirm that the newest deployment shows the same commit ID as in step 1 and finished successfully.
3. Run the post-release check (section 5) before telling participants the address.
4. Add a row to the release log below, including the check result.

## 4. Publish an earlier version again

The build is deterministic: two clean builds of the same source produce byte-identical `dist/` files. To serve an earlier version, use the provider's option to publish/redeploy the existing deployment for that commit (find it by the commit ID in the release log). If that deployment no longer exists, trigger a new deployment of that commit from the provider; it yields the same files.

## 5. Post-release check (about 5 minutes)

Do it right after every deployment, before sharing the address. Use a **private/incognito window**: it starts with an empty browser save, exactly like a new participant, and leaves nothing behind. Replace `ADDRESS` with the deployment address. UI labels are quoted as they appear in the app.

1. **Right version.** In the provider's deployment list the live deployment shows the commit ID you chose in step 1.
2. **Secure address.** `https://ADDRESS` opens with the padlock icon; `http://ADDRESS` switches to `https://` by itself.
3. **Pages load.** The home page shows the job board. Open `https://ADDRESS/#/oferty`, open any offer, then press F5 on that offer: the same offer is shown again (direct links work).
4. **Candidate path.** Open `https://ADDRESS/#/auth/sign-in` → **Wejdź jako Anna Kowalska**. Open `https://ADDRESS/#/aplikuj/ai-product-manager`, type a short answer in **Dlaczego pasujesz do tej roli?**, tick the checkbox and click **Wyślij aplikację**. Expected: **Aplikacja została wysłana.** Press F5: the application is still listed under **Moje aplikacje**.
5. **Files are served.** As Anna open `https://ADDRESS/#/app/profil` → **Pobierz CV (PDF)**: a PDF opens.
6. **Employer path.** Open `https://ADDRESS/#/auth/sign-in` → **Wejdź jako Karolina Wiśniewska** → **Kandydaci** → **Anna Kowalska** → click **W przeglądzie**. Press F5: the stage is still „W przeglądzie”.
7. **No hidden errors.** Press F12 → **Console**: no red errors. In **Network**, reload the page: every request goes to `ADDRESS` only (the app uses no external services).
8. **Phone.** Open the address on a phone: the home page fits the screen and the menu opens.

### When to roll back

Restore the previous deployment immediately (provider: publish/redeploy the previous successful deployment) if any of these happens:

- the live deployment shows a different commit than intended;
- a blank page, a provider error page or a “not found” page on the home page or an offer;
- step 4 or 6 cannot be completed, or the result disappears after F5;
- red errors in the console or requests to other domains.

If this is the first release and there is no previous deployment, do not share the address; participants keep using `npm run dev` locally until a fixed version passes this check. Record a failed check in the release log with a one-line reason.

## 6. When something breaks

The site has no server or database: an incident is either one person's browser state, a bad deployment or a provider outage. Nothing on the host can lose participant data, because it lives only in each browser.

### Diagnose (2 minutes)

1. Open the address in a private window on your own device.
   - Works for you, fails for one participant → **A. One browser**.
   - Fails for you too → step 2.
2. Open the provider's deployment list.
   - The live deployment is newer than the last one that passed section 5, or it shows a failed build → **B. Bad deployment**.
   - The live deployment is the one that passed section 5 → step 3.
3. Open the provider's public status page (netlifystatus.com) and **Team → Usage** (a paused site means credits ran out — see section 2). An incident there, or the site does not respond at all → **C. Provider outage**. Otherwise treat it as **B** and roll back.

### A. One browser

Ask the participant to:

1. Click **Odśwież stronę** on the „Coś poszło nie tak” screen, or reload the page.
2. If it repeats: click **Pobierz kopię zapisu**, or open **Ustawienia → Eksportuj dane** (**Pobierz poprzedni zapis** when shown), and keep the file.
3. **Ustawienia → Resetuj scenariusz**, confirm, and continue. A valid exported scenario can be brought back with **Importuj dane** later.
4. Post on the course channel: the address, what they clicked just before the error and the browser name — never personal data.

### B. Bad deployment

1. Netlify → your site → **Deploys**. Click **Lock to stop auto publishing** so the next push cannot replace the restored version while you fix the problem.
2. In the deploy list, open the last deployment marked successful whose commit passed section 5 (see the release log) → **Publish Deploy**. This is instant and does not rebuild.
3. Run section 5 on the restored version.
4. Tell participants on the course channel (message below). Fix the problem in Git, wait for green CI, push, then **Unlock to start auto publishing** and run sections 3–5.
5. Saves are not affected by the host; a participant whose save came from the newer version may see the recovery screen in the older one — they download the original save and continue, or wait for the fixed release (see [architecture](architecture.md)).

### C. Provider outage

1. Tell participants to run the prototype locally: `npm ci`, then `npm run dev`, and open http://127.0.0.1:3001 ([participant guide](PARTICIPANT_GUIDE.md)). Local saves are separate from the hosted site's saves; exported files can be imported.
2. Check the status page again later; no action is needed on the site when the provider recovers. Run section 5 once it is back.

### Message to participants

> Strona prototypu DoRoboty.ai chwilowo nie działa poprawnie. Twoje dane w przeglądarce są bezpieczne — nic nie usuwaj. [B: Przywróciłam poprzednią wersję, odśwież stronę.] [C: Do czasu naprawy uruchom prototyp lokalnie: npm ci, a potem npm run dev.] Dam znać, gdy wszystko wróci do normy.

### Afterwards

Add a line to the release log (what happened, which case, how long, what fixed it). If the cause is in the code, add a regression test with the fix.

## 7. Scheduled: end of the AIPH3 course

Remove the E5 study texts approved only for the course ([SECURITY.md](SECURITY.md)): delete `src/features/prototype/data/e5-study.json` and its fixture wiring with tests/FEATURES.md updates, then release (sections 1–5).

## Release log

| Date | Commit | Provider deployment (ID or URL) | CI run | Post-release check | Released by |
| ---- | ------ | ------------------------------- | ------ | ------------------ | ----------- |
