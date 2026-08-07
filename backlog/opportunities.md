# Backlog — opportunities

Statuses: `unverified` → `queued` (verifier sign-off) → `building` → `shipped`, or `rejected`
(w/ refutation). Dedupe vs both lists. Harvested-app detail lives in `data/apps/<slug>.json`.

## Shipped — 18 apps live
07-24 first cycle (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden,
adguard-home, frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing.
07-30 (+3): discourse, zulip, rocket-chat. 08-02 (+1): openproject.
Pending BUILD, paced 1 schema-change/batch: GPU/hardware-transcoding column (Jellyfin, Immich,
Frigate); community-figures column (vaultwarden, adguard-home, uptime-kuma, syncthing,
paperless-ngx).

## In pipeline (not yet live)
- **pending-second-qa** (fixed 08-02, next re-QA settles to live): Plausible CE, Linkwarden,
  Open WebUI.
- **pending-verification** (harvested 08-02 from FIND #7, re-fetch pass in flight):
  Chatwoot (postgresql+redis), Seafile (mariadb+redis), Mattermost (postgresql, amd64-only).

## Queued (verifier-signed), unbuilt
- **GitLab CE** (18/20, #8) — gitlabhq install/requirements.md — "8 vCPU / 16 GB baseline"
  single-node (alt: 8GB memory-constrained floor). Deps: PostgreSQL + Redis-or-Valkey. Gitaly
  bundled.
- **Zammad** (16/20, #8) — zammad-documentation hardware.rst — "2 CPU cores; 6 GB RAM
  (+4 GB if Elasticsearch)". PostgreSQL required.
- **Ghost** (17/20, #9) — TryGhost/Docs install/ubuntu.mdx — "at least 1GB memory"
  (Ubuntu+CLI+MySQL prod path); BUILD resolves min-vs-rec. MySQL 8 required. Docker-preview's
  "2GB/1CPU droplet" is illustrative only.
- **Mastodon** (16/20, #9) — zero official RAM/CPU min (full docs read) — ship
  `no_official_figure: true` linking mastodon/documentation#912 + #805. PostgreSQL + Redis
  required; Elasticsearch optional; Sidekiq/streaming bundled.
- **Lemmy** (16/20, #9) — lemmy-docs administration.md — "roughly 150 MB of RAM in the
  default Docker installation. CPU usage is negligible." Unlabeled — BUILD decides field.
  PostgreSQL required; pict-rs own container, not bundled — add to deps enum.
- **Netdata** (unblocked, #9) — netdata ram-requirements.md — "100MB to 200MB of RAM".
- **Portainer** (unblocked, #9) — zero RAM/CPU figure; ship `no_official_figure: true`
  linking portainer/portainer#5406.
- **Wekan** (15/20, #10) — wekan README — "1 GB RAM minimum free... Production server
  should have minimum total 4 GB RAM" (BUILD resolves per Ghost precedent). **Flag:** required
  `ferretdb` is NOT real MongoDB — no enum slot yet; don't auto-add to no-DB/cache collection.
- **Directus** (17/20, #11) — directus/docs self-hosting/2.requirements.md — "required
  minimum ... 1x 0.25 vCPU / 512 MB, recommended minimum is 2x 1 vCPU / 2GB." Deps: one DB
  required (6 vendors, OR); Redis optional — only "with horizontally scaling". Docker
  `directus/directus`, arm64+amd64.
- **Supabase self-hosted** (16/20, #11) — ~107.5k★. supabase docker.mdx#system-requirements —
  "RAM 4GB (rec 8GB+) / CPU 2 cores (rec 4 cores+) / Disk 40GB SSD (rec 80GB+)" for all
  components. **Flag:** 11 default-compose services, 7 non-removable core + 4 individually
  removable. Decide schema's "removable-if-unneeded" modeling before BUILD.
- **Twenty CRM** (17/20, #12) — twenty-docs docker-compose.mdx — "at least 2GB of RAM." No
  CPU figure. Deps: postgres+redis required. Docker `twentycrm/twenty`, arm64+amd64.
- **Formbricks** (15/20, #12) — formbricks self-hosting/overview.mdx — "Minimum Setup: 1
  vCPU, 2 GB RAM, 8 GB SSD." Deps: 4 required (postgres, redis/valkey, hub, cube); taxonomy/
  vllm optional. Docker `ghcr.io/formbricks/formbricks`, arm64+amd64.
- **Zigbee2MQTT** (14/20, #12) — no official RAM/CPU figure. Docker:
  `github.com/Koenkk/zigbee2mqtt/pkgs/container/zigbee2mqtt`, 6-arch. **Blocked:** needs
  external MQTT broker; `SERVICES` enum has no `mqtt` value.
- **Jenkins** (19/20, #13) — jenkins-infra/jenkins.io installation_requirements.adoc —
  "Minimum: 256MB RAM, 1GB disk (10GB rec. if Docker)." Rec (scope: small team): "4GB+ RAM,
  50GB+ disk". No deps (on-disk XML). Docker
  `jenkins/jenkins:lts`, amd64+arm64+s390x+ppc64le+riscv64. Canonical site 403s — mirror only.
- **Coolify** (20/20, #13) — coollabsio/coolify-docs installation.mdx — "Minimum: 2 CPU
  cores, 2GB RAM, 30GB storage" (control-plane scope, doc separates per-project resources).
  Deps: postgres+redis+soketi, all required (compose-confirmed). Docker
  `coollabsio/coolify:latest`, amd64+arm64. Canonical site 403s.
- **TriliumNext Trilium** (14/20, #13, marginal) — 37.3k★, transferred from zadam/trilium
  (don't confuse w/ archived TriliumNext/Notes fork, 2.9k★). Zero official RAM/CPU figure
  anywhere (full-tree grep, 2 passes) — ship `no_official_figure: true`; BUILD should search
  harder for a linkable issue. No deps. Docker `triliumnext/trilium:latest`,
  amd64+arm64+armv7+armv8(legacy).
- **SearXNG** (15/20, #14) — searxng/searxng docs/: no official RAM/CPU fig. Community
  (vojkovic, GH discussion #3884): "1vcpu, 512mb...0 problems". Valkey bundled but only for
  opt-in rate-limiter — not required. Docker `searxng/searxng`, amd64+arm64+armv7, ~97MB.
  35.1k★.
- **Stirling-PDF** (16/20, #14) — Stirling-Tools/Stirling-PDF: no official RAM/CPU fig;
  per-variant memory limits (2G/4G/6G) are ceilings, not a floor — don't harvest as spec.
  Community (Frooodle, founder, GH discussion #2945): "400-500mb is baseline for the security
  and database requirements" (security-variant scope). No deps, single container. Docker
  `stirlingtools/stirling-pdf`, amd64+arm64 only (2 more manifest entries are SBOM/attestation
  data, not arches). 89.1k★, highest in backlog.

## Collection page, verified — buildable
- **"Apps with no separate DB/cache service required"** (#8-10) — 14 members confirmed
  zero `required:true` deps; SERP check found no incumbent. Before BUILD: disclose
  `required:false` ≠ dependency-free (Defect Class #3) AND write an explicit inclusion
  criterion (Wekan's FerretDB case shows ad hoc dep-labeling isn't enough).

## Held (insufficient evidence, not discarded)
- Keycloak (~13/20): keycloak.org 403.
- Snipe-IT (~12/20): README has no figures, readme.io 403.
- Cal.com (~12/20): zero RAM/CPU figures.
- Metabase (~13-14/20): figure exists at metabase.com/learn but blocked, no mirror.
- BigBlueButton (14/20): 16GB/8-core prod min confirmed; bare-Ubuntu `bbb-install.sh`,
  no single Docker image — needs non-container schema allowance.
- PeerTube: guidance only on blocked docs ("1.5GB plenty...~500MB", tiered) — no mirror.
- Vikunja: repo clones fine; ~256MB figure not located.
- Plane (~12/20, #11): only an EC2 quick-start advisory, not formal reqs — crowds OpenProject.
- Redmine (~9/20, #11): still zero RAM/CPU mention (retried 08-05); redmine.org unreachable.
  `library/redmine` is a Docker Official Image, 8-arch — held on figure only.
- AFFiNE (~12/20, #11): repo grep empty; docs.affine.pro blocked, no mirror.
- Forgejo (~7/20, #11): Codeberg blocked; GitHub mirror stale/doc-free. Fork of Gitea.
- SonarQube (~13-14/20, #13): docs blocked, 2 mirrors tried (Sonar-Docs archived/empty;
  docker-sonarqube kernel-tuning only) — no figure found.
- Healthchecks (~13/20, #13): docs blocked; source-repo templates (closest mirror) checked,
  zero figure. Deps ready: postgres required. Docker healthchecks/healthchecks, amd64/arm/v7/arm64.

## Unverified / held (not sent further)
- Collection "runs on a 1GB VPS": thin (3 qualifiers); revisit once PeerTube/Vikunja ship.
- **Below bar (<14)**, don't re-propose w/o new evidence. 12-13 (recheck-worthy): Navidrome,
  Audiobookshelf, Miniflux, Zabbix, Wallabag, DocuSeal, Actual Budget, Photoprism, Mealie,
  BookStack, Firefly III, NetBox, Matrix Synapse, Authentik. ≤11 (unlikely ever): Outline(no
  doc), FreshRSS, Umami, NocoDB, Docmost, Baserow, Bitwarden, Pixelfed, Karakeep, Beszel,
  Tandoor Recipes, Headscale, Shiori, Passbolt, Wiki.js, Duplicati, ntfy, Homepage, Listmonk,
  Cachet, EspoCRM, Kavita, changedetection.io, Woodpecker CI, Kopia, Calibre-Web.
- Rejected: "ARM/Pi-ready" collection — 14/14 live entries already arm64/armv7, no value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).
- Parked, #13: Helm/K8s-chart column — nextcloud/helm's own README disclaims official
  support despite living in the official org; same official/unofficial adjudication problem
  as community-figures, needs a rule before buildable.
- Watch, #13: "CI/CD & dev-platform requirements" collection (Gitea+Jenkins+GitLab CE) —
  gate on 3+ built entries (only Gitea live today).

### Freshness work
None crossing 90 days (oldest retrieved 07-24). Docker-size on rolling `latest` tags re-checks
every AUDIT, not just the 90-day sweep.

## Rejected (graveyard — do not re-propose without new evidence)
- Column "minimum dependency version floor" (07-31): buried in a separate doc subsection.
- 07-24 rejects: Static JSON "API hub" (occupied+dead channels+LLM drain); classroom
  mail-merge printables (free incumbents, same privacy claim); emergency binder generator
  (demand unevidenced twice, trust paradox); CC0 trivia bank (channels collapsed,
  accuracy-trust contradiction).
- MinIO (08-01, ~61k★): archived by GitHub, README declares unmaintained — dead upstream.
- Strapi (08-03, ~72.8k★): no official Docker image, zero RAM/CPU figures anywhere.
- Glance (08-03, ~36.1k★): only "Low memory usage" marketing bullet, unsourced — same
  failure mode as Homepage.
- *arr suite (Sonarr/Radarr/Prowlarr/Lidarr/Bazarr/Readarr/Whisparr) + qBittorrent/Transmission/
  SABnzbd (08-05): no official Docker image, no RAM/CPU figure anywhere — Strapi shape.
- Excalidraw (08-06, ~129k★): dev-mode-only compose, no RAM/CPU figure — trivial static SPA.
- Any calculator/tool or game (owner exclusion — never propose).
</content>
