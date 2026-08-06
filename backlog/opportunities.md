# Backlog — opportunities

Statuses: `unverified` → `queued` (verifier sign-off) → `building` → `shipped`, or `rejected`
(graveyard, w/ refutation). Dedupe against BOTH lists. Full source/quote/deps detail for
anything already harvested lives in `data/apps/<slug>.json` — this file need not duplicate it.

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
- **pending-verification** (harvested 08-02 from FIND run #7, re-fetch pass in flight):
  Chatwoot (postgresql+redis), Seafile (mariadb+redis), Mattermost (postgresql, amd64-only).

## Queued (verifier-signed), unbuilt
- **GitLab CE** (18/20, run #8) — gitlabhq install/requirements.md — "8 vCPU / 16 GB baseline"
  single-node (alt 8GB memory-constrained floor also documented). Deps: PostgreSQL +
  Redis-or-Valkey. Gitaly bundled.
- **Zammad** (16/20, run #8) — zammad-documentation hardware.rst — "2 CPU cores; 6 GB RAM
  (+4 GB if Elasticsearch)". PostgreSQL required. Watch category crowding vs Chatwoot.
- **Ghost** (17/20, run #9) — TryGhost/Docs install/ubuntu.mdx — "at least 1GB memory"
  (Ubuntu+CLI+MySQL prod path); BUILD resolves min-vs-rec. MySQL 8 required. Docker-preview's
  "2GB/1CPU droplet" is illustrative only.
- **Mastodon** (16/20, run #9) — zero official RAM/CPU min (full docs read) — ship
  `no_official_figure: true` linking mastodon/documentation#912 + #805. PostgreSQL + Redis
  required; Elasticsearch optional; Sidekiq/streaming bundled.
- **Lemmy** (16/20, run #9) — lemmy-docs administration.md — "roughly 150 MB of RAM in the
  default Docker installation. CPU usage is negligible." Unlabeled — BUILD decides field.
  PostgreSQL required; pict-rs own container, not bundled — add to deps enum.
- **Netdata** (unblocked, run #9) — netdata ram-requirements.md — "100MB to 200MB of RAM".
- **Portainer** (unblocked, run #9) — zero RAM/CPU figure; ship `no_official_figure: true`
  linking portainer/portainer#5406.
- **Wekan** (15/20, run #10) — wekan README — "1 GB RAM minimum free... Production server
  should have minimum total 4 GB RAM" (BUILD resolves per Ghost precedent). **Flag:** required
  `ferretdb` is NOT real MongoDB — no enum slot yet; don't auto-add to no-DB/cache collection.
- **Directus** (17/20, run #11) — directus/docs self-hosting/2.requirements.md — "required
  minimum ... 1x 0.25 vCPU / 512 MB, recommended minimum is 2x 1 vCPU / 2GB." Deps: one DB
  required (6 vendors, OR); Redis optional — required only "with horizontally scaling". Docker
  `directus/directus`, arm64+amd64.
- **Supabase self-hosted** (16/20, run #11) — ~107.5k stars. supabase docker.mdx#system-
  requirements — "RAM 4GB (rec 8GB+) / CPU 2 cores (rec 4 cores+) / Disk 40GB SSD (rec 80GB+)"
  for all components. **Flag:** 11 default-compose services, 7 non-removable core + 4
  individually removable. Decide schema's "removable-if-unneeded" modeling before BUILD — no
  app has >2 required deps.
- **Twenty CRM** (17/20, run #12) — twenty-docs docker-compose.mdx — "at least 2GB of RAM." No
  CPU figure. Deps: postgres+redis required. Docker `twentycrm/twenty`, arm64+amd64.
- **Formbricks** (15/20, run #12) — formbricks self-hosting/overview.mdx — "Minimum Setup: 1
  vCPU, 2 GB RAM, 8 GB SSD." Deps: 4 required (postgres, redis/valkey, hub, cube); taxonomy/
  vllm optional. Docker `ghcr.io/formbricks/formbricks`, arm64+amd64.
- **Zigbee2MQTT** (14/20, run #12) — no official RAM/CPU figure. Docker:
  `github.com/Koenkk/zigbee2mqtt/pkgs/container/zigbee2mqtt`, 6-arch. **Blocked:** needs
  external MQTT broker; `SERVICES` enum has no `mqtt` value.
- **Jenkins** (19/20, run #13) — jenkins-infra/jenkins.io installation_requirements.adoc —
  "Minimum: 256MB RAM, 1GB disk (10GB rec. if Docker)." Rec (scope: small team): "4GB+ RAM,
  50GB+ disk" — tag scope, don't present as general. No deps (on-disk XML). Docker
  `jenkins/jenkins:lts`, amd64+arm64+s390x+ppc64le+riscv64. Canonical site 403s — mirror only.
- **Coolify** (20/20, run #13) — coollabsio/coolify-docs installation.mdx — "Minimum: 2 CPU
  cores, 2GB RAM, 30GB storage" (control-plane scope, doc separates per-project resources).
  Deps: postgres+redis+soketi, all required (compose-confirmed). Docker
  `coollabsio/coolify:latest`, amd64+arm64. Overlaps Portainer's space but is PaaS build+
  deploy not a dashboard — distinct. Canonical site 403s.
- **TriliumNext Trilium** (14/20, run #13, marginal) — 37.3k stars, transferred from
  zadam/trilium (don't confuse w/ archived TriliumNext/Notes fork, 2.9k stars). Zero official
  RAM/CPU figure anywhere (full-tree grep, 2 passes) — ship `no_official_figure: true`; BUILD
  should search harder for a linkable issue (none found yet). No deps. Docker
  `triliumnext/trilium:latest`, amd64+arm64+armv7+armv8(legacy).

## Collection page, verified — buildable
- **"Apps with no separate DB/cache service required"** (run #8-10) — 14 members confirmed
  zero `required:true` deps; SERP check found no incumbent. Before BUILD: disclose
  `required:false` ≠ dependency-free (Defect Class #3) AND write an explicit inclusion
  criterion (Wekan's FerretDB case shows ad hoc dep-labeling isn't enough).

## Held (insufficient evidence, not discarded)
- Keycloak (~13/20): docs unreachable, keycloak.org 403.
- Snipe-IT (~12/20): README has no figures; readme.io 403.
- Cal.com (~12/20): zero RAM/CPU figures; needs channel case.
- Metabase (~13-14/20): figure exists at metabase.com/learn but blocked, no mirror.
- BigBlueButton (14/20): 16GB/8-core prod min confirmed; installs via bare-Ubuntu
  `bbb-install.sh`, no single Docker image — needs non-containerized schema allowance.
- PeerTube: guidance only on blocked docs ("1.5GB plenty...~500MB", tiered) — no mirror.
- Vikunja: repo clones fine; ~256MB figure not yet located.
- Plane (~12/20, #11): only an EC2 quick-start advisory, not formal reqs — crowds OpenProject.
- Redmine (~9/20, #11): still zero RAM/CPU mention (retried 08-05); redmine.org unreachable
  (2 sessions). `library/redmine` is a Docker Official Image, 8-arch — held on figure only.
- AFFiNE (~12/20, #11): repo grep empty; docs.affine.pro blocked, no mirror.
- Forgejo (~7/20, #11): Codeberg blocked; GitHub mirror stale/doc-free. Fork of Gitea —
  low channel-value.
- SonarQube (~13-14/20, #13): docs blocked, 2 mirrors tried (Sonar-Docs archived/empty;
  docker-sonarqube kernel-tuning only) — no figure found.
- Healthchecks (~13/20, #13): docs blocked; source-repo templates (closest mirror) checked,
  zero figure. Deps ready: postgres required. Docker healthchecks/healthchecks, amd64/arm/v7/arm64.

## Unverified / held (not sent further)
- Collection "runs on a 1GB VPS": thin (3 qualifiers); revisit once PeerTube/Vikunja ship.
- No new column beyond GPU/community-figures this run (pacing: one schema change/batch).
- **Below ≥14 score bar** (don't re-propose w/o new sourceability evidence): Navidrome(13),
  Audiobookshelf(13), Miniflux(13), Photoprism(12), Mealie(12), BookStack(12), Firefly III(12),
  Zabbix(13), NetBox(12), Outline(no doc), Authentik(~12-13), Matrix Synapse(12), FreshRSS(11),
  Umami(11), Karakeep(10), Beszel(10), Passbolt(9), Wiki.js(9), Duplicati(9), Kavita(8),
  Kopia(7), Calibre-Web(6), Actual Budget(13), NocoDB(11), Tandoor Recipes(10), ntfy(9),
  Homepage(9), Listmonk(9), changedetection.io(8), Docmost(11), Baserow(10), Woodpecker CI(~8),
  Cachet(8), Headscale(10), Bitwarden(11), Pixelfed(11), Wallabag(13), DocuSeal(13), Shiori(10),
  EspoCRM(9).
- Rejected: "ARM/Pi-ready" collection — 14/14 live entries already arm64/armv7, no value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).
- Parked, run #13: Helm/K8s-chart column — nextcloud/helm's own README disclaims official
  support despite living in the official org; same official/unofficial adjudication problem
  as community-figures, needs a rule before buildable.
- Watch, run #13: "CI/CD & dev-platform requirements" collection (Gitea+Jenkins+GitLab CE) —
  gate on 3+ built entries (only Gitea live today).

### Freshness work
None crossing 90 days (oldest retrieved 07-24). Docker-size on rolling `latest` tags re-checks
every AUDIT, not just the 90-day sweep.

## Rejected (graveyard — do not re-propose without new evidence)
- Column "minimum dependency version floor" (07-31): not a free byproduct, buried in a
  separate doc subsection.
- Static JSON "API hub" (07-24): occupied + dead channels + LLM drain.
- Classroom mail-merge printables (07-24): free no-signup incumbents, identical privacy claim.
- Emergency binder generator (07-24): demand unevidenced twice; trust paradox.
- CC0 trivia bank (07-24): channels collapsed; accuracy-trust contradiction.
- MinIO (08-01, ~61k stars): archived by GitHub, README declares unmaintained — dead upstream.
- Strapi (08-03, ~72.8k stars): no official Docker image, zero RAM/CPU figures anywhere.
- Glance (08-03, ~36.1k stars): only "Low memory usage" marketing bullet, unsourced — same
  failure mode as Homepage.
- *arr suite (Sonarr/Radarr/Prowlarr/Lidarr/Bazarr/Readarr/Whisparr) + qBittorrent/Transmission/
  SABnzbd (08-05): no official Docker image, no RAM/CPU figure anywhere — Strapi shape.
- Excalidraw (08-06, ~129k stars): dev-mode-only compose, no RAM/CPU figure — trivial static SPA.
- Any calculator/tool or game (owner exclusion — never propose).
</content>
