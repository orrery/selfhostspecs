# Backlog — opportunities

Statuses: unverified → queued (verifier sign-off) → building → shipped, or rejected.
Dedupe vs all lists. App detail: `data/apps/<slug>.json`.

## Shipped — 28 apps live
gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden, adguard-home, frigate,
grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing, discourse, zulip, rocket-chat,
openproject, plausible-ce, open-webui, linkwarden, chatwoot, seafile, mattermost, jenkins,
keycloak, node-red, gitlab-ce. Batch-by-batch dates: reports/archive/shipped-log.md.
Pending BUILD, paced 1 schema-change/batch: GPU/transcoding column (Jellyfin/Immich/Frigate,
+open-webui?, #17); community-figures column (vaultwarden/adguard-home/uptime-kuma/
syncthing/paperless-ngx); Discourse high-churn caveat (AUDIT#3, no new figure).

## In pipeline (not yet live)
- pending-second-qa (re-QA next run): coolify, prometheus, docker-mailserver, wazuh —
  cleared verification+QA 08-16, zero defects (dep detail: data/apps/*.json). Wazuh
  deps:none ruling (bundled indexer/dashboard, no OpenSearch enum slot added — see
  LEARNINGS).

## Queued (verifier-signed), unbuilt
- Zammad (16/20, #8) — "2 CPU cores; 6GB RAM (+4GB if ES)". PostgreSQL req.
- Ghost (17/20, #9) — "at least 1GB memory" (Ubuntu+CLI+MySQL prod path); BUILD resolves
  min-vs-rec. MySQL 8 req.
- Mastodon (16/20, #9) — zero RAM/CPU min — ship no_official_figure:true, link
  mastodon/documentation#912+#805. Postgres+Redis req; ES optional; Sidekiq bundled.
- Lemmy (16/20, #9) — "~150MB RAM in default Docker install", unlabeled — BUILD decides
  field. PostgreSQL req; pict-rs now has an enum slot (08-12).
- Netdata (unblocked, #9) — "100-200MB RAM".
- Portainer (unblocked, #9) — zero figure; ship no_official_figure:true, link
  portainer/portainer#5406.
- Wekan (15/20, #10) — "1GB min...4GB production" (BUILD resolves per Ghost precedent).
  ferretdb now has an enum slot (08-12).
- Directus (17/20, #11) — "min 0.25vCPU/512MB, rec 1vCPU/2GB." Deps: one DB (6 vendors,
  OR); Redis optional. Docker directus/directus, arm64+amd64.
- Supabase self-hosted (16/20, #11) — ~107.5k★. "RAM 4GB (rec 8GB+)/CPU 2 cores (rec 4+)".
  11 compose services, 7 non-removable — schema modeling TBD before BUILD.
- Twenty CRM (17/20, #12) — "at least 2GB RAM," no CPU figure. Deps: postgres+redis req.
  Docker twentycrm/twenty, arm64+amd64.
- Formbricks (15/20, #12) — "Min: 1vCPU, 2GB RAM, 8GB SSD." Deps: 4 req (postgres,
  redis/valkey, hub, cube); taxonomy/vllm optional. hub/cube unresearched, no enum slot.
- Zigbee2MQTT (14/20, #12) — no figure. Docker: zigbee2mqtt pkgs page, 6-arch. mqtt has an
  enum slot (08-12) — needs external broker, re-check before BUILD.
- TriliumNext Trilium (14/20, #13, marginal) — 37.3k★, transferred from zadam/trilium (not
  archived fork). Zero figure — ship no_official_figure:true. No deps. 4-arch.
- SearXNG (15/20, #14) — no figure. Community (vojkovic, GH#3884): "1vcpu, 512mb...0
  problems". Valkey bundled, opt-in only. Docker searxng/searxng, 3-arch, ~97MB. 35.1k★.
- Stirling-PDF (16/20, #14) — no figure; per-variant limits (2G/4G/6G) are ceilings not
  floor. Community (Frooodle, founder, GH#2945): "400-500mb baseline". No deps. Docker
  stirlingtools/stirling-pdf, amd64+arm64. 89.1k★.
- Metabase (17/20, #15) — no_official_figure:true. JVM -Xmx tuning prose only, not a
  stated min — cite as absence evidence, Mastodon/Portainer precedent.
- License (SPDX) column (14/20, #15, conditional) — GitHub license.spdx_id + LICENSE
  cross-check, backfill 24. Never trust spdx_id alone — 2/3 spot-checked NOASSERTION
  (n8n fair-code; Wazuh dual GPLv2/AGPLv3) — label non-OSI.
- Odoo CE (15/20, #18) — 53.7k★ ERP, no dupe (Twenty=CRM-only, OpenProject=PM-only).
  deploy.rst worked example (NOT min) "RAM=9*((0.8*150)+(0.2*1024))~=3GB" @4CPU/60u.
  PostgreSQL only dep. Official Image, web+db only. BUILD: scoped rec (Wazuh precedent,
  never min). Channel: crowded calc blogs — win on provenance.
- Dokploy (18/20, #24) — "at least 2GB of RAM and 30GB of disk space" (docs.dokploy.com/
  docs/core/installation; domain proxy-blocked here, quote confirmed via archived
  Dokploy/docs raw mirror + live search-index cross-check). Swarm: postgres:16 +
  traefik:v3.6.7 + dokploy/dokploy, amd64+arm64. Not a Coolify dupe — comparison value.
- Technitium DNS Server (16/20, #24) — no official min RAM/CPU (honest absence, confirmed).
  Single-service compose (dns-server only), technitium/dns-server amd64/arm64/armv7.
  Distinct from Pi-hole/AdGuard (full auth+recursive DNS+DHCP, not just a sinkhole).
- code-server (17/20,#25) — 79.0k★, zero deps, single container. "At the minimum, we
  recommend: 1GB RAM, 2 CPU cores" (docs/requirements.md). codercom/code-server,
  amd64+arm64 (arm32 alt is 3rd-party linuxserver/code-server). ≠coder/coder (same org,
  diff product). BUILD: docs lead SERP — frame as sourced/dated.
- Dockge (17/20, #26) — 23.7k★, docker-compose stack manager, louislam (same author as
  shipped Uptime Kuma) — not a Portainer dupe, compose-only positioning. Zero deps, single
  container (mounts docker.sock only). No official RAM/CPU figure anywhere (README +
  FAQ.md/docs/requirements.md/REQUIREMENTS.md all 404'd, verifier swept) — ship
  no_official_figure:true. Docker Hub only, louislam/dockge:1 (no ghcr; browsable tags
  page confirmed 200, not a bare API URL). 3-arch: armv7/arm64/amd64.
- Penpot (16/20, #26) — 58.9k★ Figma-alt design/prototyping tool, no dupe. docker.md
  states no min RAM/CPU; recommended-settings.md: "4 CPUs and 16GB of RAM are sufficient
  to support thousands of users" — production/scale framing, cite as no_official_figure
  evidence on min (Mastodon/Portainer precedent), not as a floor. Deps: postgres + valkey
  only (both enum-mapped) — storage backend defaults to filesystem
  (PENPOT_OBJECTS_STORAGE_BACKEND: fs); Minio is an optional S3-alternative backend, NOT
  required (finder's initial deps-schema-hold call was wrong — verifier corrected against
  the live compose file; see LEARNINGS). BUILD: confirm exact image names/tags/sizes
  (multi-image: frontend/backend/exporter under penpotapp/*, not yet harvested).
## Collection page, verified — buildable
- "Apps with no separate DB/cache service required" (#8-10) — 14 members confirmed zero
  required:true deps; SERP check found no incumbent. Before BUILD: disclose required:false
  ≠ dependency-free (#3) AND write an explicit inclusion criterion (Wekan FerretDB case
  shows ad hoc dep-labeling isn't enough).
- CI/CD & Git requirements (Gitea/Jenkins/GitLab-CE, #22) — gate met 08-16 (all 3 shipped),
  zero new harvesting. Not an ARM/Pi repeat: corrects a wrong circulating figure (Contabo
  blog's GitLab "4GB" vs our sourced 8GB min/16GB rec) and fills a gap incumbents skip
  (Jenkins RAM — no comparison site states it). BUILD condition: page copy must lead with
  the correction/gap-fill angle explicitly, not generic "sourced and dated" framing.

## Held (insufficient evidence, not discarded — full evidence: reports/archive/held-log.md)
Snipe-IT/Cal.com (~12/20, no figures); BigBlueButton (14/20, non-container schema needed);
PeerTube (#15, stale figure); Vikunja (#15, docs exhausted); Plane (~12/20, crowds
OpenProject); Redmine (#15, zero figure); AFFiNE (~12/20, docs blocked); Forgejo (~7/20,
Codeberg blocked); SonarQube (#15, JVM-heap≠RAM); Healthchecks (#15, docs blocked);
Sentry (12/20) & PostHog (11/20, deps-schema); Grocy (15/20, Helm/K8s gap); Gotify
(12/20, unreachable); Windmill (~8/20, docs blocked); Ente (~11/20, deps-schema);
Infisical (~14/20, full-stack scope TBD).

## Unverified / held (not sent further)
- Collection "1GB VPS": thin (3 qualifiers); revisit once PeerTube/Vikunja ship.
- Below bar (<14), don't re-propose w/o new evidence. 12-13: Navidrome, Audiobookshelf,
  Miniflux, Zabbix, Wallabag, DocuSeal, Actual Budget, Photoprism, Mealie, BookStack,
  Firefly III, NetBox, Matrix Synapse, Authentik. ≤11: Outline, FreshRSS, Umami, NocoDB,
  Docmost, Baserow, Bitwarden, Pixelfed, Karakeep, Beszel, Tandoor Recipes, Headscale,
  Shiori, Passbolt, Wiki.js, Duplicati, ntfy, Homepage, Listmonk, Cachet, EspoCRM, Kavita,
  changedetection.io, Woodpecker CI, Kopia, Calibre-Web, NetBird, Garage/deuxfleurs-org.
- Graylog (~8.1k★,#15): docs archived, blocked — shallow (detail: held-log.md).
- Deferred: disk-footprint column — too inconsistently documented.
- Parked, #13: Helm/K8s-chart column — needs official/unofficial rule (detail: held-log.md).
- Budibase (#22): domain-blocked; second-hand rec figure only (detail: held-log.md).
- Revolt/stoatchat (#22, ~2.3k★, alias-sweep flagged): deps-schema, MinIO unmapped, same
  as Ente (detail: held-log.md).

### Freshness work
None crossing 90 days (oldest 07-24). Docker-size re-checks every AUDIT, not just the
90-day sweep.

## Rejected (graveyard — do not re-propose without new evidence; full refutations: reports/archive/rejected-log.md)
- Min-dep-version-floor column; API-hub/mail-merge/emergency-binder/trivia-bank (07-24);
  MinIO (dead upstream); Strapi/*arr-suite+qBittorrent/Transmission/SABnzbd/Memos (no
  official image/figure); Glance (unsourced bullet); Excalidraw (dev-mode-only, trivial SPA);
  Matomo (PHP memory_limit ≠ system RAM); FreeScout (overlaps Zammad, weaker sourcing);
  "ARM/Pi-ready" collection (no differentiating angle, checked twice).
- Any calculator/tool or game (owner exclusion — never propose).
