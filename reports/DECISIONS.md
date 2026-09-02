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

- 2026-07-24 to 2026-08-26 — Business direction approved, launch gate set, AUDIT #1-#5, 6
  session-start ff-merge/detached-HEAD recoveries, cadence gaps flagged, SERVICES enum gap
  resolved, Docker Hub `/v2/` API source-link defect fixed+CI-enforced, favicon fix, Defect
  Class #14 (untagged image ambiguity) added, 40 apps live. Full text:
  `reports/archive/decisions-log.md`.
