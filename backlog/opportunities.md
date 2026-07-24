# Backlog — opportunities

Statuses: `unverified` → (verifier sign-off) → `queued` → `building` → `shipped`, or
`rejected` (with refutation, kept below as the graveyard). Dedupe against BOTH lists.

## Queued (verifier-signed)
(none yet — first FIND run populates)

## Unverified — scored 2026-07-24 FIND run (pending independent verifier)
Scoring: Coverage-value · Sourceability · Effort · Channel-value, each /5, total /20. ≥14 proposed
to verifier. Note: WebFetch returned 403 on nearly every external docs domain tried this run
(Nextcloud, Paperless-ngx, Pi-hole, n8n, Frigate, Photoprism, Mealie, BookStack, even Wikipedia)
while github.com/gist.github.com succeeded — looks like a session-level fetch issue, not
per-site bot-blocking. Sourceability scores below are from GitHub-confirmed project activity +
trained knowledge of these projects' official docs, NOT a live fetch this run. Every figure
still requires the harvester's live fetch + independent verifier re-fetch before it ships —
this only affects whether FIND's sourceability *estimate* is live-confirmed today.

### Coverage-gap apps (candidate Wave 1, scored individually — no more vague batches)
| App | Category | Coverage | Source | Effort | Channel | Total |
|---|---|---|---|---|---|---|
| Nextcloud | file sync/collab | 5 | 4 | 3 | 5 | **17** |
| Pi-hole | DNS/ad-block | 5 | 3 | 4 | 5 | **17** |
| Frigate NVR | camera/NVR | 4 | 5 | 3 | 4 | **16** |
| Grafana | dashboards/observability | 4 | 5 | 3 | 4 | **16** |
| Paperless-ngx | document mgmt | 4 | 4 | 3 | 4 | **15** |
| Syncthing | P2P file sync | 4 | 3 | 4 | 4 | **15** |
| n8n | workflow automation | 4 | 4 | 3 | 4 | **15** |
| AdGuard Home | DNS/ad-block | 4 | 3 | 4 | 4 | **15** |

Held below the ≥14 bar this run (real projects, weaker official RAM/CPU documentation per
Learning #4 — revisit if sourceability improves, do not re-propose without new evidence):
Navidrome (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12), BookStack (12),
Firefly III (12).

### Column opportunities
- **Docker image size + arches harvest** for the existing 6 entries (Docker Hub API / ghcr
  manifests — objective, mechanical, always available). Coverage 3 · Source 5 · Effort 5 ·
  Channel 3 = **16**.
- **GPU / hardware-transcoding support column** (Jellyfin, Immich, Frigate, Photoprism-class
  apps) — sourced from each project's official hardware-acceleration docs (NVENC/QSV/VAAPI/
  RKMPP support, cited per app). Coverage 4 · Source 4 · Effort 2 · Channel 4 = **14**.
- Considered and deferred: disk/storage-footprint column — too inconsistently documented
  officially to score ≥14 (Sourceability ~2); not proposed to verifier.

### Collection pages
- **"Self-hosted apps without an external database"** (SQLite-only / zero required external
  service — derived from the existing `deps[].required` field, no new harvesting needed).
  3 distinct search phrasings found no dedicated incumbent owning this angle (generic
  directories like selfhosted.directory support filtering but don't publish this as a page).
  Coverage 4 · Source 5 · Effort 5 · Channel 4 = **18**.
- **"Runs on a 1GB VPS"** — re-scored down from bootstrap. Blocked on its own precondition:
  Learning #4 says only ~2/7 popular apps state a clean RAM minimum, so we don't yet have
  enough sourced RAM-min data to populate a credible filtered page; SERP is blogspam, not a
  strong incumbent, but that's moot until coverage exists. Coverage 3 · Source 2 · Effort 2 ·
  Channel 3 = **10**. Held — revisit after the Wave 1 apps above are live with RAM figures.

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
