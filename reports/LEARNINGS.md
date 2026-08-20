# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-08-16 — ANALYZE+BUILD (specs-loop)

59. **A bundled multi-container deployment doesn't need a SERVICES enum slot even when a
    component resembles a known service** (Wazuh's OpenSearch indexer+dashboard, project-
    wired, not bring-your-own) — deps:none is honest because the published rec figure
    scopes the whole bundle, no resource gap hidden (extends Discourse-Postgres/Redis
    precedent). → Don't force an enum add for embedded-search SIEM/observability
    candidates unless the app's own docs treat it as separately provisioned.

## 2026-08-20 — FIND #26

63. **A commented-out or alternative-backend block in a compose file is not a required
    service** — finder read Penpot's docker-compose and flagged Minio as a required dep
    (deps-schema hold, same shape as Ente/Sentry/PostHog), but the verifier's live re-fetch
    showed the default storage backend is filesystem (`PENPOT_OBJECTS_STORAGE_BACKEND: fs`)
    and Minio is only an optional S3-alternative — no minio service is even defined in the
    compose. Cost: a real 16/20 candidate almost got parked on a nonexistent blocker.
    → Before calling a deps-schema hold, confirm the flagged service is actually
    instantiated in the compose file (not just mentioned in config docs as an option).

## 2026-08-18 — FIND #24

62. **In-place prose-trimming bought only one cycle of headroom each time; moving historical
    detail OUT of the file is the durable fix** — 3 prior relief attempts (9998→9080→9922)
    re-ceilinged fast since nothing left the file. 08-18: moved Shipped/Rejected detail to
    reports/archive/{shipped,rejected}-log.md, names stay inline for dedupe; deleted a dupe
    SERVICES-enum bullet. 9922→9023, held past 2 new queued items (→9631). → Archive, don't
    trim, next time any governed file nears budget.

## Compacted (graduated into CI tests / defect classes, or superseded — see OPERATIONS.md,
tests/*.test.mjs, full history: reports/archive/learnings-compacted.md)
