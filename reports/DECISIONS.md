# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

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
- 2026-08-10 — **AUDIT #3:** 4 docker-size drifts fixed (Discourse 1144→1164 — 4th occurrence
  on this field specifically; n8n 363→362; Rocket.Chat 295→296; Home Assistant 594→590). New
  defect found+fixed+CI-enforced: 10 apps' `docker.source_url` cited Docker Hub's `/v2/` JSON
  API (same shape as Defect Class #13, present since bootstrap, missed twice before) — repointed
  to browsable pages, schema test now blocks `/v2/` in `docker.source_url` for any registry.
  Found AUDIT #2's favicon fix was incomplete (tag present, literal `/favicon.ico` still 404'd
  in production 7 days) — now genuinely fixed with a real generated file + an existence-based
  CI check. No new cadence gaps; the 08-04/08-05 gaps remain unresolved (3 gaps/2 routines/3
  weeks — standing owner ask, LEARNINGS Compacted). 45/45 green.
- 2026-08-12 — **ANALYZE+BUILD: resolved the 4-cycle SERVICES enum gap, promoted 4 apps to
  live, built+QA'd a new 4-app batch.** Pre-launch signal unchanged (0 stars, 19 hits/30d), no
  new cadence gaps. Extended the SERVICES enum (ferretdb/pict-rs/soketi/mqtt) via a scoped
  policy — slots only for currently-queued candidates, not held/refuted ones — unblocking
  Coolify/Wekan/Lemmy/Zigbee2MQTT for a future batch (not built this run, pacing). Fresh-eyes
  re-QA cleared Linkwarden/Chatwoot/Seafile/Mattermost with zero defects (all live-resourced
  re-checks, docker sizes exact-matched live manifests) — promoted to live (24 live). Built
  Jenkins/Keycloak/Node-RED/GitLab CE from the verified backlog: harvester's cited canonical
  docs domains were egress-blocked, so it sourced from GitHub raw mirrors without confirming
  the canonical citation resolved — verifier caught this and repointed citations to
  self-confirmed mirrors, plus found a systematic `docker.size_mb` decimal-vs-MiB conversion
  bug across all 4 (fixed, LEARNINGS #53). QA found one real defect (Keycloak's deps wrongly
  showed only PostgreSQL as required when 4 more vendors are officially supported, fixed to
  match the grafana/nextcloud multi-backend convention). All 4 land `pending-second-qa` per the
  unattended-run rule, not live yet. 49/49 green throughout.
- 2026-08-17 — **AUDIT #4: reconciled 8 unpushed commits (largest yet), fixed 6 docker-size
  drifts + 2 missing-registry-tag citations, new Defect Class #14.** Local `main` was 8 commits
  ahead of `origin/main` in detached HEAD — ff-confirmed, pushed, CI green. Live registry re-check
  found 6/32 docker-size drifts (discourse 1164→1250, 6th drift on that field; home-assistant
  590→625; mattermost/n8n/openproject/nextcloud first drifts), all changelog'd. New defect:
  Wazuh/Immich `docker.image` were bare (implies `:latest`) but neither publishes that tag —
  Wazuh has none, Immich's real `:release` tag was known from Frigate's precedent but never
  applied to its own entry; both repointed, values unchanged live. Zero defect on 7 reachable
  sampled RAM/CPU figures. First cadence-gap-free week on record. 53/53 green throughout.
- 2026-08-16 — **ANALYZE+BUILD: settled 4 pending-second-qa apps, built+QA'd a new 4-app batch,
  backlog ceiling relieved.** Fresh-eyes QA fixed one defect (GitLab CE docker.size_mb
  1319→1313), promoted Jenkins/Keycloak/Node-RED/GitLab CE to live (28 live). Built
  Coolify/Prometheus/docker-mailserver/Wazuh — zero defects through verify+QA; ruled Wazuh's
  OpenSearch indexer/dashboard correctly deps:none (bundled, rec figure scopes whole stack —
  LEARNINGS #59); all 4 land pending-second-qa. Queue-drain compaction (9998→9080 bytes)
  relieved the 5-cycle FIND-blocking byte ceiling (#56/#57) as a side effect, not by design —
  still deferred (LEARNINGS #58). No traffic-driven decisions (pre-launch, 0★, ~20 hits/30d).
  53/53 green throughout.
