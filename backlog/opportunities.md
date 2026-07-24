# Backlog — opportunities

Statuses: `unverified` → (verifier sign-off) → `queued` → `building` → `shipped`, or
`rejected` (with refutation, kept below as the graveyard). Dedupe against BOTH lists.

## Queued (verifier-signed) — 2026-07-24 FIND run
Verifier confirmed all 11 items below CONFIRMED (0 refuted). Independent agent pre-checked:
exactly 6 live entries exist (gitea, home-assistant, immich, jellyfin, uptime-kuma, vaultwarden);
none of the below collide with them or with each other; none appear in the Rejected graveyard.

### Coverage-gap apps — ready for BUILD
- **Nextcloud** (file sync/collab) — 36.2k stars, v34.0.2 released 2026-07-23 (active). Fork
  lineage from ownCloud confirmed, no collision with covered apps. Official system-requirements
  page confirmed to exist (docs.nextcloud.com).
- **Pi-hole** (DNS/ad-block) — v6.4.3, active. Confirmed a distinct project from AdGuard Home
  (independent origins, 2015 vs 2018). Official docs repo prerequisites.md carries RAM figures.
- **Frigate NVR** (camera/NVR) — v0.17.2, active. Distinct from Immich. Hardware docs page is
  unusually strong (AVX/AVX2 CPU requirement, RAM figure stated) — strongest sourceability in
  this batch.
- **Grafana** (dashboards/observability) — v13.1.1 released 3 days pre-run, active. No fork/
  rename history. Official requirements page exists; expect a sparse/soft minimum (Learning #4).
- **Paperless-ngx** (document mgmt) — v3.0.2 released same day. Legitimate succession chain
  (Paperless → Paperless-ng, abandoned 2021 → Paperless-ngx, current) — not a rename collision.
  Docs exist; likely no crisp RAM minimum (Redis OOM guidance only, not a stated floor).
- **Syncthing** (P2P file sync) — v2.1.2, active. Distinct from proprietary Resilio Sync.
  **Weakest sourceability in the batch** — no dedicated requirements page found, only forum
  threads. BUILD should expect a likely `no_official_figure` outcome on RAM specifically.
- **n8n** (workflow automation) — v2.31.5 released 2 days pre-run, very active (322 open
  issues/1.1k PRs). Distinct from Node-RED. Official memory-errors doc gives usage figures
  (~180MiB average; 250Mi/500Mi in example k8s manifests) — sourceable, not a crisp minimum.
- **AdGuard Home** (DNS/ad-block) — 35.6k stars, active. Confirmed distinct from Pi-hole.
  Official wiki states a min/recommended RAM figure.

### Column opportunities — ready for BUILD
- **Docker image size + arches harvest** for the existing 6 entries. Verifier live-tested the
  Docker Hub API this run (`hub.docker.com/v2/repositories/jellyfin/jellyfin/tags/latest`):
  confirmed a real per-architecture `images[]` array with `architecture` + `size` fields.
  Mechanical, no judgment calls — highest-confidence item in this batch.
- **GPU / hardware-transcoding support column** (Jellyfin, Immich, Frigate, Photoprism-class
  apps), sourced from each project's official hardware-acceleration docs (NVENC/QSV/VAAPI/
  RKMPP support). Verifier explicitly cleared this against the owner's permanent territory
  exclusion: it's a sourced fact column (same shape as the existing ARM-support column), not
  a "which GPU should I buy" calculator — no user input, no computed answer.

### Collection page — ready for BUILD
- **"Self-hosted apps without an external database"** (SQLite-only / zero required external
  service), derived entirely from the existing `deps[].required` schema field — zero new
  harvesting. Verifier confirmed the field is already CI-enforced, and ran 3 additional
  independent search phrasings beyond FIND's own 3 (6 total) — no dedicated incumbent page
  found owning this angle; general directories filter but don't publish it as a standalone page.

## Unverified / held (not sent to verifier this run)
- **Collection page: "runs on a 1GB VPS"** — held on its own precondition, sanity-checked by
  the verifier: of the 6 live entries, only home-assistant carries any `ram_min_mb`, and it's
  scope-restricted (RPi/HA-OS only, not general x86). Revisit once the Wave 1 apps above are
  live with RAM figures.
- **Below the ≥14 score bar this FIND run** (not sent to verifier; real projects, weaker
  official RAM/CPU documentation per Learning #4 — do not re-propose without new sourceability
  evidence): Navidrome (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12),
  BookStack (12), Firefly III (12).
- Considered and deferred: disk/storage-footprint column — too inconsistently documented
  officially to clear the bar (Sourceability ~2); not proposed to verifier.

### Freshness work
None. All 6 live entries retrieved 2026-07-24 (today); nothing crosses the 90-day staleness
line yet.

## Rejected (the graveyard — do not re-propose without new evidence)
- Static JSON "API hub" (2026-07-24): occupied + dead channels + LLM drain. Verifier-refuted.
- Classroom mail-merge printables (2026-07-24): free no-signup incumbents incl. identical
  privacy claim. Verifier-refuted.
- Emergency binder generator (2026-07-24): demand unevidenced twice; trust paradox. Revisit
  only with new demand evidence.
- CC0 trivia bank (2026-07-24): channels collapsed; accuracy-trust contradiction. Possible
  far-future side product only.
- Any calculator/tool or game (standing owner exclusion — never propose).
