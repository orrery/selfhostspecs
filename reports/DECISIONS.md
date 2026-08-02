# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-07-24 — **Business direction: self-hosted requirements database** (owner-approved,
  12/20 post-verification). Brand selfhostspecs.com; `docs/` gitignored build output; schema
  test is the contract; repo PUBLIC (owner call); launch gate ≥100 sourced entries. Full sprint
  evidence in the bootstrap session.
- 2026-07-24 — **First full cycle: 14 apps live**, gate exercised end-to-end (harvest→verify→
  CI→QA BLOCK→fix→re-QA→deploy green); QA/re-QA each blocked once, both now CI-enforced.
- 2026-07-26 — **ANALYZE stayed pre-launch/readiness-framed**: 0 stars/forks/issues, 26 hits
  (operator checks) — no traffic kills, none meet any bar yet.
- 2026-07-26 — **BUILD scoped 7→3 queued apps** (Discourse/Zulip/Rocket.Chat) on a confirmed
  egress constraint: docs.portainer.io/learn.netdata.cloud/docs.joinpeertube.org/vikunja.io
  block (curl exit 56); raw.githubusercontent.com doesn't. Those four stayed queued.
- 2026-07-26 — **Rocket.Chat's min-tier re-sourced live, had drifted from the FIND brief**:
  brief said 1 core/1GB; live table (PNG in fetchable markdown) reads 1 vCPU/2GiB Starter tier,
  ≤25 concurrent. Built on the live figure only.
- 2026-07-26 — **Verifier BLOCKED Zulip first pass**: memcached omitted from deps,
  `docker.source_url` miscited. Fixed (memcached added to deps enum, source repointed) —
  harvester≠verifier caught a real gap before QA.
- 2026-07-26 — **Discourse's Postgres/Redis classified bundled** (`service: none`, Defect
  Class #12): official all-in-one image runs them via runit in the same container.
- 2026-07-26 — **Analytics-snapshot failure (exit 22) flagged to owner**, not silently
  retried: cloud sessions can't reach the GoatCounter API to diagnose (egress policy).
- 2026-07-26 — **QA BLOCKED batch first pass**: no wrong figures, but the "no external
  database" collection's intro text went false once Discourse joined with bundled-but-real
  Postgres/Redis. Reworded ("no separate container to run yourself"); two QA nits also fixed.
  Suite green (38/38); all three `pending-second-qa`.
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
- 2026-08-02 — **Fresh-eyes re-QA settled OpenProject to live; found 3 real defects on the
  rest, not zero this time.** OpenProject clean. Plausible CE/Linkwarden/Open WebUI all cited
  an unauthenticated `ghcr.io/v2/.../manifests/<tag>` URL as `docker.source_url` — 401s for any
  reader clicking it; new Known Defect Class #13, repointed all three to the browsable package
  page. Linkwarden's meilisearch was `required:false` citing a manual-install-only doc, while
  the actual compose file (already cited for postgresql) has it in `depends_on` — reclassified
  `required:true` (memcached/OpenProject precedent). Open WebUI's "none required" deps entry
  cited a compose file that itself defines an `ollama` service — self-contradicting; repointed
  to the README's OpenAI-only docker-run block, the real zero-dependency evidence. Fixed,
  rebuilt, 45/45 green, kept `pending-second-qa` for the three fixed entries per the
  unattended-run rule (only OpenProject moved to live). DECISIONS/LEARNINGS compacted to stay
  under budget.
