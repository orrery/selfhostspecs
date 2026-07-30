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

## 2026-07-30 — FIND run #7 (Chatwoot, Seafile, Mattermost, BigBlueButton queued)

35. **A WebSearch-derived figure can silently be the wrong row of an official scaling table,
    and a 1-2 guessed raw.githubusercontent.com path 404ing is not proof no mirror exists.**
    Finder's search-only pass mis-quoted Mattermost's 1,000-2,000-user tier (4GB/2vCPU) as the
    minimum when the true floor is the 1-1,000-user tier (2GB/1vCPU); same shape on
    BigBlueButton, where the finder's "8GB/4 cores" was the doc's dev/local tier, not the
    16GB/8-core production minimum. Both times the finder also concluded "no mirror, needs a
    local session" after 1-2 path guesses 404'd, but the verifier found working mirrors at
    different paths (`mattermost/docs` master branch `.rst`, not `main`/`.mdx`;
    `bigbluebutton/bigbluebutton` monorepo `docs/docs/...`, not a separate `docs` repo).
    → Downstream: FIND-stage figures/mirror-availability are provisional until independently
    re-fetched; don't route a candidate to the blocked-local-session bucket without checking
    the doc repo's actual file tree, not just guessing common paths.

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
