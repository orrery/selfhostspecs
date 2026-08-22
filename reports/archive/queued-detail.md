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
