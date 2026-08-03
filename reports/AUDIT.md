# AUDIT log

Weekly adversarial audit findings, newest first, ranked by severity. An empty audit must say
what it tried and failed to break. First audit due after the first full loop cycle.

## 2026-08-03 — AUDIT #2

**Mechanical.** 45/45 green before and after fixes. `CI & Deploy` green at HEAD (`383555f`,
2026-08-02T23:33Z) incl. post-deploy smoke test — `selfhostspecs.com` still 403s at the proxy
level from here (re-confirmed via curl + WebFetch, same as AUDIT #1).

**SEV-1 — drifted figure, fixed.** Discourse `docker.size_mb` (1173, set 07-30) drifted again —
`latest` tag rebuilt this morning (`tag_last_pushed` 2026-08-03T08:22Z), amd64 now
1143.77MiB → corrected to 1144. Third occurrence of this exact shape on this field
(Vaultwarden AUDIT #1, Discourse 07-30, Discourse again now).

**SEV-2 — second drift, fixed.** Immich `docker.size_mb` (761, 07-24) is 762.57MiB on re-fetch
→ corrected to 763 (2MB/0.26%, same rolling-tag cause). Changelog entries added for both.

**Data audit.** Re-fetched, verbatim-clean: Discourse ram_min/cpu_min/cpu_rec, OpenProject
ram_min/cpu_min, Zulip ram_min/cpu_min — 7 fields/3 apps, quote/value/unit/scope/min-vs-rec all
correct. Docker sizes re-checked for **all 18 live apps** (Docker Hub + GHCR APIs) — 16 matched,
2 drifted (above). Standalone docs domains (gitea/grafana/home-assistant/nextcloud/frigate/
jellyfin/pi-hole/immich) still unreachable from this sandbox, unchanged from every prior audit.

**Staleness sweep.** Nothing crosses 90 days (oldest 2026-07-24, 10 days old). None queued.

**Hostile pass — executed for the first time.** `selfhostspecs.com` unreachable, so served the
actual `docs/` build on localhost and drove it with the pre-installed `playwright`/Chromium:
320px viewport, zero-result search, 5 URL-tamper payloads (script injection, negative values,
path traversal, nonexistent app — none reflected unescaped, no JS errors), JS-disabled fallback,
collection + app page at 320px. **Found and fixed one real defect:** no `<link rel="icon">` /
no favicon.ico anywhere — every browser 404'd on it since bootstrap (confirmed via CDP network
capture). Added an inline SVG favicon to `build.mjs` + a new CI invariant (`rel="icon"` check in
site-invariants.test.mjs) so it can't regress. Remaining failure (GoatCounter script) is this
sandbox's proxy blocking `gc.zgo.at`, not a live defect.

**Process audit.** LEARNINGS #37–41 all changed downstream behavior (git-clone technique reused
run #10, archive-check applied to MinIO, depends_on-scoping applied to Linkwarden, Defect Class
#13 applied to 3 citations); compacted #32–34/37–38 to one-liners for budget. Ledger $11, matches
Infra section, no unlogged spend. Backlog matches `data/apps/*.json` exactly (18 live, 3
pending-second-qa, 3 pending-verification), truthful. `git log -- tests/` since AUDIT #1: one
change (07-30 `>=`-escape fix), a real fix not a weakening. **Cadence gap found:** `specs-find`
commit exists every day 07-24→07-27 and 07-29→08-02 but **not 07-28** — that day's GH-Actions
stats-snapshot (separate system) ran, masking it visually. `list_triggers` exposes only
`last_fired_at`, not history, so this can't be root-caused here — flagged to owner as an open
question (routine error vs. silent no-op vs. genuine skip). LEARNINGS #43.

**Red-team the week's biggest decision** (shipping 4 apps `pending-second-qa` off a same-run QA
pass that found zero defects, 07-30): the safety net worked as designed — the later, different-
day QA pass caught what the first missed. But "zero defects, 12 classes checked" was wrong on
3 of 4 apps despite a nominally independent agent, so same-session identity separation alone
isn't buying much. Cheaper fix: never let BUILD and first-QA share a run, making the gap that
actually caught the defects (time + fresh context) structural, not incidental. LEARNINGS #42.

**Missing invariant, closed this run:** favicon link (above). **Still missing:** nothing
automated catches a routine silently skipping a day — needs run-history data this sandbox
lacks; flagged to owner rather than guessed at.

**Evidence:** 45/45 before and after; commits fix Discourse/Immich drift + changelog, add
favicon (build.mjs + CI invariant), extend LEARNINGS, log this entry.

## 2026-07-27 — AUDIT #1

**Mechanical.** 38/38 green. `CI & Deploy` green at HEAD (`f3e3407`, run 16).

**SEV-1, fixed.** Vaultwarden `docker.size_mb` 77→83 (rolling `latest` tag rebuilt after
harvest, not fabrication). Docker sizes were only on the 90-day sweep, not re-checked per-AUDIT
— gap logged (LEARNINGS #27). Sampled 9 other docker images (all matched) and tried 11 RAM/CPU
figures across 8 apps — could not re-fetch any; see next finding.

**SEV-2.** This sandbox cannot reach any standalone docs domain, nor
`selfhostspecs.com`/`goatcounter.com` themselves — confirmed policy-level 403 via
`/__agentproxy/status`, not a tool bug; only GitHub-hosted infra + Docker Hub/GHCR APIs work.
Live-site check and hostile pass impossible from here, every week. Mitigation: added a
post-deploy smoke test to `ci.yml` (GH Actions runners have real internet) — closes the
"deploy reachable" half, not the hostile/UX half. Flagged to owner (LEARNINGS #28).

**Staleness sweep.** Nothing crosses 90 days (oldest 3 days old). Nothing queued.

**Hostile pass.** Not executable this cycle — see SEV-2. Tried direct curl/WebFetch to
`selfhostspecs.com` and an unrelated GitHub Pages site as a control (same 403, confirming the
block is sandbox-side). Zero-result filters/URL tampering/320px/non-Chromium untested; local
`docs/` build passes all site-invariant tests, the only signal available. (Closed AUDIT #2: a
locally-served `docs/` build + pre-installed Playwright makes this pass executable after all.)

**Process audit.**
- LEARNINGS mostly changed behavior this week (memcached enum, quote/scope separation,
  collection-copy rewording, raw-fetch-for-scope-critical-phrases all shipped). One exception:
  the Analytics-snapshot failure (LEARNINGS #22) was flagged 2026-07-25 and failed *again*
  2026-07-26 with no different handling — a flag that doesn't change the next occurrence isn't
  done yet. Escalated concretely this run (see LEARNINGS #22 update).
- Budget ledger: $11 total, matches Infrastructure section, no unlogged spend found.
- Backlog (`backlog/opportunities.md`) cross-checked against `data/apps/*.json` — statuses
  match exactly: 14 `live`, 3 `pending-second-qa` (Discourse, Zulip, Rocket.Chat), 2
  verifier-signed queued-buildable (OpenProject, Plausible CE), 4 egress-blocked
  (Portainer, Netdata, PeerTube, Vikunja). No dishonest or stale status found.
- Cadence (DECISIONS.md + commit timestamps): `specs-find` fired daily 2026-07-24/25/26 (~23:2x
  UTC each day, on schedule). `specs-loop` fired Sunday 2026-07-26 08:56–09:02 UTC (on the
  Wed/Sun 08:41 schedule; next due Wed 2026-07-29). `specs-audit` — this is its first firing
  (Monday 2026-07-27, on schedule). No missed runs found.

**Red-team the week's biggest decision** (BUILD scoped 7→3 apps on a confirmed egress
constraint): the technical call was sound — the block was tested directly, not assumed, both
via WebFetch and raw curl. But three days and two more FIND cycles have re-confirmed the same
4 apps blocked without ever turning it into a concrete owner ask (e.g. "allowlist these 4
domains, or should I run a BUILD from a local session?"). The cheaper alternative to
re-discovering the block every cycle is one owner round-trip that resolves it once. Repeating
that pattern on the still-deferred GPU/community-figures columns risks the same silent-stall
shape OPERATIONS.md §4's "rolling expansion" is meant to prevent. Recommend: next FIND run
converts this into an explicit owner ask instead of a fourth silent re-confirmation.

**Missing invariant.** The suite has no check that a *deployed* page is reachable — every test
runs against the local `docs/` build, which is necessary but not sufficient (a Pages
misconfiguration, DNS lapse, or CDN issue downstream of a green build would be invisible to
CI and, per the SEV-2 finding above, invisible to this AUDIT too). Fixed this run: `ci.yml`'s
`deploy` job now smoke-tests the live URL after `deploy-pages` (5 retries, checks HTTP 200 +
title marker). This is a real gap that stayed open through 16 green deploy runs before anyone
checked whether the deployed site was actually reachable end-to-end.

**Evidence:** tests 38/38 pass before and after fixes; commit(s) this run fix Vaultwarden's
docker size, add the CI smoke test, and log LEARNINGS #27/#28.
