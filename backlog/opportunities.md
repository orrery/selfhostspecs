# Backlog — opportunities

Statuses: `unverified` → (verifier sign-off) → `queued` → `building` → `shipped`, or
`rejected` (with refutation, kept below as the graveyard). Dedupe against BOTH lists.

## Shipped — 17 apps live
2026-07-24 first cycle (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden,
adguard-home, frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing.
2026-07-30 (+3, re-QA settled from 07-26 batch): discourse, zulip, rocket-chat. See DECISIONS.md.

Still pending BUILD (verifier-signed schema changes, paced one per reviewed batch):
- **GPU / hardware-transcoding column** (Jellyfin, Immich, Frigate).
- **Community-figures column** (candidates: vaultwarden, adguard-home, uptime-kuma, syncthing,
  paperless-ngx).

## Building — 2026-07-30 (harvested + independently verified; pending-second-qa this run)
- **OpenProject** — 4096MB/4 cores min (≤200 users tier). Deps: postgresql + memcached (required).
- **Plausible CE** — 2048MB rec only, no min; CPU is SSE4.2/NEON floor, no core count. Deps:
  postgresql + clickhouse.
- **Linkwarden** — anecdotal 4GB `ram_rec_mb`, scope notes informal. Deps: postgresql (required)
  + meilisearch (optional, start-order only). `meilisearch` added to deps SERVICES enum.
- **Open WebUI** — all RAM/CPU fields `no_official_figure` (147k stars, undocumented). `:main`
  (CPU-only) tag documented; `:ollama`/`:cuda` noted as separate tags.

## Queued (verifier-signed), still unbuilt — 2026-07-31 FIND run #8
- **GitLab CE** (18/20) — full DevOps platform, distinct from Gitea (lightweight git host).
  `raw.githubusercontent.com/gitlabhq/gitlabhq/master/doc/install/requirements.md` — "8 vCPU is
  the baseline" / "16 GB is the baseline" for single-node (verifier confirmed this is the real
  general min, not the separate reference-architecture tier table; alt 8GB memory-constrained
  floor also documented, worth a footnote). Deps: PostgreSQL + Redis-or-Valkey (both required).
  **BUILD:** Gitaly is bundled-internal — do not list as an external dep (Defect Class #12).
- **Zammad** (16/20) — ticket-queue helpdesk, distinct from Chatwoot (queued: chat widget)
  despite adjacency. `raw.githubusercontent.com/zammad/zammad-documentation/main/prerequisites/
  hardware.rst` — Minimum Setup: "2 CPU cores; 6 GB of RAM (+4 GB if Elasticsearch on same
  server)". PostgreSQL required. Watch: 2nd customer-support-adjacent app — don't let this
  category crowd unchecked like chat did.

## Collection page, verified with caveat, pending SERP check — 2026-07-31
- **"Apps with no separate DB/cache service required"** — verifier read 9+ of 14 claimed
  members' JSON directly (discourse, nextcloud, gitea, grafana, n8n, frigate, open-webui,
  vaultwarden, home-assistant, syncthing + spot-checks): all have zero `required:true` deps —
  confirmed accurate, 14 members (healthier than the held "1GB VPS" collection's 3). **Real
  risk:** `required:false` means no operator-provisioned service, NOT dependency-free in
  production (Discourse AIO bundles Postgres/Redis in-container; Nextcloud-on-SQLite is
  docs-discouraged for prod — Defect Class #3 shape). Page copy must disclose this before BUILD.
  SERP check still not done — required before scheduling.

## Refuted this run — 2026-07-31 FIND run #8
- **Column: "minimum dependency version floor"** — proposed as a free byproduct of existing
  RAM/CPU fetches; refuted — GitLab's version-support table lives in a separate doc subsection,
  only found by reading the full page. Applying retroactively needs a fresh fetch per
  already-shipped app, not free. Re-cost before queuing behind GPU/community-figures.

## Held (insufficient evidence, not discarded) — 2026-07-31 FIND run #8
- **Keycloak** (~13/20, identity/SSO gap) — no reachable OSS keycloak-documentation source
  (guessed paths 404, GitHub API contents endpoint failed too); Red Hat's downstream docs
  correctly declined (different product). Revisit with repo-file-tree access.
- **Snipe-IT** (~12/20, IT asset mgmt) — README has no figures, readme.io 403s. Below propose
  bar without data; revisit if a GitHub-mirrored doc appears.
- **Cal.com** (~12/20, scheduling) — confirmed zero production RAM/CPU figures anywhere (only a
  dev-only Node heap flag, correctly not harvested). Open WebUI-shape; needs channel-value case.

## Queued (verifier-signed), still unbuilt — 2026-07-30 FIND run #7
All sources confirmed reachable via GitHub-hosted mirrors — buildable now, not blocked.
- **Chatwoot** (18/20) — 34.9k stars. `raw.githubusercontent.com/chatwoot/docs/main/self-hosted/
  deployment/requirements.mdx` — "4GB RAM required minimum... up to 10,000 conversations/day" /
  4 cores rec. Deps: PostgreSQL + Redis>=7.0 (required). Standalone docs 403; use mirror.
- **Seafile** (16/20) — 15.1k stars, distinct from Nextcloud/Syncthing.
  `raw.githubusercontent.com/haiwen/seafile-admin-docs/master/manual/setup/
  system_requirements.md` — CE: 2G RAM, 2 cores >2GHz rec, 10G/50G storage. CE only, don't
  conflate Pro tier figures in same doc. Standalone docs 403; use mirror.
- **Mattermost** (15/20, 3rd chat entry — tempered crowding concern, distinct on-prem demand).
  `raw.githubusercontent.com/mattermost/docs/master/source/deployment-guide/
  software-hardware-requirements.rst` — **1-1,000 users: 1 vCPU/2GB (true floor)**,
  1,000-2,000: 2 vCPU/4GB. BUILD must harvest the first tier, not the second (FIND mis-collapsed
  this once already, verifier caught it). Standalone docs 403; use mirror.
- **BigBlueButton** (14/20) — video conferencing, 9.2k stars, no crowding.
  `raw.githubusercontent.com/bigbluebutton/bigbluebutton/develop/docs/docs/administration/
  install.md` (v3.0.32) — production min: 16GB/8 cores/Ubuntu 22.04/500GB (50GB w/o recordings).
  FIND's initial 8GB/4-core/Ubuntu 20.04 was the dev/local tier — verifier caught the
  min-vs-tier conflation. Harvest only from the mirror, never a cached search snippet.

## Queued (verifier-signed), still unbuilt — 2026-07-24/25 FIND runs #2/#3
Blocked on confirmed cloud-egress constraint: docs domains hard-block, no GitHub mirror exists.
Needs a local session or owner-provisioned network allowlist.
- **Portainer** — docs.portainer.io; 1GB vs 2GB disputed, needs a direct fetch.
- **Netdata** — learn.netdata.cloud; harvest "100MB-200MB depending on metrics", not the formula.
- **PeerTube** — docs.joinpeertube.org; "1.5GB plenty... usually at most 500MB", tiered guidance.
- **Vikunja** — vikunja.io/docs/installing; ~256MB min, pin the exact quote locally.

## Unverified / held (not sent further)
- **Collection: "runs on a 1GB VPS"** — 3 qualifiers (gitea 1024, grafana 512, pi-hole 512);
  Nextcloud excluded (per-process 128MB, Defect Class #3). Vikunja (~256MB) would be a 4th once
  built. Still thin; revisit once Portainer/Netdata/PeerTube/Vikunja ship.
- **No new column proposed beyond GPU/community-figures** — pacing is one schema change/batch.
- **Below the ≥14 score bar** (do not re-propose without new sourceability evidence): Navidrome
  (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12), BookStack (12),
  Firefly III (12), Zabbix (13, stale legacy floor), NetBox (12, collision risk), Outline (no
  reqs doc), Authentik (~12-13, stale floor vs. real 7.4GB deployment issue).
  Run #4: Matrix Synapse (12, scoped caveat only, chat saturated), FreshRSS (11, no figure),
  Umami (11, superseded by Plausible CE), Karakeep (10), Beszel (10), Passbolt (9), Wiki.js (9),
  Duplicati (9), Kavita (8), Kopia (7), Calibre-Web (6) — no fetchable official figure.
  Run #6: Actual Budget (13, near-miss, fully read, zero figure), NocoDB (11, high egress risk),
  Tandoor Recipes (10, category below-bar already), ntfy (9, only illustrative K8s manifests —
  misharvest trap), Homepage/gethomepage (9, widget aggregator not workload), Listmonk (9, high
  egress risk), changedetection.io (8, docs+wiki confirmed blocked).
  Run #8: Docmost (11, 21.1k stars, zero figures, wiki category thick), Baserow (10, zero
  figures), Woodpecker CI (~8, doc paths unlocated, not confirmed unreachable), Cachet (8, no
  RAM/CPU, crowds Uptime Kuma).
- Rejected: **"ARM/Pi-ready" collection** — 14/14 live entries already arm64/armv7, zero value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).

### Freshness work
None crossing the 90-day line. Oldest live entries retrieved 2026-07-24 (7 days). Docker-size
figures on rolling `latest` tags get re-checked every AUDIT, not just the 90-day sweep.

## Rejected (the graveyard — do not re-propose without new evidence)
- Static JSON "API hub" (2026-07-24): occupied + dead channels + LLM drain.
- Classroom mail-merge printables (2026-07-24): free no-signup incumbents, identical privacy
  claim.
- Emergency binder generator (2026-07-24): demand unevidenced twice; trust paradox.
- CC0 trivia bank (2026-07-24): channels collapsed; accuracy-trust contradiction.
- Any calculator/tool or game (standing owner exclusion — never propose).
