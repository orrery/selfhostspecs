# AUDIT log

Weekly adversarial audit findings, newest first, ranked by severity. An empty audit must say
what it tried and failed to break. First audit due after the first full loop cycle.

## 2026-07-27 — AUDIT #1

**Mechanical.** `node --test tests/*.test.mjs`: 38/38 green. `CI & Deploy` on `main` green at
HEAD (`f3e3407`, run 16, 2026-07-26T23:34Z) — every run since bootstrap is green except the
first two bootstrap attempts (fixed same day, pre-existing).

**SEV-1 — drifted figure, fixed this run.** Vaultwarden's `docker.size_mb` was stored as 77
(retrieved 2026-07-24); re-fetching the same `hub.docker.com/v2/.../tags/latest` URL today
returned 83MB (amd64). Not fabrication — the image was rebuilt after harvest — but a published
figure that quietly stopped being true. Fixed: `size_mb` → 83, `retrieved` → 2026-07-27.
Pipeline gap: docker sizes sourced from a rolling `latest` tag were only queued for the
90-day RAM/CPU staleness sweep; they can drift within days. Logged as LEARNINGS #27.
Sampled 9 other live docker images (nextcloud, gitea, grafana, jellyfin, pi-hole, adguard-home,
syncthing, uptime-kuma, n8n) via Docker Hub/GHCR API — all matched stored size (±1MB rounding)
and arches. Also sampled 8 RAM/CPU figures (Nextcloud, Frigate ×2, Gitea, Grafana, Home
Assistant, Immich ×4, Jellyfin, Pi-hole = 11 individual figures across 8 apps) for quote/value
re-verification — **could not re-fetch any of them**; see next finding.

**SEV-2 — this session cannot perform the live-site check or most source re-fetches at all.**
Every docs domain tried (docs.nextcloud.com, docs.frigate.video, docs.gitea.com, grafana.com,
home-assistant.io, docs.immich.app, jellyfin.org, docs.pi-hole.net) 403'd at the proxy CONNECT
level, confirmed via `/__agentproxy/status` as a policy denial, not a tool bug — and so did
`selfhostspecs.com` and `goatcounter.com` themselves. This is broader than LEARNINGS #18
previously documented (which named 4 blocked docs domains as the exception, not the rule).
Only GitHub-hosted infra and Docker Hub/GHCR's APIs are reachable from this sandbox. Practical
effect: AUDIT step 2 (live-site spot check) and step 5 (hostile pass) are currently
**impossible to execute from this environment**, every week, not just this one — and nobody
had tried the apex domain directly until this audit. Mitigation shipped this run: added a
post-deploy smoke test to `ci.yml` (curl the deployed URL, assert HTTP 200 + expected marker
text) — GitHub Actions runners have real internet access, so this is the one place that can
actually confirm a deploy is live. This closes the mechanical half of the gap (deploy reachable
at all) but not the hostile/UX half (filters, viewport, non-Chromium) — that still needs either
a local session or owner-relayed spot checks. Flagged to owner. Logged as LEARNINGS #28.

**Staleness sweep.** Nothing crosses 90 days — oldest entries retrieved 2026-07-24, 3 days ago.
Nothing queued; correctly so, and expected this early.

**Hostile pass on the live site.** Not executable — see SEV-2 above. Tried: direct `curl` to
`selfhostspecs.com`, WebFetch to `selfhostspecs.com/`, `/apps/nextcloud/`, and
`orrery.github.io/selfhostspecs/` as a control (also 403 — confirms the block is sandbox-side,
not a selfhostspecs.com-specific misconfiguration, since an unrelated GitHub Pages site got the
same treatment). Zero-result filters, URL tampering, 320px viewport, and non-Chromium rendering
remain untested this cycle; the local `docs/` build (via `node scripts/build.mjs`) passes all
site-invariant tests, which is the only signal available from here.

**Process audit.**
- LEARNINGS mostly changed behavior this week (memcached enum, quote/scope separation,
  collection-copy rewording, raw-fetch-for-scope-critical-phrases all shipped). One exception:
  the Analytics-snapshot failure (LEARNINGS #22) was flagged 2026-07-25 and failed *again*
  2026-07-26 with no different handling — a flag that doesn't change the next occurrence isn't
  done yet. Escalated concretely this run (see LEARNINGS #22 update).
- Budget ledger: $11 total, matches Infrastructure section, no unlogged spend found.
- Backlog (`backlog/opportunities.md`) cross-checked against `data/apps/*.json` — statuses
  match exactly: 14 `live`, 3 `pending-second-qa` (Discourse, Zulip, Rocket.Chat), 2
  verifier-signed queued-buildable (OpenProject, Plausible CE), 4 egress-blocked
  (Portainer, Netdata, PeerTube, Vikunja). No dishonest or stale status found.
- Cadence (DECISIONS.md + commit timestamps): `specs-find` fired daily 2026-07-24/25/26 (~23:2x
  UTC each day, on schedule). `specs-loop` fired Sunday 2026-07-26 08:56–09:02 UTC (on the
  Wed/Sun 08:41 schedule; next due Wed 2026-07-29). `specs-audit` — this is its first firing
  (Monday 2026-07-27, on schedule). No missed runs found.

**Red-team the week's biggest decision** (BUILD scoped 7→3 apps on a confirmed egress
constraint): the technical call was sound — the block was tested directly, not assumed, both
via WebFetch and raw curl. But three days and two more FIND cycles have re-confirmed the same
4 apps blocked without ever turning it into a concrete owner ask (e.g. "allowlist these 4
domains, or should I run a BUILD from a local session?"). The cheaper alternative to
re-discovering the block every cycle is one owner round-trip that resolves it once. Repeating
that pattern on the still-deferred GPU/community-figures columns risks the same silent-stall
shape OPERATIONS.md §4's "rolling expansion" is meant to prevent. Recommend: next FIND run
converts this into an explicit owner ask instead of a fourth silent re-confirmation.

**Missing invariant.** The suite has no check that a *deployed* page is reachable — every test
runs against the local `docs/` build, which is necessary but not sufficient (a Pages
misconfiguration, DNS lapse, or CDN issue downstream of a green build would be invisible to
CI and, per the SEV-2 finding above, invisible to this AUDIT too). Fixed this run: `ci.yml`'s
`deploy` job now smoke-tests the live URL after `deploy-pages` (5 retries, checks HTTP 200 +
title marker). This is a real gap that stayed open through 16 green deploy runs before anyone
checked whether the deployed site was actually reachable end-to-end.

**Evidence:** tests 38/38 pass before and after fixes; commit(s) this run fix Vaultwarden's
docker size, add the CI smoke test, and log LEARNINGS #27/#28.
