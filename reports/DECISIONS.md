# DECISIONS

Append-only log of material decisions with their evidence. AUDIT checks cadence gaps here.

- 2026-09-02 — **ANALYZE+BUILD: settled 4 pending-second-qa apps (44 live), built+QA'd a new
  4-app batch (48 tracked).** Session-start recovery: detached HEAD (recurring pattern) — pure
  identity match with origin/main, zero commits at risk. Fresh-eyes QA cleared Homebox/Mailcow/
  Metabase/Technitium DNS Server with zero defects (independent re-derivation of every
  docker.size_mb from live registry manifests, all exact matches, no drift) — promoted to live.
  Built Pangolin/Ghost/Activepieces/Jitsi Meet through harvest→verify→QA; independent
  verification caught a fabricated citation on Ghost (a deps note quoted a sentence that no
  longer exists anywhere in TryGhost/docs — same failure family as LEARNINGS #71/#79) plus 2
  byte-level quote-drift nits; independent QA found and closed an open regression gap (CI
  asserted `docker.note` renders but not `deps[].note` — 11 live apps carry one, all currently
  render correctly, added the mirrored assertion as a tripwire, not a live-defect fix). All 4
  land pending-second-qa. Pre-launch signal unchanged (0★, 6 hits total window, no traffic-
  driven decisions). Compacted DECISIONS.md (7668→2112) and LEARNINGS.md (7333→6900, removed 2
  fully-archived entries) proactively at session start per the ~500B-headroom rule. 69/69 green
  throughout, 6 commits.
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
