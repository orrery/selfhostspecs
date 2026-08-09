# Backlog — opportunities

Statuses: `unverified` → `queued` (verifier sign-off) → `building` → `shipped`, or `rejected`.
Dedupe vs all lists. Harvested-app detail lives in `data/apps/<slug>.json`.

## Shipped — 20 apps live
07-24 (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden, adguard-home,
frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing. 07-30 (+3): discourse,
zulip, rocket-chat. 08-02 (+1): openproject. 08-09 (+2): plausible-ce, open-webui.
Pending BUILD, paced 1 schema-change/batch: GPU/transcoding column (Jellyfin, Immich,
Frigate); community-figures column (vaultwarden, adguard-home, uptime-kuma, syncthing,
paperless-ngx).

## In pipeline (not yet live)
- **pending-second-qa** (fresh-eyes re-QA settles next run): Linkwarden (fixed 08-09, dead
  source link repointed), Chatwoot, Seafile, Mattermost (all 3 cleared independent
  verification + QA 08-09, zero defects).

## Queued (verifier-signed), unbuilt
- **GitLab CE** (18/20, #8) — "8 vCPU / 16 GB" single-node. Deps: PostgreSQL +
  Redis-or-Valkey. Gitaly bundled.
- **Zammad** (16/20, #8) — "2 CPU cores; 6 GB RAM (+4 GB if Elasticsearch)". PostgreSQL req.
- **Ghost** (17/20, #9) — "at least 1GB memory" (Ubuntu+CLI+MySQL prod path); BUILD resolves
  min-vs-rec. MySQL 8 required.
- **Mastodon** (16/20, #9) — zero official RAM/CPU min — ship `no_official_figure: true`
  linking mastodon/documentation#912+#805. Postgres+Redis required; ES optional; Sidekiq
  bundled.
- **Lemmy** (16/20, #9) — "roughly 150 MB of RAM in the default Docker installation."
  Unlabeled — BUILD decides field. PostgreSQL required; pict-rs own container — add to enum.
- **Netdata** (unblocked, #9) — "100MB to 200MB of RAM".
- **Portainer** (unblocked, #9) — zero figure; ship `no_official_figure: true` linking
  portainer/portainer#5406.
- **Wekan** (15/20, #10) — "1 GB RAM minimum... Production minimum 4 GB" (BUILD resolves per
  Ghost precedent). **Flag:** required `ferretdb` isn't real MongoDB — no enum slot.
- **Directus** (17/20, #11) — "min 1x 0.25 vCPU/512MB, rec 2x1vCPU/2GB." Deps: one DB (6
  vendors, OR); Redis optional. Docker `directus/directus`, arm64+amd64.
- **Supabase self-hosted** (16/20, #11) — ~107.5k★. "RAM 4GB (rec 8GB+) / CPU 2 cores (rec
  4+)". **Flag:** 11 compose services, 7 non-removable — decide schema modeling before BUILD.
- **Twenty CRM** (17/20, #12) — "at least 2GB of RAM," no CPU figure. Deps: postgres+redis
  required. Docker `twentycrm/twenty`, arm64+amd64.
- **Formbricks** (15/20, #12) — "Minimum: 1 vCPU, 2 GB RAM, 8 GB SSD." Deps: 4 required
  (postgres, redis/valkey, hub, cube); taxonomy/vllm optional. Docker
  `ghcr.io/formbricks/formbricks`, arm64+amd64.
- **Zigbee2MQTT** (14/20, #12) — no official figure. Docker: zigbee2mqtt pkgs page, 6-arch.
  **Blocked:** needs external MQTT broker; `SERVICES` enum has no `mqtt` value.
- **Jenkins** (19/20, #13) — "Min: 256MB RAM, 1GB disk (10GB rec. if Docker)." Rec (small
  team): "4GB+ RAM, 50GB+ disk". No deps. Docker `jenkins/jenkins:lts`, 5-arch. Canonical
  site 403s — mirror only.
- **Coolify** (20/20, #13) — "Min: 2 CPU cores, 2GB RAM, 30GB storage" (control-plane scope).
  Deps: postgres+redis+soketi, all required. Docker `coollabsio/coolify:latest`, amd64+arm64.
- **TriliumNext Trilium** (14/20, #13, marginal) — 37.3k★, transferred from zadam/trilium (not
  the archived fork). Zero figure — ship `no_official_figure: true`. No deps. Docker
  `triliumnext/trilium:latest`, 4-arch.
- **SearXNG** (15/20, #14) — no official figure. Community (vojkovic, GH #3884): "1vcpu,
  512mb...0 problems". Valkey bundled, opt-in only. Docker `searxng/searxng`, 3-arch, ~97MB.
  35.1k★.
- **Stirling-PDF** (16/20, #14) — no official figure; per-variant limits (2G/4G/6G) are
  ceilings not a floor. Community (Frooodle, founder, GH #2945): "400-500mb baseline". No
  deps. Docker `stirlingtools/stirling-pdf`, amd64+arm64. 89.1k★.
- **Keycloak** (18/20, #15) — "at least 750 MB" min / "2 GB" rec, container memory limit,
  community edition, general Docker/Podman (not HA — separate 1250MB/pod HA figure, don't
  conflate). Prod needs external DB (dev mode ships embedded H2).
- **Metabase** (17/20, #15) — `no_official_figure: true`. JVM `-Xmx` tuning prose only, not a
  stated minimum — cite as evidence of absence, Mastodon/Portainer precedent.
- **Wazuh** (17/20, #15) — first SIEM/XDR entry, 16,465★. wazuh-documentation
  `source/quickstart.rst` — **rec** (no min stated) "4 vCPU / 8 GiB RAM / 50GB" for 1-25
  agents. Docker: wazuh-docker single-node compose, 3 containers pinned `:5.1.0`, no external
  DB. **BUILD:** harvest as `_rec_` not `_min_` (#2); note compose defaults untested vs this
  native-install figure (#3).
- **License (SPDX) column** (14/20, #15, conditional) — GitHub API `license.spdx_id` +
  LICENSE cross-check (schema+CI+build.mjs, backfill 24). **BUILD:** never trust `spdx_id`
  alone — 2/3 spot-checked `NOASSERTION` (n8n fair-code; Wazuh dual GPLv2/AGPLv3) — label
  non-OSI explicitly.

## Collection page, verified — buildable
- **"Apps with no separate DB/cache service required"** (#8-10) — 14 members confirmed zero
  `required:true` deps; SERP check found no incumbent. Before BUILD: disclose `required:false`
  ≠ dependency-free (#3) AND write an explicit inclusion criterion (Wekan FerretDB case shows
  ad hoc dep-labeling isn't enough).

## Held (insufficient evidence, not discarded)
- Snipe-IT (~12/20): no figures, readme.io 403. Cal.com (~12/20): zero RAM/CPU figures.
- BigBlueButton (14/20): 16GB/8-core prod min confirmed; bare-Ubuntu install, no single
  Docker image — needs non-container schema allowance.
- PeerTube (rechecked #15): only figure is v3.0.0-era FAQ.md (5 versions stale, current
  8.2.4); current docs redirect to blocked joinpeertube.org — don't ship a superseded figure.
- Vikunja (rechecked #15): docs-mirror angle exhausted — go-vikunja/website grepped clean.
- Plane (~12/20, #11): only an EC2 quick-start advisory — crowds OpenProject. Redmine
  (rechecked #15): `doc/INSTALL` clean, zero figure; `library/redmine` Docker Official Image,
  8-arch — held on figure only.
- AFFiNE (~12/20, #11): repo grep empty; docs.affine.pro blocked, no mirror. Forgejo (~7/20,
  #11): Codeberg blocked; GitHub mirror stale/doc-free. Fork of Gitea.
- SonarQube (rechecked #15): figure exists (helm-chart-sonarqube README, "Xmx 1536M community
  build") but it's JVM-heap-not-system-RAM — same gap as parked #13 Helm/K8s column.
- Healthchecks (rechecked+verifier-spot-checked #15): docs blocked, templates/docker README
  clean. Deps ready: postgres required. Docker healthchecks/healthchecks, amd64/arm/v7/arm64.
- **Sentry self-hosted** (12/20, #16, verifier-refuted) — 9.5k★. `getsentry/self-hosted`
  install script hard-enforces `MIN_RAM_HARD=14000`MB/4cores (strong sourcing) but 64-service
  compose, no pull-and-run image (`web` builds locally), kafka not in enum. Supabase-shape,
  worse — hold for deps-schema decision.
- **PostHog self-hosted** (11/20, #16, verifier-refuted) — 37.6k★. Official quote (self-host
  docs "Requirements": "4 vCPU, 16GB RAM, >30GB storage") real, min-vs-rec unlabeled.
  47-service compose, duplicate redis7+valkey / elasticsearch+opensearch need disambiguation;
  kafka/zookeeper/opensearch/temporal not in enum. Same category as Sentry, worse.

## Unverified / held (not sent further)
- Collection "runs on a 1GB VPS": thin (3 qualifiers); revisit once PeerTube/Vikunja ship.
- **Below bar (<14)**, don't re-propose w/o new evidence. 12-13: Navidrome, Audiobookshelf,
  Miniflux, Zabbix, Wallabag, DocuSeal, Actual Budget, Photoprism, Mealie, BookStack, Firefly
  III, NetBox, Matrix Synapse, Authentik. ≤11: Outline, FreshRSS, Umami, NocoDB, Docmost,
  Baserow, Bitwarden, Pixelfed, Karakeep, Beszel, Tandoor Recipes, Headscale, Shiori,
  Passbolt, Wiki.js, Duplicati, ntfy, Homepage, Listmonk, Cachet, EspoCRM, Kavita,
  changedetection.io, Woodpecker CI, Kopia, Calibre-Web.
- Graylog (~8.1k★, #15): docs repo archived, docs.graylog.org presumed blocked — shallow only.
- Rejected: "ARM/Pi-ready" collection — 14/14 live entries already arm64/armv7.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability~2).
- Parked, #13: Helm/K8s-chart column — nextcloud/helm's README disclaims official support
  despite living in the official org — needs an official/unofficial adjudication rule.
- Watch, #13: CI/CD collection (Gitea+Jenkins+GitLab CE) — gate on 3+ built.
- Watch, #16: SERVICES enum gap recurring (Supabase/Sentry/PostHog — kafka, zookeeper,
  object-storage, workflow-engine) — worth one dedicated enum-extension BUILD task.

### Freshness work
None crossing 90 days (oldest retrieved 07-24). Docker-size on `latest` tags re-checks every
AUDIT, not just the 90-day sweep.

## Rejected (graveyard — do not re-propose without new evidence)
- Column "minimum dependency version floor" (07-31): buried in a separate doc subsection.
- 07-24 rejects: Static JSON "API hub"; classroom mail-merge printables; emergency binder
  generator; CC0 trivia bank — full refutations in AUDIT-era history, see git log.
- MinIO (08-01, ~61k★): archived by GitHub, unmaintained — dead upstream.
- Strapi (08-03, ~72.8k★): no official Docker image, zero RAM/CPU figures.
- Glance (08-03, ~36.1k★): only unsourced "Low memory usage" marketing bullet.
- *arr suite + qBittorrent/Transmission/SABnzbd (08-05): no official Docker image/figure —
  Strapi shape.
- Excalidraw (08-06, ~129k★): dev-mode-only compose, no figure — trivial static SPA.
- Matomo (08-08, ~21.7k★): only a PHP `memory_limit` ini directive, not system RAM.
- Memos (08-08, ~62.1k★): zero RAM/CPU mention in-repo, no linkable issue — Excalidraw shape.
- Any calculator/tool or game (owner exclusion — never propose).
</content>
