# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-07-24 to 2026-08-09 — Business direction approved, launch gate set, AUDIT #1/#2, 3
  session-start ff-merge recoveries, 2 cadence gaps flagged, Sentry/PostHog refuted for queuing
  (SERVICES enum gap). Full text: `reports/archive/decisions-log.md`.
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
- 2026-08-23 — **ANALYZE+BUILD: settled 4 pending-second-qa apps, built+QA'd a new 4-app batch
  (32 live), compacted DECISIONS.md.** Session-start recovery: local `main` was 1 commit behind
  origin (FIND #28, detached HEAD carryover) — ff-merged, pushed. DECISIONS.md was at
  7932/8000 bytes, too tight for this entry — archived pre-08-10 decisions to
  reports/archive/decisions-log.md (7932→4182). Fresh-eyes re-QA cleared Coolify/Prometheus/
  docker-mailserver/Wazuh: 2 minor fixes (Coolify scope wording, Prometheus docker.size_mb
  drift 102→104 from a registry repush) — promoted to live. Built Kestra/code-server/Ollama/
  Dockge from the verified queue (score+simplicity, no SERVICES-enum blocker) through the full
  harvest→verify→QA pipeline: verifier fixed one stale note (Ollama's issue #2418 mis-described
  as Open), QA ruled Kestra's Postgres/MySQL OR-dependency modeling consistent with the
  grafana/keycloak/nextcloud convention (kept as-is) and flagged a real but out-of-scope gap —
  build.mjs never renders any multi-backend app's OR relationship in prose (LEARNINGS #65). All
  4 land pending-second-qa per the unattended-run rule. Pre-launch signal unchanged (0★, ~3
  hits/30d — traffic snapshot stale at 08-23, no kill/promote decision due). No new cadence
  gaps (CI green 08-17→08-22 continuous). 57/57 green throughout.
