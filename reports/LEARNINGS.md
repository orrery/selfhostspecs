# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-08-24 — AUDIT #5

68. **No automated cadence-gap detector exists — the 4th time across 5 audits that "did a
    scheduled routine actually fire" has been the finding, always discovered up to 6 days late
    by AUDIT manually diffing commits against cron expressions.** This run: `specs-loop`
    (Sun+Wed cron) has commits for Sun 08-16 and Sun 08-23 but nothing for Wed 08-19, while
    `specs-find` (daily) committed every day in between — the trigger API's `last_fired_at` only
    reports the most recent fire, so it can't confirm whether 08-19 fired silently or not at
    all. → Owner flag: a cheap CI-independent tripwire (scheduled Action failing/notifying if no
    operator commit lands within N hours of each cron slot) would catch this same-day; not built
    this run (AUDIT doesn't build).
67. **A harvested `quote` must be copy-pasted from the fetched source, never retyped** — 7
    quote fields across 4 live apps (chatwoot, openproject, seafile, plausible-ce) had markdown
    emphasis markers silently dropped during harvest (e.g. "Memory: 4096 MB" stored vs the
    source's literal "**Memory:** 4096 MB"), failing Defect Class #8's literal-presence bar with
    zero value/scope drift — caught only because this audit did a byte-for-byte substring check
    against freshly-fetched sources instead of an LLM gist match. Newer batches (coolify, 08-16)
    already preserve markdown verbatim, so the fix is discipline, not code: harvesters should
    paste the exact source string, not transcribe its meaning.

## 2026-08-23 — FIND #29

66. **A vendor's marketing-docs domain being egress-blocked doesn't mean the figure is
    unsourceable — check for an in-repo docs mirror first.** This session's network proxy
    blocks nearly every vendor docs domain (pocketbase.io, zitadel.com, appwrite.io, and in
    earlier ad hoc checks dify.ai/langfuse.com/librechat.ai/netbird.io/mealie.io/reddit.com
    all 403'd) while github.com/raw.githubusercontent.com/api.github.com/hub.docker.com stay
    reachable. The harvester wrote off Zitadel as unsourceable on that basis; the verifier
    found its docs are mirrored in-repo (Docusaurus monorepo under `apps/docs/content/`) and
    pulled a verbatim official RAM figure via raw.githubusercontent.com. → Before holding a
    candidate as "docs blocked," GitHub code-search the vendor's own org for a docs-as-code
    mirror and try raw.githubusercontent.com paths — only hold on reachability after that
    comes up empty too (as it did for PocketBase and Appwrite this run).

## 2026-08-23 — ANALYZE+BUILD (specs-loop)

65. **`build.mjs` never renders a DB-OR dependency's alternative relationship in prose** —
    every multi-backend app (grafana/keycloak/nextcloud/now Kestra) lists each vendor as a
    separate `required:false` dep row with no indication they're alternatives, not all-optional
    extras. Not new data risk (Defect Class #11 is about false required+optional pairing, which
    this avoids), but it's a real page-copy gap across the whole existing set, caught by QA on
    Kestra 08-23 and confirmed pre-existing on the others. → Next BUILD batch that touches the
    page template: add an OR-prose line wherever ≥2 same-role deps are `required:false`.
64. **traefik has no SERVICES enum slot** — Dokploy (18/20, top of queue) needs it and got
    passed over this batch for code-server/Ollama/Dockge instead (score+simplicity, no schema
    blocker). → Resolve the enum gap before Dokploy's BUILD turn, same pattern as LEARNINGS #54.

## 2026-08-16 — ANALYZE+BUILD (specs-loop)

59. **A bundled multi-container deployment doesn't need a SERVICES enum slot even when a
    component resembles a known service** (Wazuh's OpenSearch indexer+dashboard, project-
    wired, not bring-your-own) — deps:none is honest because the published rec figure
    scopes the whole bundle, no resource gap hidden (extends Discourse-Postgres/Redis
    precedent). → Don't force an enum add for embedded-search SIEM/observability
    candidates unless the app's own docs treat it as separately provisioned.

## 2026-08-22 — FIND #28

64. **#62's archive-don't-trim fix applies per-section, not once** — the 08-18 relief moved
    Shipped/Rejected detail out and held for 4 cycles, but the Queued section itself (not
    touched then) grew from 4 to 27 items across #24-#27 with no BUILD in between (BUILD
    only runs Wed/Sun) and re-hit the ceiling (9999/10000). Same fix, new section: moved
    full per-item sourcing detail to reports/archive/queued-detail.md (BUILD reads it),
    kept name/score/one-line-flag inline for dedupe. 9999→6335, ~3.6KB headroom restored.
    → Any list section that only grows between drains (Queued between BUILD runs, not just
    Shipped/Rejected which only grow) needs the same archive treatment, proactively — don't
    wait for the ceiling to hit a second time on the same file.

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
