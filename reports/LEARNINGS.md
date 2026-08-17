# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-08-16 — ANALYZE+BUILD (specs-loop)

58. **#56/#57 relief (9998→9080, 08-16) was temporary, not structural** — see #61.
59. **A bundled multi-container deployment doesn't need a SERVICES enum slot even when a
    component resembles a known service** (Wazuh's OpenSearch indexer+dashboard, project-
    wired, not bring-your-own) — deps:none is honest because the published rec figure
    scopes the whole bundle, no resource gap hidden (extends Discourse-Postgres/Redis
    precedent). → Don't force an enum add for embedded-search SIEM/observability
    candidates unless the app's own docs treat it as separately provisioned.

## 2026-08-12 — FIND #19

55. **A figure inside an example deployment config isn't an admissible "stated
    requirement," even from the vendor's own docs-mirror, and can drift from the
    vendor's live defaults** (Windmill: a Traefik sample gave "128MB" for a worker; the
    vendor's current default compose sets the same worker to 2048MB). → Downstream: a
    number inside an example/template resource limit needs prose confirmation, not just
    presence in an official-org repo.

## 2026-08-17 — AUDIT #4

60. **A lesson recorded only in changelog prose doesn't reach the entry it was learned from**
    — Immich's changelog already noted Frigate uses `:stable` because no `:latest` tag exists,
    but Immich's own `docker.image` stayed untagged (real tag `:release`); Wazuh shipped the
    same way (no `:latest` at all). Neither CI nor QA checked for it — new Defect Class #14
    (OPERATIONS.md): confirm a bare image's `:latest` exists before shipping; not CI-checkable
    (network), re-verify every AUDIT with `docker.size_mb`. Discourse's high-churn caveat (#51)
    is now one instance of the general rule below — folded in.

## 2026-08-17 — FIND #23

61. **Ceiling relief didn't hold — recurred in 1 cycle, and LEARNINGS.md ceilinged too**
    (opportunities.md 9080→9922; LEARNINGS.md 7988/8000 pre-edit). Structural, not under-
    compacted (#57); 08-15 escalation drew no action. → Skipped mining; re-escalated.

## Compacted (graduated into CI tests / defect classes, or superseded — see OPERATIONS.md, tests/*.test.mjs)
- Paste `backlog/opportunities.md` verbatim into the finder's briefing, never a curated
  summary — summaries drop buried items (#52, resolved 08-10, applied every cycle since).
- Docker-compose service count is a cheap early Effort signal — check it before the
  sourcing dive (#45, resolved 08-09, applied every cycle since; Sentry/PostHog both
  refuted on 64/47-service composes despite strong RAM sourcing).
- `docker.size_mb` bytes/1,000,000-vs-1,048,576 harvester error was systematic across a whole
  batch (07-24) — Defect Class #1 now states the exact divisor + known-good check (LEARNINGS
  formerly #53, superseded 08-12).
- A CI check for a UI marker's presence isn't proof of the browser behavior it exists to
  prevent — favicon check now asserts the file exists, not just that a tag mentions one (AUDIT
  #2/#3). Docker Hub's `/v2/` JSON API as `docker.source_url` is the same defect shape as
  ghcr's 401 issue — Defect Class #13 CI-enforced for both registries (AUDIT #3).
- SERVICES enum gaps are BLOCK-worthy, not a reason to silently drop a confirmed service —
  extend the enum. Recurring gap (4 FIND cycles unbuilt, #45/46) resolved 2026-08-12: scoped-
  extension policy in data-quality SKILL.md — add a slot only for a queued candidate's service.
- A scheduled routine can silently skip a day with no error/trace besides an absent commit —
  `specs-find` missed 07-28 and 08-04, `specs-loop` missed Wed 08-05; `list_triggers` exposes no
  run history so root cause is undeterminable here; 3 gaps/2 routines/3 weeks with zero
  resolution progress is now itself the standing owner ask (AUDIT #1/#2/#3).
- Same-session "independent" QA buys little — 07-30's same-run pass cleared 4 apps on all 12
  defect classes, but a later cross-session pass found real defects on 3 of 4; the gap that
  caught them was time+fresh-context, not agent identity. Now structural: unattended builds are
  `pending-second-qa` until a later run re-QAs with fresh eyes (applied correctly 08-09).
- A dep's `required` value is scoped to the specific install path the entry documents, same as
  `scope` — cite evidence from the documented path, not a different one, even when both exist
  officially (Linkwarden/meilisearch).
- `ghcr.io/v2/.../manifests/<tag>` and `hub.docker.com/v2/repositories/...` both 401/return raw
  JSON for unauthenticated readers — fine to harvest from, never fine as the published citation
  (Defect Class #13, now CI-enforced for both registries via a `/v2/` path check).
- GitHub-hosted mirrors (raw.githubusercontent.com, Docker Hub v2, ghcr.io v2) reach from cloud
  sessions; standalone docs domains AND github.com HTML/wikis hard-block — check for a raw-mirror
  before holding an app on "needs a local session."
- Rolling `latest`-tag docker image sizes drift within days, not months (5 corrections across 4
  apps by AUDIT #3) — re-check `docker.size_mb` every AUDIT, not just the 90-day RAM/CPU queue.
  selfhostspecs.com/goatcounter.com are proxy-blocked from cloud sessions too — the CI
  post-deploy smoke test covers live-site checks; AUDIT serves `docs/` locally on a port and
  drives it with the globally-installed Playwright (Node package at
  `/opt/pw-browsers/chromium`, not the Python one) for a real hostile/viewport pass.
- `git merge-base <tip> origin/main` before reconciling any apparent fork; `git checkout
  <branch>` alone does not pull — diff `rev-parse HEAD` vs. `origin/<branch>` after every
  checkout, and re-point the local branch ref (`checkout -B`) if it's just stale, not behind.
  Test escape-sets must mirror `build.mjs`'s `esc()` exactly. `git clone --depth 1` reaches
  further than guessing raw.githubusercontent.com paths. A dead/archived upstream disqualifies
  a candidate outright regardless of score (MinIO).
- Requirements tables can be images (GitBook PNG) inside otherwise-fetchable markdown — view
  the image directly before declaring a figure unsourceable (confirmed exact-match on
  Rocket.Chat's 3-image table, AUDIT #3).
- Auth-adjacent 404s can be permission masks, not absence — verify from a second vantage point.
- Seed quotes from memory drift; harvest quotes only from a live fetch in the same session.
  No-fetch FIND scoring is an estimate; absence claims need a sibling-page sweep.
- First QA pass found 4 SEV-2s → defect classes 10–12 (template-label reuse, OR-flattening,
  bundled-dependency misclassification) — now CI/QA-enforced, not re-litigated per batch.
- Registry tags: record the tag when it isn't `latest` (Immich `:release`, Frigate `:stable`).
- Verification cuts finder scores 20–40%; synonym sweeps kill candidates; channel claims need a
  checked, dated precedent; official RAM minimums are sparse (lead with always-harvestable
  columns); the moat is provenance depth, not the idea; territory exclusions are absolute;
  repeat community submissions decay (one-shot launch); scoped ≠ general figures.
- Unofficial doc mirrors are a collision risk — name the canonical org-owned domain.
  Component-vs-whole-app scoping (Nextcloud's "per process" 128MB) is Defect Class #3 — filters
  over ram_min_mb must check `scope`.
- WebFetch's AI-summary can drift scope-critical wording — confirm against a raw fetch before
  locking a quote. Deps lists from prose alone can miss compose-only services or over-include
  start-order-only `depends_on` entries — check the app's own env-var/graceful-degradation
  docs, not compose syntax alone. `github.com` HTML/wiki pages proxy-block same as standalone
  docs domains — raw mirrors only.
