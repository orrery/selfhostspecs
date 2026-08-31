# Queued backlog — full sourcing detail (archived from backlog/opportunities.md 2026-08-22)

Names, scores, and one-line flags stay inline in `backlog/opportunities.md` for fast
dedupe + BUILD triage; full quotes/deps/image/arch detail lives here (precedent:
LEARNINGS #62, shipped/rejected-log split). BUILD reads this file before harvesting.

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
- Kestra (18/20, #27) — workflow orchestrator, 27.9k★, distinct from n8n (data-eng
  angle). "≥2 vCPUs, 4 GiB memory" (kestra.io/docs/administrator-guide/requirements).
  Postgres/MySQL req; docker socket: script tasks only.
- Ollama (17/20, #27) — local LLM runtime backing Open WebUI (shipped, separate
  footprint), 179k★, GH#8478/#2418 request a min doc. No canonical figure;
  per-model tiers (ollama.com/library, e.g. 70b→64GB) — cite model pages, not
  blogs. Zero deps.
- Mailu (17/20, #27) — modular mail server (Postfix/Dovecot/Rspamd), 7.5k★, vs
  docker-mailserver (pending-second-qa; differentiate before both ship).
  "1GB RAM+1GB swap, 3GB w/ClamAV" (mailu.io/master/compose/requirements.html).
  Redis req (compose-confirmed); SQLite default, PG/MySQL optional.
- Penpot (16/20, #26) — 58.9k★ Figma-alt design/prototyping tool, no dupe. docker.md
  states no min RAM/CPU; recommended-settings.md: "4 CPUs and 16GB of RAM are sufficient
  to support thousands of users" — production/scale framing, cite as no_official_figure
  evidence on min (Mastodon/Portainer precedent), not as a floor. Deps: postgres + valkey
  only (both enum-mapped) — storage backend defaults to filesystem
  (PENPOT_OBJECTS_STORAGE_BACKEND: fs); Minio is an optional S3-alternative backend, NOT
  required (finder's initial deps-schema-hold call was wrong — verifier corrected against
  the live compose file; see LEARNINGS). BUILD: confirm exact image names/tags/sizes
  (multi-image: frontend/backend/exporter under penpotapp/*, not yet harvested).
- WordPress (17/20, #28) — no official min RAM/CPU (wordpress.org/about/requirements +
  hub.docker.com/_/wordpress both checked, neither states hardware specs — honest absence,
  ship no_official_figure:true, Mastodon/Portainer/Metabase precedent). Deps: MySQL OR
  MariaDB required (both enum-mapped); SQLite not core-supported (plugin-only, Playground-
  sandbox use, not standard installs — checked make.wordpress.org, confirmed still true).
  Docker: library/wordpress Official Image, 9-arch (amd64/arm32v5/arm32v6/arm32v7/arm64v8/
  i386/ppc64le/riscv64/s390x). Channel: crowded topic (hosting blogs) — win on provenance,
  same play as Odoo/code-server.
- ONLYOFFICE Document Server (18/20, #30) — office-editing backend, pairs with shipped
  Nextcloud/Seafile. 101M+ Docker pulls (onlyoffice/documentserver). "Recommended System
  Requirements: RAM: 4 GB or more; CPU: dual-core 2 GHz or higher; Swap: at least 2 GB; HDD:
  at least 2 GB of free space" (github.com/ONLYOFFICE/Docker-DocumentServer README, no
  minimum section — rec-only). Deps: none for CE — verified against the CE docker-compose.yml
  itself (single onlyoffice-documentserver service); the README's Postgres/RabbitMQ/Redis
  bundling sentence refers to EE/DE images, not CE, don't cite it for the deps claim.
  Docker Hub :latest manifest: amd64+arm64 (README silent on arch — image-manifest evidence
  only, Defect Class #6). Demand: ONLYOFFICE/Docker-DocumentServer#69/#352,
  DocumentServer#591 (RAM/OOM complaints).
- Coder (15/20, #30) — coder/coder, 14.2k★, dev-environment orchestration platform, ≠
  code-server (same org, different product — code-server's own entry above already flags
  this distinction but never queued Coder itself). "A machine with 2+ CPU cores and 4GB+
  RAM (ideally a separate machine or VM, not your primary dev machine)" (docs/get-started/
  index.md Prerequisites) — scoped to the Coder-server host, NOT managed workspaces; note
  that scope distinction at BUILD. Postgres required — docs/install/docker.md's compose.yaml
  defines a postgres:17 service. Demand evidence weak: coder/coder#13559/#9364 are
  memory-leak bug reports, not direct min-RAM asks — honest gap, not disqualifying.
- Langfuse (18/20, #31) — LLM engineering/observability (tracing, evals, prompt mgmt),
  33.7k★, YC-backed. "Minimum Infrastructure Requirements" table (raw.githubusercontent.com/
  langfuse/langfuse-docs/main/content/self-hosting/configuration/scaling.mdx, retrieved
  2026-08-25, verifier byte-checked): Web Container 2 CPU/4 GiB; Worker Container 2 CPU/
  4 GiB; PostgreSQL 2 CPU/4 GiB; Redis/Valkey 1 CPU/1.5 GiB; ClickHouse 2 CPU/8 GiB; Blob
  Storage "Serverless (S3 or compatible) or MinIO (2 CPU, 4 GiB Memory)". Deps confirmed via
  langfuse/langfuse docker-compose.yml: postgres+clickhouse+redis+minio all required
  (minio ships in default compose, not merely optional — S3-compatible external storage is
  the prod alternative). Docker: docker.langfuse.com/langfuse/langfuse(-worker):4, arm64
  supported (exact "since vX.X" version unconfirmed by verifier, don't cite a version at
  BUILD without re-checking). Category overlap note: 3rd AI-stack entry alongside Ollama/
  Open WebUI — not a dupe, but flag for BUILD pacing.
- Nginx Proxy Manager (16/20, #31) — NginxProxyManager/nginx-proxy-manager, 34.0k★, near-
  universal reverse-proxy+LetsEncrypt UI. No official RAM/CPU figure: nginxproxymanager.com
  proxy-blocked for both agents; full-repo GitHub code search for RAM/CPU/memory/
  requirements/resources found zero real hits; repo has no wiki (has_wiki:false) — ship
  no_official_figure:true. Deps: single `app` service, SQLite default (MySQL/MariaDB
  user-optional) — confirmed via docs/src/setup/index.md (source of the compose snippet;
  no standalone compose file at repo root). Docker: jc21/nginx-proxy-manager, arm64
  confirmed (docs/src/setup/index.md architecture list); armv7 dropped since 2.14+.
- wg-easy (14/20, #31, marginal) — wg-easy/wg-easy, 26.8k★, WireGuard VPN + web UI. No
  official RAM/CPU figure: wg-easy.github.io proxy-blocked for both agents; repo-wide code
  search clean; GitHub wiki (11 pages, has_wiki:true, mostly integration tutorials) also
  checked and clean — ship no_official_figure:true. Deps: single `wg-easy` service, no DB
  (raw docker-compose.yml confirmed). Docker: ghcr.io/wg-easy/wg-easy:15, arm64 built on
  every release (CI matrix confirmed) — but host kernel needs in-kernel WireGuard support
  (SYS_MODULE cap + /lib/modules mount) — note this caveat explicitly on the page, not just
  in the arch note. Demand evidence thinnest of the batch (one lightly-commented closed
  issue on resource usage vs. NPM's sustained memory-leak discussion).
- Activepieces (17/20, #33) — activepieces/activepieces, 24,064★ (checked 2026-08-27, not
  harvester's stale 23.4k), n8n-alt AI/workflow automation, self-tagged `n8n-alternative`
  topic — distinct org/codebase/trajectory, not a rename or dupe. Official per-component
  sizing table, verbatim from docs/install/configure-operate/production-setup.mdx (mirrors
  activepieces.com/docs, blocked; raw.githubusercontent.com reachable), retrieved
  2026-08-27: "| **Worker** | 0.5 vCPU / 1 GB, concurrency **1** | one per concurrent flow |"
  / "| **App** | 1 vCPU / 1 GB | one per ten workers |" / "| **Postgres** | 2 vCPU / 4 GB,
  managed | one — **size it against peak throughput**, see below |" / "| **Redis** | 1 vCPU
  / 1 GB, managed | one |". Same table also states object storage (S3) "**required**" at
  production scale ("S3 is a hard requirement, not a nice-to-have... without it... the
  throughput numbers below no longer hold") — but default docker-compose.yml (repo root,
  `app` depends_on [postgres, redis] only) has no S3 service, so S3 is optional at
  quickstart scale only. Model as min-vs-rec split (quickstart=optional, official
  production=required), like Ghost, not a flat optional. Deps: postgres+redis required
  (docker-compose.yml confirmed). License not clean SPDX: MIT core + separate EE license
  under packages/ee/ — flag if a license field is ever added (rule: never trust spdx_id
  alone).
- Stalwart (15/20, #33) — stalwartlabs/stalwart, 14,373★, all-in-one Rust mail/collab
  server (JMAP/IMAP4/POP3/SMTP/CalDAV/CardDAV/WebDAV in one binary). `stalwartlabs/
  mail-server` is confirmed to be the same repo's old name (transparent GH redirect, badges
  point at current org), not a separate project — no dupe risk. Architecturally distinct
  from docker-mailserver (shipped) and Mailu (queued): both are Postfix/Dovecot(/Rspamd)
  multi-daemon stacks, Stalwart is a single compiled binary, no docker-compose.yml anywhere
  in the repo outside CI test fixtures. Deps: none required by default — embedded RocksDB
  confirmed verbatim via Docker Hub `full_description` field (hub.docker.com/v2/
  repositories/stalwartlabs/stalwart/, reachable, stalw.art itself blocked), retrieved
  2026-08-27: "Stalwart comes pre-configured with `RocksDB` as the default backend for all
  stores. You can skip this step if you are happy with the default configuration." Postgres/
  MySQL/Redis/S3/Elasticsearch/Meilisearch all optional pluggable backends per README.
  RAM figure UNVERIFIED to byte-for-byte bar: github.com/stalwartlabs/stalwart/
  discussions/580, maintainer mdecimus (GitHub "Maintainer" badge, per WebFetch-mediated
  re-fetch only — direct API/HTML blocked this session, repo-scope restriction) allegedly
  states "For a small setup you can start with any VPS with 1GB or RAM. Stalwart has low
  memory requirements." Two independent agents reproduced the same idiosyncratic "1GB or
  RAM" wording, and multiple other commenters independently report 122-250MiB actual usage
  — corroborating but not a literal capture. BUILD must get a true byte-for-byte fetch
  (retry raw HTML/API, or a screenshot) before shipping as a labeled COMMUNITY figure
  (maintainer-statement is top basis grade per OPERATIONS.md rule 8); if that fails too,
  ship no_official_figure:true instead.
- Dify (16/20, #32) — langgenius/dify, AI app-builder/LLMOps (workflows/agents/RAG),
  distinct from Ollama/open-webui/Langfuse. Official min figure IN REPO README (not
  docs.dify.ai, blocked): "CPU >= 2 Core - RAM >= 4 GiB" (github.com/langgenius/dify/blob/
  main/README.md, retrieved 2026-08-26), min-only, no rec stated. Deps: postgres/mysql OR
  (postgres default), redis req, nginx req, vector store OR-required-by-default (weaviate
  via COMPOSE_PROFILES, swappable to qdrant/pgvector/etc) — model all three as OR like
  Directus/Kestra. CAUTION: harvester's first-pass compose-comment quote didn't exist in
  the file (verifier caught it) — re-confirm every quote against the live file at BUILD.
- Jitsi Meet (17/20, #36) — 29.8k★ video conferencing, first entry in category; distinct
  from held BigBlueButton (BBB blocked on non-container schema; Jitsi ships official
  multi-arch images ghcr.io/jitsi/{web,prosody,jicofo,jvb}, no external DB). Bands not point
  figures (Jitsi Handbook devops-guide/requirements.md, verified verbatim): min~2GB/1core
  (small/test), rec~8GB/4core (basic server). Jibri (recording, optional) has its own scoped
  8-12GB figure — do not conflate with base app at BUILD.

## In pipeline — pending-second-qa detail (moved from opportunities.md, 08-29)
- onlyoffice-document-server, coder, nginx-proxy-manager, twenty-crm — cleared 08-26, zero
  defects (data/apps/*.json). nginx-proxy-manager's deps array (none/postgresql/mysql/
  mariadb, all optional) needed a missing mysql entry added by the verifier plus `note`
  fields — QA confirmed correct rendering incl. the OR-dep prose fix. Coder/Twenty CRM:
  coder.com/docs.twenty.com egress-blocked in sandbox both harvest and verify passes —
  citations rest on raw.githubusercontent.com source files, independently re-fetched twice
  (verifier + QA), not canonical-domain-confirmed.

## Pending BUILD — schema/retrofit items on already-shipped apps (moved from
opportunities.md Shipped section, 08-29, same archive-not-trim precedent)
- GPU column (Jellyfin/Immich/Frigate/open-webui?, #17).
- Community-figures column (vaultwarden/adguard-home/uptime-kuma/syncthing/paperless-ngx).
- Discourse churn caveat (AUDIT#3).
- grafana/keycloak/nextcloud OR-deps still lack `note` fields (build.mjs renders them now,
  08-26 — only Kestra/Nginx Proxy Manager have notes so far; retrofit opportunistically).
- Linkwarden cpu_rec_cores now has an official figure ("any 2 core machine", AUDIT#5,
  source rewritten 08-24) — harvest+verify next BUILD, don't add unverified.
