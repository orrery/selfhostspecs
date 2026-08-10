# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-08-10 — FIND #17

52. **Hand-summarizing the backlog into a briefing for the finder subagent (instead of passing
    the file verbatim) drops items buried in section prose** — the finder proposed a GPU/hw-accel
    column already sitting in the Shipped section's "Pending BUILD" line, and an ARM/Pi-ready
    collection page already in the Rejected graveyard, because the operator's hand-built
    candidate/rejected lists omitted both (they weren't under an obvious "Queued"/"Rejected"
    bullet). The verifier caught both, but only after a full research round-trip. → Downstream:
    next FIND, paste `backlog/opportunities.md` verbatim into the finder's briefing instead of
    a curated summary.

## 2026-08-10 — AUDIT #3

49. **A CI check for a UI marker's presence is not the same as verifying the browser behavior
    it exists to prevent.** AUDIT #2's favicon fix added `<link rel="icon">` and a CI assertion
    for that tag — but Chromium's automatic `GET /favicon.ico` is independent of the `<link>`
    tag and kept 404ing in production for 7 days while the check stayed green. → Downstream:
    when a hostile-pass fix targets a literal browser behavior (a request, a render, a status
    code), verify the fix against that behavior directly (network capture), not just the code
    artifact believed to cause it; the new CI check now asserts `docs/favicon.ico` exists as a
    file, not just that a tag mentions one.
50. **Docker Hub's `v2/repositories/.../tags/<tag>` API endpoint as a citation is the same
    defect shape as Defect Class #13's ghcr issue, just without the 401 wall** — confirmed via
    `content-type: application/json` on 10 of 24 apps' `docker.source_url`, present since
    bootstrap, missed by 2 prior audits. → Downstream: Defect Class #13's CI enforcement
    (schema test) now rejects `/v2/` in `docker.source_url` for any registry, not just ghcr.
51. **Discourse's `latest` tag rebuilds unusually often** (4 drift-corrections in ~3 weeks vs.
    0–1 for every other tracked image) — no longer generic rolling-tag noise, this image's own
    release cadence. → Downstream: worth a page-copy caveat for high-churn images ("this image
    rebuilds frequently — size may lag") instead of presenting the same bare-integer stability
    implication as a sourced RAM figure; not yet built, flagging for a FIND/BUILD cycle.

## 2026-08-09 — FIND #16

45. **A candidate's docker-compose service count is a cheap early Effort signal — check it
    before the full sourcing dive, not after.** Sentry and PostHog self-hosted both had
    excellent official RAM sourcing but the verifier refuted both for queuing anyway — 64 and
    47 docker-compose services respectively, several without a SERVICES enum slot. →
    Downstream: run this 2-minute check before spending research budget on sourcing.
46. **The SERVICES enum gap is now a recurring blocker across independent candidates**
    (Supabase #11, Sentry+PostHog #16). → Downstream: schedule one dedicated BUILD task to
    extend the enum with a documented policy, instead of re-deciding it ad hoc per app
    (AUDIT #3: still undone as of this run — escalating past a second silent hold).

## Compacted (graduated into CI tests / defect classes, or superseded — see OPERATIONS.md, tests/*.test.mjs)
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
- Deps-enum gaps are BLOCK-worthy, not a reason to silently drop a confirmed service — extend
  the enum instead.
- Analytics snapshot Action: resolved 08-02, no longer tracked.
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
