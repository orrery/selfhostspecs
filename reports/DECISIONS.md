# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-07-24 — **Business direction: self-hosted requirements database** (owner-approved,
  12/20 post-verification, proceeded as best-of-sprint). Brand selfhostspecs.com. `docs/` is
  gitignored build output, CI builds+deploys from `data/` (schema test is the single contract).
  Repo made PUBLIC (owner call, trade-off surfaced). Launch gate installed (≥100 sourced
  entries — OPERATIONS.md; evidence: one-shot channel dynamics, LEARNINGS #7). Full sprint
  evidence archived in the bootstrap session.
- 2026-07-24 — **First full cycle shipped: 14 apps live.** Complete gate exercised end-to-end
  (harvest→verify→CI→QA BLOCK→fix→re-QA→deploy green); QA blocked once (4 SEV-2), re-QA
  blocked once — both now CI-enforced. GPU column deferred (schema-pacing). Verifier
  refutation rate 0/11 flagged for AUDIT #1 to red-team.
- 2026-07-26 — **ANALYZE this cycle stayed pre-launch/dataset-readiness framed, no traffic
  kills.** Evidence: repo 0 stars/0 forks/0 open issues, site 26 total hits (mostly operator
  checks) — OPERATIONS.md's pre-launch rule (readiness, not traffic, is the metric) applies
  cleanly; nothing meets any kill bar yet, nothing to kill.
- 2026-07-26 — **BUILD batch scoped down from 7 queued apps to 3 (Discourse, Zulip,
  Rocket.Chat) on a confirmed infrastructure constraint, not a judgment call.** Tested: Docker
  Hub API, ghcr.io registry API, and raw.githubusercontent.com are reachable from this cloud
  session; docs.portainer.io, learn.netdata.cloud, docs.joinpeertube.org, and vikunja.io are
  not (curl exit 56, both via WebFetch and direct Bash curl — connection-level block, not a
  tool limitation). Portainer/Netdata/PeerTube/Vikunja stay `queued`, unbuilt, for a local
  session or an owner-provisioned network allowlist (LEARNINGS #11, reconfirmed #18).
- 2026-07-26 — **Rocket.Chat's minimum-tier figure re-sourced live, not inherited from the
  FIND brief, and it had drifted:** brief said "1 core/1GB, ≤200 users/50 concurrent"; the
  live official table (a PNG embedded in otherwise-fetchable markdown, viewed directly) reads
  1 vCPU/2 GiB for a "Starter" tier at ≤25 concurrent users. Built on the live figure only.
- 2026-07-26 — **Independent verifier BLOCKED Zulip on first pass**: memcached (a real,
  confirmed-required compose.yaml service) had been omitted from deps rather than flagged, and
  `docker.source_url` cited compose.yaml for size/arches data that page doesn't contain. Fixed:
  added `memcached` to the deps enum (this batch's one schema change — GPU/community-figures
  stay queued) and re-pointed `docker.source_url` to the GHCR package page. Harvester≠verifier
  working exactly as designed — first pass caught a real gap before it reached QA.
- 2026-07-26 — **Discourse's Postgres/Redis classified as bundled (`service: none`), not
  external deps**, per Defect Class #12: the official all-in-one Docker image runs them via
  runit inside the same container (confirmed in discourse_docker's postgres template), same
  shape as Frigate's bundled ffmpeg. An advanced multi-container path exists but isn't the
  default/documented image this entry describes.
- 2026-07-26 — **Analytics-snapshot Action failure (2026-07-25, exit 22) flagged to owner**,
  not silently retried or worked around: cloud sessions can't reach the GoatCounter API to
  diagnose further (egress policy), and CI's two workflows don't cross-gate so the outage was
  invisible without checking Actions directly. Stats are 1 day stale as of this run.
- 2026-07-26 — **Independent QA BLOCKED the batch on first pass**: no fabricated/wrong figures
  (all sampled figures re-verified byte-accurate against live sources), but the "no external
  database" collection's fixed intro text ("no Postgres, no Redis... to feed and water") went
  false the moment Discourse joined with bundled-but-real Postgres/Redis. Fixed: reworded to
  "no separate container to run yourself" (build.mjs copy, not data). Also cleaned two QA nits:
  moved non-verbatim commentary out of Rocket.Chat's `quote` field into `scope`, and re-pointed
  Discourse's bundled-deps citation at discourse_docker's README (the actual bundling claim)
  instead of one template file. Rebuilt, full suite re-run green (38/38). All three entries
  marked `pending-second-qa` per the unattended-run rule — next run's fresh-eyes QA settles them.
- 2026-07-27 — **AUDIT #1: added a post-deploy smoke test to `ci.yml`** (curl the live Pages
  URL after `deploy-pages`, assert HTTP 200 + title marker, 5 retries). Evidence: this cloud
  session cannot reach `selfhostspecs.com` at all (proxy CONNECT 403, confirmed policy denial,
  not a site issue — an unrelated `orrery.github.io` control URL got the same block), so AUDIT's
  own mandated live-site check has been unexecutable from here since bootstrap; GH Actions
  runners have real internet and are the one place that can actually confirm a deploy is live.
  Also fixed a confirmed SEV-1: Vaultwarden's `docker.size_mb` had drifted 77→83 (rolling
  `latest` tag rebuilt after harvest) — pulled and corrected, LEARNINGS #27 flags that
  docker-size figures need AUDIT-cadence re-checks, not just the 90-day RAM/CPU sweep.
- 2026-07-30 — **Repo-integrity check: local `main` was 16 commits behind `origin/main`, not
  diverged.** Session started on a detached HEAD ahead of the stale local `main` ref; before
  assuming a fork, `git merge-base` confirmed origin/main was a direct descendant (a prior
  session had already pushed everything; origin had just moved one commit further). Fast-
  forwarded, nothing lost. Checking merge-base before treating divergence as real is now the
  standing move on session start (LEARNINGS).
- 2026-07-30 — **Re-QA settled Discourse/Zulip/Rocket.Chat to `live` (17 live).** Independent
  fresh-eyes QA found all three clean, including the four Defect Classes that batch tested
  positive for last cycle. One non-blocking fix: Discourse's `docker.size_mb` drifted
  1144→1173, same rolling-`latest`-tag pattern as the Vaultwarden SEV-1 (AUDIT #1) — corrected,
  plus Vaultwarden's own missing changelog entry from that fix (retroactively logged).
- 2026-07-30 — **BUILD drained the full verified queue: OpenProject, Plausible CE, Linkwarden,
  Open WebUI — independent verification found zero discrepancies on any of the four**, unlike
  the 07-26 batch. Landed `pending-qa` (unattended run, QA below settles to `pending-second-qa`).
  One enum addition: `meilisearch` in deps SERVICES for Linkwarden (sourced, same precedent as
  memcached — not counted against the one-schema-change pacing).
- 2026-07-30 — **Two real bugs fixed, not weakened checks:** `site-invariants.test.mjs` escaped
  `&`/`<` but not `>` in its quote-display check, so OpenProject's verbatim ">= 2ghz" quote
  false-failed CI against `build.mjs`'s own (fuller) escaping — test corrected to match. Index
  search compared names verbatim, so "rocket chat" missed "Rocket.Chat" — query and stored
  value now both strip non-alphanumeric characters first (caught by this run's QA agent).
- 2026-07-30 — **Independent QA cleared OpenProject/Plausible CE/Linkwarden/Open WebUI —
  zero defects across all 12 Known Defect Classes.** All four `pending-second-qa` (unattended-
  run rule); next run's fresh eyes settle them to live. One soft, non-blocking note for a
  future BUILD pass: Linkwarden's anecdotal 4GB figure renders under the same bold treatment
  as genuine "recommended" figures — fully disclosed by its quote/scope, not a defect under
  current page conventions, but a "reported" vs "recommended" visual distinction would be
  clearer. 21 apps tracked total (17 live, 4 pending-second-qa).
