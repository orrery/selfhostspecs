# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-08-09 — FIND #16

45. **A candidate's docker-compose service count is a cheap early Effort signal — check it
    before the full sourcing dive, not after.** Sentry self-hosted and PostHog self-hosted
    both had excellent official RAM sourcing (Sentry: install-script-enforced
    `MIN_RAM_HARD`; PostHog: explicit docs "Requirements" section) but the verifier refuted
    both for queuing anyway — 64 and 47 docker-compose services respectively, several without
    a SERVICES enum slot (kafka, zookeeper, opensearch, temporal), Sentry with no
    pull-and-run image at all. → Downstream: `docker-compose.yml` service count is a 2-minute
    check; run it before spending research budget on sourcing, not after — Sourceability
    alone doesn't clear the bar when Effort collapses.
46. **The SERVICES enum gap is now a recurring blocker across independent candidates, not a
    per-app one-off** (Supabase #11, Sentry+PostHog #16 — kafka/zookeeper/opensearch/temporal
    all missing). → Downstream: schedule one dedicated BUILD task to extend the enum with a
    documented policy for workflow-engine-class deps, instead of re-deciding it ad hoc inside
    whichever heavy entry hits it first.

## 2026-08-09 — ANALYZE + BUILD

44. **A cadence gap recurring across independent routines is a pattern, not a fluke — escalate
    it as one.** After AUDIT #2 flagged `specs-find`'s single 07-28 skip, two more gaps
    surfaced this run: `specs-find` skipped 08-04 too, and `specs-loop` (a different routine)
    skipped its Wed 08-05 firing entirely — no commit, no report entry; that run's
    `reports/2026-31.md` was also left mid-write (a bare `## BUILD` header). Three gaps across
    two routines in ~2 weeks, still unexplained (`list_triggers` exposes no run history). →
    Downstream: stop treating each gap as a fresh one-off to log-and-move-on; the recurrence
    itself is the finding — escalate to owner as a systemic scheduling-reliability question
    (e.g. a heartbeat commit, or checking the routine platform), and check the prior report
    file's completeness at session start, not just its existence.

## 2026-08-03 — AUDIT #2

43. **A scheduled routine can silently skip a day with no error and no trace besides an absent
    commit** (`specs-find` skipped 07-28; recurred 08-04 and on `specs-loop` 08-05 — see #44).
    `list_triggers` exposes only `last_fired_at`, not history — git commit dates are the only
    cadence record.

## 2026-08-02 — ANALYZE + BUILD (re-QA settle, Chatwoot/Seafile/Mattermost built)

40. **A dep's `required` value is scoped to the specific install path the entry documents**
    (same as `specs.*.scope`) — Linkwarden's meilisearch was `required:false` citing a
    manual-install-only doc while the cited Docker Compose path has it in `depends_on` with no
    escape hatch; fresh-eyes QA caught the citation/install-path mismatch. Cite evidence from
    the documented path, not a different one, even when both exist officially.
41. **`ghcr.io/v2/.../manifests/<tag>` 401s for unauthenticated readers** — fine to harvest
    from, never fine as the published citation (now Defect Class #13; see OPERATIONS.md).

## Compacted (graduated into CI tests / defect classes — see OPERATIONS.md, tests/*.test.mjs)
- GitHub-hosted mirrors (raw.githubusercontent.com, Docker Hub v2, ghcr.io v2) reach from cloud
  sessions; standalone docs domains AND github.com HTML/wikis hard-block (widened 2026-07-27,
  confirmed again 2026-07-29) — check for a raw-mirror before holding an app on "needs a local
  session" (Portainer/Netdata/PeerTube/Vikunja have none, stay held).
- Rolling `latest`-tag docker image sizes drift within days, not months (Vaultwarden AUDIT #1,
  Discourse twice since, Immich AUDIT #2) — 2 of 18 live docker sizes had drifted by AUDIT #2,
  a real recurring rate, not a one-off; re-check `docker.size_mb` every AUDIT, not just the
  90-day RAM/CPU queue. selfhostspecs.com/goatcounter.com are also proxy-blocked from cloud
  sessions — a post-deploy smoke test in `ci.yml` now covers the live-site check on GH Actions
  instead; AUDIT can additionally serve docs/ on a local port and drive it with the
  globally-installed `playwright` package (`executablePath` pointed at `/opt/pw-browsers/`) for
  a real hostile/viewport pass when the live site itself is unreachable — caught a missing
  favicon (every browser auto-requests `/favicon.ico`; 404'd since bootstrap) this way, fixed
  and now CI-enforced (`rel="icon"` check in site-invariants.test.mjs).
- `git merge-base <tip> origin/main` before reconciling any apparent fork (detached-HEAD or
  stale-ref cases both resolve to "fast-forward, nothing lost" if merge-base matches);
  `git checkout <branch>` alone does not pull — diff `rev-parse HEAD` vs. `origin/<branch>`
  after every checkout. Test escape-sets must mirror `build.mjs`'s `esc()` exactly; verbatim
  quotes tolerate stripped markdown emphasis, nothing else. `git clone --depth 1` reaches
  further than guessing raw.githubusercontent.com paths (unblocked Netdata/Portainer) — try it
  before holding an app as session-blocked; docs-mirror repos can differ in path from canonical
  (verify by cloning both). A dead/archived upstream disqualifies a candidate outright regardless
  of score (MinIO).
- Requirements tables can be images (GitBook PNG) inside otherwise-fetchable markdown — view
  the image directly before declaring a figure unsourceable.
- Deps-enum gaps are BLOCK-worthy, not a reason to silently drop a confirmed service
  (memcached precedent, twice) — extend the enum instead.
- Analytics snapshot Action failing since 2026-07-25 (exit 22), unfixed 3 runs straight —
  keep flagging to owner every run until resolved, don't assume one flag was enough.
- Auth-adjacent 404s can be permission masks, not absence — verify from a second vantage point.
- Seed quotes from memory drift; harvest quotes only from a live fetch in the same session.
- No-fetch FIND scoring is an estimate; absence claims need a sibling-page sweep.
- First QA pass found 4 SEV-2s → defect classes 10–12 (template-label reuse, OR-flattening,
  bundled-dependency misclassification) — now CI/QA-enforced, not re-litigated per batch.
- Registry tags: record the tag when it isn't `latest` (Immich `:release`, Frigate `:stable`).
- Verification cuts finder scores 20–40%; synonym sweeps kill candidates; channel claims need a
  checked, dated precedent; official RAM minimums are sparse (lead with always-harvestable
  columns); the moat is provenance depth, not the idea; territory exclusions are absolute;
  repeat community submissions decay (one-shot launch); scoped ≠ general figures.
- Unofficial doc mirrors (zulipaaa.readthedocs.io, GitHub doc forks) are a collision risk —
  name the canonical org-owned domain. Component-vs-whole-app scoping (Nextcloud's
  "per process" 128MB) is Defect Class #3 — filters over ram_min_mb must check `scope`.
- WebFetch's AI-summary can drift scope-critical wording (total→concurrent); confirm against
  a raw fetch before locking a quote. Deps lists from prose alone can miss compose-only
  services (memcached, twice) or over-include start-order-only `depends_on` entries
  (Meilisearch) — check the app's own env-var/graceful-degradation docs, not compose syntax
  alone. A confirmed-undocumented figure (Open WebUI) can still clear the bar on demand +
  channel-value; don't harvest illustrative compose-limits examples as real figures.
  `github.com` HTML/wiki pages proxy-block same as standalone docs domains — raw mirrors only.
