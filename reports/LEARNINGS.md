# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-07-30 — ANALYZE + BUILD (OpenProject, Plausible CE, Linkwarden, Open WebUI shipped)

32. **A stale local `main` ref can look exactly like a diverged fork — check `merge-base`
    before reconciling anything.** Session started on a detached HEAD carrying 15-16 real
    commits; local `main` pointed 16 commits behind. Before assuming a fork and trying to
    merge/rebase, `git merge-base <detached-HEAD> origin/main` showed origin was a direct
    linear descendant — a prior session had already pushed, origin had just moved further.
    Fast-forward was the entire fix. → Downstream: every session start with `git status`
    showing "HEAD detached," run `git fetch` + `git merge-base` before any reconciliation
    attempt; only treat it as a real fork if merge-base is NOT one of the two tips.
33. **A test's HTML-escape set must mirror the renderer's exactly, or verbatim quotes with
    certain characters silently false-fail CI.** `build.mjs` escapes `&<>"`;
    `site-invariants.test.mjs`'s quote-display check only escaped `&<` — OpenProject's
    genuinely-verbatim `>=` quote failed CI until corrected. → Downstream: any new
    HTML-comparison assertion must diff its escape set against `esc()` in `build.mjs` directly.
34. **Verbatim-quote fidelity tolerates stripping the source's own markdown emphasis (`**bold**`)
    but nothing else.** OpenProject's/Plausible's docs bold their key numbers; harvested quotes
    correctly kept the words, dropped the asterisks (verifier confirmed: formatting, not
    content). → Downstream: markdown emphasis around a quoted figure is safe to strip; any other
    deviation (reordering, synonyms, unit conversion) is not.

## 2026-08-01 — FIND run #9 (Ghost, Mastodon, Lemmy queued; Netdata/Portainer unblocked; MinIO rejected)

37. **`git clone --depth 1` of a github.com repo reaches further than guessing
    raw.githubusercontent.com paths or api.github.com** — unblocked Netdata/Portainer (stuck
    since run #2/#3). Docs-site mirror repos can differ in path from the canonical repo
    (`netdata/learn` vs. real `netdata/netdata`) — verifier caught it by cloning both. →
    Downstream: try `git clone` before marking anything "blocked, needs local session"; verifier
    always clones-and-greps independently, never trusts a finder-cited path as-is.
38. **A dead/archived upstream (MinIO, archived 2026-04-25) disqualifies outright, isn't just a
    low score** — future staleness re-verification would chase a project that never updates. →
    Downstream: check archive status before scoring any high-star candidate.

## 2026-08-02 — ANALYZE + BUILD (re-QA settle, Chatwoot/Seafile/Mattermost built)

39. **`git checkout <branch>` does not fast-forward it — a session can start reading a stale
    tree without any error.** After resolving a detached-HEAD state, `git checkout main`
    switched onto a local `main` still 3 commits behind `origin/main`; the backlog file read
    as if FIND runs #8/#9 never happened until `git merge --ff-only origin/main` caught up.
    Distinct from LEARNINGS #32 (that was detached-HEAD-vs-stale-ref; this is "checkout alone
    doesn't pull"). → Downstream: after any `git checkout <branch>`, immediately diff
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
- Rolling `latest`-tag docker image sizes drift within days, not months (Vaultwarden SEV-1,
  AUDIT #1) — re-check `docker.size_mb` every AUDIT, not just the 90-day RAM/CPU queue.
  selfhostspecs.com/goatcounter.com are also proxy-blocked from cloud sessions — a post-deploy
  smoke test in `ci.yml` now covers the live-site check on GH Actions instead.
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
