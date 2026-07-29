# Backlog — opportunities

Statuses: `unverified` → (verifier sign-off) → `queued` → `building` → `shipped`, or
`rejected` (with refutation, kept below as the graveyard). Dedupe against BOTH lists.

## Shipped (2026-07-24 first cycle) — 14 apps live
gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden, adguard-home, frigate,
grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing. See reports/DECISIONS.md.

Still pending BUILD (verifier-signed, schema changes, paced one per reviewed batch):
- **GPU / hardware-transcoding column** (Jellyfin, Immich, Frigate).
- **Community-figures column** (candidates: vaultwarden, adguard-home, uptime-kuma, syncthing,
  paperless-ngx).

## Building — 2026-07-26 (harvested + independently verified this cycle, status pending-second-qa)
- **Discourse** — 1GB RAM min/1 core (2 core rec), all-in-one Docker, Postgres/Redis bundled
  (deps: none, Defect Class #12).
- **Zulip** — 2GB RAM/1 core min (DAU-tiered above that, no single rec figure), deps:
  postgresql+redis+rabbitmq+memcached required (verifier caught the initial memcached
  omission — deps enum extended, see DECISIONS.md).
- **Rocket.Chat** — 2GiB/1 vCPU min (Starter tier, ≤25 concurrent; live figure differs from
  the FIND brief's stale "1GB/≤200 users" — re-sourced, see LEARNINGS #21), deps: mongodb
  required.

## Queued (verifier-signed), buildable now — FIND run #4 (2026-07-26)
Both fetched clean via GitHub-hosted mirrors this run (no egress block); verifier re-fetched
independently and signed off. Next BUILD batch candidates.
- **OpenProject** (project management, heavyweight counterpart to queued Vikunja) — 17/20.
  `opf/openproject` docs: "Quad Core CPU (>=2ghz)" / "4096 MB" RAM / "20 GB" disk, for
  "up to 200 total users" single-server; scaling table to 1500 users. **Deps correction from
  verifier: postgresql + memcached (NOT Postgres-only as first drafted) — memcached runs as
  its own container per the official docker-compose, not bundled** (Zulip-shape, LEARNINGS #20).
- **Plausible Community Edition** (self-hosted analytics, new category) — 15/20.
  `plausible/community-edition` README: "At least 2 GB of RAM is recommended... without fear
  of OOMs" (RECOMMENDED only — no official minimum, publish minimum as `no_official_figure`
  per Defect Class #2); CPU requires SSE4.2/NEON (useful ARM-column signal: excludes old
  ARMv6 boards). Deps: postgres + clickhouse (compose-confirmed).

## Queued (verifier-signed, CONDITIONAL), buildable now — FIND run #6 (2026-07-29)
- **Linkwarden** (self-hosted bookmark manager / read-it-later / web archiving) — 15/20
  (Coverage 4, Sourceability 4, Effort 4, Channel 3). New category, no collision with
  Karakeep (verifier confirmed distinct project — Karakeep's own README lists Linkwarden as
  a service it imports FROM, not a rename). Docs mirrored via GitHub
  (`raw.githubusercontent.com/linkwarden/docs/main/docs/self-hosting/installation.md`,
  verbatim-checked): "Linkwarden has pretty minimal hardware requirements - it was tested on
  a VPS with 4gb of memory and it ran pretty smoothly, the most intense part is when you
  build the app, but once it's running it's relatively lightweight." **Anecdotal, not a
  spec** — file as `ram_rec_mb` informal figure with this quote in scope; CPU/disk ship
  `no_official_figure`. **BUILD must apply the verifier's conditions:**
  (a) Meilisearch deps entry = `required: false` — compose's `depends_on` is plain-list form
  (start-order only, not a health/functional gate) and
  `docs/self-hosting/environment-variables.md` confirms "Linkwarden only initializes the
  MeiliSearch client when [MEILI_MASTER_KEY] is set"; keep postgres `required: true`.
  (b) Trendshift #4006 / HN-301 badges are project-self-reported (both domains proxy-blocked
  this session) — label as such, don't present as independently confirmed traction unless a
  future session verifies directly.
  (c) Image: `ghcr.io/linkwarden/linkwarden:latest`, multi-arch (amd64+arm64 only, no armv7);
  no Docker Hub image exists (`linkwarden/linkwarden` 404s). amd64 = 496 MiB via GHCR
  manifest layer-sum (Docker Hub's convenience `size` field isn't available on GHCR).

## Queued (verifier-signed), buildable now — FIND run #5 (2026-07-27)
- **Open WebUI** (self-hosted AI/LLM chat interface, new category) — 16/20. 147k GitHub
  stars, no current entry close; real community demand (Cloudron forum, Proxmox-VE
  Discussion #4505) exists precisely because no official RAM/CPU minimum is published
  anywhere (README + docs repo, independently reverified) — all four RAM/CPU fields ship
  `no_official_figure`. What's real and official: GPU vs CPU-only vs bundled-Ollama are three
  first-class install paths (`ghcr.io/open-webui/open-webui:cuda`/`:ollama`/`:main`); `:main`
  resolved ~1741MB via ghcr.io (Docker Hub's `openwebui/open-webui` is unofficial/unlinked —
  ghcr.io only). First genuinely GPU-native (not optional-transcoding) app — direct test case
  for the still-queued GPU/hardware-transcoding column. BUILD trap: the docs performance page's
  `memory: 8G/cpus: 4.0` compose-limits snippet is a commented "adjust based on usage" example,
  not a spec — do not harvest it as a figure (LEARNINGS #29).

## Queued (verifier-signed), still unbuilt — 2026-07-24/25 FIND runs #2/#3
Blocked this cycle on a confirmed cloud-egress constraint, not a judgment call: their official
docs domains hard-block from this cloud session (curl exit 56); no GitHub-hosted mirror exists
for any of these four, unlike Discourse/Zulip (LEARNINGS #18). Needs a local session or an
owner-provisioned network allowlist.
- **Portainer** — docs.portainer.io; live-page RAM figure (1GB vs 2GB disputed by third
  parties) needs a direct fetch, don't inherit either number.
- **Netdata** — learn.netdata.cloud; harvest the stated default-footprint quote ("100MB–200MB
  depending on metrics"), not the scaling formula, as the figure (n8n-usage-figure precedent).
- **PeerTube** — docs.joinpeertube.org; strongest sourceability of its batch ("1.5GB RAM
  plenty… usually takes at most 500MB", tiered guidance for viewers/transcoding).
- **Vikunja** — vikunja.io/docs/installing; ~256MB min, lightest footprint in the pipeline;
  pin the exact quote locally, don't inherit third-party corroboration numbers.

## Unverified / held (not sent further)
- **Collection: "runs on a 1GB VPS"** — 3 honest qualifiers today (gitea 1024, grafana 512,
  pi-hole 512); Nextcloud excluded (128MB is per-process, Defect Class #3 shape, logged
  LEARNINGS). Zulip/Rocket.Chat's min RAM (2048) don't qualify. Vikunja (~256MB) would be a
  strong 4th member once built — re-check its scope text before counting it. Still thin;
  revisit once Portainer/Netdata/PeerTube/Vikunja ship.
- **No new column proposed** — GPU/community-figures/memcached-enum already queued; pacing
  is one schema change per batch, a fourth would be backlog bloat ahead of capacity.
- **Below the ≥14 score bar** (do not re-propose without new sourceability evidence): Navidrome
  (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12), BookStack (12),
  Firefly III (12), Zabbix (13, stale legacy floor), NetBox (12, product/URL collision risk),
  Outline (no official reqs doc found), Authentik (~12-13, official floor stale vs. a real
  7.4GB deployment in issue #21413 — revisit only if a realistic tier is published).
  FIND run #4: Matrix Synapse (12, only a scoped "large public rooms" caveat, no general min;
  chat category already saturated this cycle), FreshRSS (11, prose only, no figure — Miniflux
  shape), Umami (11, deps only, no RAM figure — superseded by Plausible CE this run), Karakeep
  (10), Beszel (10), Passbolt (9), Wiki.js (9), Duplicati (9), Kavita (8), Kopia (7),
  Calibre-Web (6) — all: no numeric official hardware figure reachable from any fetchable
  source this run.
  FIND run #6: Actual Budget (13, near-miss — docs fully GitHub-mirrored and read in full,
  genuinely zero ram/cpu figure anywhere; revisit only if a future doc revision adds one),
  NocoDB (11, high egress risk — no in-repo docs mirror found, only standalone
  nocodb.com/docs), Tandoor Recipes (10, distinct from Mealie but same recipe-manager
  category already below-bar; no requirements page in its mirrored mkdocs docs), ntfy (9,
  zero official minimum; only figures found are illustrative Kubernetes example manifests —
  misharvest trap, do not source from those if revisited), Homepage/gethomepage (9, docs
  mirrored, zero hardware figures — closer to a widget aggregator than a resource-pressure
  workload), Listmonk (9, high egress risk — standalone docs only, tiny 14.8MB image but no
  figure), changedetection.io (8, high egress risk — standalone docs + GitHub wiki also
  confirmed blocked this run, new evidence below).
- Rejected: **"ARM/Pi-ready" collection** — 14/14 live entries already arm64/armv7, zero
  differentiating value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).

### Freshness work
None crossing the 90-day line. Oldest live entries retrieved 2026-07-24 (2 days).

## Rejected (the graveyard — do not re-propose without new evidence)
- Static JSON "API hub" (2026-07-24): occupied + dead channels + LLM drain.
- Classroom mail-merge printables (2026-07-24): free no-signup incumbents, identical privacy
  claim.
- Emergency binder generator (2026-07-24): demand unevidenced twice; trust paradox.
- CC0 trivia bank (2026-07-24): channels collapsed; accuracy-trust contradiction.
- Any calculator/tool or game (standing owner exclusion — never propose).
