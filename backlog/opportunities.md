# Backlog — opportunities

Statuses: unverified→queued(verifier sign-off)→building→shipped/rejected. Dedupe vs
all lists. App detail: `data/apps/<slug>.json`.

## Shipped — 32 apps live
gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden, adguard-home, frigate,
grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing, discourse, zulip, rocket-chat,
openproject, plausible-ce, open-webui, linkwarden, chatwoot, seafile, mattermost, jenkins,
keycloak, node-red, gitlab-ce, coolify, prometheus, docker-mailserver, wazuh.
Batch-by-batch dates: reports/archive/shipped-log.md.
Pending BUILD (1 schema-change/batch): GPU column (Jellyfin/Immich/Frigate/open-webui?,
#17); community-figures column (vaultwarden/adguard-home/uptime-kuma/syncthing/
paperless-ngx); Discourse churn caveat (AUDIT#3); build.mjs doesn't render DB-OR deps
in prose for any multi-backend app (QA 08-23, affects Kestra + every existing OR-dep app);
Linkwarden cpu_rec_cores now has an official figure ("any 2 core machine", AUDIT#5, source
rewritten 08-24) — harvest+verify next BUILD, don't add unverified.

## In pipeline (not yet live)
- pending-second-qa: kestra, code-server, ollama, dockge — cleared 08-23, zero defects
  (data/apps/*.json). Ollama has no official base RAM/CPU figure (model-dependent, honest
  no_official_figure). Kestra's Postgres/MySQL OR modeled as two required:false deps +
  note (QA-ruled consistent with grafana/keycloak/nextcloud convention, kept as-is).

## Queued (verifier-signed), unbuilt
Full sourcing detail (quotes, deps, images, arch) for every item below is archived at
`reports/archive/queued-detail.md` — BUILD reads that file; this list is name/score/
one-line-flag only, for dedupe + triage (relief: LEARNINGS #62 precedent, applied to
Queued 08-22 after hitting byte ceiling again).
- Zammad (16/20, #8) — PostgreSQL req.
- Ghost (17/20, #9) — MySQL req; min-vs-rec TBD at BUILD.
- Mastodon (16/20, #9) — no_official_figure. Postgres+Redis req; ES optional.
- Lemmy (16/20, #9) — PostgreSQL req; unlabeled figure, field TBD at BUILD.
- Netdata (unblocked, #9) — "100-200MB RAM".
- Portainer (unblocked, #9) — no_official_figure.
- Wekan (15/20, #10) — min-vs-rec TBD at BUILD (Ghost precedent).
- Directus (17/20, #11) — DB OR (6 vendors); Redis optional.
- Supabase self-hosted (16/20, #11) — 11-svc compose, schema modeling TBD.
- Twenty CRM (17/20, #12) — postgres+redis req.
- Formbricks (15/20, #12) — 4 req deps; hub/cube unresearched, no enum slot.
- Zigbee2MQTT (14/20, #12) — needs external broker, re-check before BUILD.
- TriliumNext Trilium (14/20, #13, marginal) — no_official_figure, no deps.
- SearXNG (15/20, #14) — community figure only (GH#3884).
- Stirling-PDF (16/20, #14) — community figure only (founder, GH#2945).
- Metabase (17/20, #15) — no_official_figure.
- License (SPDX) column (14/20, #15, conditional) — never trust spdx_id alone.
- Odoo CE (15/20, #18) — scoped rec only, never min (Wazuh precedent). PostgreSQL only dep.
- Dokploy (18/20, #24) — Swarm: postgres+traefik+dokploy. Not a Coolify dupe. traefik has
  no SERVICES enum slot (checked 08-23) — resolve before BUILD.
- Technitium DNS Server (16/20, #24) — no_official_figure, single-service.
- Mailu (17/20, #27) — Redis req; SQLite default. Differentiate vs docker-mailserver.
- Penpot (16/20, #26) — postgres+valkey req; multi-image not yet harvested.
- WordPress (17/20, #28) — no_official_figure. MySQL OR MariaDB req; SQLite not
  core-supported. Official Image, 9-arch. Crowded topic — win on provenance.
- ONLYOFFICE Document Server (18/20, #30) — rec-only "4GB RAM/dual-core 2GHz", deps:none
  (verified via CE docker-compose.yml, single service — not the EE/DE bundling sentence),
  arm64+amd64 per Docker Hub manifest (README silent). Source: github.com/ONLYOFFICE/
  Docker-DocumentServer README "Recommended System Requirements".
- Coder (15/20, #30) — coder/coder, 14.2k★, ≠code-server (diff product, same org).
  "2+ CPU cores and 4GB+ RAM" for the Coder-server host (not workspaces), docs/get-started/
  index.md. Postgres required (compose.yaml). Demand evidence weak (memory-leak issues,
  not direct RAM asks) — note at BUILD.
## Collection page, verified — buildable
- "Apps with no separate DB/cache service required" (#8-10) — 14 members, zero-incumbent
  SERP. BUILD: disclose required:false≠dependency-free (#3), write explicit inclusion
  criterion (Wekan/FerretDB showed ad hoc dep-labeling isn't enough).
- CI/CD & Git requirements (Gitea/Jenkins/GitLab-CE, #22) — gate met 08-16, all 3 shipped.
  Corrects Contabo blog's wrong GitLab "4GB" (ours: 8GB min/16GB rec) + fills Jenkins-RAM
  gap no comparison site states. BUILD: lead copy with the correction/gap-fill angle.
- Smallest Docker images across self-hosted apps (16/20, #30) — zero new harvest, sorts
  existing docker.size_mb (36/36 apps already have it). SERP has subjective "best
  self-hosted apps" listicles but no sourced/dated per-app size ranking — lead copy with
  that provenance angle, not "no incumbent."

## Held (insufficient evidence, not discarded — full evidence: reports/archive/held-log.md)
Snipe-IT/Cal.com (~12/20, no figures); BigBlueButton (14/20, non-container schema needed);
PeerTube (#15, stale figure); Vikunja (#15, docs exhausted); Plane (~12/20, crowds
OpenProject); Redmine (#15, zero figure); AFFiNE (~12/20, docs blocked); Forgejo (~7/20,
Codeberg blocked); SonarQube (#15, JVM-heap≠RAM); Healthchecks (#15, docs blocked);
Sentry (12/20) & PostHog (11/20, deps-schema); Grocy (15/20, Helm/K8s gap); Gotify
(12/20, unreachable); Windmill (~8/20, docs blocked); Ente (~11/20, deps-schema);
Infisical (~14/20, full-stack scope TBD).
- PocketBase (~14/20, #29, near-miss): 60.8k★, single-binary/SQLite, no deps — real demand
  (10 GH issues on OOM/memory). No reachable official RAM figure (pocketbase.io blocked,
  no in-repo docs mirror). Re-check sourcing before re-scoring.
- Zitadel (13/20, #29): 14.8k★ IAM, crowds Keycloak (shipped). Sourced verbatim via in-repo
  docs mirror despite zitadel.com blocked (~512MB app / 4GB per DB core, Postgres≥14 req)
  — below bar on coverage/channel, not sourcing.
- Appwrite (9/20, #29): BaaS, no reachable figure, no in-repo mirror, overlaps Supabase
  (already queued). Weakest of the three.

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
