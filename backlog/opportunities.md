# Backlog — opportunities

Statuses: unverified → queued (verifier sign-off) → building → shipped, or rejected.
Dedupe vs all lists. App detail: `data/apps/<slug>.json`.

## Shipped — 28 apps live
07-24 (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden, adguard-home,
frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing. 07-30 (+3): discourse,
zulip, rocket-chat. 08-02 (+1): openproject. 08-09 (+2): plausible-ce, open-webui. 08-12 (+4):
linkwarden, chatwoot, seafile, mattermost. 08-16 (+4): jenkins, keycloak, node-red, gitlab-ce.
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

## Held (insufficient evidence, not discarded)
- Snipe-IT/Cal.com (~12/20): no RAM/CPU figures (readme.io 403 on Snipe-IT).
- BigBlueButton (14/20): 16GB/8-core prod min; bare-Ubuntu, no Docker image — needs
  non-container schema.
- PeerTube (#15): only figure is v3.0.0-era FAQ.md, 5 versions stale — don't ship stale.
- Vikunja (#15): docs-mirror angle exhausted (go-vikunja/website grepped clean).
- Plane (~12/20,#11): only EC2 quick-start advisory, crowds OpenProject. Redmine (#15):
  doc/INSTALL clean, zero figure; library/redmine Official Image, 8-arch.
- AFFiNE (~12/20,#11): repo grep empty, docs.affine.pro blocked. Forgejo (~7/20,#11):
  Codeberg blocked, GH mirror stale (Gitea fork).
- SonarQube (#15): figure exists ("Xmx 1536M community build") but JVM-heap not
  system-RAM (Helm/K8s gap, #13).
- Healthchecks (#15): docs blocked, docker README clean. Deps: postgres req. Docker
  healthchecks/healthchecks, 4-arch.
- Sentry (12/20,#16) & PostHog (11/20,#16): strong sourcing but 64/47-svc composes; kafka
  (+zookeeper/temporal) not in enum — hold for deps-schema.
- Grocy (15/20,#17): zero figure; README redirects to 3rd-party linuxserver/grocy
  (78.7MB), no org image (Helm/K8s gap) — owner policy needed.
- Gotify (12/20,#17): org-owned gotify/server (48.1MB), gotify.net+mirrors unreachable —
  RAM-absence/SQLite-default unconfirmed.
- Windmill (~8/20,#19): n8n-alt, ~17.5k★. windmill.dev blocked. Only findable RAM sits in
  a stale Traefik example compose (worker_native now 2048M vendor-side). Postgres only
  dep. Hold until windmill.dev reachable or a prose minimum surfaces.
- Ente (~11/20,#19): Immich-alt (E2EE), ~28.3k★. No RAM/CPU figure; self-hosting non-priority
  support (server/README.md). Deps: postgres + minio (not in enum) + socat shim — same
  unmapped-service shape as Supabase/Sentry/PostHog.
- Infisical (~14/20,#20): 28.8k★ secrets/PKI manager, non-dupe vs Vaultwarden (distinct
  category). Finder's "2-4CPU/4-8GB" figure is app-tier only — required Postgres+Redis
  add ~6-8vCPU/16-20GB. Hold for a full-stack scope write-up before Queued; deps
  enum-mapped, Docker infisical/infisical amd64+arm64 confirmed.

## Unverified / held (not sent further)
- Collection "1GB VPS": thin (3 qualifiers); revisit once PeerTube/Vikunja ship.
- Below bar (<14), don't re-propose w/o new evidence. 12-13: Navidrome, Audiobookshelf,
  Miniflux, Zabbix, Wallabag, DocuSeal, Actual Budget, Photoprism, Mealie, BookStack,
  Firefly III, NetBox, Matrix Synapse, Authentik. ≤11: Outline, FreshRSS, Umami, NocoDB,
  Docmost, Baserow, Bitwarden, Pixelfed, Karakeep, Beszel, Tandoor Recipes, Headscale,
  Shiori, Passbolt, Wiki.js, Duplicati, ntfy, Homepage, Listmonk, Cachet, EspoCRM, Kavita,
  changedetection.io, Woodpecker CI, Kopia, Calibre-Web.
- Graylog (~8.1k★,#15): docs repo archived, docs.graylog.org presumed blocked — shallow.
- Deferred: disk-footprint column — too inconsistently documented.
- Parked, #13: Helm/K8s-chart column — nextcloud/helm's README disclaims official support
  despite living in-org — needs an official/unofficial rule.
- Budibase (#22): low-code internal-tool builder. Official self-host-specification page
  (budibase.com) domain-blocked from cloud sessions; only a recommended (not min) 4CPU/
  8GB/150GB figure found second-hand. Hold for a local-session fetch.
- Revolt/stoatchat chat (#22, ~2.3k★): org renamed revoltchat→stoatchat (alias-sweep flag).
  Deps Mongo+Redis+MinIO — MinIO unmapped in SERVICES enum, same shape as Ente/Sentry/
  PostHog. Hold for deps-schema, same as those.
- SERVICES enum: scoped-extension policy resolved 08-12 (data-quality SKILL.md) —
  ferretdb/pict-rs/soketi/mqtt added for then-queued candidates; Supabase/Sentry/PostHog's
  kafka/zookeeper/opensearch/temporal stay unmapped (held, not queued).

### Freshness work
None crossing 90 days (oldest 07-24). Docker-size re-checks every AUDIT, not just the
90-day sweep.

## Rejected (graveyard — do not re-propose without new evidence)
- Column "minimum dependency version floor" (07-31): buried in a separate doc subsection.
- 07-24 rejects: Static JSON "API hub"; classroom mail-merge printables; emergency binder
  generator; CC0 trivia bank — full refutations in AUDIT-era history, see git log.
- MinIO (08-01, ~61k★): archived, dead upstream.
- Strapi (08-03,~72.8k★), *arr suite+qBittorrent/Transmission/SABnzbd (08-05), Memos
  (08-08,~62.1k★): no official Docker image/figure — same shape.
- Glance (08-03, ~36.1k★): only unsourced "Low memory usage" bullet.
- Excalidraw (08-06, ~129k★): dev-mode-only compose, no figure — trivial SPA.
- Matomo (08-08, ~21.7k★): only a PHP memory_limit directive, not system RAM.
- FreeScout (08-10, ~4.2k★): overlaps queued Zammad, weaker sourcing, no official image.
- "ARM/Pi-ready" collection: rejected at 14/14 arm64/armv7, reaffirmed #17 at 23/24 — no
  differentiating angle found either time.
- Any calculator/tool or game (owner exclusion — never propose).
