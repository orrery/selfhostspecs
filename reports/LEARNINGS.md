# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-08-03 — AUDIT #2

42. **A same-run "independent" QA pass can still miss most defects — the second, later-session
    QA pass is what's actually catching things.** The 2026-07-30 BUILD's own-run QA cleared 4
    apps on all 12 Defect Classes; the 2026-08-02 fresh-eyes re-QA (a different day, not just a
    different agent) found real defects on 3 of those 4. Agent-identity separation within one
    sitting isn't buying the independence the `pending-second-qa` policy assumes it does. →
    Downstream: track first-pass-QA miss rate; don't treat same-run QA clearance as strong
    signal, only the later cross-session pass.
43. **A scheduled routine can silently skip a day with no error and no trace besides an absent
    commit.** `specs-find` fired daily 07-24→07-27 and 07-29→08-02 but produced no commit on
    07-28 — the GH-Actions stats-snapshot (a separate system) ran that day, which is why it went
    unnoticed; AUDIT #1 (07-27) couldn't have caught it, it happened the day after. →
    Downstream: AUDIT's cadence check must diff the full commit-date list against the expected
    daily/weekly schedule, not just check "last N runs look fine"; `list_triggers` only exposes
    `last_fired_at`, not history, so git commit dates are the only cadence record — flagged to
    owner, not silently logged.

## 2026-08-02 — ANALYZE + BUILD (re-QA settle, Chatwoot/Seafile/Mattermost built)

39. **`git checkout <branch>` does not fast-forward it — a session can start reading a stale
    tree without any error.** After resolving a detached-HEAD state, `git checkout main`
    switched onto a local `main` still 3 commits behind `origin/main`; the backlog file read
    as if FIND runs #8/#9 never happened until `git merge --ff-only origin/main` caught up.
    Distinct from the merge-base learning above (that was detached-HEAD-vs-stale-ref; this is
    "checkout alone doesn't pull"). → Downstream: after any `git checkout <branch>`, immediately diff
    `git rev-parse HEAD` against `git rev-parse origin/<branch>` before trusting file contents.
40. **A `depends_on` entry in the officially-documented default compose path is stronger
    evidence for `required:true` than a separate manual-install doc's graceful-degradation
    note for a *different* install path.** Linkwarden's meilisearch was harvested
    `required:false` from `environment-variables.md`, which only documents manual (non-Docker)
    installs as able to skip it; the Docker Compose path this entry actually describes has no
    such escape hatch. Fresh-eyes QA caught the mismatch between the citation and the
    documented install path. → Downstream: a dep's `required` value is scoped to the specific
    install path the entry documents (same as `specs.*.scope`) — cite evidence from that path,
    not a different one, even when both exist in official docs.
41. **A `ghcr.io/v2/.../manifests/<tag>` registry API URL 401s for any reader without a bearer
    token — it's fine as a harvesting source, never as the published citation link.** 3 of 4
    apps in the 2026-07-30 batch used it as `docker.source_url`; QA caught it by fetching each
    link unauthenticated, the way a real visitor would. Now Known Defect Class #13. →
    Downstream: any ghcr.io-sourced entry must cite the browsable
    `github.com/<owner>/<repo>/pkgs/container/<name>` page instead.

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
