# Backlog — opportunities

Statuses: `unverified` → (verifier sign-off) → `queued` → `building` → `shipped`, or
`rejected` (with refutation, kept below as the graveyard). Dedupe against BOTH lists.

## Shipped (previous FIND batch, 2026-07-24 first cycle)
The 8 coverage-gap apps, docker-column harvest, and no-external-database collection queued by
the 2026-07-24 FIND run all shipped in the first BUILD/TEST cycle — 14 apps now live (gitea,
home-assistant, immich, jellyfin, uptime-kuma, vaultwarden + adguard-home, frigate, grafana,
n8n, nextcloud, paperless-ngx, pi-hole, syncthing). See reports/DECISIONS.md.

Still pending BUILD from that batch (verifier-signed, not yet built — schema changes, paced
one per reviewed batch):
- **GPU / hardware-transcoding support column** (Jellyfin, Immich, Frigate) — verifier-cleared
  against territory exclusions.
- **Community-figures column** (owner directive rule 8 amendment) — candidates: vaultwarden,
  adguard-home, uptime-kuma, syncthing, paperless-ngx.

## Queued (verifier-signed) — 2026-07-24 FIND run #2
Verifier (independent agent, did not propose these) ran 10 WebSearch passes (2-3 phrasings per
candidate), confirmed no collision with the 14 live entries or the Rejected graveyard below.

### Coverage-gap apps — ready for BUILD
- **Portainer** (Docker management UI) — official docs.portainer.io requirements page confirmed
  live at multiple versioned paths (real, maintained, not stale). No fork/rename collision
  (Dockge/Yacht/Arcane/CapRover are distinct competitors). CE vs BE share one requirements doc
  (low edition-mixup risk). **Harvester note:** third-party citations disagree on the exact
  figure (1GB vs 2GB RAM) — fetch and quote the live page directly, don't inherit a number from
  this brief.
- **Netdata** (real-time monitoring agent) — official learn.netdata.cloud sizing docs confirmed
  current. Distinct from Grafana (agent/collector vs. visualization layer — sources frame them
  as complementary) and from Uptime Kuma (full-stack metrics vs. uptime pings). **Harvester
  note:** RAM story is formula-based (`UNIQUE_METRICS × 16KiB + 32MiB cache`), not a single
  minimum. Harvest the stated **default-footprint quote** ("100MB to 200MB… depending on the
  number of metrics") as the figure — same shape as n8n's accepted usage-figure precedent.
  Do not force the scaling formula into a single number or extrapolate a worst case.
- **PeerTube** (federated video hosting) — official docs.joinpeertube.org FAQ confirmed current
  and specific: "1.5GB RAM plenty for a basic instance, usually takes at most 500MB"; tiered
  guidance for concurrent viewers (4GB/1000 viewers) and on-box transcoding (8GB). No rename
  history (Framasoft, since 2017); "alternatives" found are unrelated competing projects.
  Strongest sourceability of this batch.

## Queued (verifier-signed) — 2026-07-25 FIND run #3
Verifier (independent agent, did not propose these) ran 2-3 independently-phrased WebSearch
passes per candidate, confirmed no collision with live/queued entries or the Rejected graveyard.

### Coverage-gap apps — ready for BUILD
- **Vikunja** (self-hosted task/project management) — official vikunja.io/docs/installing
  states a ~256MB minimum, corroborated across multiple independent secondary sources; ~4.7k
  GitHub stars, active releases through July 2026. Strongest sourceability of this batch — also
  the lightest-footprint app in the pipeline. **Harvester note:** WebFetch to vikunja.io 403s
  from cloud sessions; pin the exact quote from vikunja.io/docs/installing in a local session,
  don't inherit the corroborating third-party numbers used for verification.
- **Zulip** (self-hosted team chat, Slack alternative) — official zulip.readthedocs.io (mirrored
  at github.com/zulip/zulip docs/production/requirements.md) states tiered RAM-by-user-count
  figures (~2GB+2GB swap small installs, 4GB+ for 100+ users) — same shape as the accepted
  Netdata formula precedent. **Collision hazard found:** `zulipaaa.readthedocs.io` is a real,
  live, unofficial ReadTheDocs mirror of the same docs tree under a confusingly similar name —
  harvester must cite ONLY zulip.readthedocs.io or github.com/zulip/zulip, never the mirror.
- **Rocket.Chat** (self-hosted team chat, Slack alternative) — official
  docs.rocket.chat/docs/system-requirements (backed by github.com/RocketChat/docs) gives a real
  tiered scale (1 core/1GB for ≤200 users/50 concurrent → up to 16 vCPU/12GiB enterprise tier);
  finder's initial "conflicting numbers" concern was resolved — it's one tiered official page,
  not ambiguity. **Harvester note:** pin the minimum tier (1 core/1GB/≤200 users), not the
  enterprise number out of context; unofficial doc forks exist (abrom, iuvei GitHub mirrors) —
  cite only docs.rocket.chat or github.com/RocketChat/docs.
- **Discourse** (self-hosted forum/community platform) — official
  github.com/discourse/discourse/blob/main/docs/INSTALL.md (org-maintained, main branch) states
  1GB RAM minimum with mandatory swap, 2GB+ recommended for production; corroborated (not
  substituted) by long-running meta.discourse.org threads. 22,000+ communities, 46.5k+ GitHub
  stars — resolves finder's uncertainty about source authority. **Harvester note:** the swap
  requirement is load-bearing to the 1GB figure — don't drop that qualifier when harvesting.

## Unverified / held (not sent further this run)
- **Collection page: "runs on a 1GB VPS"** — precondition partially met (was blocked on zero
  general RAM figures; now 4 of 14 live entries carry `ram_min_mb`), but verifier's full sweep
  found only **3 honestly-qualifying members**: gitea (1024), grafana (512), pi-hole (512).
  **Nextcloud's 128MB EXCLUDED** — verifier flagged its source quote is scoped "per process";
  presenting it as "fits on 1GB" would conflate one PHP-FPM process with the whole multi-process
  + database stack (a new shape of Defect Class #3, logged to LEARNINGS). Held: 3 members is
  thin for a launch-worthy page — revisit once Portainer/Netdata/PeerTube (or a future batch)
  add more general (non-Pi-scoped) RAM minimums. When built, hard-code the Nextcloud exclusion
  rule, don't just filter on "has a value." **2026-07-25 update:** Vikunja (~256MB, verifier-
  confirmed above) would be a strong 4th qualifying member once built — re-check its scope text
  for per-process language before counting it, same discipline as Nextcloud's exclusion.
- **No new column proposed this run** — GPU/transcoding and community-figures columns are
  already verifier-signed and unbuilt (see Shipped section above); OPERATIONS.md paces one
  schema change per reviewed BUILD batch, so a third would just be backlog bloat ahead of
  capacity. Revisit column-mining once one of the two queued columns ships.
- **Below the ≥14 score bar, not sent to verifier** (do not re-propose without new sourceability
  evidence): Navidrome (13), Audiobookshelf (13), Miniflux (13), Photoprism (12), Mealie (12),
  BookStack (12), Firefly III (12) — from the prior run. This run: **Zabbix** (13) — official
  docs cite "128MB physical memory," essentially unchanged since v1.8, while real deployments
  need ~8GB; reads as a stale legacy floor, not a representative minimum. **NetBox** (12) —
  Community/OSS docs (~1GB min) and NetBox **Enterprise** embedded-cluster docs (16GB+) now
  live under the same netboxlabs.com domain differing only by URL path; a generic harvest could
  plausibly grab the wrong product's figure. Standing caution if NetBox is ever revisited.
  **Outline** wiki — no official requirements documentation found in 3 search phrasings
  (third-party guides only); not scoreable, not proposed. **Authentik** (self-hosted SSO/
  identity, ~12-13, this run) — official docs state a 2GB minimum, but
  github.com/goauthentik/authentik/issues/21413 (opened 2026-04-06) documents a real ~1400-user
  production deployment needing 7.4GB (worker) + 1.4GB (postgres) — the official floor is
  stale/unrepresentative, same shape as the Zabbix rejection. Not sent to verifier. Revisit only
  if the project publishes a realistic sizing tier (not just the disputed legacy minimum).
- Considered and rejected: **"ARM/Raspberry Pi-ready apps" collection** — checked `docker.arches`
  across all 14 live entries: 14/14 already carry arm64 or armv7. Zero differentiating value
  (would list the entire dataset); not proposed to verifier.
- Considered and deferred (prior run): disk/storage-footprint column — too inconsistently
  documented officially to clear the bar (Sourceability ~2); not proposed to verifier.

### Freshness work
None. All 14 live entries retrieved 2026-07-24 (yesterday, 1 day old); nothing crosses the
90-day staleness line yet.

## Rejected (the graveyard — do not re-propose without new evidence)
- Static JSON "API hub" (2026-07-24): occupied + dead channels + LLM drain. Verifier-refuted.
- Classroom mail-merge printables (2026-07-24): free no-signup incumbents incl. identical
  privacy claim. Verifier-refuted.
- Emergency binder generator (2026-07-24): demand unevidenced twice; trust paradox. Revisit
  only with new demand evidence.
- CC0 trivia bank (2026-07-24): channels collapsed; accuracy-trust contradiction. Possible
  far-future side product only.
- Any calculator/tool or game (standing owner exclusion — never propose).
