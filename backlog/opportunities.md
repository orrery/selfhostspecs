# Backlog — opportunities

Statuses: `unverified` → `queued` (verifier sign-off) → `building` → `shipped`, or `rejected`
(graveyard, with refutation). Dedupe against BOTH lists. Full source/quote/deps detail for
anything already harvested lives in `data/apps/<slug>.json` — this file need not duplicate it.

## Shipped — 18 apps live
2026-07-24 first cycle (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden,
adguard-home, frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing.
2026-07-30 (+3): discourse, zulip, rocket-chat. 2026-08-02 (+1): openproject.
Pending BUILD, paced 1 schema-change/batch: GPU/hardware-transcoding column (Jellyfin, Immich,
Frigate); community-figures column (vaultwarden, adguard-home, uptime-kuma, syncthing,
paperless-ngx).

## In pipeline (not yet live)
- **pending-second-qa** (verified, fixed 08-02, next re-QA settles to live): Plausible CE,
  Linkwarden, Open WebUI.
- **pending-verification** (harvested 08-02 from FIND run #7 queue, independent re-fetch pass
  in flight): Chatwoot (18/20, postgresql+redis), Seafile (16/20, mariadb+redis), Mattermost
  (15/20, postgresql only, amd64-only image).

## Queued (verifier-signed), unbuilt
- **GitLab CE** (18/20, run #8) — `raw.githubusercontent.com/gitlabhq/gitlabhq/master/doc/
  install/requirements.md` — "8 vCPU / 16 GB is the baseline" single-node (alt 8GB
  memory-constrained floor also documented). Deps: PostgreSQL + Redis-or-Valkey. Gitaly bundled.
- **Zammad** (16/20, run #8) — `raw.githubusercontent.com/zammad/zammad-documentation/main/
  prerequisites/hardware.rst` — "2 CPU cores; 6 GB RAM (+4 GB if Elasticsearch)". PostgreSQL
  required. 2nd support-adjacent app — watch category crowding vs. Chatwoot.
- **Ghost** (17/20, run #9) — `raw.githubusercontent.com/TryGhost/Docs/main/install/
  ubuntu.mdx` — "A server with at least 1GB memory" (Ubuntu+CLI+MySQL prod path); BUILD
  resolves min-vs-rec. MySQL 8 required. Docker-preview's "2GB/1CPU droplet" is illustrative.
- **Mastodon** (16/20, run #9) — zero official RAM/CPU min (full docs read) — ship
  `no_official_figure: true` linking mastodon/documentation#912 + #805. PostgreSQL + Redis
  required; Elasticsearch optional; Sidekiq/streaming bundled.
- **Lemmy** (16/20, run #9) — `raw.githubusercontent.com/LemmyNet/lemmy-docs/main/src/
  administration/administration.md` — "roughly 150 MB of RAM in the default Docker
  installation. CPU usage is negligible." Unlabeled min/rec — BUILD decides field. PostgreSQL
  required; pict-rs is its own container, not bundled — add to deps enum.
- **Netdata** (unblocked, run #9) — `raw.githubusercontent.com/netdata/netdata/master/docs/
  netdata-agent/sizing-netdata-agents/ram-requirements.md` — "100MB to 200MB of RAM".
- **Portainer** (unblocked, run #9) — confirmed zero RAM/CPU figure; ship
  `no_official_figure: true` linking portainer/portainer#5406.
- **Wekan** (15/20, run #10) — `raw.githubusercontent.com/wekan/wekan/master/README.md` —
  "1 GB RAM minimum free... Production server should have minimum total 4 GB RAM" (BUILD
  resolves per Ghost precedent). **Flag:** required `ferretdb` container (embedded SQLite,
  Mongo-wire-protocol) is NOT real MongoDB — no enum slot yet, needs a schema decision; don't
  auto-add to the no-DB/cache collection below pending that call.
- **Directus** (17/20, run #11) — `raw.githubusercontent.com/directus/docs/main/content/
  self-hosting/2.requirements.md` — "required minimum system requirements are 1x 0.25 vCPU /
  512 MB, although the recommended minimum is 2x 1 vCPU / 2GB." Deps: one DB required
  (Postgres/MySQL/SQLite/MSSQL/MariaDB/CockroachDB/OracleDB, OR); Redis optional — required
  only "with horizontally scaling your Directus instance" (quote in full, don't clip). Docker
  `directus/directus`, arm64+amd64.
- **Supabase self-hosted** (16/20, run #11) — ~107.5k stars. `raw.githubusercontent.com/
  supabase/supabase/master/apps/docs/content/guides/self-hosting/docker.mdx#system-
  requirements` — "Minimum requirements for running all Supabase components, suitable for
  development and small to medium production workloads: RAM 4GB (rec 8GB+) / CPU 2 cores (rec
  4 cores+) / Disk 40GB SSD (rec 80GB+)". **Flag — most complex deps object this DB would ever
  model:** 11 default-compose services — 7 non-removable core (studio, kong, auth, rest, meta,
  db, supavisor) + 4 individually removable (realtime, storage, imgproxy, functions, per
  official doc note). Logflare+Vector (analytics) excluded from default compose entirely, added
  only via a separate override file. Decide the schema's "removable-if-unneeded" modeling
  approach before BUILD starts — no existing app has more than 2 required deps.

## Collection page, verified — buildable
- **"Apps with no separate DB/cache service required"** (run #8-10) — 14 members confirmed
  zero `required:true` deps; SERP check found no incumbent. Before BUILD: disclose
  `required:false` ≠ dependency-free (Defect Class #3 shape) AND write an explicit inclusion
  criterion (Wekan's FerretDB case shows ad hoc dep-labeling isn't enough).

## Held (insufficient evidence, not discarded)
- Keycloak (~13/20): no reachable OSS docs source; keycloak.org/server/containers 403 (re-tried
  08-02).
- Snipe-IT (~12/20): README has no figures, readme.io 403.
- Cal.com (~12/20): confirmed zero production RAM/CPU figures; needs channel-value case.
- Metabase (~13-14/20): metabase.com/learn has a figure but domain hard-blocks, no GitHub mirror.
- BigBlueButton (14/20): 16GB/8-core prod min confirmed, but installs via `bbb-install.sh` onto
  bare Ubuntu — no official single Docker image for the core server; needs a schema allowance
  for non-containerized apps first.
- PeerTube: hardware guidance only on blocked FramaGit/docs.joinpeertube.org ("1.5GB plenty...
  usually at most 500MB", tiered) — still no reachable mirror.
- Vikunja: go-vikunja/website clones fine but the ~256MB figure not yet located in it.
- Plane (~12/20, run #11): only sourced figure is EC2 quick-start advisory text, not a formal
  requirements section — thin provenance; also crowds OpenProject's category.
- Redmine (~9/20, run #11): GitHub-mirror INSTALL doc has zero RAM/CPU mention; redmine.org
  itself fully unreachable this session — access blind spot, not a confirmed absence, retry
  before final disposition.
- AFFiNE (~12/20, run #11): full repo grep for RAM/CPU came up empty; docs.affine.pro blocked,
  no GitHub-mirrored docs repo to fall back on — blind spot, pattern-matches Homepage/Glance.
- Forgejo (~7/20, run #11): canonical repo on Codeberg, fully session-blocked; GitHub only hosts
  a stale doc-free unofficial mirror. Hard fork of shipped Gitea, likely near-identical figures
  (unverified) — low channel-value even if sourced.

## Unverified / held (not sent further)
- Collection "runs on a 1GB VPS": thin (3 qualifiers); revisit once PeerTube/Vikunja ship.
- No new column beyond GPU/community-figures this run (pacing: one schema change/batch).
- **Below ≥14 score bar** (don't re-propose w/o new sourceability evidence): Navidrome(13),
  Audiobookshelf(13), Miniflux(13), Photoprism(12), Mealie(12), BookStack(12), Firefly III(12),
  Zabbix(13), NetBox(12), Outline(no doc), Authentik(~12-13), Matrix Synapse(12), FreshRSS(11),
  Umami(11), Karakeep(10), Beszel(10), Passbolt(9), Wiki.js(9), Duplicati(9), Kavita(8),
  Kopia(7), Calibre-Web(6), Actual Budget(13), NocoDB(11), Tandoor Recipes(10), ntfy(9),
  Homepage(9), Listmonk(9), changedetection.io(8), Docmost(11), Baserow(10), Woodpecker CI(~8),
  Cachet(8), Headscale(10), Bitwarden(11), Pixelfed(11).
- Rejected: "ARM/Pi-ready" collection — 14/14 live entries already arm64/armv7, no value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).

### Freshness work
None crossing 90 days (oldest retrieved 2026-07-24). Docker-size on rolling `latest` tags
re-checks every AUDIT, not just the 90-day sweep.

## Rejected (the graveyard — do not re-propose without new evidence)
- Column "minimum dependency version floor" (07-31): not a free byproduct, buried in a
  separate doc subsection.
- Static JSON "API hub" (07-24): occupied + dead channels + LLM drain.
- Classroom mail-merge printables (07-24): free no-signup incumbents, identical privacy claim.
- Emergency binder generator (07-24): demand unevidenced twice; trust paradox.
- CC0 trivia bank (07-24): channels collapsed; accuracy-trust contradiction.
- MinIO (08-01, ~61k stars): repo archived by GitHub, README declares unmaintained — dead
  upstream.
- Strapi (08-03, ~72.8k stars): no official Docker image at all, zero RAM/CPU figures anywhere.
- Glance (08-03, ~36.1k stars): only a "Low memory usage" marketing bullet, nothing sourced —
  same failure mode as Homepage.
- Any calculator/tool or game (owner exclusion — never propose).
</content>
