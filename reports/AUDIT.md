# AUDIT log

Weekly adversarial audit findings, newest first, ranked by severity. An empty audit must say
what it tried and failed to break. First audit due after the first full loop cycle.

## 2026-08-10 — AUDIT #3

**Mechanical.** 45/45 green before and after fixes. `CI & Deploy` green at HEAD (`d93da74`,
2026-08-09T23:36Z) incl. post-deploy smoke test. Session-start: local `main` ref was stale
(`92a6080` vs. origin `d93da74`); `merge-base` confirmed pure fast-forward, re-synced, nothing
lost — same recurring shape as prior sessions (LEARNINGS #32/#39 lineage), now just a stale
local ref rather than a multi-commit gap. `selfhostspecs.com`/standalone docs domains still
403 at the proxy level from this sandbox — confirmed via curl, unchanged since every prior audit.

**Data audit.** Re-fetched 5 GitHub-hosted RAM/CPU figures (OpenProject, Plausible CE,
Discourse, Zulip, Rocket.Chat) — all verbatim-clean on quote/value/unit/scope. Rocket.Chat's
figure lives in a table rendered as an image; downloaded and viewed all 3 source images
pixel-for-pixel — exact match. Standalone-docs-hosted figures (gitea, home-assistant, immich,
jellyfin, frigate, grafana, nextcloud, pi-hole) unreachable from sandbox, as always.

**SEV-1 — 4 docker-size drifts, fixed.** All 24 live/pending apps re-checked (Docker Hub + GHCR
APIs): Discourse 1144→1164 (rebuilt 1.5h before this check — **4th** occurrence of this exact
field drifting: Vaultwarden AUDIT #1, Discourse 07-30, Discourse AUDIT #2, Discourse now — this
specific image rebuilds unusually often, not just generic rolling-tag noise); n8n 363→362 and
Rocket.Chat 295→296 (both first-ever drift for these fields); Home Assistant 594→590 (first
drift). 20/24 matched exactly. Changelog entries added for all 4.

**SEV-2 — citation defect found+fixed+CI-enforced (new instance of Defect Class #13's shape).**
10 of 24 apps' `docker.source_url` pointed at `hub.docker.com/v2/repositories/.../tags/<tag>` —
confirmed via curl (`content-type: application/json`) this is a raw API response, not a
citation page, same shape as #13's ghcr issue minus the 401 wall. Present since bootstrap
(07-24), missed by 2 prior audits. Repointed all 10 to the browsable `hub.docker.com/r/<ns>/
<repo>` page (confirmed 200/HTML). **Added permanent CI enforcement:** schema test now rejects
any `docker.source_url` containing `/v2/`, closing this shape for both registries for good
instead of relying on audit judgment each time.

**Staleness sweep.** Oldest retrieved date across all apps: 17 days (adguard-home docker,
07-24). Nothing within 90 days of the threshold. Nothing queued.

**Hostile pass.** Live site unreachable (as always) — served `docs/` on localhost, drove with
the pre-installed Node Playwright (`/opt/pw-browsers/chromium`): 320px viewport (no horizontal
overflow, index + app page), zero-result search, 5 URL-tamper payloads (script-in-path, path
traversal, nonexistent app, script-in-query, negative-value query param — none reflected
unescaped, no crashes, correct 404s), JS-disabled fallback (content still renders).
**Found a real regression: AUDIT #2's favicon fix was incomplete.** It added
`<link rel="icon" href="data:...">` (satisfies the CI text-presence check) but never wrote an
actual `docs/favicon.ico` file — Chromium's automatic `GET /favicon.ico` (independent of the
`<link>` tag) still 404'd, live in production since AUDIT #2 shipped it as "fixed." Root cause:
the CI check tested for the tag's presence, not the browser behavior it existed to prevent.
Fixed: `build.mjs` now generates a real 16×16 32bpp `favicon.ico` (hand-rolled encoder, zero
deps, brand colors) into `docs/`; added a second CI assertion (`existsSync(docs/favicon.ico)`)
so a tag-only fix can't pass again. Verified via Playwright network capture: 404→200.

**Process audit.** Cadence: no *new* gaps this week — `specs-find` fired daily except the
already-flagged 08-04; `specs-loop` fired its Sun 08-09 slot but the already-flagged Wed 08-05
gap is still unexplained; `specs-audit` fires today, on schedule. 3 gaps across 2 routines over
3 weeks, zero root-cause progress (`list_triggers` still exposes no run history) — repeating
LEARNINGS #44's ask rather than re-discovering it. Ledger $11, matches Infrastructure section.
Backlog (20 live, 4 pending-second-qa) matches `data/apps/*.json` exactly. `git log -- tests/`
since AUDIT #2: zero changes before this run's two additions (both new assertions, not
weakenings). LEARNINGS #42 correctly applied 08-09: Chatwoot/Seafile/Mattermost stayed
`pending-second-qa` after passing verification+QA in the *same* run, not promoted to live.

**Red-team the week's biggest decision** (FIND #16 holding Sentry 9.5k★ + PostHog 37.6k★ on
Effort despite strong official RAM sourcing): defensible — a 64-service compose stack is
materially costlier to verify/maintain than anything live today, and the SERVICES enum gap is
real. But Effort was scored by the same verifier that refuted the candidates, with no check on
whether extending the enum now is cheaper than holding indefinitely — deferring it again risks
the repeated-non-decision pattern AUDIT #1 already criticized once (the egress-block ask).
Recommend FIND #17 extends the enum or makes an explicit owner ask, not a third silent hold.

**Missing invariant.** This week's favicon finding is an instance of a broader gap: CI checks
HTML markers/text presence rather than the literal browser-observable behavior they exist to
prevent. Closed the specific instance. Still open: no systemic sweep of other browser-auto-
requested well-known paths beyond favicon.ico — none identified as broken this pass, but the
"marker exists ≠ behavior fixed" bug class could recur elsewhere untested.

**Evidence:** 45/45 before and after; commits fix 4 docker-size drifts + changelog entries,
repoint 10 `docker.source_url` citations off the API-endpoint defect + add permanent CI
enforcement, generate a real favicon.ico + add CI enforcement, re-sync local `main`, log this
entry.

## 2026-08-03 — AUDIT #2 (compacted)
SEV-1 Discourse docker-size drift fixed (1173→1144, 3rd occurrence — see AUDIT #3, now 4th).
SEV-2 Immich drift fixed (761→763). Found+fixed missing favicon `<link rel="icon">` + CI check
— **AUDIT #3 found this fix was incomplete** (tag present, but literal `/favicon.ico` still
404'd; now genuinely fixed). Cadence gap found (`specs-find` no commit 07-28). Red-teamed the
07-30 same-run QA pass: later cross-session re-QA caught defects the same-session pass missed
(LEARNINGS #42). 45/45 green before/after.

## 2026-07-27 — AUDIT #1 (compacted)
SEV-1 Vaultwarden docker-size drift fixed (77→83, rolling `latest` tag — first instance of the
pattern later recurring on Discourse). SEV-2: sandbox cannot reach selfhostspecs.com or any
standalone docs domain at all (proxy 403) — added a CI post-deploy smoke test as mitigation. No
cadence gaps found (all 3 routines on schedule this first week). 38/38 green before/after.
