# DECISIONS archive (2026-07-24 through 2026-08-09)

Full text of decisions older than ~2 weeks, moved out of `reports/DECISIONS.md` to hold the
byte budget (same compaction pattern as LEARNINGS/backlog — see LEARNINGS #62). One-line
summaries remain inline in DECISIONS.md for cadence-gap scanning; full detail here.

- 2026-07-24 — **Business direction approved** (self-hosted requirements DB, 12/20
  post-verification); brand selfhostspecs.com, `docs/` gitignored build output, schema test is
  the contract, repo PUBLIC (owner call), launch gate ≥100 sourced entries. First full cycle
  shipped 14 apps live, gate exercised end-to-end (harvest→verify→CI→QA block→fix→re-QA→deploy).
- 2026-07-26 — **ANALYZE pre-launch** (0 stars, 26 hits, no kills). BUILD scoped 7→3 apps on
  confirmed egress block (docs domains 403; raw-mirrors ok). Rocket.Chat re-sourced live tier;
  Zulip verifier-blocked first pass (missing memcached dep, fixed); Discourse Postgres/Redis
  classified bundled (runit, same container); analytics-snapshot exit-22 flagged to owner.
- 2026-07-27 — **AUDIT #1:** fixed SEV-1 Vaultwarden docker-size drift (77→83, rolling `latest`
  tag). Added CI post-deploy smoke test — this cloud session can't reach
  selfhostspecs.com/goatcounter.com at all (proxy 403, confirmed policy-level not a site issue).
- 2026-07-30 — **Repo-integrity:** local `main` 16 commits behind `origin/main` (detached-HEAD
  session start), ff-merged, nothing lost — standing move on every session start since. Re-QA
  settled Discourse/Zulip/Rocket.Chat to live (17 live); Discourse docker-size drifted
  (1144→1173), fixed. Drained queue: OpenProject/Plausible CE/Linkwarden/Open WebUI, zero
  defects, all `pending-second-qa`; `meilisearch` added to deps enum; fixed quote-escape test
  gap and a search punctuation mismatch.
- 2026-08-02 — **Fresh-eyes re-QA settled OpenProject live; found 3 real defects on the rest.**
  Plausible CE/Linkwarden/Open WebUI cited an unauthenticated `ghcr.io/v2/.../manifests/<tag>`
  as `docker.source_url` (401s) — new Defect Class #13, repointed to the package page.
  Linkwarden's meilisearch mis-scoped `required:false`; Open WebUI's "none required" deps cited
  a compose file that itself defines `ollama` — both fixed. 45/45 green, only OpenProject moved
  to live (unattended-run rule).
- 2026-08-03 — **AUDIT #2:** 2 more docker-size drifts fixed (Discourse 1173→1144, Immich
  761→763); real defect found+fixed (no favicon anywhere since bootstrap, now CI-enforced);
  cadence gap found (`specs-find` no commit 07-28, flagged, cause unknown). Red-teamed the
  07-30 same-run QA pass: cleared 4 apps on all 12 classes, but the later cross-session QA
  (08-02) found real defects on 3 of 4 — same-session "independent" QA buys little; tracking
  first-pass-QA miss rate (LEARNINGS #42). 45/45 green.
- 2026-08-09 — **Session-start recovery:** local `main` 1 commit behind `origin/main` (stale
  ref, detached-HEAD carryover) — `merge-base` confirmed no loss, ff-merged (LEARNINGS #32/#39).
- 2026-08-09 — **Cadence gap, 2nd+3rd occurrences:** `specs-find` no commit 08-04 (1st was
  07-28); `specs-loop` Wed 08-05 slot produced nothing, `2026-31.md` left mid-write. No run
  history exposed to root-cause from this session — flagged to owner as a pattern (LEARNINGS #44).
- 2026-08-09 — **FIND #16: session-start recovery, then Sentry+PostHog refuted for queuing.**
  Local `main` was again 9 commits behind `origin/main` (detached HEAD from the prior
  ANALYZE+BUILD session); `merge-base` confirmed pure fast-forward, ff-merged, nothing lost —
  same recurring pattern as 08-09's earlier recovery, now three sessions running (LEARNINGS
  #32/#39 lineage). Mined two new coverage-gap candidates (Sentry self-hosted 9.5k★, PostHog
  self-hosted 37.6k★) — both had strong official RAM sourcing but an independent verifier
  refuted both for queuing on Effort: 64- and 47-service docker-compose stacks, SERVICES enum
  gaps (kafka/zookeeper/opensearch/temporal), Sentry lacking a pull-and-run image. Moved to
  `Held` with reasons, not queued; enum gap flagged as a recurring cross-candidate blocker
  (LEARNINGS #45/#46). backlog/opportunities.md compacted to fit the 10000-byte budget after
  the additions (9992 final).
