# Backlog — opportunities

Statuses: `unverified` → `queued` (verifier sign-off) → `building` → `shipped`, or `rejected`
(graveyard below, with refutation). Dedupe against BOTH lists.

## Shipped — 17 apps live
2026-07-24 first cycle (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden,
adguard-home, frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing.
2026-07-30 (+3, re-QA settled from 07-26 batch): discourse, zulip, rocket-chat. See DECISIONS.md.

Pending BUILD, paced 1 schema-change/batch: GPU/hardware-transcoding column (Jellyfin, Immich,
Frigate); community-figures column (vaultwarden, adguard-home, uptime-kuma, syncthing,
paperless-ngx).

## Built, pending-second-qa — 2026-07-30 batch
OpenProject, Plausible CE, Linkwarden, Open WebUI — harvested, independently verified, QA-clean;
live in data/apps/, not yet moved to Shipped (needs fresh-eyes re-QA per unattended-run rule).
Detail: DECISIONS.md 2026-07-30.

## Queued (verifier-signed), still unbuilt — 2026-07-31 FIND run #8
- **GitLab CE** (18/20) — full DevOps platform, distinct from Gitea. `raw.githubusercontent.com/
  gitlabhq/gitlabhq/master/doc/install/requirements.md` — "8 vCPU is the baseline" / "16 GB is
  the baseline" single-node (confirmed the real general min, not the ref-arch tier table; alt
  8GB memory-constrained floor also documented). Deps: PostgreSQL + Redis-or-Valkey (required).
  Gitaly is bundled-internal — not an external dep (Defect Class #12).
- **Zammad** (16/20) — ticket-queue helpdesk, distinct from Chatwoot despite adjacency.
  `raw.githubusercontent.com/zammad/zammad-documentation/main/prerequisites/hardware.rst` —
  Minimum Setup: "2 CPU cores; 6 GB of RAM (+4 GB if Elasticsearch on same server)". PostgreSQL
  required. 2nd support-adjacent app — watch category crowding.

## Collection page, verified with caveat, pending SERP check — 2026-07-31
- **"Apps with no separate DB/cache service required"** — verifier confirmed 14 members have
  zero `required:true` deps (spot-checked 9+ JSONs). **Real risk:** `required:false` ≠
  dependency-free in production (Discourse AIO bundles Postgres/Redis; Nextcloud-on-SQLite is
  docs-discouraged — Defect Class #3 shape); page copy must disclose this before BUILD. SERP
  check still not done.

## Queued (verifier-signed), still unbuilt — 2026-08-01 FIND run #9
- **Ghost** (17/20) — ~52.5k stars, first blogging/CMS entry. `raw.githubusercontent.com/
  TryGhost/Docs/main/install/ubuntu.mdx` — "A server with at least 1GB memory" (Prerequisites,
  Ubuntu+Ghost-CLI+MySQL prod path); install.mdx corroborates "recommend...1GB" — BUILD resolves
  min-vs-rec. MySQL 8 required. Docker-preview path bundles Caddy (internal), defaults to
  *hosted* ActivityPub (not a dep); its "2GB/1CPU droplet" is illustrative, not a figure.
- **Mastodon** (16/20) — ~50k stars, federated microblogging, new category. Zero official
  RAM/CPU minimum confirmed (full docs read) — ship `no_official_figure: true` linking
  mastodon/documentation#912 and #805. PostgreSQL + Redis required (config.md core section);
  Elasticsearch optional (illustrative heap example); Sidekiq/streaming bundled-internal.
- **Lemmy** (16/20) — ~14.5k stars, federated link-aggregation (3rd social app — watch
  crowding). `raw.githubusercontent.com/LemmyNet/lemmy-docs/main/src/administration/
  administration.md` — "Lemmy uses roughly 150 MB of RAM in the default Docker installation.
  CPU usage is negligible." Unlabeled min/rec, near-empty-instance scope — BUILD decides field.
  PostgreSQL required; pict-rs is its own compose container, not bundled — add to deps enum.
- **Netdata** (unblocked) — cite `raw.githubusercontent.com/netdata/netdata/master/docs/
  netdata-agent/sizing-netdata-agents/ram-requirements.md` (not netdata/learn, wrong path) —
  "Netdata by default should need 100MB to 200MB of RAM, depending on the number of metrics
  being collected."
- **Portainer** (unblocked) — `start/requirements-and-prerequisites.md` confirmed zero RAM/CPU
  figure; ship `no_official_figure: true` linking portainer/portainer#5406.

## Held (insufficient evidence, not discarded)
- **Keycloak** (~13/20, run #8) — no reachable OSS keycloak-docs source (paths 404, GitHub API
  contents failed); Red Hat's downstream docs declined (different product).
- **Snipe-IT** (~12/20, run #8) — README has no figures, readme.io 403.
- **Cal.com** (~12/20, run #8) — confirmed zero production RAM/CPU figures (dev-only Node heap
  flag correctly not harvested). Open WebUI-shape; needs channel-value case.
- **Metabase** (~13-14/20, run #9) — likely-official metabase.com/learn page states "1 core and
  1GB RAM baseline, +1CPU/2GB per 20 concurrent users" (distinct from the JVM-heap guide/
  Discourse post already ruled community-figure); domain hard-blocks fetch, no GitHub mirror.

## Queued (verifier-signed), still unbuilt — 2026-07-30 FIND run #7
All reachable via GitHub-hosted mirrors — buildable now (standalone docs domains 403, use mirror).
- **Chatwoot** (18/20) — 34.9k stars. `raw.githubusercontent.com/chatwoot/docs/main/self-hosted/
  deployment/requirements.mdx` — "4GB RAM required minimum... up to 10,000 conversations/day" /
  4 cores rec. Deps: PostgreSQL + Redis>=7.0 (required).
- **Seafile** (16/20) — 15.1k stars, distinct from Nextcloud/Syncthing.
  `raw.githubusercontent.com/haiwen/seafile-admin-docs/master/manual/setup/
  system_requirements.md` — CE: 2G RAM, 2 cores >2GHz rec, 10G/50G storage. CE only, don't
  conflate Pro tier figures in same doc.
- **Mattermost** (15/20, 3rd chat entry — tempered crowding concern, distinct on-prem demand).
  `raw.githubusercontent.com/mattermost/docs/master/source/deployment-guide/
  software-hardware-requirements.rst` — **1-1,000 users: 1 vCPU/2GB (true floor)**,
  1,000-2,000: 2 vCPU/4GB. BUILD must harvest the first tier, not the second (FIND mis-collapsed
  this once already, verifier caught it).
- **BigBlueButton** (14/20) — video conferencing, 9.2k stars, no crowding.
  `raw.githubusercontent.com/bigbluebutton/bigbluebutton/develop/docs/docs/administration/
  install.md` (v3.0.32) — production min: 16GB/8 cores/Ubuntu 22.04/500GB (50GB w/o recordings).
  FIND's initial 8GB/4-core/Ubuntu 20.04 was the dev/local tier — verifier caught the
  min-vs-tier conflation.

## Queued (verifier-signed), still unbuilt — 2026-07-24/25 FIND runs #2/#3
Still blocked (no GitHub mirror found; standalone docs domain hard-blocks):
- **PeerTube** — hardware guidance only on FramaGit-hosted marketing FAQ (FramaGit itself
  403s); docs.joinpeertube.org unreachable. "1.5GB plenty... usually at most 500MB", tiered.
- **Vikunja** — go-vikunja/website clones fine but the ~256MB figure isn't located in it yet;
  needs a full-site read. vikunja.io/docs unreachable directly.
Netdata/Portainer unblocked 2026-08-01 (FIND run #9, see below) — `git clone` of GitHub
HTML-hosted doc repos reaches further than raw-path guessing.

## Unverified / held (not sent further)
- **Collection: "runs on a 1GB VPS"** — 3 qualifiers (gitea 1024, grafana 512, pi-hole 512);
  Nextcloud excluded (Defect Class #3). Thin; Netdata/Portainer ship `no_official_figure` so
  don't qualify — revisit once PeerTube/Vikunja ship.
- No new column beyond GPU/community-figures this run (pacing: one schema change/batch).
- **Below the ≥14 score bar** (do not re-propose without new sourceability evidence): Navidrome
  (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12), BookStack (12),
  Firefly III (12), Zabbix (13, stale floor), NetBox (12, collision risk), Outline (no reqs
  doc), Authentik (~12-13, stale floor vs. real 7.4GB issue).
  Run #4: Matrix Synapse (12, scoped caveat only, chat saturated), FreshRSS (11, no figure),
  Umami (11, superseded by Plausible CE), Karakeep (10), Beszel (10), Passbolt (9), Wiki.js (9),
  Duplicati (9), Kavita (8), Kopia (7), Calibre-Web (6) — no fetchable official figure.
  Run #6: Actual Budget (13, fully read, zero figure), NocoDB (11, high egress risk), Tandoor
  Recipes (10), ntfy (9, illustrative K8s manifests only — misharvest trap), Homepage (9, widget
  aggregator not workload), Listmonk (9, high egress risk), changedetection.io (8, blocked).
  Run #8: Docmost (11, 21.1k stars, zero figures, wiki category thick), Baserow (10, zero
  figures), Woodpecker CI (~8, doc paths unlocated, not confirmed unreachable), Cachet (8, no
  RAM/CPU, crowds Uptime Kuma).
  Run #9: Headscale (10, zero figures, "under 100MB" unofficial), Bitwarden (11, stale 2022
  table, current Unified/Lite repo has no figures either), Pixelfed (11, zero figures).
- Rejected: **"ARM/Pi-ready" collection** — 14/14 live entries already arm64/armv7, no value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).

### Freshness work
None crossing the 90-day line (oldest live entries retrieved 2026-07-24, 8 days). Docker-size
figures on rolling `latest` tags re-check every AUDIT, not just the 90-day sweep.

## Rejected (the graveyard — do not re-propose without new evidence)
- Column "minimum dependency version floor" (2026-07-31): not a free byproduct — GitLab's
  version table lives in a separate doc subsection, only found by full-page read.
- Static JSON "API hub" (2026-07-24): occupied + dead channels + LLM drain.
- Classroom mail-merge printables (2026-07-24): free no-signup incumbents, identical privacy
  claim.
- Emergency binder generator (2026-07-24): demand unevidenced twice; trust paradox.
- CC0 trivia bank (2026-07-24): channels collapsed; accuracy-trust contradiction.
- MinIO (2026-08-01, ~61k stars): repo archived by GitHub 2026-04-25, README declares no
  longer maintained, source-only going forward — dead upstream.
- Any calculator/tool or game (standing owner exclusion — never propose).
