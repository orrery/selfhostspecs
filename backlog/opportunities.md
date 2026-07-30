# Backlog — opportunities

Statuses: `unverified` → (verifier sign-off) → `queued` → `building` → `shipped`, or
`rejected` (with refutation, kept below as the graveyard). Dedupe against BOTH lists.

## Shipped — 17 apps live
2026-07-24 first cycle (14): gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden,
adguard-home, frigate, grafana, n8n, nextcloud, paperless-ngx, pi-hole, syncthing.
2026-07-30 (+3, re-QA settled from 07-26 batch): discourse, zulip, rocket-chat. See DECISIONS.md.

Still pending BUILD (verifier-signed, schema changes, paced one per reviewed batch):
- **GPU / hardware-transcoding column** (Jellyfin, Immich, Frigate).
- **Community-figures column** (candidates: vaultwarden, adguard-home, uptime-kuma, syncthing,
  paperless-ngx).

## Building — 2026-07-30 (harvested + independently verified this cycle, status pending-qa
pending independent QA; will land pending-second-qa this run per the unattended-run rule)
- **OpenProject** — 4096MB/4 cores min (≤200 users; scaling table beyond that, not a single
  rec figure — Defect Class #2 avoided). Deps: postgresql + memcached (both required, prod
  compose-confirmed, memcached not bundled).
- **Plausible Community Edition** — 2048MB recommended only, no minimum; CPU has no core count,
  only an SSE4.2/NEON instruction-set floor. Deps: postgresql + clickhouse.
- **Linkwarden** — anecdotal 4GB figure from official docs, filed as `ram_rec_mb` with scope
  noting it's informal. Deps: postgresql (required) + meilisearch (required: false — start-order
  only in compose, docs confirm optional). `meilisearch` added to the deps SERVICES enum.
- **Open WebUI** — all four RAM/CPU fields `no_official_figure` (147k stars, genuinely
  undocumented). Documents the `:main` (CPU-only) image tag; `:ollama`/`:cuda` variants noted
  as separate tags, not conflated in. Did not harvest the docs' illustrative compose-limits
  snippet as a figure.

## Queued (verifier-signed), still unbuilt — 2026-07-24/25 FIND runs #2/#3
Blocked this cycle on a confirmed cloud-egress constraint, not a judgment call: their official
docs domains hard-block from this cloud session (curl exit 56); no GitHub-hosted mirror exists
for any of these four, unlike Discourse/Zulip (LEARNINGS #18). Needs a local session or an
owner-provisioned network allowlist.
- **Portainer** — docs.portainer.io; live-page RAM figure (1GB vs 2GB disputed by third
  parties) needs a direct fetch, don't inherit either number.
- **Netdata** — learn.netdata.cloud; harvest the stated default-footprint quote ("100MB–200MB
  depending on metrics"), not the scaling formula, as the figure (n8n-usage-figure precedent).
- **PeerTube** — docs.joinpeertube.org; strongest sourceability of its batch ("1.5GB RAM
  plenty… usually takes at most 500MB", tiered guidance for viewers/transcoding).
- **Vikunja** — vikunja.io/docs/installing; ~256MB min, lightest footprint in the pipeline;
  pin the exact quote locally, don't inherit third-party corroboration numbers.

## Unverified / held (not sent further)
- **Collection: "runs on a 1GB VPS"** — 3 honest qualifiers today (gitea 1024, grafana 512,
  pi-hole 512); Nextcloud excluded (128MB is per-process, Defect Class #3 shape, logged
  LEARNINGS). Zulip/Rocket.Chat's min RAM (2048) don't qualify. Vikunja (~256MB) would be a
  strong 4th member once built — re-check its scope text before counting it. Still thin;
  revisit once Portainer/Netdata/PeerTube/Vikunja ship.
- **No new column proposed** — GPU/community-figures/memcached-enum already queued; pacing
  is one schema change per batch, a fourth would be backlog bloat ahead of capacity.
- **Below the ≥14 score bar** (do not re-propose without new sourceability evidence): Navidrome
  (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12), BookStack (12),
  Firefly III (12), Zabbix (13, stale legacy floor), NetBox (12, product/URL collision risk),
  Outline (no official reqs doc found), Authentik (~12-13, official floor stale vs. a real
  7.4GB deployment in issue #21413 — revisit only if a realistic tier is published).
  FIND run #4: Matrix Synapse (12, only a scoped "large public rooms" caveat, no general min;
  chat category already saturated this cycle), FreshRSS (11, prose only, no figure — Miniflux
  shape), Umami (11, deps only, no RAM figure — superseded by Plausible CE this run), Karakeep
  (10), Beszel (10), Passbolt (9), Wiki.js (9), Duplicati (9), Kavita (8), Kopia (7),
  Calibre-Web (6) — all: no numeric official hardware figure reachable from any fetchable
  source this run.
  FIND run #6: Actual Budget (13, near-miss — docs fully GitHub-mirrored and read in full,
  genuinely zero ram/cpu figure anywhere; revisit only if a future doc revision adds one),
  NocoDB (11, high egress risk — no in-repo docs mirror found, only standalone
  nocodb.com/docs), Tandoor Recipes (10, distinct from Mealie but same recipe-manager
  category already below-bar; no requirements page in its mirrored mkdocs docs), ntfy (9,
  zero official minimum; only figures found are illustrative Kubernetes example manifests —
  misharvest trap, do not source from those if revisited), Homepage/gethomepage (9, docs
  mirrored, zero hardware figures — closer to a widget aggregator than a resource-pressure
  workload), Listmonk (9, high egress risk — standalone docs only, tiny 14.8MB image but no
  figure), changedetection.io (8, high egress risk — standalone docs + GitHub wiki also
  confirmed blocked this run, new evidence below).
- Rejected: **"ARM/Pi-ready" collection** — 14/14 live entries already arm64/armv7, zero
  differentiating value.
- Deferred: disk/storage-footprint column — too inconsistently documented (Sourceability ~2).

### Freshness work
None crossing the 90-day line. Oldest live entries retrieved 2026-07-24 (6 days). Docker-size
figures on rolling `latest` tags now get re-checked every AUDIT, not just the 90-day sweep
(LEARNINGS #27, reconfirmed on Discourse this run).

## Rejected (the graveyard — do not re-propose without new evidence)
- Static JSON "API hub" (2026-07-24): occupied + dead channels + LLM drain.
- Classroom mail-merge printables (2026-07-24): free no-signup incumbents, identical privacy
  claim.
- Emergency binder generator (2026-07-24): demand unevidenced twice; trust paradox.
- CC0 trivia bank (2026-07-24): channels collapsed; accuracy-trust contradiction.
- Any calculator/tool or game (standing owner exclusion — never propose).
