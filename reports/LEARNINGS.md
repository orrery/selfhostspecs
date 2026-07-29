# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-07-26 — FIND run #4 (OpenProject, Plausible CE queued)

25. **WebFetch's AI-summarized pass can silently drift scope-critical wording even when the
    raw source is correct** — verifier's own WebFetch call on OpenProject's requirements doc
    paraphrased "up to 200 total users" as "up to 200 **concurrent** users" (a real Defect
    Class #3 scoping error), while a direct curl/raw fetch of the identical URL preserved the
    exact wording. → Downstream: for scope-critical phrases (min-vs-recommended, total-vs-
    concurrent, per-process-vs-whole-app), harvesters and verifiers must confirm against a raw
    fetch, not just a summarized WebFetch pass, before locking the quote.
26. **A harvester's draft dependency list can look complete from the requirements prose alone
    and still be wrong** — OpenProject's system-requirements page names only Postgres, but the
    official docker-compose runs memcached as its own container (Zulip-shape, LEARNINGS #20,
    second occurrence). → Downstream: always cross-check named deps against the actual official
    compose/docker file, not just the prose requirements section.

## 2026-07-26 — ANALYZE + BUILD (Discourse, Zulip, Rocket.Chat)

23. **A fixed prose block can go stale the moment a new member joins its collection.**
    The "no external database" collection's copy said "no Postgres, no Redis... to feed and
    water" — true for every prior member (zero DB dependency) but false once Discourse joined
    with Postgres/Redis genuinely running, just bundled in its own container. QA caught it as
    a reader-facing overstatement, not a data error. → Downstream: collection-page copy that
    makes a blanket claim about members must be re-read against the NEWEST member added, not
    just checked once at the copy's creation; reworded to "no separate container to run
    yourself" (true for both zero-dep and bundled-dep members).
24. **`quote` must stay pure transcription — methodology commentary belongs in `scope`.**
    Rocket.Chat's quote field had "(table image, transcribed from...)" appended inline; QA
    flagged it as the first instance of commentary inside a field the schema requires to be
    verbatim. → Downstream: when a figure comes from a non-text source (image, PDF), put the
    "how we read this" explanation in `scope`, never appended to `quote` itself.

## 2026-07-27 — FIND run #5 (Open WebUI queued)

29. **A confirmed source can still yield zero official numeric figures — demand + channel-value
    can still clear the bar.** Open WebUI (147k stars, no current entry close) has no official
    RAM/CPU minimum anywhere (README + docs repo, independently reverified) — real demand exists
    (Cloudron forum, Proxmox-VE Discussion #4505) precisely because it's undocumented. What IS
    official: GPU vs CPU-only vs bundled-Ollama are three first-class install paths
    (`ghcr.io/open-webui/open-webui:cuda`/`:ollama`/`:main`; `:main` resolved ~1741MB via ghcr.io).
    → Downstream: queued 16/20, all four RAM/CPU fields `no_official_figure`; BUILD must NOT
    harvest the docs performance page's illustrative `memory: 8G/cpus: 4.0` compose-limits
    example (commented "adjust based on usage") as a real figure — first genuinely GPU-native
    (not optional-transcoding) app, real test case for the still-queued GPU column.

## 2026-07-29 — FIND run #6 (Linkwarden queued, conditional)

30. **The egress block is broader than #28 characterized: `github.com` HTML pages and GitHub
    wikis are proxy-blocked too, not just standalone doc domains.** Confirmed twice
    independently this run (finder + verifier, separate sessions) — only
    `raw.githubusercontent.com`, `hub.docker.com/v2`, and `ghcr.io/v2` reach. → Downstream:
    stop citing `github.com/.../pkgs/container/...` HTML pages as a source_url expecting this
    session to confirm them; treat any `github.com` (non-raw) or `*.wiki` URL as unreachable
    until a local/non-cloud session proves otherwise.
31. **A compose file listing a service under `depends_on` does not make it required — check
    the syntax form and the app's own env-var docs before classifying.** Linkwarden's compose
    lists Meilisearch via plain-list `depends_on` (start-order only, not
    `condition: service_healthy`), and its own env-var docs confirm the app "only initializes
    the MeiliSearch client when [MEILI_MASTER_KEY] is set" — genuinely optional despite always
    starting by default. Opposite-direction case from #26 (OpenProject: compose had an
    UNDOCUMENTED required dep) — this time compose OVER-implies a dep the app doesn't need.
    → Downstream: `required: true/false` in `deps` must be decided from the app's functional
    behavior (env-var docs, graceful-degradation statements), never inferred from `depends_on`
    presence alone.

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
