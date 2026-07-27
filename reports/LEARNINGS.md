# LEARNINGS

Every entry must change something downstream — a learning that changes nothing is not a
learning. FIND and BUILD read this file first, every run. Newest first.

## 2026-07-27 — AUDIT #1

27. **Docker image size sourced from a rolling `latest` tag drifts by design, not by mistake.**
    Vaultwarden's stored 77MB (retrieved 2026-07-24) read 83MB live via the same
    `hub.docker.com/v2/.../tags/latest` URL three days later — a real rebuild, not fabrication,
    but a live figure the site published as still-true. SEV-1 per OPERATIONS.md §5: pulled and
    fixed this run. → Downstream: `docker.size_mb` needs re-checking every AUDIT (Docker Hub/
    GHCR API is cheap, always reachable), not just the 90-day RAM/CPU staleness queue — a
    rolling tag can drift within days, not months.
28. **This session's egress block is far broader than LEARNINGS #18 characterized.** Every
    docs domain tried this audit (nextcloud/frigate/gitea/grafana/home-assistant/immich/
    jellyfin/pi-hole) 403'd at the proxy CONNECT level — and so did selfhostspecs.com and
    goatcounter.com themselves (confirmed via `/__agentproxy/status`: policy denial, not a tool
    bug). Only GitHub-hosted infra + Docker Hub/GHCR reach. → Downstream: AUDIT's mandated
    live-site spot-check and most source re-fetches cannot run from this environment at all;
    added a post-deploy smoke test to `ci.yml` (GH Actions runners have real internet) so the
    live-site check happens somewhere authoritative every deploy instead of never.

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

## Compacted (graduated into CI tests / defect classes — see OPERATIONS.md, tests/*.test.mjs)
- GitHub-hosted mirrors (raw.githubusercontent.com, Docker Hub v2, ghcr.io v2) reach from cloud
  sessions; standalone docs domains hard-block — check for a mirror before holding an app on
  "needs a local session" (Portainer/Netdata/PeerTube/Vikunja have none, stay held).
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
