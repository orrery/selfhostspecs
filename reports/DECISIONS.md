# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-07-24 — **Business direction approved** (self-hosted requirements DB, 12/20
  post-verification); brand selfhostspecs.com, `docs/` gitignored build output, schema test is
  the contract, repo PUBLIC (owner call), launch gate ≥100 sourced entries. First full cycle
  shipped 14 apps live, gate exercised end-to-end (harvest→verify→CI→QA block→fix→re-QA→deploy).
- 2026-07-26 — **ANALYZE pre-launch** (0 stars, 26 hits, no kills). BUILD scoped 7→3 apps on a
  confirmed egress block (Portainer/Netdata/PeerTube/Vikunja docs domains 403; raw-mirrors ok).
  Rocket.Chat re-sourced live tier (brief 1cpu/1GB → actual 1vCPU/2GiB). Verifier blocked Zulip
  first pass (missing memcached dep + bad source, fixed). Discourse Postgres/Redis classified
  bundled (runit, same container). Analytics-snapshot exit-22 flagged to owner. QA blocked once
  (collection-copy went false when Discourse's bundled deps joined), fixed; 3 apps
  pending-second-qa.
- 2026-07-27 — **AUDIT #1:** fixed SEV-1 Vaultwarden docker-size drift (77→83, rolling `latest`
  tag). Added CI post-deploy smoke test — this cloud session can't reach
  selfhostspecs.com/goatcounter.com at all (proxy 403, confirmed policy-level not a site issue).
- 2026-07-30 — **Repo-integrity:** local `main` 16 commits behind `origin/main` (detached-HEAD
  session start); `merge-base` confirmed non-diverged, ff-merged, nothing lost — standing move
  on every session start since. Re-QA settled Discourse/Zulip/Rocket.Chat to live (17 live);
  Discourse docker-size drifted again (1144→1173), fixed.
- 2026-07-30 — **BUILD drained the queue:** OpenProject/Plausible CE/Linkwarden/Open WebUI —
  zero verifier discrepancies, zero QA defects across 12 classes; all 4 `pending-second-qa`
  (unattended-run rule). `meilisearch` added to deps enum (sourced). Two real bugs fixed:
  quote-escape test gap (`>` unescaped, false-failed OpenProject's quote), search punctuation
  mismatch ("rocket chat" missed "Rocket.Chat").
- 2026-08-02 — **Fresh-eyes re-QA settled OpenProject live; found 3 real defects on the rest,
  not zero this time.** Plausible CE/Linkwarden/Open WebUI all cited an unauthenticated
  `ghcr.io/v2/.../manifests/<tag>` URL as `docker.source_url` (401s for readers) — new Defect
  Class #13, repointed to the browsable package page. Linkwarden's meilisearch was
  `required:false` citing a manual-install-only doc while the cited compose file has it in
  `depends_on` — reclassified `required:true`. Open WebUI's "none required" deps cited a
  compose file that itself defines `ollama` — repointed to the real zero-dep evidence (README
  OpenAI-only docker-run). Fixed, rebuilt, 45/45 green, kept `pending-second-qa` (only
  OpenProject moved to live) per the unattended-run rule.
- 2026-08-03 — **AUDIT #2:** 2 more docker-size drifts fixed (Discourse 1173→1144, Immich
  761→763); real defect found+fixed (no favicon anywhere since bootstrap, now CI-enforced);
  cadence gap found (`specs-find` no commit 07-28, flagged, cause unknown). Red-teamed the
  07-30 same-run QA pass: cleared 4 apps on all 12 classes, but the later cross-session QA
  (08-02) found real defects on 3 of 4 — same-session "independent" QA buys little; tracking
  first-pass-QA miss rate (LEARNINGS #42). 45/45 green.
- 2026-08-09 — **Session-start recovery: local `main` was 1 commit behind `origin/main`**
  (prior session ended detached-HEAD after FIND #15, local branch ref never fast-forwarded).
  `merge-base` confirmed origin already had the commit — no data was actually lost, only the
  local ref was stale; ff-merged to match. Standing session-start check (LEARNINGS #32/#39)
  held.
- 2026-08-09 — **Cadence gap, second and third occurrences across two different routines:**
  `specs-find` produced no commit 2026-08-04 (first gap was 07-28, AUDIT #2); `specs-loop`
  (Wed/Sun ANALYZE+BUILD) produced no commit and no report entry for its Wed 2026-08-05 firing
  — first known gap for this routine. `reports/2026-31.md` was also left mid-write (a
  `## BUILD` header with no content) from the 08-02 run. `list_triggers` only exposes
  `last_fired_at`; cause (silent no-op / never fired / crashed mid-run) can't be determined
  from this session. Flagged to owner as a pattern, not a one-off (LEARNINGS #44).
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
