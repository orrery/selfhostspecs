# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-08-31 — **AUDIT #6: 4 docker-size drifts + 1 quote-formatting fix from a 12-app
  sample; first cadence-gap-free week confirmed with zero ambiguity; first session-start
  with no detached-HEAD reconciliation since AUDIT #2.** Full findings: `reports/AUDIT.md`.
  No structural process changes this run (LEARNINGS #75's detached-HEAD fix held up once,
  not yet fully proven); n8n's docs-mirror path unresolved, flagged for next AUDIT. 65/65
  green throughout.
- 2026-08-30 — **ANALYZE+BUILD: settled 4 pending-second-qa apps, built+QA'd a new 4-app
  batch (44 tracked), new Defect Class #15.** Second firing this ISO week (Wed 08-26 + Sun
  08-30), no cadence gap. Session-start clean (main already synced with origin, no detached
  HEAD). Fresh-eyes QA promoted ONLYOFFICE/Coder/Nginx Proxy Manager/Twenty CRM to live (40
  live): fixed Coder's missing embedded-Postgres-fallback note and Twenty CRM's stale
  `docker.size_mb` (239→242, upstream `:latest` repushed a day after harvest). Built Homebox/
  Mailcow/Metabase/Technitium DNS Server through harvest→verify→QA; independent QA found
  Mailcow's 18-container bundle publishing one component's size (postfix, 110MB) with no
  disclosure it wasn't the whole stack — new Known Defect Class #15 (representative-image
  ambiguity), enforced by a `docker.note` schema field + build-integrity test, not just
  documentation. All 4 land pending-second-qa. Pre-launch signal unchanged (0★, 3 hits total
  window, no traffic-driven decisions). AUDIT.md flagged at 9992/10000 bytes for next AUDIT to
  compact first. 65/65 green throughout, 9 commits.

- 2026-07-24 to 2026-08-12 — Business direction approved, launch gate set, AUDIT #1/#2/#3, 3
  session-start ff-merge recoveries, 2 cadence gaps flagged, Sentry/PostHog refuted for queuing,
  SERVICES enum gap resolved, Docker Hub `/v2/` API source-link defect fixed+CI-enforced,
  favicon fix completed, 24 apps live. Full text: `reports/archive/decisions-log.md`.
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
- 2026-08-24 — **AUDIT #5: 7 docker-size drifts + 1 quote drift + 7 quote-fidelity fixes,
  reconciled 9 unpushed commits, flagged a likely cadence gap.** Full sweep of all 32 live apps'
  `docker.size_mb` (not a sample) found 7 drifted (22%, worst week on record) — keycloak,
  chatwoot (-6%, largest ever), discourse (7th drift on that field), gitlab-ce, grafana (+25%,
  the never-re-verified 07-24 bootstrap entry), n8n, linkwarden — all fixed+changelog'd. Direct
  byte-substring checks (not WebFetch gist-matching) against 10 sampled sources found linkwarden's
  quote no longer verbatim-present (source rewritten since the 08-09 re-QA; value coincidentally
  still correct) and 7 more quote fields (chatwoot/openproject/seafile/plausible-ce) with
  markdown silently stripped at harvest — all restored to literal source text. 9 commits sat
  unpushed in detached HEAD at session start (recurring pattern, AUDIT #3/#4 lineage) — pure
  fast-forward, reconciled and pushed, CI green. Process: no commit trail for `specs-loop`'s
  08-19 Wed slot while `specs-find` committed daily around it — can't confirm fired-silently vs.
  didn't-fire from the trigger API; owner flag + LEARNINGS #68 proposes a cadence tripwire.
  Hostile pass (10 checks) and live smoke test both clean. 57/57 green throughout.
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
- 2026-08-26 — **ANALYZE+BUILD: settled 4 pending-second-qa apps (36 live), built+QA'd a new
  4-app batch (40 tracked), fixed a live false-claim defect.** Session-start recovery: 14
  commits sat unpushed in detached HEAD (same recurring pattern as AUDIT #3/#4/#5) — ff-merged
  and pushed, 57/57 green. Fresh-eyes QA cleared code-server/Ollama/Dockge; found Kestra's
  Postgres/MySQL either-or (both required:false) let `noExternalServices()` falsely list it on
  the "no external database" collection page — fixed by making Postgres required:true (compose-
  file default, paperless-ngx precedent) and rendering `deps[].note` in build.mjs (LEARNINGS #65
  finally landed, benefits any future OR-dep entry). Harvested ONLYOFFICE/Coder/Nginx Proxy
  Manager/Twenty CRM from the verified queue; independent verifier found NPM's deps citation
  missing a `mysql` entry (docs name both mysql+mariadb explicitly) and added clarifying notes;
  independent QA (3rd agent, distinct from harvester+verifier) found zero further defects, all 4
  land pending-second-qa. No traffic-driven decisions (pre-launch, 0★, near-zero hits — SEO-tail
  gate not close). Governance: LEARNINGS 7836/8000, backlog 8386/10000 — under budget. 61/61
  green throughout.
